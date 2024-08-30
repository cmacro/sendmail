const { ipcRenderer } = require('electron');

const smtpSettingsForm = document.getElementById('smtpSettingsForm');
const emailForm = document.getElementById('emailForm');
const statusText = document.getElementById('status');

// Save SMTP settings
smtpSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const smtpConfig = {
        host: document.getElementById('smtpHost').value,
        port: document.getElementById('smtpPort').value,
        secure: document.getElementById('smtpSecure').checked,
        user: document.getElementById('smtpEmail').value,
        pass: document.getElementById('smtpPassword').value
    };

    ipcRenderer.send('save-smtp-settings', smtpConfig);
    alert('save smtp config finished.');
});

// Send email(s)
emailForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const toEmails = document.getElementById('toEmails').value.split(',').map(email => email.trim());
    const emailConfig = {
        from: document.getElementById('fromEmail').value,
        to: toEmails,
        subject: document.getElementById('subject').value,
        text: document.getElementById('message').value,
        html: document.getElementById('message').value
    };

    // Check for inline image
    const inlineImageInput = document.getElementById('inlineImage');
    if (inlineImageInput.files.length > 0) {
        const inlineImage = inlineImageInput.files[0];
        const inlineImagePath = inlineImage.path;
        const inlineImageCid = 'inline-image'; // unique cid for the image

        emailConfig.html += `<br><img src="cid:${inlineImageCid}">`;

        emailConfig.attachments = emailConfig.attachments || [];
        emailConfig.attachments.push({
            filename: inlineImage.name,
            path: inlineImagePath,
            cid: inlineImageCid // same cid value as in the html body
        });
    }

    // Check for attachments
    const attachmentInputs = document.getElementById('attachments');
    if (attachmentInputs.files.length > 0) {
        emailConfig.attachments = emailConfig.attachments || [];
        for (let i = 0; i < attachmentInputs.files.length; i++) {
            const attachment = attachmentInputs.files[i];
            emailConfig.attachments.push({
                filename: attachment.name,
                path: attachment.path
            });
        }
    }

    ipcRenderer.send('send-bulk-email', emailConfig);
});

ipcRenderer.on('email-sent', (event, message) => {
    statusText.textContent = message;
});

ipcRenderer.on('email-error', (event, errorMessage) => {
    statusText.textContent = errorMessage;
});


ipcRenderer.on('smtp-config', (event, config) => {
    document.getElementById('smtpHost').value = config.host || '';
    document.getElementById('smtpPort').value = config.port || '';
    document.getElementById('smtpSecure').checked = config.secure || false;
    document.getElementById('smtpEmail').value = config.user || '';
    document.getElementById('smtpPassword').value = config.pass || '';
    document.getElementById('fromEmail').value = config.user || '';
});

// 日志输出函数
function appendLog(message) {
    const logOutput = document.getElementById('log-output');
    logOutput.textContent += message + '\n';
    logOutput.scrollTop = logOutput.scrollHeight; // 自动滚动到底部
}

ipcRenderer.on("log-message", (event, message) => {
    appendLog(message)
});
