const { app, BrowserWindow, ipcMain } = require('electron');
const nodemailer = require('nodemailer');
let smtpConfig;

ipcMain.on('save-smtp-settings', (event, config) => {
    smtpConfig = config;
});

ipcMain.on('send-bulk-email', async (event, emailConfig) => {
    try {
        if (!smtpConfig) {
            throw new Error('SMTP settings are not configured.');
        }

        let transporter = nodemailer.createTransport({
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: smtpConfig.secure, // true for 465, false for other ports
            auth: {
                user: smtpConfig.user,
                pass: smtpConfig.pass
            }
        });

        let info = await transporter.sendMail({
            from: emailConfig.from,
            to: emailConfig.to,
            subject: emailConfig.subject,
            text: emailConfig.text,
            html: emailConfig.html,
            attachments: emailConfig.attachments
        });

        event.sender.send('email-sent', 'Email sent: ' + info.response);
    } catch (error) {
        event.sender.send('email-error', 'Failed to send email: ' + error.message);
    }
});

app.whenReady().then(() => {
    createWindow();
});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile('index.html');
}

