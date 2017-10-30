var CryptoJS = require("crypto-js");

export function encrypt(data)
{
    var ciphertext = CryptoJS.AES.encrypt(data, '5olVFvfdpz');
    console.log("encrypted text", ciphertext.toString());
    return ciphertext.toString();
}
export function decrypt(data)
{
    var bytes  = CryptoJS.AES.decrypt(data, '5olVFvfdpz');
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    console.log("decrypted text", plaintext);
    return plaintext;
}
