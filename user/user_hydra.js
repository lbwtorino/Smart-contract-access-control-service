var HYDRA = artifacts.require("./hydra.sol");
var HYDRASMACS = artifacts.require("./hydraSmacs.sol");
var Web3 = require('web3');
var fs = require("fs");
var sleep = require('sleep');
var LocalStorage = require('node-localstorage').LocalStorage;
policyStorage = new LocalStorage('./data/policy');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var hydrasmacs = require('../AAA/hydraVerify.js')
var hydra = require('../AAA/hydra.js')


contract('hydra', function(accounts) {
    it("hydra detection", function() {
        var super_no = [accounts[8], false];
        var super_onetime = [accounts[8], true];
        var method_no = [accounts[8], 'setValue', false];
        var method_onetime = [accounts[8], 'setValue', true];
        var argument_no = [accounts[8], 'setValue', 'value',1000, false];
        var argument_onetime = [accounts[8], 'setValue', 'value',1000, true];
        var clientAbi = JSON.stringify([{"constant":true,"inputs":[],"name":"hyd","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"setValue","outputs":[],"payable":false,"type":"function","stateMutability":"nonpayable"},{"inputs":[{"name":"addr","type":"address"}],"type":"constructor","payable":true,"stateMutability":"payable"}]);
        var bytecode = "0x60606040526040516020806101e4833981016040528080519060200190919050505b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5061015d806100876000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806340d0e1fd14610047578063552410771461008557610042565b610002565b346100025761005960048050506100a2565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34610002576100a060048080359060200190919050506100c8565b005b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635524107782604051827c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b156100025760325a03f115610002575050505b5056";
        var msg_hydra = [accounts[8], 'setValue', clientAbi, bytecode];
        var name = [];
        name[0] = 'hydraSmacs';


        if (JSON.parse(policyStorage.getItem('hydraSmacs')).function[msg_hydra[1]].tools == 'Hydra'){
            console.log('Hydra detect!!!')
        }else {
            console.log(JSON.parse(policyStorage.getItem('hydraSmacs')).function[msg_hydra[1]].tools);
        }
        var results = hydrasmacs.hydracheck(msg_hydra);
        sleep.sleep(10);
        var lines = fs.readFileSync("/Users/liubowen/sutd/SCticket/code/Hydra/detect.txt").toString().split("\n")
        console.log(lines)
        for (var i=0; i < lines.length; i++){
            if (lines[i].indexOf("Failed") != -1) {
                results = false;
            }
        }
        if (results == false) {
            console.log('Fail to pass Hydra check!')
        }else{
            // var tickets = banker.applyTickets(3, argument_no, name[0]);
            var tickets = hydra.applyTickets(3, argument_onetime, name[0]);
            var _address = [];
            _address.push(tickets[0]);
            var _type = [];
            _type.push(tickets[1]);
            var _access = [];
            _access.push(tickets[2]);
            var _index = [];
            _index.push(tickets[3]);
            var _vsignature = [];
            _vsignature.push(tickets[4]);
            var _rsignature = [];
            _rsignature.push(tickets[5]);
            var _ssignature = [];
            _ssignature.push(tickets[6]);
            // console.log(tickets)

            return HYDRASMACS.deployed().then(function(instance) {
                deco = instance;
                return instance.setValue(1000, _address, _type, _access, _index, _vsignature, _rsignature, _ssignature, {from: accounts[8]}).then(function(res){
                    return deco.getValue.call().then(function(value){
                        console.log(value);
                    });                
                });
            });
        }
    });
});
