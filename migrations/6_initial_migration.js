var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var hydra = artifacts.require("./hydra.sol");
var hydraSmacs = artifacts.require("./hydraSmacs.sol");
var LibA = artifacts.require("./imported/verify.sol");

module.exports = function(deployer, network, accounts) {
    var HydraTS = require('../AAA/hydra.js')
    deployer.deploy(LibA);
    deployer.link(LibA, hydraSmacs);
    deployer.deploy(hydra);
    var public_key = web3.eth.accounts.privateKeyToAccount(web3.utils.sha3("1")).address;
    deployer.deploy(hydraSmacs, public_key, {from:accounts[3]}).then(function(hydra_instance){
            white_list = [accounts[8], accounts[9]];
            black_list = [accounts[5], accounts[6]];
            var nonce = '1';
            var private_key = web3.utils.keccak256(nonce);
            var update_key = web3.eth.accounts.privateKeyToAccount(private_key).address;
            HydraTS.synchronizeData(web3.utils.sha3("1"), public_key, accounts[3], "hydraSmacs", hydra_instance.address, white_list, black_list, update_key, 'Hydra');
            console.log("policy successfully!")
    });
};
