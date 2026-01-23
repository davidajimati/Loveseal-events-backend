export interface PaymentCustomer {
  name: string;
  email: string;
}

export interface KorapPayInitiatePaymentRequest {
  amount: number;
  redirect_url: string;
  currency: "NGN" | string;
  reference: string;
  narration?: string | undefined;
  merchant_bears_cost: boolean;
  customer: any;
  notification_url: string;
}

export interface InitiatePaymentRequest {
  amount: number;
  userId: string;
  reason?: string;
  eventId: string;
  reference: string;
  narration?: string;
}

export interface PaymentStatusWebhook {
  event: string;
  data: {
    reference: string;
    currency: string;
    amount: number;
    fee: number;
    status: string;
    payment_method: string;
    payment_reference?: string; 
  };
}


export interface InitiatePaymentResponse {
  reference: string;
  checkoutUrl: string;
}

export interface KoraPayInitiatePaymentResponseData {
  reference: string;
  checkout_url: string;
}

export interface KoraPayInitiatePaymentResponse {
  status: boolean;
  message: string;
  data: KoraPayInitiatePaymentResponseData;
}
