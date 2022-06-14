pragma solidity ^0.4.24;
import "./strings.sol";
pragma experimental "ABIEncoderV2";


library verify {
    using strings for *;

    function bytesToBytes32(bytes b, uint offset) private pure returns (bytes32) {
        bytes32 out;
        for (uint i = 0; i < 32; i++) {
            out |= bytes32(b[offset + i] & 0xFF) >> (i * 8);
        }
        return out;
    }

    function conver(bytes call_data) private view returns (string){
        bytes memory data = new bytes(call_data.length);
        for (uint i = 0; i < call_data.length; i++) {
            data[i] = call_data[i];
        }
        return bytesArrayToString(data);
    }

    function bytesArrayToString(bytes memory _bytes) private returns (string) {
        return string(_bytes);
    } //

    function recursi(bytes call_data, uint i) private returns (string){
        return bytes32string(bytesToBytes32(call_data, i));
    } 

    function bytesToBytes32(bytes memory source) private pure returns (bytes32 result) {
        assembly { 
            //mload(p) -->  mem[p..(p+32)) 
            result := mload(add(source, 32))
        }
    }

    function char(byte b) private returns (byte c) {
        if (b < 10) 
            return byte(uint8(b) + 0x30);
        else 
            return byte(uint8(b) + 0x57);
    }

    function bytes32string(bytes32 b32) private returns (string out) {
        bytes memory s = new bytes(64);
        for (var i = 0; i < 32; i++) {
            byte b = byte(b32[i]);
            byte hi = byte(uint8(b) / 16);
            byte lo = byte(uint8(b) - 16 * uint8(hi));
            s[i*2] = char(hi);
            s[i*2+1] = char(lo);            
        }
        out = string(s);
    }

    function uint2str(uint i) private returns (string memory){
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

    function toBytes(address x) private returns (bytes b) {
        b = new bytes(20);
        for (uint i = 0; i < 20; i++)
            b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
    }

    function toHexDigit(uint8 d) pure internal returns (byte) {                                                                                      
        if (0 <= d && d <= 9) {                                                                                                                      
            return byte(uint8(byte('0')) + d);                                                                                                       
        } else if (10 <= uint8(d) && uint8(d) <= 15) {                                                                                               
            return byte(uint8(byte('a')) + d - 10);                                                                                                  
        }                                                                                                                                            
        revert();                                                                                                                                    
    }  

    function fromCode(bytes4 code) private view returns (string) {                                                                                    
        bytes memory result = new bytes(10);                                                                                                         
        result[0] = byte('0');
        result[1] = byte('x');
        for (uint i=0; i<4; ++i) {
            result[2*i+2] = toHexDigit(uint8(code[i])/16);
            result[2*i+3] = toHexDigit(uint8(code[i])%16);
        }
        return string(result);
    }

    function convertBytesToBytes4(bytes inBytes) returns (bytes8 outBytes4) {
        if (inBytes.length == 0) {
            return 0x0;
        }

        assembly {
            outBytes4 := mload(add(inBytes, 32))
        }
    }

    struct Data {
        string  len_message;
        string  whole;
        string  sender_;
        string  sig_;
        string  final_;
        string  type_;
        string  time;
        string  index_;
    }

    function verifyTickets(Data data, bytes32 _addr, uint _type, uint _time, uint8 _index, byte _v, bytes32 _r, bytes32 _s, address sender, bytes4 sig, bytes call_data) public returns (address) {
        data.type_ = bytes32string(_addr).toSlice().concat(uint2str(_type).toSlice());
        data.time = data.type_.toSlice().concat(uint2str(_time).toSlice());
        data.index_ = data.time.toSlice().concat(uint2str(_index).toSlice());
        if (_type == 1){                
            data.final_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
        }else if (_type == 2) {
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.final_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
        }else {
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.sig_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 260).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 356).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 452).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 548).toSlice());
            data.final_ = data.sig_;
        }
        data.len_message = uint2str(data.final_.toSlice().len());
        string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
        data.whole = pref1.toSlice().concat(data.final_.toSlice());    
        return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    }

    function verified(Data data, bytes32 _addr, uint _type, uint _time, uint8 _index, byte _v, bytes32 _r, bytes32 _s, address sender, bytes4 sig, bytes call_data) public returns (address) {
        data.type_ = bytes32string(_addr).toSlice().concat(uint2str(_type).toSlice());
        data.time = data.type_.toSlice().concat(uint2str(_time).toSlice());
        data.index_ = data.time.toSlice().concat(uint2str(_index).toSlice());
        if (_type == 1){ 
            data.final_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
        }else if (_type == 2) {
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.final_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
        }else {
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.sig_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 4).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 32*(8+1)+4).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 32*(8+1)+4+32*(4+1)).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 32*(8+1)+4+64*(4+1)).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 32*(8+1)+4+96*(4+1)).toSlice());
            data.final_ = data.sig_;
        }
        data.len_message = uint2str(data.final_.toSlice().len());
        string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
        data.whole = pref1.toSlice().concat(data.final_.toSlice());    
        return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    }

    function verifyA(Data data, bytes32 _addr, uint _type, uint _time, uint8 _index, byte _v, bytes32 _r, bytes32 _s, address sender, bytes4 sig, bytes call_data) public returns (address) {
        data.type_ = bytes32string(_addr).toSlice().concat(uint2str(_type).toSlice());
        data.time = data.type_.toSlice().concat(uint2str(_time).toSlice());
        data.index_ = data.time.toSlice().concat(uint2str(_index).toSlice());
        if (_type == 1){ 
            data.final_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
        }else if (_type == 2) {
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.final_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
        }else {
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.sig_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 4).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 292).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 452).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 612).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 772).toSlice());
            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 420).toSlice());
            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 548).toSlice());
            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 676).toSlice());
            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 388).toSlice());
            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 484).toSlice());
            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 580).toSlice());
            
            data.final_ = data.sig_;
        }
        data.len_message = uint2str(data.final_.toSlice().len());
        string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
        data.whole = pref1.toSlice().concat(data.final_.toSlice());    
        return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    }

    function verifyB(Data data, bytes32 _addr, uint _type, uint _time, uint8 _index, byte _v, bytes32 _r, bytes32 _s, address sender, bytes4 sig, bytes call_data) public returns (address) {
        data.type_ = bytes32string(_addr).toSlice().concat(uint2str(_type).toSlice());
        data.time = data.type_.toSlice().concat(uint2str(_time).toSlice());
        data.index_ = data.time.toSlice().concat(uint2str(_index).toSlice());
        if (_type == 1){  
            data.final_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
        }else if (_type == 2) {
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.final_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
        }else {
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.sig_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 4).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 324).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 484).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 644).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 804).toSlice());
            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 452).toSlice());
            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 580).toSlice());
            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 708).toSlice());
            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 420).toSlice());
            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 516).toSlice());
            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 612).toSlice());
            data.final_ = data.sig_;
        }
        data.len_message = uint2str(data.final_.toSlice().len());
        string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
        data.whole = pref1.toSlice().concat(data.final_.toSlice());    
        return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    }

    function verifyC(Data data, bytes32 _addr, uint _type, uint _time, uint8 _index, byte _v, bytes32 _r, bytes32 _s, address sender, bytes4 sig, bytes call_data) public returns (address) {
        data.type_ = bytes32string(_addr).toSlice().concat(uint2str(_type).toSlice());
        data.time = data.type_.toSlice().concat(uint2str(_time).toSlice());
        data.index_ = data.time.toSlice().concat(uint2str(_index).toSlice());
        if (_type == 1){  
            data.final_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
        }else if (_type == 2) {
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.final_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
        }else {
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.sig_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 4).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 356).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 516).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 676).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 836).toSlice());

            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 484).toSlice());
            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 612).toSlice());
            // data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 740).toSlice());
            
            data.final_ = data.sig_;
        }
        data.len_message = uint2str(data.final_.toSlice().len());
        string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
        data.whole = pref1.toSlice().concat(data.final_.toSlice());    
        return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    }

    function verifyD(Data data, bytes32 _addr, uint _type, uint _time, uint8 _index, byte _v, bytes32 _r, bytes32 _s, address sender, bytes4 sig, bytes call_data) public returns (address) {
        data.type_ = bytes32string(_addr).toSlice().concat(uint2str(_type).toSlice());
        data.time = data.type_.toSlice().concat(uint2str(_time).toSlice());
        data.index_ = data.time.toSlice().concat(uint2str(_index).toSlice());
        if (_type == 1){  
            data.final_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
        }else if (_type == 2) {
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.final_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
        }else {
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.sig_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 4).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 388).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 548).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 708).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 868).toSlice());
            data.final_ = data.sig_;
        }
        data.len_message = uint2str(data.final_.toSlice().len());
        string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
        data.whole = pref1.toSlice().concat(data.final_.toSlice());    
        return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    }

    function verifyTicket(Data data, bytes32 _addr, uint _type, uint _time, uint8 _index, byte _v, bytes32 _r, bytes32 _s, address sender, bytes4 sig, bytes call_data) public returns (address) {
        data.type_ = bytes32string(_addr).toSlice().concat(uint2str(_type).toSlice());
        data.time = data.type_.toSlice().concat(uint2str(_time).toSlice());
        data.index_ = data.time.toSlice().concat(uint2str(_index).toSlice());
        if (_type == 1){                
            data.final_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
        }else if (_type == 2) {
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.final_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
        }else {
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.sig_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 4).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 292).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 356).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 420).toSlice());
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 484).toSlice());
            data.final_ = data.sig_;
        }
        data.len_message = uint2str(data.final_.toSlice().len());
        string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
        data.whole = pref1.toSlice().concat(data.final_.toSlice());    
        return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    }

    function Verify(Data data, bytes32 _addr, uint _type, uint _time, uint8 _index, byte _v, bytes32 _r, bytes32 _s, address sender, bytes4 sig) public returns (address) {
        data.type_ = bytes32string(_addr).toSlice().concat(uint2str(_type).toSlice());
        data.time = data.type_.toSlice().concat(uint2str(_time).toSlice());
        data.index_ = data.time.toSlice().concat(uint2str(_index).toSlice());
        if (_type == 1){                
            data.final_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
        }else{
            data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
            data.final_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
        }
        data.len_message = uint2str(data.final_.toSlice().len());
        string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
        data.whole = pref1.toSlice().concat(data.final_.toSlice());    
        return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    }

    function middle1(Data data, bytes32 _addr, uint _type, uint _time, uint8 _index, address sender, bytes4 sig) public returns (string memory) {
        data.type_ = bytes32string(_addr).toSlice().concat(uint2str(_type).toSlice());
        data.time = data.type_.toSlice().concat(uint2str(_time).toSlice());
        data.index_ = data.time.toSlice().concat(uint2str(_index).toSlice());
        data.sender_ = data.index_.toSlice().concat(bytes32string(bytesToBytes32(toBytes(sender))).toSlice());   
        data.sig_ = data.sender_.toSlice().concat(fromCode(sig).toSlice());
        return data.sig_;
    }

    function middle2(Data data, string mid1, byte _v, bytes32 _r, bytes32 _s, bytes call_data, uint arg_num, uint dynamic) public returns (address) {
        uint tmp = dynamic;
        uint num_tmp = arg_num;
        uint round = 1;
        data.sig_ = mid1.toSlice().concat(recursi(call_data, 4).toSlice());
        while (num_tmp - dynamic - 8 > 0){
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 4+32*round).toSlice());
            num_tmp -= 1;
            round += 1;
        }
        while (dynamic > 0){
            data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 4 + (arg_num-tmp)*32 + ((tmp-dynamic)*2+1)*32).toSlice());
            dynamic -= 1;
        }
        data.final_ = data.sig_;
        data.len_message = uint2str(data.final_.toSlice().len());
        string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
        data.whole = pref1.toSlice().concat(data.final_.toSlice());    
        return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    }

    // function middle2(Data data, string mid1, byte _v, bytes32 _r, bytes32 _s, bytes call_data, uint token_num, uint arg_num, uint belong_index, uint dynamic) public returns (address) {
    //     data.sig_ = mid1.toSlice().concat(recursi(call_data, 4).toSlice());
    //     uint tmp = dynamic;

    //     while (dynamic > 0){
    //         data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 4 + (arg_num-tmp)*32 + ((tmp-dynamic)*2+1)*32).toSlice());
    //         dynamic -= 1;
    //     }
    //     data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 4 + tmp*32 + (arg_num+1)*32 + belong_index*32).toSlice());
    //     data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 4 + tmp*32 + (arg_num+1)*32 + belong_index*32 + (token_num+1)*32).toSlice());
    //     data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 4 + tmp*32 + (arg_num+1)*32 + belong_index*32 + (token_num+1)*64).toSlice());
    //     data.sig_ = data.sig_.toSlice().concat(recursi(call_data, 4 + tmp*32 + (arg_num+1)*32 + belong_index*32 + (token_num+1)*96).toSlice());
    //     data.final_ = data.sig_;
    //     data.len_message = uint2str(data.final_.toSlice().len());
    //     string memory pref1 = "\x19Ethereum Signed Message:\n".toSlice().concat(data.len_message.toSlice());
    //     data.whole = pref1.toSlice().concat(data.final_.toSlice());    
    //     return ecrecover(keccak256(data.whole), uint8(_v), _r, _s);
    // }
}
