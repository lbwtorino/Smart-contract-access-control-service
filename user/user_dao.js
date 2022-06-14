var DAO = artifacts.require("./DAO.sol");
var Banker = artifacts.require("./Banker.sol");
var Web3 = require('web3');
var fs = require("fs");
var sleep = require('sleep');
var LocalStorage = require('node-localstorage').LocalStorage;
policyStorage = new LocalStorage('./data/policy');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var dao = require('../AAA/DAO.js')
var banker = require('../AAA/Banker.js')

contract('DAO', function(accounts) {
    it("ECF detection", function() {
        var super_no = [accounts[8], false];
        var super_onetime = [accounts[8], true];
        var method_no = [accounts[8], 'withdraw', false];
        var method_onetime = [accounts[8], 'withdraw', true];
        var argument_no = [accounts[8], 'withdraw', 'amount',1000, false];
        var argument_onetime = [accounts[8], 'withdraw', 'amount',1000, true];
        // var attackAbi = JSON.stringify([{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function","stateMutability":"nonpayable"},{"constant":true,"inputs":[],"name":"bank","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":false,"inputs":[],"name":"addBalance","outputs":[],"payable":false,"type":"function","stateMutability":"nonpayable"},{"inputs":[{"name":"addr","type":"address"}],"type":"constructor","payable":true,"stateMutability":"payable"},{"payable":true,"type":"fallback","stateMutability":"payable"}]);
        var attackAbi = JSON.stringify([{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function","stateMutability":"nonpayable"},{"constant":true,"inputs":[],"name":"dao","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":false,"inputs":[],"name":"addBalance","outputs":[],"payable":false,"type":"function","stateMutability":"nonpayable"},{"inputs":[{"name":"addr","type":"address"}],"type":"constructor","payable":true,"stateMutability":"payable"},{"payable":true,"type":"fallback","stateMutability":"payable"}]);
        // var bytecode = "0x60606040526001600160146101000a81548160ff021916908302179055506040516020806104c9833981016040528080519060200190919050505b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610429806100a06000396000f360606040523615610053576000357c0100000000000000000000000000000000000000000000000000000000900480633ccfd60b146101a657806376cdb03b146101ba578063b163cc38146101f857610053565b6101a45b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f8b2cb4f30600060405160200152604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b156100025760325a03f1156100025750505060405180519060200150604051827c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b156100025760325a03f115610002575050505b565b005b34610002576101b8600480505061020c565b005b34610002576101cc6004805050610359565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b346100025761020a600480505061037f565b005b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f8b2cb4f30600060405160200152604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b156100025760325a03f1156100025750505060405180519060200150604051827c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b156100025760325a03f115610002575050505b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b5cef24a30604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff168152602001915050600060405180830381600087803b156100025760325a03f115610002575050505b56";
        var bytecode = "0x60606040526001600160146101000a81548160ff021916908302179055506040516020806104c9833981016040528080519060200190919050505b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610429806100a06000396000f360606040523615610053576000357c0100000000000000000000000000000000000000000000000000000000900480633ccfd60b146101a65780634162169f146101ba578063b163cc38146101f857610053565b6101a45b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f8b2cb4f30600060405160200152604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b156100025760325a03f1156100025750505060405180519060200150604051827c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b156100025760325a03f115610002575050505b565b005b34610002576101b8600480505061020c565b005b34610002576101cc6004805050610359565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b346100025761020a600480505061037f565b005b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f8b2cb4f30600060405160200152604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b156100025760325a03f1156100025750505060405180519060200150604051827c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b156100025760325a03f115610002575050505b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b5cef24a30604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff168152602001915050600060405180830381600087803b156100025760325a03f115610002575050505b56";
        var msg_ecf = [accounts[8], 'withdraw', attackAbi, bytecode];
        var name = [];
        name[0] = 'Banker';
        var result = false;

        if (JSON.parse(policyStorage.getItem('Banker')).function[msg_ecf[1]].tools == 'ECFChecker'){
            console.log('ECFChecker detect!');
            dao.ECFcheck(msg_ecf);
            // sleep.sleep(30);
            var lines = fs.readFileSync("/Users/liubowen/sutd/SCticket/code/ecfpolicy/detect.txt").toString().split("\n")
            for (var i=0; i < lines.length; i++){
                if (lines[i].indexOf("not ECF")!=-1) {
                    result = false;
                }else{
                    result = true;
                }
            }
        }
        
        if (result == false) {
            console.log('Fail to pass ECF check!')
        }else{
            // var tickets = banker.applyTickets(3, argument_no, name[0]);
            var tickets = banker.applyTickets(3, argument_onetime, name[0]);
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

            return Banker.deployed().then(function(instance) {
                deco = instance;
                return instance.withdraw(1000, _address, _type, _access, _index, _vsignature, _rsignature, _ssignature, {from: accounts[8]}).then(function(res){
                    return deco.getInfor.call().then(function(value){
                        console.log(value);
                    });                
                });
            });
        }
    });
});
