const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const nodemailer = require('nodemailer');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
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

// 监听渲染进程发送的邮件发送请求
ipcMain.on('send-email', async (event, emailConfig) => {
    try {
        // 创建SMTP客户端配置
        let transporter = nodemailer.createTransport({
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            auth: {
                user: emailConfig.user,
                pass: emailConfig.pass
            }
        });

        // 设置邮件内容
        let mailOptions = {
            from: emailConfig.from,
            to: emailConfig.to,
            subject: emailConfig.subject,
            text: emailConfig.text,
            html: emailConfig.html
        };

        // 发送邮件
        let info = await transporter.sendMail(mailOptions);
        event.reply('email-sent', 'Message sent: ' + info.messageId);
    } catch (error) {
        event.reply('email-error', 'Error: ' + error.message);
    }
});
