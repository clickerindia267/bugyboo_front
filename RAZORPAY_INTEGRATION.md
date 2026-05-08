# Razorpay UPI Payment Integration - Implementation Guide

## Overview
This document outlines the complete Razorpay UPI payment integration added to the ecommerce checkout flow.

## Implementation Summary

### Files Created

#### 1. **[src/lib/loadRazorpayScript.ts](src/lib/loadRazorpayScript.ts)**
- Safely loads Razorpay checkout script from CDN
- Prevents duplicate script loading with state tracking
- Handles errors gracefully
- Provides `loadRazorpayScript()` function to load the script
- Provides `isRazorpayAvailable()` function to check availability

#### 2. **[src/lib/paymentService.ts](src/lib/paymentService.ts)**
- Reusable payment service functions
- Three main functions:
  - `createRazorpayOrder()` - Creates payment order on backend
  - `handleRazorpayPayment()` - Opens Razorpay popup
  - `verifyRazorpayPayment()` - Verifies payment signature

### Files Modified

#### 1. **[src/lib/api.ts](src/lib/api.ts)**
- Updated `CreateOrderRequest` interface
- Added optional fields:
  - `paymentStatus?: string` - For UPI: "paid", for COD: undefined
  - `transactionId?: string` - Razorpay payment ID

#### 2. **[src/pages/Address.tsx](src/pages/Address.tsx)**
- Added Razorpay and payment service imports
- Added `handleUPIPayment()` function for complete UPI flow
- Updated `handlePlaceOrder()` to differentiate COD vs UPI
- Changed button text dynamically:
  - COD: "Confirm Order"
  - UPI: "Proceed to Payment"
- Added dynamic loading text for button
- Added `successMessage` state for custom success messages

---

## Payment Flow Architecture

### COD Flow (Unchanged)
```
User clicks "Confirm Order"
    ↓
Direct API call: POST /orders
    ↓
Order created with paymentMethod="COD"
    ↓
Success modal shown
    ↓
Redirect to home
```

### UPI Flow (New)
```
User clicks "Proceed to Payment"
    ↓
Load Razorpay Script
    ↓
Step 1: Create Razorpay Order
  POST /payment/create-order
  Payload: { amount }
  Response: { key, order }
    ↓
Step 2: Open Razorpay Popup
  User completes payment in popup
    ↓
Step 3: Razorpay returns payment details
  - razorpay_order_id
  - razorpay_payment_id
  - razorpay_signature
    ↓
Step 4: Verify Payment
  POST /payment/verify
  Payload: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    ↓
Step 5: Create Final Order
  POST /orders
  Payload includes:
    - contact details
    - addressId
    - paymentMethod: "UPI"
    - paymentStatus: "paid"
    - transactionId: razorpay_payment_id
    ↓
Success modal shown
    ↓
Redirect to home
```

---

## API Contracts

### 1. Create Razorpay Order API
**Endpoint:** `POST /payment/create-order`

**Request:**
```json
{
  "amount": 50000  // in paise (₹500)
}
```

**Response:**
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

### 2. Verify Payment API
**Endpoint:** `POST /payment/verify`

**Request:**
```json
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}
```

**Response:**
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

### 3. Create Order API (Updated)
**Endpoint:** `POST /orders`

**Request (COD):**
```json
{
  "contact": {
    "name": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com"
  },
  "addressId": "addr_id",
  "paymentMethod": "COD"
}
```

**Request (UPI):**
```json
{
  "contact": {
    "name": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com"
  },
  "addressId": "addr_id",
  "paymentMethod": "UPI",
  "paymentStatus": "paid",
  "transactionId": "pay_xxxxx"
}
```

**Response:**
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

## Error Handling

The implementation includes comprehensive error handling:

1. **Script Loading Error**
   - Failed to load Razorpay script
   - Toast: "Failed to load Razorpay script. Please check your internet connection."

2. **Payment Order Creation Error**
   - Failed to create payment order on backend
   - Toast displays backend error message

3. **Payment Popup Error**
   - Failed to open Razorpay popup
   - Toast: "Failed to open Razorpay payment window"

4. **User Cancellation**
   - User closes payment popup without paying
   - Toast: "Payment cancelled. Please try again."

5. **Payment Verification Error**
   - Signature verification failed
   - Toast displays verification error

6. **Order Creation Error**
   - Failed to create final order after successful payment
   - Toast displays error message

---

## Key Features

✅ **Non-Breaking Changes**
- Existing COD flow completely unchanged
- All new code is isolated in separate files

✅ **Production Ready**
- Comprehensive error handling
- Loading states for all async operations
- User feedback via toast notifications
- Graceful fallbacks

✅ **Type Safe**
- Full TypeScript support
- Proper interfaces for all API responses
- Type-safe function parameters

✅ **User Experience**
- Dynamic button text (COD: "Confirm Order" → UPI: "Proceed to Payment")
- Dynamic loading messages
- Clear success/error feedback
- Smooth payment flow

✅ **Security**
- Authorization headers on all API calls
- Razorpay script from official CDN
- Signature verification on backend
- No sensitive data stored in frontend

---

## Testing Checklist

- [ ] COD flow works as before
- [ ] Button text changes when switching payment method
- [ ] UPI selected: Razorpay popup opens on button click
- [ ] Successful payment creates order with "paid" status
- [ ] Failed/cancelled payment shows error toast
- [ ] Cart cleared after successful payment
- [ ] Redirect to home page after success
- [ ] Success message displays correctly

---

## Dependencies

No new external dependencies added!
- Uses existing `fetch` API (like rest of app)
- Uses existing `sonner` for toasts
- Uses existing UI components

---

## Environment Variables

Make sure your backend API is configured:
- `VITE_API_BASE_URL` - Backend API base URL (existing)

---

## Additional Notes

### Amount Calculation
- All amounts sent to Razorpay must be in **paise** (multiply by 100)
- ₹500 = 50000 paise
- Code automatically handles this conversion

### Razorpay CDN
- Script loaded from: `https://checkout.razorpay.com/v1/checkout.js`
- Safe loading prevents duplicate scripts
- Handles network errors gracefully

### Payment Status Flow
- **COD**: paymentStatus not sent (backend defaults)
- **UPI**: paymentStatus = "paid" after successful verification
- Ensures clear payment status tracking in database

---

## File Structure
```
src/
├── lib/
│   ├── loadRazorpayScript.ts    (NEW - Script loader)
│   ├── paymentService.ts        (NEW - Payment APIs)
│   └── api.ts                   (MODIFIED - Updated interfaces)
└── pages/
    └── Address.tsx              (MODIFIED - UPI integration)
```

---

## Support & Debugging

If you encounter issues:

1. **Check browser console** for JavaScript errors
2. **Verify backend APIs** are implemented correctly
3. **Check network tab** to see actual API requests/responses
4. **Ensure Razorpay key** is correct in backend response
5. **Test with Razorpay test credentials** first

---

Generated: May 7, 2026
Last Updated: Razorpay UPI Integration Complete
