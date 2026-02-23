// import axios from "axios";
// import { API_URL } from "../Config";


// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// //  Add token to every request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("admin_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// //  Handle 401 - redirect to login if token expired
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // localStorage.removeItem("admin_token");
//       localStorage.removeItem("admin_token_expires");
//       // window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;



import axios from "axios";
import CryptoJS from "crypto-js";
import { API_URL } from "../Config";

// Add your secret key here (must match backend)
const SECRET_KEY = "7x!9@kL#2mN$5pQ&8rT*uY^3vW";

// Decryption function
const decryptData = (encryptedData) => {
  try {
    console.log("Attempting to decrypt:", encryptedData.substring(0, 50) + "...");
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      throw new Error('Decryption failed - empty result');
    }
    
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response - decrypt if needed
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Raw response data:", response.data);
    
    // Check if response is encrypted (check for both encrypted and encoded flags)
    if (response.data) {
      // Case 1: Has encrypted flag
      if (response.data.encrypted === true) {
        console.log("Found encrypted: true flag");
        try {
          const decryptedData = decryptData(response.data.data);
          response.data = decryptedData;
          console.log("Decryption successful");
        } catch (error) {
          console.error("Decryption failed:", error);
        }
      }
      // Case 2: Has encoded flag (if backend uses 'encoded' instead)
      else if (response.data.encoded === true) {
        console.log("Found encoded: true flag");
        try {
          const decryptedData = decryptData(response.data.data);
          response.data = decryptedData;
          console.log("Decryption successful");
        } catch (error) {
          console.error("Decryption failed:", error);
        }
      }
      // Case 3: Check if data looks encrypted (starts with U2FsdGVkX1 for CryptoJS)
      else if (response.data.data && typeof response.data.data === 'string' && 
               response.data.data.startsWith('U2FsdGVkX1')) {
        console.log("Data looks encrypted, attempting decryption...");
        try {
          const decryptedData = decryptData(response.data.data);
          response.data = decryptedData;
          console.log("Decryption successful");
        } catch (error) {
          console.error("Decryption failed:", error);
        }
      }
    }
    
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token_expires");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;