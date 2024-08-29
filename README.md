# send mail

Electron SMTP 发送邮件

```bash
npm install electron --save-dev
```

引用邮件发送包
```bash
npm install electron nodemailer
```

## builder

1. 使用 electron-builder 打包


1.1 安装 electron-builder
在项目目录中安装 electron-builder：

```bash
npm install --save-dev electron-builder
```

1.2 更新 package.json
在 package.json 中添加以下配置，以便使用 electron-builder 进行打包：

```json
{
  "name": "my-electron-email-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build:mac": "electron-builder --mac",
    "build:win": "electron-builder --win"
  },
  "build": {
    "appId": "com.example.my-electron-email-app",
    "productName": "MyElectronEmailApp",
    "mac": {
      "category": "public.app-category.utilities",
      "target": ["dmg", "zip"]
    },
    "win": {
      "target": ["nsis", "zip"]
    }
  },
  "devDependencies": {
    "electron": "^26.2.3",
    "electron-builder": "^24.7.0"
  },
  "dependencies": {
    "nodemailer": "^6.9.4"
  }
}
```

- appId: 应用的唯一标识符，通常采用域名的反写形式。  
- productName: 应用的显示名称。 
- mac: 配置 macOS 打包的选项，这里指定了打包成 .dmg 和 .zip 文件。 
- win: 配置 Windows 打包的选项，这里指定了打包成 .exe 文件（使用 nsis 安装程序）和 .zip 文件。 

1.3 运行打包命令
macOS: 要为 macOS 打包，运行以下命令：

```bash
npm run build:mac
```

打包后的 .app 文件和 .dmg 文件将会生成在 dist/mac/ 目录下。

Windows: 要为 Windows 打包，在 Windows 或使用 Wine（在 macOS 或 Linux 上运行 Windows 程序的兼容层）下运行以下命令：

```bash
npm run build:win
```

打包后的 .exe 文件将会生成在 dist/win/ 目录下。




3. 代码签名 (可选)

在将应用发布之前，尤其是 macOS 应用，建议进行代码签名。如果你有开发者证书，可以使用 electron-builder 的 --mac 选项进行签名：

```bash
electron-builder --mac --sign "Developer ID Application: Your Name (XXXXXXXXXX)"
```

对于 Windows，你可以使用 electron-builder 的 win 选项结合 .pfx 证书文件进行签名。

**总结**

- electron-builder 提供了更全面的配置选项，适合需要完整打包和发布流程的项目。 
- electron-packager 简单易用，适合轻量级的打包需求。 


你可以根据项目需求选择适合的工具来打包你的 Electron 应用。
