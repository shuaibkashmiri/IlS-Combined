import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendCourseStatusEmail = async (email, fullname, courseTitle, status, reason = '') => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your Course "${courseTitle}" Has Been ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        html: `
            <h2>Course Status Update</h2>
            <p>Dear ${fullname},</p>
            <p>Your course <b>${courseTitle}</b> has been <b>${status}</b>.</p>
            ${reason ? `<p>Reason: ${reason}</p>` : ''}
            <p>Best regards,<br>E-Learning Team</p>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Course status email sending failed:', error);
        return false;
    }
};

export const sendVideoStatusEmail = async (email, fullname, videoTitle, status, reason = '') => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your Video "${videoTitle}" Has Been ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        html: `
            <h2>Video Status Update</h2>
            <p>Dear ${fullname},</p>
            <p>Your video <b>${videoTitle}</b> has been <b>${status}</b>.</p>
            ${reason ? `<p>Reason: ${reason}</p>` : ''}
            <p>Best regards,<br>E-Learning Team</p>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Video status email sending failed:', error);
        return false;
    }
};
