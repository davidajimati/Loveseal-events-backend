import type {BrevoRequest, HtmlNotifyRequest, TextNotifyRequest,} from "../model/notification.model.js";
import * as response from "../../ApiResponseContract.js";
import type {Response} from "express";
import {HttpError} from "../../exceptions/HttpError.js";

export class EmailingService {
  public async sendTextContent(res: Response, emailData: TextNotifyRequest) {
    try {
      const body: BrevoRequest = {
        sender: {
          name: "SMFLX 2026",
          email: "info@smflx.org",
        },
        to: [
          {
            email: emailData.email,
            name: emailData.name,
          },
        ],
        subject: emailData.subject,
        textContent: emailData.textContent,
      };

      return await this.sendBrevoEmail(res, body);
    } catch (error) {
      throw new HttpError("error sending email", 500);
    }
  }

  public async sendHtmlContent(res: Response, emailData: HtmlNotifyRequest) {
    try {
      const body: BrevoRequest = {
        sender: {
          name: "SMFLX 2026",
          email: "info@smflx.org",
        },
        to: [
          {
            email: emailData.email,
            name: emailData.name,
          },
        ],
        subject: emailData.subject,
        params: emailData.params,
        htmlContent: emailData.htmlContent,
      };

      return await this.sendBrevoEmail(res, body);
    } catch (error) {
      response.badRequest(res, "An error occurred while sending email");
    }
  }

  async sendBrevoEmail(res: Response, emailData: BrevoRequest) {
    try {
      const url = "https://api.brevo.com/v3/smtp/email";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": `${process.env.BREVO_API_KEY}`,
        },
        body: JSON.stringify(emailData),
      });

      console.log("email sending successful:", response.ok? "true" : "false");
      const result = await response.text();
      console.log("Brevo response: " + result);
      if (!response.ok) {
        console.log("Brevo email sending failed");
        return false;
      }
      return true;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      response.badRequest(res, "Unable to send email");
    }
  }
}
