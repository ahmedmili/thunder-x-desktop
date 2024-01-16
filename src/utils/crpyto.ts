// import crypto from 'crypto-browserify';
import CryptoJS from 'crypto-js';

const sucret_Key = import.meta.env.VITE_CRYPTO_SUCRET_KEY || "thunder-x-2024";
const algorithm_key = import.meta.env.VITE_CRYPTO_ALGORITHME_KEY

const hashData = (originalData: string, secretKey: string = sucret_Key): string => {
    // Encrypt the data using a secret key
    const encryptedData = CryptoJS.AES.encrypt(originalData, secretKey).toString();

    const hashedURL = `${encryptedData}`;
    return hashedURL
}

const unHashData = (encryptedData: string, secretKey: string = sucret_Key): string => {

    // Decrypt the data using the secret key
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedData

}

export const cryptoData = {
    hashData,
    unHashData,
}
