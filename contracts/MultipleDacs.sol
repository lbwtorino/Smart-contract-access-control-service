pragma solidity ^0.4.24;
import {Bits} from "./imported/Bits.sol";
import "./imported/strings.sol";
// import "./MultipleB.sol";
import "./imported/verify.sol";
pragma experimental "ABIEncoderV2";


contract MultipleDacs{

    verify.Data data;
    using strings for *;
    // using verify for *;
    using verify for verify.Data;

    address public owner;

    // using Bits for uint8;
    string name = "MultipleDacs";
    // mapping (string => uint8) bit_map;
    uint8 recursive_map = 0;
    uint8 ticket_counter;
    uint8 fixed_size = 8;
    uint8 index = 0; 
    uint8 end = 7;
    uint8 start = 0;

    address verify_public_key;

    // MultipleB multipleB;
    
    function MultipleDacs(address private_key) public {
        owner = msg.sender;
        verify_public_key = private_key;
        // verify_private_key = generatePrivateKey(private_key);
        // multipleB = MultipleB(_t);
    }

   mapping(address=>uint) userBalances;
   /*mapping is a variable
   type that saves the relation between the user and the amount contributed to
   this contract. An address (account) is a unique indentifier in the blockchain*/

   function getUserBalance(address user) constant returns(uint) {
     return userBalances[user];
   }
   /*This function returns the amount (balance) that the user has contributed
   to this contract (this information is saved in the userBalances variable)*/

   function addToBalance() payable {
     userBalances[msg.sender] = userBalances[msg.sender] + msg.value;
   }
   /*This function assigns the value sent by the user to the userBalances variable.
   The msg variable is a global variable*/

   function getInfor() public returns (uint, bytes, address){
       return (va, test, verify_public_key);
   }

   uint va = 999;
   bytes test;

   struct MID {
        string  mid;
    }
    mapping(uint => MID) mid_mapping;

    function withdrawBalance(uint val, bytes32[] _addr, uint[] _type, uint[] _time, uint8[] _index, byte[] _v, bytes32[] _r, bytes32[] _s) public {
        test = msg.data;
        MID memory u = mid_mapping[1];
        uint belong_index = 0;
        while (belong_index < _addr.length ){
            if (bytesToBytes32(toBytes(address(this))) == _addr[belong_index]){
                break;
            }
            belong_index += 1;
        }
        // if (block.timestamp > _time[belong_index]) 
        //     return;
        if(_type[belong_index] == 3){
            u.mid = data.middle1(_addr[belong_index], _type[belong_index], _time[belong_index], _index[belong_index], tx.origin, msg.sig);
            // assert(verify_public_key == data.middle2(u.mid, _v[belong_index],  _r[belong_index], _s[belong_index], msg.data, token_num, 8, belong_index, 0));
            assert(verify_public_key == data.middle2(u.mid, _v[belong_index],  _r[belong_index], _s[belong_index], msg.data, 8, 0));
            va = 1000;
        }else{
            assert(verify_public_key == data.Verify(_addr[belong_index], _type[belong_index], _time[belong_index], _index[belong_index],  _v[belong_index],  _r[belong_index], _s[belong_index], tx.origin, msg.sig));
            va = 1111;
        }
        // multipleB.withdrawBalance(val, _addr, _type,  _time, _index, _v, _r, _s);
    }

    function bytesToBytes32(bytes memory source) private pure returns (bytes32 result) {
        assembly { 
            //mload(p) -->  mem[p..(p+32)) 
            result := mload(add(source, 32))
        }
    }

    function toBytes(address x) private returns (bytes b) {
        b = new bytes(20);
        for (uint i = 0; i < 20; i++)
            b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
    }
}


