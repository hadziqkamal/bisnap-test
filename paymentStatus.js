require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');

const host = process.env.HOST;
const clientSecret = process.env.CLIENT_KEY;
const accessToken = fs.readFileSync('access_token.txt', 'utf8');

const body = {
  "originalPartnerReferenceNo": "815027979003",
  "originalReferenceNo": "574929794216",
  "serviceCode": "54"
};

const requestBody = JSON.stringify(body);
console.log('Request body:', requestBody);

const endpointUrl = '/snap/v1.0/debit/status';
const httpMethod = 'POST';
const timestamp = new Date().toISOString();
const sha256Body = crypto.createHash('sha256').update(requestBody).digest('hex').toLowerCase();
const stringToSign = `${httpMethod}:${endpointUrl}:${accessToken}:${sha256Body}:${timestamp}`;
console.log('String to sign:', stringToSign);

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
  'X-IP-ADDRESS': '192.168.1.1',
  'X-DEVICE-ID': 'device123',
  'X-LATITUDE': '37.7749',
  'X-LONGITUDE': '-122.4194'
};

axios.post(`http://${host}${endpointUrl}`, body, { headers })
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.log("Error");
    console.error(error.response ? error.response.data : error.message);
  });
