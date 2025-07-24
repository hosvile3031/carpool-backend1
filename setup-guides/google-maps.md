# Google Maps API Setup Guide

## Step 1: Create Google Cloud Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Accept the terms of service
4. You'll get $300 in free credits for new accounts

## Step 2: Create a New Project

1. Click the project dropdown at the top
2. Click "New Project"
3. **Project Name**: "Carpool Application"
4. **Organization**: Leave default or select your organization
5. Click "Create"
6. Wait for the project to be created and select it

## Step 3: Enable Required APIs

1. Go to "APIs & Services" → "Library"
2. Search for and enable these APIs:
   - **Maps JavaScript API** (for map display)
   - **Geocoding API** (for address to coordinates conversion)
   - **Places API** (for place search and autocomplete)
   - **Directions API** (for route calculation)
   - **Distance Matrix API** (for distance/duration calculation)

For each API:
1. Click on the API name
2. Click "Enable"
3. Wait for it to be enabled

## Step 4: Create API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy your API key (starts with `AIza...`)
4. Click "Restrict Key" (recommended for security)

## Step 5: Configure API Key Restrictions

1. **Application restrictions**:
   - For development: Choose "None"
   - For production: Choose "HTTP referrers" and add your domain

2. **API restrictions**:
   - Select "Restrict key"
   - Choose the APIs you enabled:
     - Maps JavaScript API
     - Geocoding API
     - Places API
     - Directions API
     - Distance Matrix API

3. Click "Save"

## Step 6: Update Environment Variables

```env
GOOGLE_MAPS_API_KEY=AIza_your_actual_api_key_here
GOOGLE_PLACES_API_KEY=AIza_your_actual_api_key_here
```

Note: You can use the same API key for both variables.

## Step 7: Set Up Billing (Required)

1. Go to "Billing" in the Google Cloud Console
2. Link a payment method (credit card)
3. **Don't worry**: Google provides generous free tiers:
   - Maps JavaScript API: 28,000 loads per month free
   - Geocoding API: 40,000 requests per month free
   - Places API: Varies by request type
   - Directions API: 40,000 requests per month free

## Step 8: Monitor Usage

1. Go to "APIs & Services" → "Dashboard"
2. Monitor your API usage to avoid unexpected charges
3. Set up billing alerts in the Billing section

## Important Security Notes

- **Never expose API keys in frontend code** for production
- Use **domain restrictions** for frontend keys
- Use **IP restrictions** for backend keys
- **Rotate keys** regularly
- **Monitor usage** to detect unauthorized access

## ✅ Test Your API Key

Test with this command:
```bash
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Lagos,Nigeria&key=YOUR_API_KEY"
```

You should get a JSON response with location data.

## Common Issues

1. **API not enabled**: Make sure all required APIs are enabled
2. **Billing not set up**: Many APIs require billing to be enabled
3. **Key restrictions**: Ensure your restrictions match your usage
4. **Quota exceeded**: Monitor your usage and upgrade if needed

## Free Tier Limits (Monthly)

- **Geocoding**: 40,000 requests
- **Directions**: 40,000 requests  
- **Places**: 17,000 requests (basic)
- **Maps loads**: 28,000 loads

Perfect for starting your carpool service!
