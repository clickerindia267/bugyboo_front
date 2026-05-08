# Backend Implementation Requirements - Razorpay UPI Payment

## Overview
This guide outlines what backend APIs need to be implemented for the Razorpay UPI payment integration to work.

## Required Backend Endpoints

### 1. Create Razorpay Order
**Endpoint:** `POST /payment/create-order`  
**Auth:** Required (Bearer token)

**Purpose:** Create a Razorpay order that the frontend will use to initiate payment

**Request Body:**
```json
{
  "amount": 50000
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "key": "rzp_live_xxxxx",
    "order": {
      "id": "order_xxxxx",
      "amount": 50000,
      "currency": "INR",
      "receipt": "receipt_xxxxx",
      "status": "created",
      "created_at": 1234567890
    }
  }
}
```

**Notes:**
- Amount comes in paise (₹500 = 50000)
- Must create order using Razorpay Node SDK: `razorpay.orders.create()`
- Include user ID from JWT token
- Store order_id in database for reference
- Return Razorpay API key for frontend

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to create order"
}
```

---

### 2. Verify Payment Signature
**Endpoint:** `POST /payment/verify`  
**Auth:** Required (Bearer token)

**Purpose:** Verify the Razorpay payment signature to ensure payment was successful and authentic

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "razorpay_order_id": "order_xxxxx",
    "razorpay_payment_id": "pay_xxxxx",
    "razorpay_signature": "signature_xxxxx",
    "verified": true
  }
}
```

**Expected Response (Failure):**
```json
{
  "success": false,
  "message": "Payment verification failed"
}
```

**Implementation Steps:**

1. Create string to verify: `order_id + "|" + payment_id`
2. Generate HMAC SHA256 using your Razorpay secret: `crypto.createHmac('sha256', secret).update(body).digest('hex')`
3. Compare generated hash with received signature
4. If match, payment is verified
5. Return success

**Pseudo Code:**
```javascript
const body = razorpay_order_id + "|" + razorpay_payment_id;
const expectedSignature = crypto
  .createHmac("sha256", RAZORPAY_KEY_SECRET)
  .update(body)
  .digest("hex");

const verified = expectedSignature === razorpay_signature;
```

---

### 3. Update Create Order Endpoint (Existing)
**Endpoint:** `POST /orders` (Already exists, need update)

**Current Working Payload (COD):**
```json
{
  "contact": {
    "name": "bugyboo",
    "mobile": "8744953803",
    "email": "info@bugyboo.com"
  },
  "addressId": "69f8804978dea8fce2825080",
  "paymentMethod": "COD"
}
```

**New Payload For UPI:**
```json
{
  "contact": {
    "name": "bugyboo",
    "mobile": "8744953803",
    "email": "info@bugyboo.com"
  },
  "addressId": "69f8804978dea8fce2825080",
  "paymentMethod": "UPI",
  "paymentStatus": "paid",
  "transactionId": "pay_xxxxx"
}
```

**What Changed:**
- Added `paymentStatus`: "paid" (only for UPI)
- Added `transactionId`: Razorpay payment ID (only for UPI)
- `paymentMethod` = "UPI" (instead of "COD")

**Response (Remains Same):**
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "paymentMethod": "UPI",
    "paymentStatus": "paid",
    "orderStatus": "ordered"
  }
}
```

---

## Setup Instructions

### 1. Get Razorpay Credentials
1. Sign up at [https://razorpay.com](https://razorpay.com)
2. Get API Key and Key Secret from dashboard
3. Keep Key Secret secure (never expose in frontend)

### 2. Install Razorpay SDK
```bash
npm install razorpay
```

### 3. Configure Environment
```env
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx
```

### 4. Initialize Razorpay in Backend
```javascript
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
```

---

## Example Implementation (Node.js/Express)

### Create Order Endpoint
```javascript
const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/payment/create-order", authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Create order with Razorpay
    const order = await razorpay.orders.create({
      amount: amount, // in paise
      currency: "INR",
      receipt: `receipt_${userId}_${Date.now()}`,
    });

    return res.json({
      success: true,
      data: {
        key: process.env.RAZORPAY_KEY_ID,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
          created_at: order.created_at,
        },
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
});
```

### Verify Payment Endpoint
```javascript
router.post("/payment/verify", authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const verified = expectedSignature === razorpay_signature;

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Optional: Fetch payment details from Razorpay to confirm
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: "Payment not captured",
      });
    }

    // Payment verified successfully
    res.json({
      success: true,
      message: "Payment verified successfully",
      data: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        verified: true,
      },
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
});
```

### Update Order Endpoint
```javascript
// In your existing POST /orders endpoint, add:

router.post("/orders", authenticateToken, async (req, res) => {
  try {
    const { contact, addressId, paymentMethod, paymentStatus, transactionId } = req.body;
    
    // ... existing validation code ...

    const order = new Order({
      user: req.user.id,
      contact,
      address: addressId,
      paymentMethod,
      paymentStatus: paymentStatus || "pending", // "pending" for COD, "paid" for UPI
      transactionId: transactionId || null, // Razorpay payment ID for UPI
      orderStatus: "ordered",
      // ... other fields ...
    });

    await order.save();

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
});
```

---

## Important Notes

⚠️ **Security:**
- Never expose `RAZORPAY_KEY_SECRET` in frontend code
- Always verify signatures on backend
- Never trust payment status from frontend alone
- Use HTTPS only in production

⚠️ **Amount Handling:**
- All amounts in API are in **paise** (smallest unit)
- ₹1 = 100 paise
- Always validate amount on backend before creating order

⚠️ **Error Responses:**
- Always return consistent error format
- Include meaningful error messages
- Log all errors for debugging

✅ **Testing:**
- Use Razorpay test credentials for development
- Test both success and failure scenarios
- Test with test card: 4111 1111 1111 1111

---

## Testing Credentials (Razorpay Sandbox)

For testing, use these credentials:

**Test Card:**
- Number: 4111 1111 1111 1111
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)

**Test UPI:**
- UPI ID: success@razorpay

---

## Verification Checklist

- [ ] `/payment/create-order` endpoint implemented
- [ ] `/payment/verify` endpoint implemented
- [ ] `/orders` endpoint updated for UPI fields
- [ ] Razorpay SDK installed and configured
- [ ] Environment variables set (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
- [ ] Signature verification logic implemented correctly
- [ ] Error handling implemented
- [ ] Tested with Razorpay test credentials
- [ ] HTTPS enabled in production
- [ ] Logging in place for debugging

---

Generated: May 7, 2026  
Last Updated: Razorpay UPI Backend Integration Guide
