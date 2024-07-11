require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const host = process.env.HOST;
const clientSecret = process.env.CLIENT_KEY;
const accessToken = fs.readFileSync('access_token.txt', 'utf8');

// Define the query parameters
const params = {
  "partnerReferenceNo": "ref123",
  "url": "https://example.com/callback",
  "type": "REDIRECT",
  "isDeepLink": "false",
  "bankCardToken": fs.readFileSync('token.txt', 'utf8'),
  "currency": "IDR",
  "value": "100",
  "otpStatus": "REQUIRED",
  "settlementAccount": "account123"
};

const endpointUrl = '/bi-snap/private/debit-transactions';
const httpMethod = 'GET';
const timestamp = new Date().toISOString();
const sha256Body = crypto.createHash('sha256').update('').digest('hex').toLowerCase(); 
const stringToSign = `${httpMethod}:${endpointUrl}:${accessToken}:${sha256Body}:${timestamp}`;
console.log('String to sign:', stringToSign);
const signature = crypto.createHmac('sha512', clientSecret).update(stringToSign).digest('base64');

const headers = {
  'Authorization': "Bearer " + accessToken,
  'X-TIMESTAMP': timestamp,
  'X-SIGNATURE': signature,
  'X-PARTNER-ID': '2323',
  'CHANNEL-ID': '23232',
  'X-EXTERNAL-ID': '2323232',
  'Content-Type': 'application/json'
};

axios.get(`http://${host}${endpointUrl}`, { headers, params })
  .then(response => {    
    fs.writeFileSync('otp.txt', response.data.additionalInfo.chargeToken);
    console.log(response.data);
  })
  .catch(error => {
    console.log("Error");
    console.error(error.response.data);
  });
