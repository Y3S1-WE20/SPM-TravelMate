// Test PayPal Credentials
// Run this with: node testPayPalCredentials.js

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

console.log('🔍 Testing PayPal Credentials...\n');
console.log('Client ID (first 10 chars):', PAYPAL_CLIENT_ID?.substring(0, 10));
console.log('API Base URL:', PAYPAL_API_BASE);
console.log('Mode:', process.env.PAYPAL_MODE);
console.log('\n---\n');

async function testPayPalConnection() {
  try {
    console.log('1️⃣ Testing PayPal API connection...');
    
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    console.log('Response Status:', response.status);
    console.log('Response Status Text:', response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ SUCCESS! PayPal credentials are valid!');
      console.log('Access Token (first 20 chars):', data.access_token?.substring(0, 20) + '...');
      console.log('Token Type:', data.token_type);
      console.log('Expires In:', data.expires_in, 'seconds');
      console.log('\n🎉 Your PayPal integration should work!\n');
      return true;
    } else {
      const errorData = await response.json();
      console.log('\n❌ FAILED! PayPal credentials are invalid!');
      console.log('Error:', JSON.stringify(errorData, null, 2));
      console.log('\n💡 Solution:');
      console.log('1. Go to https://developer.paypal.com/dashboard/');
      console.log('2. Navigate to Apps & Credentials');
      console.log('3. Make sure you\'re in SANDBOX mode');
      console.log('4. Create a new app or use existing one');
      console.log('5. Copy the new Client ID and Secret');
      console.log('6. Update your .env file\n');
      return false;
    }
  } catch (error) {
    console.log('\n❌ ERROR! Could not connect to PayPal!');
    console.log('Error Message:', error.message);
    console.log('\n💡 Possible Issues:');
    console.log('- Network connection problem');
    console.log('- Firewall blocking PayPal');
    console.log('- VPN interfering with connection');
    console.log('- PayPal servers are down\n');
    console.log('Try:');
    console.log('- Disable VPN');
    console.log('- Check firewall settings');
    console.log('- Visit https://www.paypal.com in browser\n');
    return false;
  }
}

// Run the test
testPayPalConnection()
  .then((success) => {
    if (success) {
      console.log('✅ You can proceed with testing payments!\n');
      process.exit(0);
    } else {
      console.log('⚠️  Fix the issues above before testing payments.\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
