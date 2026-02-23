// src/services/api.js
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { API_URL } from '../Config';

const SECRET_KEY = '7x!9@kL#2mN$5pQ&8rT*uY^3vW';

const secure = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Decryption function
const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      throw new Error('Decryption failed');
    }
    
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};


secure.interceptors.response.use(
  (response) => {

    if (response.data && response.data.encrypted) {
      const decryptedData = decryptData(response.data.data);
      response.data = decryptedData;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default secure;