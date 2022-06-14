var Owner = artifacts.require("./Owner.sol");
var Owner1 = artifacts.require("./Owner1.sol");
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
userStorage = new LocalStorage('./user');
var Owner_AAA = require('../AAA/Move_Owner_AAA.js')
var Owner1_AAA = require('../AAA/Move_Owner1_AAA.js')
var Owner_abi =  require('../build/contracts/Owner.json')

contract('Owner', function(accounts) {
    it("test multiple tickets", function() {
        var msg_sig = [accounts[8], 'setA', 'a', 6721975];
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
        return Owner.deployed().then(function(instance) {
            deco = instance;
            return instance.setA(100,  _address, _type, _access, _index, _vsignature, _rsignature, _ssignature, {from: accounts[8]}).then(function(res){
                return deco.getA.call().then(function(value){
                    console.log(value)
                    var Owner_tickets1 = Owner_AAA.applyTickets(5, msg_sig, owner_array[0], 9000, 12345);
                    _address[0] = Owner_tickets1[0];
                    _type[0] = Owner_tickets1[1];
                    _access[0] = Owner_tickets1[2];
                    _index[0] = Owner_tickets1[3];
                    _vsignature[0] = Owner_tickets1[5];
                    _rsignature[0] = Owner_tickets1[6];
                    _ssignature[0] = Owner_tickets1[7];
                    return instance.setA(100,  _address, _type, _access, _index, _vsignature, _rsignature, _ssignature, {from: accounts[8]}).then(function(res){
                        return deco.getA.call().then(function(value1) {
                            console.log(value1);
                            var Owner_tickets2 = Owner_AAA.applyTickets(5, msg_sig, owner_array[0], 9000, 12345);
                            _address[0] = Owner_tickets2[0];
                            _type[0] = Owner_tickets2[1];
                            _access[0] = Owner_tickets2[2];
                            _index[0] = Owner_tickets2[3];
                            _vsignature[0] = Owner_tickets2[5];
                            _rsignature[0] = Owner_tickets2[6];
                            _ssignature[0] = Owner_tickets2[7];
                            return instance.setA(100,  _address, _type, _access, _index, _vsignature, _rsignature, _ssignature, {from: accounts[8]}).then(function(res){
                                return deco.getA.call().then(function(value2){
                                    console.log(value2);
                                    var Owner_tickets3 = Owner_AAA.applyTickets(5, msg_sig, owner_array[0], 9000, 12345);
                                    _address[0] = Owner_tickets3[0];
                                    _type[0] = Owner_tickets3[1];
                                    _access[0] = Owner_tickets3[2];
                                    _index[0] = Owner_tickets3[3];
                                    _vsignature[0] = Owner_tickets3[5];
                                    _rsignature[0] = Owner_tickets3[6];
                                    _ssignature[0] = Owner_tickets3[7];
                                    return instance.setA(100,  _address, _type, _access, _index, _vsignature, _rsignature, _ssignature, {from: accounts[8]}).then(function(res){
                                        return deco.getA.call().then(function(value3){
                                            console.log(value3);
                                            var Owner_tickets4 = Owner_AAA.applyTickets(5, msg_sig, owner_array[0], 9000, 12345);
                                            _address[0] = Owner_tickets4[0];
                                            _type[0] = Owner_tickets4[1];
                                            _access[0] = Owner_tickets4[2];
                                            _index[0] = Owner_tickets4[3];
                                            _vsignature[0] = Owner_tickets4[5];
                                            _rsignature[0] = Owner_tickets4[6];
                                            _ssignature[0] = Owner_tickets4[7];
                                            console.log(_address)
                                            console.log(_type)
                                            console.log(_access)
                                            console.log(_index)
                                            return instance.setA(100,  _address, _type, _access, _index, _vsignature, _rsignature, _ssignature, {from: accounts[8]}).then(function(res){
                                                return deco.getA.call().then(function(value4){
                                                    console.log(value4);
                                                    return Owner1.deployed().then(function(instance1) {
                                                        return instance1.getA.call().then(function(value){
                                                            console.log(value);
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
        });
        
    });
}); 

function senddata(_addr, _abi){
    userStorage.setItem('Owner', _addr);
}

module.exports.senddata = senddata;