## electron-vue-elementui

#### 环境
node v16.20.2

####


# 命令
npm run dev

npm run build -- --win 

npm run build -- --mac 

# 说明
src/main/index.js 28行 用于去掉菜单

src/main/index.js 34行 mainWindow.webContents.openDevTools() 用于打包环境打开调试


# 配置
开发环境服务器接口地址配置:
.electron-vue dev-runner.js 找到proxy 配置target

生产环境服务器端接口地址配置:
src/renderer/main.js  65行





