const nodemailer = require('nodemailer');

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
    from: '"Sender Name" <your-email@163.com>', // 发件人
    to: 'recipient@example.com', // 收件人
    subject: 'Hello from 163 Mail', // 邮件主题
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

