var Web3 = require('web3');
var process = require('child_process');
var fs = require("fs")
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
policyStorage = new LocalStorage('./data/policy');
keyStorage = new LocalStorage('./data/key');
indexStorage = new LocalStorage('./data/index');

function ECFcheck(message) {
    fs.writeFile("./ecfpolicy/method.txt", message[1], function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
    fs.writeFile("./ecfpolicy/abi.txt", message[2], function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
    fs.writeFile("./ecfpolicy/bytecode.txt", message[3], function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
    var cmd = 'python2.7 ./ecfpolicy/create.py';
    var initData = process.exec(cmd);
    initData.stdout.on('data', (data) => {
        console.log(data.toString());
    });
    var gethExe = process.exec('./DAO.sh > ./ecfpolicy/detect.txt');
    gethExe.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    // sleep.sleep(3)
    // process.exec('./DAO.sh > ./ecfpolicy/detect.txt');
    // sleep.sleep(35)
    // var lines = fs.readFileSync("./ecfpolicy/detect.txt").toString().split("\n")
    // console.log(lines)
    // for (var i=0; i < lines.length; i++){
    //     if (lines[i].indexOf("not ECF")!=-1) {
    //         return false;
    //     }
    // }
    // return true;
}
module.exports.ECFcheck = ECFcheck;
