const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// 获取用户数据目录
const userDataPath = app.getPath('userData');
const configPath = path.join(userDataPath, 'smtp-config.json');

let smtpConfig = {};

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');

    // 在窗口加载完成后，加载并发送配置
    win.webContents.on('did-finish-load', () => {
        if (fs.existsSync(configPath)) {
            const configData = fs.readFileSync(configPath, 'utf-8');
            smtpConfig = JSON.parse(configData);
            win.webContents.send('smtp-config', smtpConfig);
        } else {
            console.log('not found SMTP config');
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// // 保存配置函数
// function saveConfig(config) {
//     fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
// }


// 保存 SMTP 设置
ipcMain.on('save-smtp-settings', (event, config) => {
    smtpConfig = config;
    // 保存配置函数
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    // saveConfig(smtpConfig)
});

// 处理批量发送邮件
ipcMain.on('send-bulk-email', async (event, emailConfig) => {
    try {
        if (!smtpConfig || !smtpConfig.host || !smtpConfig.user || !smtpConfig.pass) {
            event.sender.send('log-message', 'Error:缺少配置文件...');
            throw new Error('未配置SMTP配置.');
        }

        event.sender.send('log-message', '开始发送邮件 ...');
        // 创建SMTP客户端配置
        let transporter = nodemailer.createTransport({
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: smtpConfig.secure,
            auth: {
                user: smtpConfig.user,
                pass: smtpConfig.pass
            }
        });

        // 遍历收件人数组，逐一发送邮件
        for (let recipient of emailConfig.to) {
            let mailOptions = {
                from: emailConfig.from,
                to: recipient,
                subject: emailConfig.subject,
                text: emailConfig.text,
                html: emailConfig.html,
                attachments: emailConfig.attachments
            };

            // 发送邮件
            let info = await transporter.sendMail(mailOptions);
            console.log(`Message sent to ${recipient}: ${info.messageId}`);

            event.sender.send('log-message', `Message sent to ${recipient}: ${info.messageId}`);
        }

        event.reply('email-sent', 'All emails sent successfully.');

        event.sender.send('log-message', `all emails send successfully.`);

    } catch (error) {
        event.reply('email-error', 'Error: ' + error.message);
        event.sender.send('log-message', 'Error: ' + error.message);
    }
});


// ipcMain.handle('get-smtp-config', async () => {
//     const configPath = path.join(__dirname, 'smtp-config.json');
//     if (fs.existsSync(configPath)) {
//         const configData = fs.readFileSync(configPath, 'utf-8');
//         return JSON.parse(configData);
//     } else {
//         throw new Error('配置文件不存在');
//     }
// });

// // 加载配置函数
// function loadConfig() {
//     if (fs.existsSync(configPath)) {
//         const configData = fs.readFileSync(configPath, 'utf-8');
//         return JSON.parse(configData);
//     } else {
//         console.log('not found SMTP config');
//         return null;
//     }
// }



// if (smtpConfig) {
//     console.log('SMTP 配置信息已加载:', smtpConfig);
// } else {
//     console.log('not found smtp config file');
// }
