pragma solidity ^0.4.24;
// pragma experimental "v0.5.0";
pragma experimental "ABIEncoderV2";


library ops {
    function bytesToUint(bytes b) public returns (uint256){
        uint256 number;
        for(uint i=0;i<b.length;i++){
            number = number + uint(b[i])*(2**(8*(b.length-(i+1))));
        }
        return number;
    }
    function bytes32ToBytes(bytes32 data) internal pure returns (bytes) {
        uint i = 0;
        while (i < 32 && uint(data[i]) != 0) {
            ++i;
        }
        bytes memory result = new bytes(i);
        i = 0;
        while (i < 32 && data[i] != 0) {
            result[i] = data[i];
            ++i;
        }
        return result;
    }

    function addresstoBytes(address a) public returns (bytes b){
        assembly {
                let m := mload(0x40)
                mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, a))
                mstore(0x40, add(m, 52))
                b := m
        }
    }
    function addressToBytes(address i)  returns (bytes by) { 
        by = new bytes(20); 
        assembly { 
            let count := 0 
            let byptr := add(by, 32) 
            loop: 
                jumpi(end, eq(count, 20)) 
                mstore8(byptr, byte(add(count,12), i)) 
                byptr := add(byptr, 1) 
                count := add(count, 1) 
                jump(loop) 
            end:
        } 
        return by; 
    }

    function stringToUint(string s) public returns (uint result) {
        bytes memory b = bytes(s);
        uint i;
        result = 0;
        for (i = 0; i < b.length; i++) {
            uint c = uint(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
    }

    function substring(string str, uint startIndex, uint endIndex) public returns (string) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex-startIndex);
        for(uint i = startIndex; i < endIndex; i++) {
            result[i-startIndex] = strBytes[i];
        }
        return string(result);
    }

    function bytes1ToString(bytes1 x) constant returns (string) {
        bytes memory bytesString = new bytes(1);
        uint charCount = 0;
        for (uint j = 0; j < 1; j++) {
            byte char = byte(bytes1(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

    function verified(bytes32 message_hash, bytes memory signature) public returns (address addr) {
        addr = parseTickets(signature, message_hash);
    }

    function parseTickets(bytes memory after_signature, bytes32 public_hash) public pure returns (address) {
        bytes32  r = bytesToBytes32(slice(after_signature, 0, 32));
        bytes32  s = bytesToBytes32(slice(after_signature, 32, 32));
        byte  v = slice(after_signature, 64, 1)[0];
        return ecrecoverDecode(r, s, v, public_hash);
    }

    function slice(bytes memory data, uint start, uint len) public pure returns (bytes){
        bytes memory b = new bytes(len);
        for(uint i = 0; i < len; i++){
            b[i] = data[i + start];
        }
        return b;
    }

    function ecrecoverDecode(bytes32 r, bytes32 s, byte v1, bytes32 h) public pure returns (address addr){
        uint8 v = uint8(v1);
        addr = ecrecover(h, v, r, s);
    }

    function bytesToBytes32(bytes memory source) public pure returns (bytes32 result) {
        assembly { 
            //mload(p) -->  mem[p..(p+32)) 
            result := mload(add(source, 32))
        }
    }

    function char(byte b) returns (byte c) {
        if (b < 10) 
            return byte(uint8(b) + 0x30);
        else 
            return byte(uint8(b) + 0x57);
    }

    function bytes32string(bytes32 b32) returns (string out) {
        bytes memory s = new bytes(64);
        for (uint i = 0; i < 32; i++) {
            byte b = byte(b32[i]);
            byte hi = byte(uint8(b) / 16);
            byte lo = byte(uint8(b) - 16 * uint8(hi));
            s[i*2] = char(hi);
            s[i*2+1] = char(lo);            
        }
        out = string(s);
    }

    function uint2str(uint i) public returns (string memory){
        if (i == 0) return "0";
        uint j = i;
        uint length;
        while (j != 0){
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint k = length - 1;
        while (i != 0){
            bstr[k--] = byte(48 + i % 10);
            i /= 10;
        }
        return string(bstr);
    }

    function toBytes(address x) returns (bytes b) {
        b = new bytes(20);
        for (uint i = 0; i < 20; i++)
            b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
    }

}