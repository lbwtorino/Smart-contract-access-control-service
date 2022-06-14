
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
const EthCrypto = require('eth-crypto');

const user = EthCrypto.createIdentity();
console.log("============= User info ==========================")
console.dir(user)

const owner = EthCrypto.createIdentity();
console.log("============= Owner info ========================")
console.dir(owner)

const secretMessage = 'message info (tickets type accordingly)';

async function whole_process(){
    const signature = EthCrypto.sign(
        user.privateKey,
        EthCrypto.hash.keccak256(secretMessage)
    );
    const ticket = {
        message: secretMessage,
        signature
    };
    console.log("============= Tickets info ======================")
    console.dir(ticket)
    const encrypted = await EthCrypto.encryptWithPublicKey(
        owner.publicKey, // by encryping with bobs publicKey, only bob can decrypt the payload with his privateKey
        JSON.stringify(ticket) // we have to stringify the payload before we can encrypt it
    );
    // console.log(encrypted)

    // we convert the object into a smaller string-representation
    const encryptedString = EthCrypto.cipher.stringify(encrypted);
    
    console.log("================= Verify info =====================")
    // we parse the string into the object again
    const encryptedObject = EthCrypto.cipher.parse(encryptedString);

    const decrypted = await EthCrypto.decryptWithPrivateKey(
        owner.privateKey,
        encryptedObject
    );
    const decryptedPayload = JSON.parse(decrypted);

    // check signature
    const senderAddress = EthCrypto.recover(
        decryptedPayload.signature,
        EthCrypto.hash.keccak256(ticket.message)
    );

    console.log('Got tickets from: ' + senderAddress) 
    console.log('message info: ' + decryptedPayload.message)
    console.log("======================================")
};

whole_process()