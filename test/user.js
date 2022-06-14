var Owner = artifacts.require("./Owner.sol");
var Owner1 = artifacts.require("./Owner1.sol");
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
userStorage = new LocalStorage('./User');
var Owner_AAA = require('../AAA/Owner_AAA.js')
var Owner1_AAA = require('../AAA/Owner1_AAA.js')
var Owner_abi =  require('../build/contracts/Owner.json')

contract('Owner', function(accounts) {
    it("should decode the singer", function() {
        // var addr = userStorage.getItem('Owner')
        // const contract =  new web3.eth.Contract(Owner_abi.abi, '0x7aB9843C5fAa781e54a1ecC5e4Aad6019EEF4dC3');
        // console.log(contract)
        var msg_sig = "setA(uint256,bytes32,uint256,bytes32,bytes)";
        var owner_array = [];
        owner_array[0] = 'Owner';
        owner_array[1] = 'Owner1';
        var Owner_tickets = Owner_AAA.applyTickets(5, msg_sig, owner_array[0], 9000, 12345);
        var _address = [];
        _address.push(Owner_tickets[0]);
        var _type = [];
        _type.push(Owner_tickets[1]);
        var _access = [];
        _access.push(Owner_tickets[2]);
        var _index = [];
        _index.push(Owner_tickets[3]);
        var _vsignature = [];
        _vsignature.push(Owner_tickets[5]);
        var _rsignature = [];
        _rsignature.push(Owner_tickets[6]);
        var _ssignature = [];
        _ssignature.push(Owner_tickets[7]);
        var Owner1_tickets = Owner1_AAA.applyTickets(5, msg_sig, owner_array[1], 9000, 12345);
        _address.push(Owner1_tickets[0]);
        _type.push(Owner1_tickets[1]);
        _access.push(Owner1_tickets[2]);
        _index.push(Owner1_tickets[3]);
        _vsignature.push(Owner1_tickets[5]);
        _rsignature.push(Owner1_tickets[6]);
        _ssignature.push(Owner1_tickets[7]);
        console.log(Owner_tickets)
        console.log(Owner1_tickets)
        return Owner.deployed().then(function(instance) {
            deco = instance;
            return instance.setA(100,  _address, _type, _access, _index, _vsignature, _rsignature, _ssignature).then(function(res){
                return deco.getA.call().then(function(value){
                    console.log(value)
                    return Owner1.deployed().then(function(instance1) {
                        return instance1.getA.call().then(function(value1){
                            console.log(value1);
                        });

                    });
                });
            });
            // return instance.getA.call();
            // return deco.decode.call(signature, hash)
        });
        // console.log(accounts)
        // return contract.methods.setA(100, _address, _type, _access, _index, _vsignature, _rsignature, _ssignature).send({from:'0xb1D4f06aCb529622C70779ED9cDC59aE5220D1b3'}).then(function(result){
        //     console.log(result);
        // });
    });
});

// web3.eth.getAccounts(function(account){
//     console.log(account)
//     return contract.methods.setA(100, _address, _type, _access, _index, _vsignature, _rsignature, _ssignature).send({from:'0xb1D4f06aCb529622C70779ED9cDC59aE5220D1b3'}).then(function(result){
//         // console.log(result);
//         return contract.methods.getA().call().then(function(Owner_res){
//             result = Owner_res;
//             console.log(Owner_res)
//         });
//     });
// });



function senddata(_addr, _abi){
    userStorage.setItem('Owner', _addr);
}

module.exports.senddata = senddata;