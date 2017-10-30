var CryptoJS = require("crypto-js");

export function encrypt(data)
{
    var ciphertext = CryptoJS.AES.encrypt(data, '5olVFvfdpz');
    return ciphertext.toString();
}
export function decrypt(data)
{
    var bytes  = CryptoJS.AES.decrypt(data, '5olVFvfdpz');
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);

    return plaintext;
}
