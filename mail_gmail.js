const nodemailer = require('nodemailer');

// 创建一个SMTP客户端配置
let transporter = nodemailer.createTransport({
    service: 'gmail', // 使用 Gmail 的 SMTP 服务
    auth: {
        user: 'your-email@gmail.com', // 你的Gmail邮箱账号
        pass: 'your-email-password' // 你的Gmail邮箱密码或应用专用密码
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

