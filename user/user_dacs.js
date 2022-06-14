var MultipleDacs = artifacts.require("./MultipleDacs.sol");
// var B = artifacts.require("./MultipleB.sol");
// var C = artifacts.require("./MultipleC.sol");
// var D = artifacts.require("./MultipleD.sol");
// var E = artifacts.require("./MultipleE.sol");
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
userStorage = new LocalStorage('./user');
var Multiple_dacs = require('../AAA/Multiple_dacs.js')
// var MultipleB = require('../AAA/MultipleB.js')
// var MultipleC = require('../AAA/MultipleC.js')
// var MultipleD = require('../AAA/MultipleD.js')
// var MultipleE = require('../AAA/MultipleE.js')

contract('Banker', function(accounts) {
    it("test multiple tickets", function() {
        var super_no = [accounts[8], false];
        var super_onetime = [accounts[8], true];
        var method_no = [accounts[8], 'withdrawBalance', false];
        var method_onetime = [accounts[8], 'withdrawBalance', true];
        var argument_no = [accounts[8], 'withdrawBalance', 'userBalances',1000, false];
        var argument_onetime = [accounts[8], 'withdrawBalance', 'userBalances',1000, true];
        var owner_array = [];
        owner_array[0] = 'MultipleDacs';
        // owner_array[1] = 'MultipleB';
        // owner_array[2] = 'MultipleC';
        // owner_array[3] = 'MultipleD';
        var _address = [];
        var _type = [];
        var _access = [];
        var _index = [];
        var _vsignature = [];
        var _rsignature = [];
        var _ssignature = [];


        // var A_tickets = Multiple_dacs.applyTickets(1, super_no, owner_array[0]);
        // var A_tickets = Multiple_dacs.applyTickets(1, super_onetime, owner_array[0]);
        var A_tickets = Multiple_dacs.applyTickets(2, method_no, owner_array[0]);
        // var A_tickets = Multiple_dacs.applyTickets(2, method_onetime, owner_array[0]);
        // var A_tickets = Multiple_dacs.applyTickets(3, argument_no, owner_array[0]);
        // var A_tickets = Multiple_dacs.applyTickets(3, argument_onetime, owner_array[0]);
        _address.push(A_tickets[0]);
        _type.push(A_tickets[1]);
        _access.push(A_tickets[2]);
        _index.push(A_tickets[3]);
        _vsignature.push(A_tickets[4]);
        _rsignature.push(A_tickets[5]);
        _ssignature.push(A_tickets[6]);

        return MultipleDacs.deployed().then(function(instance) {
            deco = instance;
            return instance.withdrawBalance(1000, _address, _type, _access, _index, _vsignature, _rsignature, _ssignature, {from: accounts[8]}).then(function(res){
                return deco.getInfor.call().then(function(value){
                    console.log(value);
                    // return B.deployed().then(function(instanceB) {
                    //     return instanceB.getInfor.call().then(function(value){
                    //         console.log(value);
                    //         return C.deployed().then(function(instanceC) {
                    //             return instanceC.getInfor.call().then(function(value){
                    //                 console.log(value);
                    //                 return D.deployed().then(function(instanceD) {
                    //                     return instanceD.getInfor.call().then(function(value){
                    //                         console.log(value)
                    //                     });  
                    //                 });

                    //             });                
                    //         });

                    //     });                
                    // });

                });                
            });

        });
    });
});
