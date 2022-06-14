var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var DAO = artifacts.require("./DAO.sol");
var Banker = artifacts.require("./Banker.sol");
var LibA = artifacts.require("./imported/verify.sol");

module.exports = function(deployer, network, accounts) {
    var BankerTS = require('../AAA/Banker.js')
    deployer.deploy(LibA);
    deployer.link(LibA, Banker);
    deployer.deploy(DAO);
    var public_key = web3.eth.accounts.privateKeyToAccount(web3.utils.sha3("1")).address;
    deployer.deploy(Banker, public_key, {from:accounts[3]}).then(function(Banker_instance){
            white_list = [accounts[8], accounts[9]];
            black_list = [accounts[5], accounts[6]];
            var nonce = '1';
            var private_key = web3.utils.keccak256(nonce);
            var update_key = web3.eth.accounts.privateKeyToAccount(private_key).address;
            BankerTS.synchronizeData(web3.utils.sha3("1"), public_key, accounts[3], "Banker", Banker_instance.address, white_list, black_list, update_key, 'ECFChecker');
            console.log("policy successfully!")
    });
};
