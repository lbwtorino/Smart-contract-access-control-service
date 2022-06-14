var MultipleA = artifacts.require("./MultipleA.sol");
var microtime = require('microtime')
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
userStorage = new LocalStorage('./user');
var throughput = require('../AAA/throughput.js')

contract('MultipleA', function(accounts) {
    it("test multiple token", function() {
        var super_no = [accounts[8], false];
        var super_onetime = [accounts[8], true];
        var method_no = [accounts[8], 'withdrawBalance', false];
        var method_onetime = [accounts[8], 'withdrawBalance', true];
        var argument_no = [accounts[8], 'withdrawBalance', 'userBalances',1000, false];
        var argument_onetime = [accounts[8], 'withdrawBalance', 'userBalances',1000, true];
        var owner_array = [];
        owner_array[0] = 'MultipleA';
        number = 10000
        for (var i=0; i<number; i++){
            if(i == 0){
                console.log(microtime.now()/1000000.0)
            }
            // var A_tickets = throughput.applyTickets(1, super_no, owner_array[0]);
            // var A_tickets = throughput.applyTickets(1, super_onetime, owner_array[0]);
            // var A_tickets = throughput.applyTickets(2, method_no, owner_array[0]);
            // var A_tickets = throughput.applyTickets(2, method_onetime, owner_array[0]);
            // var A_tickets = throughput.applyTickets(3, argument_no, owner_array[0]);
            var A_tickets = throughput.applyTickets(3, argument_onetime, owner_array[0]);
            if(i == number-1){
                console.log(microtime.now()/1000000.0)
            }
        }
        
    });
});
