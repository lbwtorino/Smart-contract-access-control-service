var Owner = artifacts.require("./Owner.sol");
var AAA = artifacts.require("./AAA.sol")
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));


contract('AAA', function(accounts) {
    it("should decode the singer", function() {

        var signature = web3.eth.accounts.sign('hello', '0x6ccf2f938d8bab6c66ff333d6ab6e5cb9775912285d345ecdf2e8262289ef69f');
        // console.log(signature) 
        // console.log(web3.utils.sha3("getCalldata()"))
        // console.log(web3.utils.sha3("setA(uint256,bytes32,uint8,bytes32,bytes32)"))
        // var result = web3.eth.accounts.recover(signature)
        // web3.eth.getTransactionCount('0xBa7F9239A21A678b334F3dF8Ba4Dc6669492e44a').then(function(instance){
        //     console.dir(instance)
        // });
        var deco; 
        return AAA.deployed().then(function(instance) {
            deco = instance;
            // return deco.setA.call(10, signature.messageHash, signature.v, signature.r, signature.s);
            // return deco.getPrivateKeyByAddress.call('0xBa7F9239A21A678b334F3dF8Ba4Dc6669492e44a');
            // return deco.getAddressByPrivateKey.call('0x6ccf2f938d8bab6c66ff333d6ab6e5cb9775912285d345ecdf2e8262289ef69f');
            return deco.get_policy.call('0xBa7F9239A21A678b334F3dF8Ba4Dc6669492e44a');
            // return deco.addPolicy.call(10000000000000000000);
        }).then(function(para) {
            // assert.equal(para, account, "decode fail");
            // console.log("signer address:"+ account)
            //     return deco.get3.call('0xBa7F9239A21A678b334F3dF8Ba4Dc6669492e44a');
            // }).then(function(para){
            console.log("Return value:"+ para)
        });
    });
});
