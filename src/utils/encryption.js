import CryptoJS from "crypto-js";

const addNullBytes = function (plaintext) {
    var plaintextLength = Buffer.byteLength(plaintext,'utf8');
    var mod = plaintextLength % 8;
    if (mod != 0) {
        var result = new Buffer(plaintextLength + 8 - mod);
        for (var i = 0; i < plaintextLength + 8 - mod; ++i) {
            if (i < plaintextLength) {
                result.fill(plaintext.charAt(i),i,i+1);
            }else {
                result.fill(0,i,i+1);
            }
        }
        return result.toString();
    }
    return plaintext;
}

const removeNullBytes = function (str) {
    let buf = new Buffer(str);
    let lastZero;
    for(let i = buf.length - 1; i>=0 ; --i){
        if(buf[i] !=0 ){
            lastZero = i;
            break;
        }
    }
    var result = new Buffer(lastZero + 1);
    for(let i = 0 ; i < result.length ; ++i){
        result[i] = buf[i];
    }
    return result.toString();
}

const Cncryption = {
    encrypt(plaintext, key) {
        return CryptoJS.DES.encrypt(addNullBytes(plaintext), CryptoJS.enc.Utf8.parse(key), {
            mode: CryptoJS.mode.ECB,
            padding:CryptoJS.pad.NoPadding
        }).ciphertext.toString();
    },
    decrypt(ciphertext, key) {
        return removeNullBytes(
            CryptoJS.DES.decrypt(
                CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(ciphertext)).toString(),
                CryptoJS.enc.Utf8.parse(key),
                {
                    mode: CryptoJS.mode.ECB,
                    padding:CryptoJS.pad.NoPadding
                }
            ).toString(CryptoJS.enc.Utf8));
    }
}

export default Cncryption;