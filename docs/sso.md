# SSO

学校登录走耀中耀华 OIDC，机密客户端，授权码，不用 PKCE。密钥只放在服务器环境变量 `OIDC_CLIENT_ID` 和 `OIDC_CLIENT_SECRET` 里。前端不放密钥、令牌、调试日志，也不列出别人的身份。

发现地址：`https://oidc.ycyw.com/.well-known/openid-configuration`。

姓名用 userinfo 的 `chinesename`；没有这项时用 `lastname` 加 `firstname`。不用 id_token 里的 `name`。角色以 userinfo 为准。id_token 里的 role 只是第一个值。

`/auth/login` 只有两个环境变量都在时才会跳到学校。现在没有 client id 和 client secret，这条地址返回未配置，页面上也不放学校登录按钮。

学生现在用真实姓名和邮箱进入。这次登录记在这台浏览器里，30 天内有效，同时写入服务器的学习记录。学生只能取回自己邮箱下的记录。

回调地址必须在学校那边登记，并且带上网站所在的子路径。挂在 `https://edfutures.ycyw.com/pelaontology` 时，登记 `https://edfutures.ycyw.com/pelaontology/auth/callback`。本机没有子路径时是 `http://127.0.0.1:8765/auth/callback`。如果前面的反代把这段路径去掉了，给服务器环境变量 `APP_BASE=/pelaontology`，或让反代带上 `X-Forwarded-Prefix`。
