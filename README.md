# send mail

Electron SMTP 发送邮件

```bash
npm install electron --save-dev
```

引用邮件发送包
```bash
npm install electron nodemailer
```

## 邮局配置说明


**163 邮箱授权码：** 使用的是 163 邮箱，确保已在 163 邮箱的设置中生成了授权码，并用该授权码代替密码字段。

**Gmail 应用专用密码：** 如果开启了两步验证，需要生成并使用应用专用密码，而不是直接使用邮箱密码。可以在 Google Account 的安全设置中生成应用专用密码。

**SMTP 服务器：** 不同邮箱的 SMTP 服务器地址和端口可能有所不同。

**service 选项：** 对于 Gmail，nodemailer 支持通过 service 选项简化配置，因此不需要手动设置 host 和 port。

运行脚本时确保你已经安装了 nodemailer，并且代码中的邮箱账号、密码或授权码已正确填写。

## Send code


```js
const nodemailer = require('nodemailer');

// Gmail
// 创建一个SMTP客户端配置
// let transporter = nodemailer.createTransport({
//     service: 'gmail', // 使用 Gmail 的 SMTP 服务
//     auth: {
//         user: 'your-email@gmail.com', // 你的Gmail邮箱账号
//         pass: 'your-email-password' // 你的Gmail邮箱密码或应用专用密码
//     }
// });

// 163 邮箱
// 创建一个SMTP客户端配置
let transporter = nodemailer.createTransport({
    host: 'smtp.163.com', // 163 邮箱的 SMTP 服务器地址
    port: 465, // SMTP端口，163 邮箱使用SSL的端口为465
    secure: true, // 端口为465时需要设为true
    auth: {
        user: 'your-email@163.com', // 你的163邮箱账号
        pass: 'your-email-password' // 你的163邮箱密码或授权码
    }
});


// 设置邮件内容
let mailOptions = {
    from: '"Sender Name" <your-email@gmail.com>', // 发件人
    to: 'recipient@example.com', // 收件人
    subject: 'Hello from Gmail', // 邮件主题
    text: 'Hello world!', // 文本内容
    html: '<b>Hello world!</b>' // HTML内容
};

// 发送邮件
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});
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

Mac 代码签名

```bash
electron-builder --mac --sign "Developer ID Application: Your Name (XXXXXXXXXX)"
```

Windows，你可以使用 .pfx 证书文件进行签名。
