export interface BrevoRequest {
  sender: {
    name: string;
    email: string;
  };
  to: Array<{
    email: string;
    name?: string | undefined;
  }>;
  subject: string;
  textContent?: string;
  htmlContent?: string;
}

export interface TextNotifyRequest {
  subject: string;
  email: string;
  name?: string | undefined;
  textContent: string;
}

export interface HtmlNotifyRequest {
  subject: string;
  email: string;
  name?: string | undefined;
  htmlContent: string;
}
