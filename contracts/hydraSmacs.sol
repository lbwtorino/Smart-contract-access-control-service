pragma solidity ^0.4.24;
import {Bits} from "./imported/Bits.sol";
import "./imported/strings.sol";
import "./imported/verify.sol";
pragma experimental "ABIEncoderV2";


contract hydraSmacs {

    verify.Data data;
    using strings for *;
    using verify for verify.Data;
    address public owner;
    using Bits for uint8;
    string name = "hydraSmacs";
    mapping (string => uint8) bit_map;
    uint8 recursive_map = 0;
    uint8 ticket_counter;
    uint8 fixed_size = 8;
    uint8 index = 0; 
    uint8 end = 7;
    uint8 start = 0;
    address verify_public_key;
    uint public last_completed_migration;
    uint a = 10;
    struct MID {
        string  mid;
    }
    mapping(uint => MID) mid_mapping;
    function hydraSmacs(address private_key) public {
        owner = msg.sender;
        verify_public_key = private_key;
    }

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }

    // function upgrade(address new_address) public restricted {
    //     hydra upgraded = hydraSmacs(new_address);
    //     upgraded.setCompleted(last_completed_migration);
    // }

    function setValue(uint value, bytes32[] _addr, uint[] _type, uint[] _time, uint8[] _index, byte[] _v, bytes32[] _r, bytes32[] _s) public {
        MID memory u = mid_mapping[1];
        uint belong_index = 0;
        while (belong_index < _addr.length ){
            if (bytesToBytes32(toBytes(address(this))) == _addr[belong_index]){
                break;
            }
            belong_index += 1;
        }
        uint token_num = _addr.length;
        if (block.timestamp > _time[belong_index]) 
            return;
        if(_type[belong_index] == 3){
            u.mid = data.middle1(_addr[belong_index], _type[belong_index], _time[belong_index], _index[belong_index], tx.origin, msg.sig);
            assert(verify_public_key == data.middle2(u.mid, _v[belong_index],  _r[belong_index], _s[belong_index], msg.data, 8, 0));
        }else{
            assert(verify_public_key == data.Verify(_addr[belong_index], _type[belong_index], _time[belong_index], _index[belong_index],  _v[belong_index],  _r[belong_index], _s[belong_index], tx.origin, msg.sig));
        }
        if (_index[belong_index] != 0){
            if(_index[belong_index] < start)
                return;
            if (_index[belong_index]-1 >  end){
                uint8 new_counter_single = moveBuffer(_index[belong_index]-1);
                recursive_map = bit_map[name].setBit(new_counter_single);  
                bit_map[name] = recursive_map;
                a = value;
            }else{
                recursive_map = bit_map[name].setBit(_index[belong_index]-1);  
                bit_map[name] = recursive_map;
                a = value;
            }
        }else {
            a = value;
        }
    }

    function getValue() public returns(uint){
        return a;
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

    function moveBuffer(uint8 counter) public returns(uint8){
        uint8 minimal_size = counter - end;
        uint8 old_index = index;
        uint8 move_time = 0;

        // move_time = 0;
        for (uint8 i=0; i<fixed_size; i++){
            if (bit_map[name].bit(index) == 0 && (move_time + 1) >= minimal_size){
                index = (index + 1) % fixed_size;
                end = end + move_time + 1;
                start = end - fixed_size + 1;
                // move = move_time;
                return (minimal_size + old_index - 1) % fixed_size;
            }else{
                uint8 new_bit = bit_map[name].clearBit(index);
                bit_map[name] = new_bit;
                index = (index + 1) % fixed_size;
                move_time += 1;
            }
        }

    }
}
