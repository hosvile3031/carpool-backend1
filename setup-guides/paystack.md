# Paystack Setup Guide

## Step 1: Create Paystack Account

1. Go to [https://paystack.com/](https://paystack.com/)
2. Click "Create a free account"
3. Fill in your business information:
   - Business name: "Your Carpool Service"
   - Business type: "Transportation/Logistics"
   - Country: Select your country
4. Verify your email address
5. Complete your profile setup

## Step 2: Get API Keys

### For Testing (Development)
1. Log into your Paystack dashboard
2. Go to "Settings" → "API Keys & Webhooks"
3. Copy your **Test** API keys:
   - **Test Secret Key** (starts with `sk_test_`)
   - **Test Public Key** (starts with `pk_test_`)

### For Production (Live)
1. Complete business verification (requires business documents)
2. Once verified, you'll get **Live** API keys:
   - **Live Secret Key** (starts with `sk_live_`)
   - **Live Public Key** (starts with `pk_live_`)

## Step 3: Update Environment Variables

### For Development/Testing:
```env
PAYSTACK_SECRET_KEY=sk_test_your_actual_test_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_actual_test_public_key_here
```

### For Production:
```env
PAYSTACK_SECRET_KEY=sk_live_your_actual_live_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_live_your_actual_live_public_key_here
```

## Step 4: Configure Webhooks (Optional but Recommended)

1. In Paystack dashboard, go to "Settings" → "API Keys & Webhooks"
2. Scroll to "Webhooks" section
3. Click "Add Endpoint"
4. **URL**: `https://your-domain.com/api/payments/webhook`
5. **Events**: Select:
   - `charge.success`
   - `charge.failed`
   - `transfer.success`
   - `transfer.failed`
6. Save the webhook

## Step 5: Test Payment Integration

Create a test payment to verify everything works:

```javascript
// Test with these card details in development:
// Card Number: 4084084084084081
// Expiry: Any future date
// CVV: Any 3 digits
```

## Important Notes

- **Test Mode**: Use test keys for development
- **Live Mode**: Only use live keys in production
- **Security**: Never expose secret keys in frontend code
- **Verification**: Complete business verification for live transactions
- **Fees**: Check Paystack's fee structure for your country

## ✅ Verification Checklist

- [ ] Account created and verified
- [ ] Test API keys obtained
- [ ] Environment variables updated
- [ ] Test payment successful
- [ ] Webhook configured (optional)
- [ ] Business verification completed (for live mode)
