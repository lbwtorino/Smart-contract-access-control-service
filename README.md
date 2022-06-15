# Smart-contract-access-control-service
SMACS: Smart contract access control service, IEEE DSN'2020

## Prerequisites

The smart contract is deployed on Truffle testnet on a MacBookPro with
macOS Catalina 10.15.7, Intel Core i5 CPU (2.7 GHz), and 8GB of RAM. 

The neccessary prerequisites are:

- [Truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation) framework, v4.1.15 (core: 4.1.15, stricyly)
- [Solidity](https://docs.soliditylang.org/en/v0.7.4/) compiler, v0.4.25 (solc-js, stricyly)
- [Ganache](https://www.trufflesuite.com/ganache)
- Misc: python, nodeJS, make, etc,. (to update)

## Information and Execution

`/contracts` contains smart contract solidity code,

`/migrations` contains Ethereum testnet deployment file,

`/user` contains Truffle testnet test file (need install node.js, Ganache, etc.). 

To complile the sample smart contract, 
```sh
$ truffle compile
```

To deploy the compiled smart contract on Truffle testnet, 
```sh
$ truffle migrate
```

To test super/method/argument token type, 
```sh
$ ./run.sh dacs
```
It will read `/user/user_dacs.js` file that contains the logic of starting a Token service (implemented by javascript), token request from a user,
and creating a transaction by user with token.

To test multiple tokens (call chain), 
```sh
$ ./run.sh multi
```

To test verification tool performance (e.g., ECFChecker in our paper),
```sh
$ ./run.sh dao
```

## Contact
Bowen@ bowen_liu@mymail.sutd.edu.sg
