import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key'; // 请替换为您的密钥

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const setAuthCookie = (data) => {
  const encryptedData = encryptData(data);
  document.cookie = `authData=${encryptedData}; path=/; max-age=86400`; // 1天过期
};

export const getAuthCookie = () => {
  const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)authData\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  return cookieValue ? decryptData(cookieValue) : null;
};

export const clearAuthCookie = () => {
  document.cookie = 'authData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
