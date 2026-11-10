# 古生物科学研究

耀中耀华曲靖古生物科考的学生学习站。

本地运行：

```bash
python serve.py
```

然后打开 `http://127.0.0.1:8765/`。

学生用真实姓名和邮箱进入。登录记在这台浏览器里，30 天内有效。填写内容按邮箱存在本机服务器。学生只能取回自己的记录。

学校 SSO 使用耀中耀华 OIDC，机密客户端，授权码，不用 PKCE。`OIDC_CLIENT_ID` 和 `OIDC_CLIENT_SECRET` 只放在服务器环境变量里，不放进仓库，也不放进网页。没有这两项时，页面上不出现学校登录按钮。姓名取 userinfo 的 `chinesename`，没有时用 `lastname` 加 `firstname`。说明见 `docs/sso.md`。
