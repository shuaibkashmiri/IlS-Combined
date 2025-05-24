import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendStudentCredentials = async (email, password, fullname) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to ILS - Your Student Account Details',
        html: `
            <h2>Welcome to ILS E-Learning Platform</h2>
            <p>Dear ${fullname},</p>
            <p>Your student account has been created by the admin. Here are your login details:</p>
            <ul>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Password:</strong> ${password}</li>
            </ul>
            <p>Please login and dont share your credentials with anyone.</p>
            <p>Best regards,<br/>ILS Team</p>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Student credentials email sending failed:', error);
        return false;
    }
};
