import crypto from "crypto";


export function generatePaymentReference() {
  const randomString = crypto.randomBytes(4).toString("hex").toUpperCase();

  const timestamp = Date.now();

  return `PAY-${timestamp}-${randomString}`;
}
