pragma solidity ^0.4.2;

contract hydra {
    address public owner;
    uint public last_completed_migration;
    uint a = 10;

    function hydra() public {
        owner = msg.sender;
    }

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }

    // function upgrade(address new_address) public restricted {
    //     hydra upgraded = hydra(new_address);
    //     upgraded.setCompleted(last_completed_migration);
    // }

    function setValue(uint val) public {
        a = val;
    }

    function getValue() public returns(uint){
        return a;
    }
}


contract Client {
  hydra public hyd;
  address owner;

  function Client(hydra addr){ 
    owner = msg.sender;
    hyd = addr;
  }

  function setValue(uint amount) {
      hyd.setValue(amount);
  }
}