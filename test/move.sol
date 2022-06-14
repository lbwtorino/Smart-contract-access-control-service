pragma solidity ^0.4.24;
import "./strings.sol";
pragma experimental "ABIEncoderV2";
import {Bits} from "./imported/Bits.sol";



library move {
    using strings for *;
    using Bits for uint8;

    struct move_data {
        mapping (string => uint8) bit_map;
        uint8 recursive_map;
        uint8 ticket_counter;
        uint8 fixed_size;
        uint8 index; 
        uint8 end;
        uint8 start;
    }

    function moveBuffer(uint8 counter) private returns(uint8){
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
