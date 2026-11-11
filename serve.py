"""Temporary public study server. Stores sign-in traces next to the site.

School SSO runs only when OIDC_CLIENT_ID and OIDC_CLIENT_SECRET are set
in the server environment. The secret never leaves this process.
"""
import hashlib
import hmac
import json
import os
import secrets
import socket
import time
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

socket.getfqdn = lambda *args, **kwargs: "localhost"
ROOT = os.path.dirname(os.path.abspath(__file__))
LOG = os.path.join(ROOT, "data", "traces.jsonl")
WORK = os.path.join(ROOT, "data", "work")
ACCOUNTS = os.path.join(ROOT, "data", "accounts.jsonl")
ISSUER = "https://oidc.ycyw.com"
MONTH = 30 * 24 * 60 * 60 * 1000
STATES = {}
DISCOVERY = None
APP_ROUTES = ("/api/trace", "/api/account", "/api/work", "/api/traces", "/api/admin/login", "/auth/login", "/auth/callback")


def load_dotenv():
    path = os.path.join(ROOT, ".env")
    if not os.path.exists(path):
        return
    with open(path, encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def same_secret(left, right):
    return hmac.compare_digest(
        hashlib.sha256(str(left).encode("utf-8")).digest(),
        hashlib.sha256(str(right).encode("utf-8")).digest(),
    )


def oidc_ready():
    return bool(os.environ.get("OIDC_CLIENT_ID") and os.environ.get("OIDC_CLIENT_SECRET"))


def discovery():
    global DISCOVERY
    if DISCOVERY is None:
        with urllib.request.urlopen(ISSUER + "/.well-known/openid-configuration", timeout=12) as res:
            DISCOVERY = json.loads(res.read().decode("utf-8"))
    return DISCOVERY


def form_post(url, fields):
    data = urllib.parse.urlencode(fields).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    with urllib.request.urlopen(req, timeout=12) as res:
        return json.loads(res.read().decode("utf-8"))


def userinfo(url, token):
    req = urllib.request.Request(url, headers={"Authorization": "Bearer " + token})
    with urllib.request.urlopen(req, timeout=12) as res:
        return json.loads(res.read().decode("utf-8"))


def school_name(info):
    chinese = str(info.get("chinesename") or "").strip()
    if chinese:
        return chinese
    return (str(info.get("lastname") or "") + str(info.get("firstname") or "")).strip()


def work_file(email):
    digest = hashlib.sha256(email.lower().encode("utf-8")).hexdigest()[:24]
    return os.path.join(WORK, digest + ".json")


def load_work(email):
    path = work_file(email)
    if not os.path.exists(path):
        return {"email": email.lower(), "units": {}}
    with open(path, encoding="utf-8") as handle:
        data = json.load(handle)
    if str(data.get("email", "")).lower() != email.lower():
        return {"email": email.lower(), "units": {}}
    data.setdefault("units", {})
    return data


def store_work(data):
    os.makedirs(WORK, exist_ok=True)
    with open(work_file(data["email"]), "w", encoding="utf-8") as handle:
        json.dump(data, handle, ensure_ascii=False)


def explicit_prefix(handler):
    raw = (os.environ.get("APP_BASE") or handler.headers.get("X-Forwarded-Prefix") or "").strip()
    if not raw or raw == "/":
        return ""
    if not raw.startswith("/"):
        raw = "/" + raw
    return raw.rstrip("/")


def inside_root(rel):
    candidate = os.path.normpath(os.path.join(ROOT, rel.replace("/", os.sep)))
    return candidate.startswith(ROOT) and os.path.exists(candidate)


def split_mount(handler, raw_path):
    path = urlparse(raw_path).path or "/"
    prefix = explicit_prefix(handler)
    if prefix and (path == prefix or path.startswith(prefix + "/")):
        rest = path[len(prefix):] or "/"
        return prefix, rest if rest.startswith("/") else "/" + rest
    rel = path.strip("/")
    if path in APP_ROUTES or path == "/" or (rel and inside_root(rel)):
        return "", path
    parts = rel.split("/", 1)
    if len(parts) == 1 and parts[0] and "." not in parts[0] and not inside_root(parts[0]):
        return "/" + parts[0], "/"
    if len(parts) == 2:
        rest = "/" + parts[1]
        if rest in APP_ROUTES or inside_root(parts[1]):
            return "/" + parts[0], rest
    return "", path


def public_base(handler):
    proto = handler.headers.get("X-Forwarded-Proto", "http").split(",")[0].strip() or "http"
    prefix, _rest = split_mount(handler, handler.path)
    return proto + "://" + handler.headers.get("Host", "127.0.0.1:8765") + prefix


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def read_body(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length > 6_000_000:
            return None
        raw = self.rfile.read(length) if length else b"{}"
        return json.loads(raw.decode("utf-8"))

    def translate_path(self, path):
        _prefix, rest = split_mount(self, path)
        return super().translate_path(rest)

    def do_POST(self):
        _prefix, path = split_mount(self, self.path)
        if path not in ("/api/trace", "/api/account", "/api/work", "/api/admin/login"):
            self.send_error(404)
            return
        try:
            body = self.read_body()
        except json.JSONDecodeError:
            self.send_error(400)
            return
        if body is None:
            self.send_error(413)
            return
        if path == "/api/admin/login":
            username = str(body.get("username") or "").strip()
            password = str(body.get("password") or "")
            configured = os.environ.get("ADMIN_USER", "").strip()
            secret = os.environ.get("ADMIN_PASSWORD", "")
            if not configured or not secret:
                self.send_json(503, {"ok": False, "reason": "admin-not-configured"})
                return
            if not same_secret(username.lower(), configured.lower()) or not same_secret(password, secret):
                self.send_json(401, {"ok": False, "reason": "admin-rejected"})
                return
            signed = int(time.time() * 1000)
            record = {"name": "Admin", "email": configured, "role": "admin", "signedAt": signed, "expires": signed + MONTH}
            os.makedirs(os.path.dirname(ACCOUNTS), exist_ok=True)
            with open(ACCOUNTS, "a", encoding="utf-8") as handle:
                handle.write(json.dumps(record, ensure_ascii=False) + "\n")
            data = load_work(configured)
            data["name"] = "Admin"
            data["email"] = configured.lower()
            data["role"] = "admin"
            store_work(data)
            self.send_json(200, {"ok": True, **record})
            return
        email = str(body.get("email") or "").strip()
        name = str(body.get("name") or "").strip()
        if "@" not in email or len(name) < 2:
            self.send_error(400)
            return
        if path == "/api/account":
            os.makedirs(os.path.dirname(ACCOUNTS), exist_ok=True)
            with open(ACCOUNTS, "a", encoding="utf-8") as handle:
                handle.write(json.dumps({"name": name, "email": email, "signedAt": body.get("signedAt"), "expires": body.get("expires")}, ensure_ascii=False) + "\n")
            data = load_work(email)
            data["name"] = name
            data["email"] = email.lower()
            store_work(data)
            self.send_json(200, {"ok": True})
            return
        if path == "/api/work":
            unit_id = str(body.get("id") or "").strip()
            patch = body.get("patch")
            if not unit_id or not isinstance(patch, dict):
                self.send_error(400)
                return
            drawing = patch.get("drawing")
            if isinstance(drawing, str) and len(drawing) > 1_500_000:
                patch = {key: value for key, value in patch.items() if key != "drawing"}
                patch["drawingTooLarge"] = True
            data = load_work(email)
            data["name"] = name
            data["email"] = email.lower()
            data["units"][unit_id] = patch
            store_work(data)
            self.send_json(200, {"ok": True})
            return
        body.pop("drawing", None)
        os.makedirs(os.path.dirname(LOG), exist_ok=True)
        with open(LOG, "a", encoding="utf-8") as handle:
            handle.write(json.dumps(body, ensure_ascii=False) + "\n")
        self.send_json(200, {"ok": True})

    def send_json(self, code, payload):
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        parsed = urlparse(self.path)
        _prefix, path = split_mount(self, self.path)
        if path == "/auth/login":
            if not oidc_ready():
                self.send_json(503, {"ok": False, "reason": "school-login-not-configured"})
                return
            try:
                doc = discovery()
            except Exception:
                self.send_json(502, {"ok": False, "reason": "issuer-unreachable"})
                return
            state = secrets.token_urlsafe(24)
            STATES[state] = time.time() + 600
            query = urllib.parse.urlencode({
                "response_type": "code",
                "client_id": os.environ["OIDC_CLIENT_ID"],
                "redirect_uri": public_base(self) + "/auth/callback",
                "scope": "openid profile email",
                "state": state,
            })
            self.send_response(302)
            self.send_header("Location", doc["authorization_endpoint"] + "?" + query)
            self.end_headers()
            return
        if path == "/auth/callback":
            if not oidc_ready():
                self.send_json(503, {"ok": False, "reason": "school-login-not-configured"})
                return
            query = parse_qs(parsed.query)
            state = query.get("state", [""])[0]
            code = query.get("code", [""])[0]
            expires = STATES.pop(state, 0)
            if not code or expires < time.time():
                self.send_json(400, {"ok": False, "reason": "state-invalid"})
                return
            try:
                doc = discovery()
                token = form_post(doc["token_endpoint"], {
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": public_base(self) + "/auth/callback",
                    "client_id": os.environ["OIDC_CLIENT_ID"],
                    "client_secret": os.environ["OIDC_CLIENT_SECRET"],
                })
                info = userinfo(doc["userinfo_endpoint"], token["access_token"])
            except Exception:
                self.send_json(502, {"ok": False, "reason": "token-exchange-failed"})
                return
            name = school_name(info)
            email = str(info.get("email") or "").strip()
            if len(name) < 2 or "@" not in email:
                self.send_json(400, {"ok": False, "reason": "name-or-email-missing"})
                return
            signed = int(time.time() * 1000)
            record = {"name": name, "email": email, "signedAt": signed, "expires": signed + MONTH}
            os.makedirs(os.path.dirname(LOG), exist_ok=True)
            with open(LOG, "a", encoding="utf-8") as handle:
                handle.write(json.dumps({"type": "sign-in", "via": "school", "name": name, "email": email, "signedAt": signed, "expires": record["expires"]}, ensure_ascii=False) + "\n")
            home = public_base(self) + "/#/"
            page = (
                "<!doctype html><meta charset=\"utf-8\"><title>Signed in</title><script>"
                "localStorage.setItem('qujing-student', %s);location.replace(%s);"
                "</script>" % (json.dumps(json.dumps(record, ensure_ascii=False)), json.dumps(home))
            ).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(page)))
            self.end_headers()
            self.wfile.write(page)
            return
        if path == "/api/work":
            email = parse_qs(parsed.query).get("email", [""])[0].strip()
            if "@" not in email:
                self.send_json(400, {"units": {}})
                return
            self.send_json(200, {"units": load_work(email).get("units", {})})
            return
        if path == "/api/traces":
            email = parse_qs(parsed.query).get("email", [""])[0].strip().lower()
            rows = []
            if os.path.exists(LOG) and email:
                with open(LOG, encoding="utf-8") as handle:
                    for line in handle:
                        try:
                            row = json.loads(line)
                        except json.JSONDecodeError:
                            continue
                        if str(row.get("email", "")).lower() == email:
                            rows.append(row)
            data = json.dumps({"rows": rows[-40:]}, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        super().do_GET()


if __name__ == "__main__":
    load_dotenv()
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("0.0.0.0", 4009), Handler)
    print("http://127.0.0.1:4009/")
    server.serve_forever()
