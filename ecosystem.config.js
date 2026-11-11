// pm2 进程配置：pm2 start ecosystem.config.js
//
// 环境变量从项目目录下的 .env 读取（格式 KEY=VALUE，# 开头为注释）。
// .env 已被 .gitignore 覆盖，不会进仓库；首次部署照着 .env.example 建一份。

const fs = require("fs");
const path = require("path");

function loadEnvFile(file) {
  try {
    return fs
      .readFileSync(file, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .reduce((acc, line) => {
        const i = line.indexOf("=");
        if (i > 0) {
          acc[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
        }
        return acc;
      }, {});
  } catch {
    return {}; // .env 不存在时静默跳过，APP_BASE 用下方默认值
  }
}

const fileEnv = loadEnvFile(path.join(__dirname, ".env"));

module.exports = {
  apps: [{
    name: "qujing-paleo",
    script: "serve.py",
    interpreter: "python3",
    cwd: __dirname, // 与 ecosystem.config.js 同目录，放哪都行
    env: {
      // APP_BASE 不配时 serve.py 会自动识别子路径，但显式指定更可靠
      APP_BASE: "/pelaontology",
      ...fileEnv, // .env 里的值覆盖默认值；OIDC_CLIENT_ID / OIDC_CLIENT_SECRET 写进 .env
    },
  }],
};
