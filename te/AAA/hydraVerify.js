var Web3 = require('web3');
var process = require('child_process');
var fs = require("fs")
var sleep = require('sleep');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
policyStorage = new LocalStorage('./data/policy');
keyStorage = new LocalStorage('./data/key');
indexStorage = new LocalStorage('./data/index');

function hydracheck(message) {
    fs.writeFile("./Hydra/method.txt", message[1], function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
    fs.writeFile("./Hydra/abi.txt", message[2], function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
    fs.writeFile("./Hydra/bytecode.txt", message[3], function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
    var cmd = './Hydra/generate.sh > /Users/liubowen/sutd/SCticket/code/Hydra/generate.txt';
    process.exec(cmd);
    sleep.sleep(10);
    process.exec('cp /Users/liubowen/sutd/SCticket/code/Hydra/examples/SimpleERC20/test/erc20_hydra_test_cp.py /Users/liubowen/sutd/SCticket/code/Hydra/examples/SimpleERC20/test/erc20_hydra_test.py')
    process.exec('python2.7 /Users/liubowen/sutd/SCticket/code/Hydra/replace.py')
    process.exec('python2.7 /Users/liubowen/sutd/SCticket/code/Hydra/incoming.py')
    process.exec('./Hydra/incoming.sh > /Users/liubowen/sutd/SCticket/code/Hydra/detect.txt')
    // sleep.sleep(10);    
    
    
    return true;
}
module.exports.hydracheck = hydracheck;
