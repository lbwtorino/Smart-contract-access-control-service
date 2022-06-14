pragma solidity ^0.4.24;
pragma experimental "v0.5.0";
pragma experimental "ABIEncoderV2";


library Bits {

    uint8 constant internal ONE = uint8(1);
    uint8 constant internal ONES = uint8(~0);

    // Sets the bit at the given 'index' in 'self' to '1'.
    // Returns the modified value.
    function setBit(uint8 self, uint8 index) internal pure returns (uint8) {
        return self | ONE << index;
    }

    // Sets the bit at the given 'index' in 'self' to '0'.
    // Returns the modified value.
    function clearBit(uint8 self, uint8 index) internal pure returns (uint8) {
        return self & ~(ONE << index);
    }

    // Sets the bit at the given 'index' in 'self' to:
    //  '1' - if the bit is '0'
    //  '0' - if the bit is '1'
    // Returns the modified value.
    function toggleBit(uint8 self, uint8 index) internal pure returns (uint8) {
        return self ^ ONE << index;
    }

    // Get the value of the bit at the given 'index' in 'self'.
    function bit(uint8 self, uint8 index) internal pure returns (uint8) {
        return uint8(self >> index & 1);
    }

    // Check if the bit at the given 'index' in 'self' is set.
    // Returns:
    //  'true' - if the value of the bit is '1'
    //  'false' - if the value of the bit is '0'
    function bitSet(uint self, uint8 index) internal pure returns (bool) {
        return self >> index & 1 == 1;
    }
}