const crypto = require("crypto");

const config = require('./config/configuration.json');

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
};

const algorithm = "aes256";

function encrypt(text){
    const cipher = crypto.createCipher(algorithm, config.secret);
    let crypted = cipher.update(text, 'utf-8', 'base64');
    crypted += cipher.final('base64');
    return crypted;
}

function decrypt(text) {
    const decipher = crypto.createDecipher(algorithm, config.secret);
    let decrypted = decipher.update(text, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}