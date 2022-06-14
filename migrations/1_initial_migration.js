var Migrations = artifacts.require("./Migrations.sol");
module.exports = function(deployer) {
    
    // for (var i = 0; i < res.logs.length; i++) {
    //     console.log("======")
    //     var log = res.logs[i];
    //     if (log.event == "Calldata") {
    //         console.log(log.args);
    //     }
    // }
    // console.log(web3.utils.sha3("setA(uint256,bytes32,bytes)"))
    deployer.deploy(Migrations);
};
