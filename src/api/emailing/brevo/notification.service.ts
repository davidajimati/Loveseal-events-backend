import type {
  BrevoRequest,
  HtmlNotifyRequest,
  TextNotifyRequest,
} from "../model/notification.model.js";
import * as response from "../../ApiResponseContract.js";
import type { Response } from "express";

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

      await this.sendBrevoEmail(res, body);
    } catch (error) {
      response.badRequest(res, "An error occurred while sending email");
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

      await this.sendBrevoEmail(res, body);
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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(`Brevo error: ${JSON.stringify(result)}`);
      }

      return result;
    } catch (error) {
      response.badRequest(res, "Unable to send email");
    }
  }
}
