import nodemailer from 'nodemailer';
import type {Response, Request} from 'express';
import * as response from "../ApiResponseContract.js";
import {SESClient, SendEmailCommand} from "@aws-sdk/client-ses";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

const sesClient = new SESClient({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});


async function sendEmailViaSes(to: string, otpReason: string, otp: string, res: Response) {
    try {
        const subject: string = "Loveseal events portal test";
        const body: string = `OTP for ${otpReason}: ${otp}`;
        const fromName = process.env.FROME_NAME;
        const fromEmail = process.env.FROM_EMAIL;

        const command = new SendEmailCommand({
            Source: fromName ? `${fromName} <${fromEmail}>`
                : fromEmail,
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Subject: {Data: subject},
                Body: {
                    Html: {Data: body},
                },
            },
        });
        await sesClient.send(command);
        console.log(`sending email sent to ${to}`);
    } catch (err) {
        console.error("SES Email Error:", err);
        return false;
    }
    return true;
}

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
        } else {
            console.log("Email sent: ", info.response);
        }
    });
}

export {
    sendOtpByEmail,
    sendEmailViaSes
}