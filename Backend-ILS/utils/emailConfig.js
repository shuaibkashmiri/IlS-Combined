import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendInstructorCredentials = async (email, password, fullname, profession) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to E-Learning Platform - Your Instructor Account Details',
        html: `
            <h2>Welcome to E-Learning Platform</h2>
            <p>Dear ${fullname},</p>
            <p>Your instructor account has been created successfully. Here are your account details:</p>
            <ul>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Password:</strong> ${password}</li>
                <li><strong>Profession:</strong> ${profession}</li>
                <li><strong>Role:</strong> Instructor</li>
            </ul>
            <p>Please login using these credentials and change your password upon first login.</p>
            <p>Best regards,<br>E-Learning Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};
