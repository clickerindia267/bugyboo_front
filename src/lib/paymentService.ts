/**
 * Payment Service - Razorpay Payment APIs
 * Handles payment creation, verification, and order finalization
 */

import { API_BASE_URL } from "./api";

/**
 * Razorpay Create Order Response
 */
export interface RazorpayCreateOrderResponse {
  success: boolean;
  data: {
    key: string;
    order: {
      id: string;
      amount: number;
      currency: string;
      receipt: string;
      status: string;
      created_at: number;
    };
  };
}

/**
 * Razorpay Payment Details from Popup
 */
export interface RazorpayPaymentDetails {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Payment Verification Response
 */
export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    verified: boolean;
  };
}

/**
 * Create Razorpay order
 * Calls backend to create an order for payment
 * 
 * @param amount - Total amount in rupees. Backend converts this value into paise.
 * @param accessToken - User's access token
 * @returns Razorpay order details with key
 */
export const createRazorpayOrder = async (
  amount: number,
  accessToken: string
): Promise<RazorpayCreateOrderResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to create payment order");
    }

    if (!data.success) {
      throw new Error(data.message || "Failed to create payment order");
    }

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create payment order"
    );
  }
};

/**
 * Verify Razorpay payment
 * Calls backend to verify the payment signature
 * 
 * @param paymentDetails - Payment details from Razorpay popup
 * @param accessToken - User's access token
 * @returns Verification result
 */
export const verifyRazorpayPayment = async (
  paymentDetails: RazorpayPaymentDetails,
  accessToken: string
): Promise<PaymentVerificationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paymentDetails),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Payment verification failed");
    }

    if (!data.success) {
      throw new Error(data.message || "Payment verification failed");
    }

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Payment verification failed"
    );
  }
};

/**
 * Handle Razorpay payment popup
 * Opens Razorpay payment window and returns payment details on success
 * 
 * @param options - Razorpay options
 * @returns Payment details if successful, throws error on failure
 */
export const handleRazorpayPayment = (
  options: {
    key: string;
    order_id: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    contact: string;
    email: string;
  }
): Promise<RazorpayPaymentDetails> => {
  return new Promise((resolve, reject) => {
    const Razorpay = (window as any).Razorpay;

    if (!Razorpay) {
      reject(new Error("Razorpay is not available"));
      return;
    }

    const razorpayOptions = {
      key: options.key,
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      description: options.description,
      order_id: options.order_id,
      contact: options.contact,
      email: options.email,
      handler: function (response: RazorpayPaymentDetails) {
        resolve(response);
      },
      prefill: {
        name: options.name,
        email: options.email,
        contact: options.contact,
      },
      theme: {
        color: "#000000",
      },
      modal: {
        ondismiss: function () {
          reject(new Error("Payment cancelled by user"));
        },
      },
    };

    try {
      const razorpay = new Razorpay(razorpayOptions);
      razorpay.open();
    } catch (error) {
      reject(
        error instanceof Error
          ? error
          : new Error("Failed to open Razorpay payment window")
      );
    }
  });
};
