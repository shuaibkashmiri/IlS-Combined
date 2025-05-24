import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendInstructorApprovalEmail = async (email, fullname) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Instructor Application Has Been Approved',
        html: `
            <h2>Congratulations!</h2>
            <p>Dear ${fullname},</p>
            <p>Your instructor application has been <b>approved</b>. You can now access all instructor features on our E-Learning Platform.</p>
            <p>Best regards,<br>E-Learning Team</p>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Approval email sending failed:', error);
        return false;
    }
};

export const sendInstructorRejectionEmail = async (email, fullname, reason = '') => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Instructor Application Has Been Rejected',
        html: `
            <h2>Application Update</h2>
            <p>Dear ${fullname},</p>
            <p>We regret to inform you that your instructor application has been <b>rejected</b>.</p>
            ${reason ? `<p>Reason: ${reason}</p>` : ''}
            <p>If you have questions or wish to reapply, please contact us.</p>
            <p>Best regards,<br>E-Learning Team</p>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Rejection email sending failed:', error);
        return false;
    }
};
