import {Router} from "express";
import nodemailer from 'nodemailer';
import type {Request, Response} from "express";


export default function registerEmailRoutes(app: Router) {
    const router = Router();
    router.post("/send", (req: Request, res: Response) => {

        const transporter = nodemailer.createTransport({
            // service: "Gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "davidflinty@gmail.com", // the email you used to create router password
                pass: "esit koxm mjok bzsr", // your generated router password
            },
        });

        if (!req.body) {
            return res.status(400).json({ error: "Request body is missing" });
        }
        const { subject, message } = req.body || {};

        console.log("mail subject: " + subject + " message:", message);

        const mailOptions = {
            from: "davidflinty@gmail.com",
            to: "eng.david.ajimati@gmail.com",
            subject: subject,
            text: message,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email: ", error);
                res.status(500).send("Error sending email");
            } else {
                console.log("Email sent: ", info.response);
                res.send("Email sent successfully");
            }
        });
    });

    app.use("/email", router);
}