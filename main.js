const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const nodemailer = require('nodemailer');

let smtpConfig = {};

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 800,
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

// 保存 SMTP 设置
ipcMain.on('save-smtp-settings', (event, config) => {
    smtpConfig = config;
});

// 处理批量发送邮件
ipcMain.on('send-bulk-email', async (event, emailConfig) => {
    try {
        if (!smtpConfig.host || !smtpConfig.user || !smtpConfig.pass) {
            throw new Error('SMTP settings are not configured.');
        }

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
                html: emailConfig.html
            };

            // 发送邮件
            let info = await transporter.sendMail(mailOptions);
            console.log(`Message sent to ${recipient}: ${info.messageId}`);
        }

        event.reply('email-sent', 'All emails sent successfully.');
    } catch (error) {
        event.reply('email-error', 'Error: ' + error.message);
    }
});

