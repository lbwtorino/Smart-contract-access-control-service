# ECFChecker

This project contains an implementation of a dynamic monitor of the ECF property of Ethereum transactions.
It is based on _[Geth](https://github.com/ethereum/go-ethereum)_, the Go implementation of an Ethereum client, version 1.5.9.

## Artifact description
+ _32bit Ubuntu 16.04 with 1GB RAM._
+ _Prepared on a 64bit Windows host with 32GB RAM and 8 cores, 3.4GHz._
+ _It has go1.6.2 installed._
+ _Credentials are user/pass._

In accordance with the paper, the artifact includes a sample contract ```SimpleDAO``` which is very similar to DAO object in Figure 1.
The ```Mallory``` contract acts as our Attacker object (Figure 3).
Both ```SimpleDAO``` and ```Mallory``` behave as described in the paper. Some deviations are obligatory due to the pecularities of the EVM semantics.

## Running the artifact
Download the VM from [https://www.cs.tau.ac.il/~shellygr/vms/ECFArtifact.ova](https://www.cs.tau.ac.il/~shellygr/vms/ECFArtifact.ova).

Login to the machine, open a terminal and run:

	cd ~/ECFChecker/RunningExample

*A few notes on the execution in the provided VM:*
+ Depending on the availability of VT-x in the host system, it may be needed to modify the VM to use a single process and disable VT-x.
+ USB is disabled, thus when running the script, an error message may appear. It can be ignored.


### Non-ECF example
To run the non-ECF vulnerable ```SimpleDAO``` contract, run:

	./TestScript.sh

The output lines prefixed with ```TestScript :::``` pertain to the test orchestration script, handling creation of new accounts, updating the genesis block, creating a new blockchain, and executing the test script.
The output lines prefixed with ```Test :::``` pertain to running the attack scenario described in the Overview section of the paper. Contracts are created and deployed, and the required transactions are executed.
The rest of the output is generated by the client executable.

Note especially the Before and After messages.
We start with SimpleDAO keeping 4000 wei, 3000 of them are the donator's, the rest is Mallory's. 
Upon sending 1 wei directly to Mallory contract, Mallory's fallback function is invoked and calls SimpleDAO's withdraw(). 
In the first round, Mallory contract receives its 1000 wei back. 
However this triggers again the execution of Mallory's fallback function, which again calls SimpleDAO's withdraw(). 
This repeats 4 times overall, thus after the transaction, SimpleDAO is depleted of all money, and Mallory has 4001 wei.
Indeed, our Checker was able to detect this as non-ECF behavior:

	Transaction is not ECF! Contract 0x0c1108c2149cf9c918d6ca4afeded959f71bcbb1, depth 7, index in transaction starting at 15


### ECF example
To run the fixed ```SimpleDAO``` contract on a similar scenario, run:

	./ECFTestScript.sh

Note that while the output is similar, the final outcome is different.
When Mallory is sent 1 wei, and calls withdraw, only the amount that is registered as Mallory's in SimpleDAO is transferred, as intended by the DAO object.
Remarkably, there is no warning on the transaction being non-ECF.


## Use cases
 - Online verification of the ECF property for new transactions as fetched by the client. Each non-ECF execution recorded is saved in $ETH_FOLDER/ecf.db.
 - Small modifications to the code allow to drop transactions which are not ECF, thus miners could use it to drop non-ECF transactions.
 - In the POPL'18 paper the tool was used to check all transactions since Ethereum's inception until June 23rd 2017.
 - Test specific contracts and executions.
 
 ## Additional details
For those unfamiliar with Ethereum, we provide some necessary background in the form of answers to frequently asked questions. 

### Testing a different contract:
Contract compilation to EVM can be done from a web interface (```https://remix.ethereum.org```).
Regarding deployment, it is possible to use the given files as templates or references. We give further information below:
* Generating EVM bytecode:
	* To generate EVM bytecode, one needs to compile the Solidity source code.
	* The easiest way to do it is to use the online compiler "Remix" in: ```https://remix.ethereum.org```
	* The UI of Remix changes from time to time. As of 18.X.17, after writing the contract in the editor, press the ```Start to compile``` button on the right pane.
	* To get information such as the bytecode, press the ```Details``` button next to the select box with the contract name, below the compile button. 
	* ```BYTECODE``` is the code that has to be run to deploy the contract to the blockchain. ```RUNTIME BYTECODE``` is the code that is actually deployed.
	* To deploy the contract, the interface should also be provided. The ```WEB3DEPLOY``` section provides a full template for deploying the contract. 		
	* If you change code only and not the interface, then copy and paste the string under ```BYTECODE``` to the suitable place in the JS request similar to the template given in ```WEB3DEPLOY``` (see lines 9-15 in ```ecfcheck.js```).
* The deployment JS file:
	* The JS file is is a set of instructions that are executed by the geth client. It has specific API for interacting with Ethereum.
	* An extensive wiki on the geth client and the API can be found here: ```https://github.com/ethereum/go-ethereum/wiki/geth```
	* The JS file is designed to behave synchronously for deterministic reproduction of the results.
	* Line 1 - ```eth.accounts[]``` is an array of the Ethereum accounts registered in this running host (see ```TestScript.sh``` on how accounts are created).
	* Line 4 - ```miner.start(1)``` means we start a single mining thread, which allows our contract creations and contract calls to commit to the blockchain.
	* Line 7 (```... = web3.eth.contract(...)```) is the creation of a contract interface.
	* Line 9 - by calling "new" on the interface, the console issues a create transaction to the blockchain. It has a few parameters such as ```from```, ```data``` (which should be the string given in ```BYTECODE``` from Remix, prefixed with ```0x```), and ```gas``` (a number representing a cap on the execution time).
	* Line 14-15 - if contract creation was successful (line 14), and we got an address for our contract (line 15), we proceed.
	* Lines 21-31 - Similar code handling the creation of another contract, ```Mallory```.
	* Lines 45, 49 show how we execute a method of a contract, in this case, ```simpleDao``` and the ```donate``` method, and how parameters should be passed: First are the formal parameters of the method, and then obligatory meta-parameters of sender (```from```) and value in wei (```value```) enclosed in ```{}```.
	* Line 55 (```eth.sendTransaction(...)```) shows how to send value to an address. This implicitly triggers the execution of the fallback function of Mallory.
	* Lines 46, 50, 56 (```admin.sleepBlocks(...)```) are to ensure each contract call is committed to the Blockchain. 

### How to execute full Ethereum block history:
* Reproducing the entire history involves running the geth client on the main Ethereum network.
* It is a lengthy process. The blocks take up to 4.5GB of data. They can be either downloaded online during the execution of the Ethereum client, or prematurely from some online resource and "imported" locally using the ```geth import``` command.
* In the paper, we reported that importing the blocks from 30.VII.15-30.III.17 took over 16 hours, on a strong server.
* In addition, the database generated by geth with the results of the execution after processing all blocks is almost 200GB in size. (Real users of Ethereum mostly use 'fast clients' which do not execute the EVM on the entire block history, and thus were unsuitable for the experiment).
