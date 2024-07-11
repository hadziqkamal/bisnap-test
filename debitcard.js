require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const host = process.env.HOST;
const clientSecret = process.env.CLIENT_SECRET;
const accessToken = fs.readFileSync('access_token.txt', 'utf8');


const body = {
  "partnerReferenceNo": "ref1236",
  "urlParam": {
    "url": "https://example.com/callback",
    "type": "REDIRECT",
    "isDeepLink": "false"
  },
  "bankCardToken": fs.readFileSync('token.txt', 'utf8'),
  "amount": {
    "currency": "IDR",
    "value": "100"
  },
  "additionalInfo": {
    "otpStatus": "REQUIRED",
    "settlementAccount": "account123"
  }
}
const requestBody = JSON.stringify(body); // Minify the request body
console.log('Request body:', requestBody)
const endpointUrl = '/snap/v1.0/debit/payment-host-to-host';
const httpMethod = 'POST';
const timestamp = new Date().toISOString();
const sha256Body = crypto.createHash('sha256').update(requestBody).digest('hex').toLowerCase();
const stringToSign = `${httpMethod}:${endpointUrl}:${accessToken}:${sha256Body}:${timestamp}`;
console.log('String to sign:', stringToSign)
const signature = crypto.createHmac('sha512', clientSecret).update(stringToSign).digest('base64');

const headers = {
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
};


axios.post(`http://${host}${endpointUrl}`, body, { headers })
  .then(response => {    
    fs.writeFileSync('otp.txt', response.data.additionalInfo.chargeToken);
    console.log(response.data)
  })
  .catch(error => {
    console.log("Error")
    console.error(error.response.data)
  });