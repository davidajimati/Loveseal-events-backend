import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendOtpByEmail(otp: string, email: string, otpReason: string) {
    const subject: string = "Loveseal events portal dev token";
    const body: string = `OTP for ${otpReason}: ${otp}`;

    console.log("mail subject: " + subject + " body:", body);

    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
        text: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
            return false;
        } else {
            console.log("Email sent: ", info.response);
        }
    });
    return true;
}

export {
    sendOtpByEmail
}