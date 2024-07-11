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
        'Content-Type': 'application/json',
        'X-IP-ADDRESS': '',
  'X-DEVICE-ID' : 'deviceid',
  'X-LATITUDE' : '22',
  'X-LONGITUDE' : '22',
  'ORIGIN' : 'web',
      }
    });

    console.log('inquiry card Response:', JSON.stringify(response.data));
  } catch (error) {
    console.error('Error making inquiry card:', error);
  }

}

inquiryCard();