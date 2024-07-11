# heer-nav-nuxt

一个使用Nuxt.js+Tailwindcss开发的个人导航站,使用MongoDB存储站点数据,允许进行即时编辑

## 功能特性

- 分类化展示站点
- 允许使用ASH进行加密存储
- 使用MongoDB存储站点信息
- 简单易用的界面
- 在页面上快速编辑,删除,添加新的站点

## 技术栈

- Nuxt.js
- MongoDB
- Vue.js
- Node.js
- Tailwindcss
- Typescript



## 部署与使用

### 部署

1. 克隆本仓库到你的本地环境：

```bash
git clone https://github.com/your-username/your-repository.git
```

2. 进入项目目录：

```bash
cd your-repository
```

3. 安装依赖：

```bash
npm install
```

4. 配置环境变量：

在项目根目录下创建一个名为 `.env` 的文件，并按照以下格式填写你的 MongoDB 连接信息：

```
MONGODB_URI=your-mongodb-uri
```

5. 启动应用：

```bash
npm run dev
```

### 使用

1. 访问应用：

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

2. 添加/编辑导航链接：

点击页面右上角的“编辑”按钮，登录后即可进行导航链接的添加和编辑。

## 参与贡献

如果您想对该项目进行贡献或改进，欢迎提交PR或Issue。

## 许可证

该项目采用 [MIT 许可证](LICENSE) 进行许可。
```

以上是一个简单的README示例，其中包含了项目的功能特性、技术栈、部署与使用指南以及参与贡献和许可证信息。你可以根据自己的实际情况进行修改和补充。