var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var MultipleDacs = artifacts.require("./MultipleDacs.sol");
// var B = artifacts.require("./MultipleB.sol");
// var C = artifacts.require("./MultipleC.sol");
// var D = artifacts.require("./MultipleD.sol");
// var E = artifacts.require("./MultipleE.sol");
var LibA = artifacts.require("./imported/verify.sol");


module.exports = function(deployer, network, accounts) {
    if (network == "development") {
        var Multiple_dacs = require('../AAA/Multiple_dacs.js')
        // var MultipleB = require('../AAA/MultipleB.js')
        // var MultipleC = require('../AAA/MultipleC.js')
        // var MultipleD = require('../AAA/MultipleD.js')
        deployer.deploy(LibA);
        deployer.link(LibA, MultipleDacs);
        // deployer.link(LibA, B);
        // deployer.link(LibA, C);
        // deployer.link(LibA, D);
        var public_keyDacs = web3.eth.accounts.privateKeyToAccount(web3.utils.sha3("1")).address;
        // var public_keyB = web3.eth.accounts.privateKeyToAccount(web3.utils.sha3("2")).address;
        // var public_keyC = web3.eth.accounts.privateKeyToAccount(web3.utils.sha3("3")).address;
        // var public_keyD = web3.eth.accounts.privateKeyToAccount(web3.utils.sha3("4")).address;
        console.log(public_keyDacs)
        deployer.deploy(MultipleDacs, public_keyDacs, {from:accounts[3]}).then(function(A_instance){
            // return A_instance.getVerifyPrivateKeyAndPolicy.call()
            // .then(function(result){
            // var public_key = web3.eth.accounts.privateKeyToAccount(result[0]).address;
            white_list = [accounts[8], accounts[9]];
            black_list = [accounts[5], accounts[6]];
            var nonce = '1';
            var private_key = web3.utils.keccak256(nonce);
            var update_key = web3.eth.accounts.privateKeyToAccount(private_key).address;
            Multiple_dacs.synchronizeData(web3.utils.sha3("1"),public_keyDacs, accounts[3], "MultipleDacs", A_instance.address, white_list, black_list, update_key);
            // return A_instance.setVerifyPublicKey(public_key)
            // .then(function(public_key_instance){
                console.log("policy successfully!")
        });
            // deployer.deploy(D, 'fa16159c3478b8082cc986b73521bdeaf3f2642ff9f3ed594f86318e3842fe6b', {from:accounts[0]}).then(function(D_instance){
            // deployer.deploy(D, public_keyD, {from:accounts[0]}).then(function(D_instance){
            //     // return D_instance.getVerifyPrivateKeyAndPolicy.call()
            //     // .then(function(resultD){
            //         white_list = [accounts[8], accounts[9]];
            //         black_list = [accounts[5], accounts[6]];
            //         var nonce = '1';
            //         var private_key = web3.utils.keccak256(nonce);
            //         var update_key = web3.eth.accounts.privateKeyToAccount(private_key).address;
            //         // MultipleD.synchronizeData(resultD[0], public_key, resultD[1], resultD[2], D_instance.address, white_list, black_list, update_key);
            //         MultipleD.synchronizeData(web3.utils.sha3("4"), public_keyD, accounts[0], "MultipleD", D_instance.address, white_list, black_list, update_key);
            //         // return D_instance.setVerifyPublicKey(public_key)
            //         // .then(function(public_key_instanceB){
    
            //             return deployer.deploy(C, D_instance.address, public_keyC, {from:accounts[7]}).then(function(C_instance){
            //                 // return C_instance.getVerifyPrivateKeyAndPolicy.call()
            //                 // .then(function(resultC){
            //                     // var public_key = web3.eth.accounts.privateKeyToAccount(resultC[0]).address;
            //                     white_list = [accounts[8], accounts[9]];
            //                     black_list = [accounts[5], accounts[6]];
            //                     var nonce = '1';
            //                     var private_key = web3.utils.keccak256(nonce);
            //                     var update_key = web3.eth.accounts.privateKeyToAccount(private_key).address;
            //                     MultipleC.synchronizeData(web3.utils.sha3("3"), public_keyD, accounts[7], "MultipleC", C_instance.address, white_list, black_list, update_key);
            //                     // return C_instance.setVerifyPublicKey(public_key)
            //                     // .then(function(public_key_instanceB){
                
            //                         return deployer.deploy(B, C_instance.address, public_keyB, {from:accounts[4]}).then(function(B_instance){
            //                             // return B_instance.getVerifyPrivateKeyAndPolicy.call()
            //                             // .then(function(resultB){
            //                                 // var public_key = web3.eth.accounts.privateKeyToAccount(resultB[0]).address;
            //                                 white_list = [accounts[8], accounts[9]];
            //                                 black_list = [accounts[5], accounts[6]];
            //                                 var nonce = '1';
            //                                 var private_key = web3.utils.keccak256(nonce);
            //                                 var update_key = web3.eth.accounts.privateKeyToAccount(private_key).address;
            //                                 MultipleB.synchronizeData(web3.utils.sha3("2"), public_keyB, accounts[4], "MultipleB", B_instance.address, white_list, black_list, update_key);
            //                                 // return B_instance.setVerifyPublicKey(public_key)
            //                                 // .then(function(public_key_instanceB){
                            
            //                                     return deployer.deploy(A, B_instance.address, public_keyA, {from:accounts[3]}).then(function(A_instance){
            //                                         // return A_instance.getVerifyPrivateKeyAndPolicy.call()
            //                                         // .then(function(result){
            //                                             // var public_key = web3.eth.accounts.privateKeyToAccount(result[0]).address;
            //                                             white_list = [accounts[8], accounts[9]];
            //                                             black_list = [accounts[5], accounts[6]];
            //                                             var nonce = '1';
            //                                             var private_key = web3.utils.keccak256(nonce);
            //                                             var update_key = web3.eth.accounts.privateKeyToAccount(private_key).address;
            //                                             MultipleA.synchronizeData(web3.utils.sha3("1"),public_keyA, accounts[3], "MultipleA", A_instance.address, white_list, black_list, update_key);
            //                                             // return A_instance.setVerifyPublicKey(public_key)
            //                                             // .then(function(public_key_instance){
            //                                                 console.log("policy successfully!")
            //                                             });
            //                                         // });
            //                                     // });
                            
            //                                 });
            //                             // });
            //                         // });
                
            //                     });
            //                 // });
            //             // });
    
            //         });
            //     // });
            // // });
    }else {
        console.log("wrong nework configuration!");
    }    
};