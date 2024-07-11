require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');
const host = process.env.HOST;
const endpointUrl = '/snap/v1.0/registration-card-inquiry';
const clientSecret = process.env.CLIENT_KEY;

async function  inquiryCard() {  
  const accessToken = fs.readFileSync('access_token.txt', 'utf8');
  const timestamp = new Date().toISOString();
  const signature = crypto.createHmac('sha512', clientSecret).digest('base64');

  try {
    const response = await axios.get(`http://${host}${endpointUrl}/custIdMerchant/0012345679504`, {
      headers: {
        'Authorization': "Bearer " + accessToken,
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': signature,
        'ORIGIN': 'origin123',
        'Content-Type': 'application/json',
        'X-PARTNER-ID': '2323',
        'CHANNEL-ID': '23232',
        'X-EXTERNAL-ID': '2323232',
        'X-IP-ADDRESS': '192.168.1.1',
        'X-DEVICE-ID': 'device123',
        'X-LATITUDE': '37.7749',
        'X-LONGITUDE': '-122.4194'
      }
    });

    console.log('inquiry card Response:', JSON.stringify(response.data));
  } catch (error) {
    console.error('Error making inquiry card:', error);
  }

}

inquiryCard();