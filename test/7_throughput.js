var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var A = artifacts.require("./MultipleA.sol");
var B = artifacts.require("./MultipleB.sol");
var C = artifacts.require("./MultipleC.sol");
var D = artifacts.require("./MultipleD.sol");
// var E = artifacts.require("./MultipleE.sol");
var LibA = artifacts.require("./imported/verify.sol");


module.exports = function(deployer, network, accounts) {
    if (network == "development") {
        var MultipleA = require('../AAA/MultipleA.js')
        var MultipleB = require('../AAA/MultipleB.js')
        var MultipleC = require('../AAA/MultipleC.js')
        var MultipleD = require('../AAA/MultipleD.js')
        // var MultipleE = require('../AAA/MultipleE.js')
        deployer.deploy(LibA);
        deployer.link(LibA, A);
        deployer.link(LibA, B);
        deployer.link(LibA, C);
        deployer.link(LibA, D);
            deployer.deploy(D, 'fa16159c3478b8082cc986b73521bdeaf3f2642ff9f3ed594f86318e3842fe6b', {from:accounts[0]}).then(function(D_instance){
                return D_instance.getVerifyPrivateKeyAndPolicy.call()
                .then(function(resultD){
                    var public_key = web3.eth.accounts.privateKeyToAccount(resultD[0]).address;
                    white_list = [accounts[8], accounts[9]];
                    black_list = [accounts[5], accounts[6]];
                    var nonce = '1';
                    var private_key = web3.utils.keccak256(nonce);
                    var update_key = web3.eth.accounts.privateKeyToAccount(private_key).address;
                    MultipleD.synchronizeData(resultD[0],public_key, resultD[1], resultD[2], D_instance.address, white_list, black_list, update_key);
                    return D_instance.setVerifyPublicKey(public_key)
                    .then(function(public_key_instanceB){
    
                        return deployer.deploy(C, D_instance.address, '33a47ff6a52e04f08453bdafc96b29f2dd531615b86a2d710f4ee20ec668a68f', {from:accounts[7]}).then(function(C_instance){
                            return C_instance.getVerifyPrivateKeyAndPolicy.call()
                            .then(function(resultC){
                                var public_key = web3.eth.accounts.privateKeyToAccount(resultC[0]).address;
                                white_list = [accounts[8], accounts[9]];
                                black_list = [accounts[5], accounts[6]];
                                var nonce = '1';
                                var private_key = web3.utils.keccak256(nonce);
                                var update_key = web3.eth.accounts.privateKeyToAccount(private_key).address;
                                MultipleC.synchronizeData(resultC[0],public_key, resultC[1], resultC[2], C_instance.address, white_list, black_list, update_key);
                                return C_instance.setVerifyPublicKey(public_key)
                                .then(function(public_key_instanceB){
                
                                    return deployer.deploy(B, C_instance.address, '0x84fcce5eba1db05ce018fbe79dd5b22c7618e7f199e527844267311bef7a8999', {from:accounts[4]}).then(function(B_instance){
                                        return B_instance.getVerifyPrivateKeyAndPolicy.call()
                                        .then(function(resultB){
                                            var public_key = web3.eth.accounts.privateKeyToAccount(resultB[0]).address;
                                            white_list = [accounts[8], accounts[9]];
                                            black_list = [accounts[5], accounts[6]];
                                            var nonce = '1';
                                            var private_key = web3.utils.keccak256(nonce);
                                            var update_key = web3.eth.accounts.privateKeyToAccount(private_key).address;
                                            MultipleB.synchronizeData(resultB[0],public_key, resultB[1], resultB[2], B_instance.address, white_list, black_list, update_key);
                                            return B_instance.setVerifyPublicKey(public_key)
                                            .then(function(public_key_instanceB){
                            
                                                return deployer.deploy(A, B_instance.address, 'c7e06b93d050bb76204321743ba7da6d5a2486d1abce5bd83b7788a6bedaf372', {from:accounts[3]}).then(function(A_instance){
                                                    return A_instance.getVerifyPrivateKeyAndPolicy.call()
                                                    .then(function(result){
                                                        var public_key = web3.eth.accounts.privateKeyToAccount(result[0]).address;
                                                        white_list = [accounts[8], accounts[9]];
                                                        black_list = [accounts[5], accounts[6]];
                                                        var nonce = '1';
                                                        var private_key = web3.utils.keccak256(nonce);
                                                        var update_key = web3.eth.accounts.privateKeyToAccount(private_key).address;
                                                        MultipleA.synchronizeData(result[0],public_key, result[1], result[2], A_instance.address, white_list, black_list, update_key);
                                                        return A_instance.setVerifyPublicKey(public_key)
                                                        .then(function(public_key_instance){
                                                            console.log("policy successfully!")
                                                        });
                                                    });
                                                });
                            
                                            });
                                        });
                                    });
                
                                });
                            });
                        });
    
                    });
                });
            });
        //         });
        //     });
        // });
    }else {
        console.log("wrong nework configuration!");
    }    
};