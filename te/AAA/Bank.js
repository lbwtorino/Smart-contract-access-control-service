var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
policyStorage = new LocalStorage('./data/policy');
keyStorage = new LocalStorage('./data/key');
bitStorage = new LocalStorage('./data/bitsize');
indexStorage = new LocalStorage('./data/index');
testOwnerStorage = new LocalStorage('./data/position');


function synchronizeData(verify_private_key, public_key, owner_address, contract_name, deployed_address, white_list, black_list, update_key){
    addPrivateKey(contract_name, verify_private_key, public_key, owner_address, deployed_address, update_key);
    var _size = 8;
    if (getCounter(contract_name) == null){
        var _bit = [];
        for (var i=0; i<_size; i++){
            var _sub_bit = [0,0]
            _bit.push(_sub_bit);
        }
        testOwnerStorage.setItem("index", 0);
    }
    var method_name = "withdrawBalance";
    addPolicy(contract_name, method_name, white_list, black_list);
}

function initIndex(contract_name){
    var indexDic = {index:0, round:0};
    var indexDictoStr = JSON.stringify(indexDic);
    indexStorage.setItem(contract_name, indexDictoStr);
}

function getIndexStorage(contract_name){
    return JSON.parse(indexStorage.getItem(contract_name));
}

function updateIndexStorage(contract_name, new_position, current_round){
    var _index = new_position;
    var indexDic = {index:_index, round:current_round};
    var indexDictoStr = JSON.stringify(indexDic);
    indexStorage.setItem(contract_name, indexDictoStr);
}

function updateCounter(contract_name, tickets_index, inner_index){
    var _size = getCounter(contract_name).size;
    var _counter = tickets_index+1;
    var _bit = getCounter(contract_name).bit;
    _bit[inner_index][0] = 1;
    _bit[inner_index][1] = getIndexStorage(contract_name).round;
    var counterDic = {size:_size, counter:_counter, bit:_bit};
    var counterDicToStr = JSON.stringify(counterDic);
    bitStorage.setItem(contract_name, counterDicToStr);
}

function initCounter(contract_name, counter){
    bitStorage.setItem(contract_name, counter);
}

function clearIndex(contract_name, index){
    var _size = getCounter(contract_name).size;
    var _counter = getCounter(contract_name).counter;
    var _bit = getCounter(contract_name).bit;
    _bit[index][0] = 0;
    var counterDic = {size:_size, counter:_counter, bit:_bit};
    var counterDicToStr = JSON.stringify(counterDic);
    bitStorage.setItem(contract_name, counterDicToStr);
}

function getCounter(contract_name){
    return JSON.parse(bitStorage.getItem(contract_name));
}

var one_way_index = 1;
function grantTickets(type, message, verify_private_key, access_time, contract_name, deployed_address) {
    switch(type) {
        case 1:
            var _address = deployed_address.toString();
            var _type = type.toString();
            var _access = access_time.toString();
            var _index = 0;
            var _whole_msg = deployed_address.substring(2)+'000000000000000000000000'.toString() +type.toString() +access_time.toString() + _index.toString() + message[0].substring(2)+'000000000000000000000000'.toString();
            console.log(_whole_msg)
            var _vsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).v.toString();
            var _rsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).r.toString();
            var _ssignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).s.toString();
            return [_address, _type, _access, _index, _whole_msg, _vsignature, _rsignature, _ssignature];
            break;
        case 2:
            var _address = deployed_address.toString();
            var _type = type.toString();
            var _access = access_time.toString();
            var _index = 0;
            
            var _whole_msg = deployed_address.substring(2)+'000000000000000000000000'.toString() +type.toString() +access_time.toString() + _index.toString() + message[0].substring(2)+'000000000000000000000000'.toString() + web3.utils.sha3('withdrawBalance(bytes32[],uint256[],uint256[],uint8[],bytes1[],bytes32[],bytes32[])').substring(0,10);
            console.log(_whole_msg)            
            var _vsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).v.toString();
            var _rsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).r.toString();
            var _ssignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).s.toString();
            return [_address, _type, _access, _index, _whole_msg, _vsignature, _rsignature, _ssignature];
            break;
        case 3:
            var _address = deployed_address.toString();
            var _type = type.toString();
            var _access = access_time.toString();
            var _index = 0;
            // 0xe4a2ebb4
            // 00000000000000000000000000000000000000000000000000000000000000e0
            // 0000000000000000000000000000000000000000000000000000000000000120
            // 0000000000000000000000000000000000000000000000000000000000000160
            // 00000000000000000000000000000000000000000000000000000000000001a0
            // 00000000000000000000000000000000000000000000000000000000000001e0
            // 0000000000000000000000000000000000000000000000000000000000000220
            // 0000000000000000000000000000000000000000000000000000000000000260

            // 0000000000000000000000000000000000000000000000000000000000000001
            // 5f807dcd73c03a6a915524c46621eed4af349143000000000000000000000000

            // 0000000000000000000000000000000000000000000000000000000000000001
            // 0000000000000000000000000000000000000000000000000000000000000001
            
            // 0000000000000000000000000000000000000000000000000000000000000001
            // 0000000000000000000000000000000000000000000000000000000000003075
            
            // 0000000000000000000000000000000000000000000000000000000000000001
            // 0000000000000000000000000000000000000000000000000000000000000000

            var str1 = '000000000000000000000000000000000000000000000000000000000000003c'.toString();
            var str2 = '00000000000000000000000000000000000000000000000000000000000000e0'.toString();
            var str3 = '0000000000000000000000000000000000000000000000000000000000000120'.toString();
            var str4 = '0000000000000000000000000000000000000000000000000000000000000160'.toString();
            var str5 = '00000000000000000000000000000000000000000000000000000000000001a0'.toString();
            var str6 = '00000000000000000000000000000000000000000000000000000000000001e0'.toString();
            var str7 = '0000000000000000000000000000000000000000000000000000000000000220'.toString();
            var str8 = '0000000000000000000000000000000000000000000000000000000000000260'.toString();
            var str9 = '0000000000000000000000000000000000000000000000000000000000000001'.toString();
            var str10 = deployed_address.substring(2)+'000000000000000000000000'.toString()
            var str11 = '0000000000000000000000000000000000000000000000000000000000000001'.toString()
            var str12 = '0000000000000000000000000000000000000000000000000000000000000003'.toString()
            var str13 = '0000000000000000000000000000000000000000000000000000000000000001'.toString()
            var str14 = '00000000000000000000000000000000000000000000000000000000'.toString()+access_time.toString(16)
            var str15 = '0000000000000000000000000000000000000000000000000000000000000001'.toString()
            var str16 = '0000000000000000000000000000000000000000000000000000000000000000'.toString();
            var _whole_msg = deployed_address.substring(2)+'000000000000000000000000'.toString() +type.toString() +access_time.toString() + _index.toString()+ message[0].substring(2)+'000000000000000000000000'.toString() + web3.utils.sha3('withdrawBalance(bytes32[],uint256[],uint256[],uint8[],bytes1[],bytes32[],bytes32[])').substring(0,10)+str10 + str12 + str14 + str16;
            console.log(_whole_msg) 
            
            var _vsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).v.toString();
            var _rsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).r.toString();
            var _ssignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).s.toString();
            return [_address, _type, _access, _index, _whole_msg, _vsignature, _rsignature, _ssignature];
            break;
        case 4:
                if (testOwnerStorage.getItem("index") == null){
                    testOwnerStorage.setItem("index", 0);
                }
                var _address = deployed_address.toString();
                var _type = type.toString();
                var _access = access_time.toString();
                var _index = parseInt(testOwnerStorage.getItem("index"));
                var test_index = _index+1;
                testOwnerStorage.setItem("index", test_index);   
                var str10 = deployed_address.substring(2)+'000000000000000000000000'.toString()
                var str12 = '0000000000000000000000000000000000000000000000000000000000000004'.toString()
                var str14 = '00000000000000000000000000000000000000000000000000000000'.toString()+access_time.toString(16)
                var str16 = '000000000000000000000000000000000000000000000000000000000000000'.toString()+test_index.toString();             
                var _whole_msg = deployed_address.substring(2)+'000000000000000000000000'.toString() +type.toString() +access_time.toString() + test_index.toString() + message[0].substring(2)+'000000000000000000000000'.toString() + web3.utils.sha3('withdrawBalance(bytes32[],uint256[],uint256[],uint8[],bytes1[],bytes32[],bytes32[])').substring(0,10)+str10 + str12 + str14 + str16;            
                console.log(_whole_msg)    
                var _vsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).v.toString();
                var _rsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).r.toString();
                var _ssignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).s.toString();
            return [_address, _type, _access, test_index, _whole_msg, _vsignature, _rsignature, _ssignature];
            break;
        default:
            console.log("failed to apply tickets")
    }
}

var verify_private_key;
var deployed_address;
var access_time;
var i = 0;
function applyTickets(type, msg, contract_name){
    if (i == 0){
        verify_private_key = JSON.parse(keyStorage.getItem(contract_name)).verifyPrivatekey;  
        deployed_address =  JSON.parse(keyStorage.getItem(contract_name)).deployed; 
        access_time = JSON.parse(policyStorage.getItem(contract_name)).time;
        i = i+1;
    }
    
    switch(type){
        case 1:
            var verified = verifyPolicy(type, msg, contract_name);
            if (verified){
                // verify_private_key = JSON.parse(keyStorage.getItem(contract_name)).verifyPrivatekey;  
                // deploayed_address =  JSON.parse(keyStorage.getItem(contract_name)).deployed; 
                // var access_time = time + JSON.parse(policyStorage.getItem(contract_name)).time;
                // var msg_sig = web3.utils.sha3(msg);
                return grantTickets(type, msg, verify_private_key, access_time, contract_name, deployed_address);
            }else{
                console.log("failed pass policy")
            }
            break;
        case 2:
            var verified = verifyPolicy(type, msg, contract_name);
            if (verified){
                // verify_private_key = JSON.parse(keyStorage.getItem(contract_name)).verifyPrivatekey;  
                // deployed_address =  JSON.parse(keyStorage.getItem(contract_name)).deployed; 
                // var access_time = time + JSON.parse(policyStorage.getItem(contract_name)).time;
                // var msg_sig = web3.utils.sha3(msg);
                return grantTickets(type, msg, verify_private_key, access_time, contract_name, deployed_address);
            }else{
                console.log("failed pass policy")
            }
            break;
        case 3:
            var verified = verifyPolicy(type, msg, contract_name);
            if (verified){
                // verify_private_key = JSON.parse(keyStorage.getItem(contract_name)).verifyPrivatekey;  
                // deployed_address =  JSON.parse(keyStorage.getItem(contract_name)).deployed; 
                // var access_time = time + JSON.parse(policyStorage.getItem(contract_name)).time;
                // var msg_sig = web3.utils.sha3(msg);
                return grantTickets(type, msg, verify_private_key, access_time, contract_name, deployed_address);
            }else{
                console.log("failed pass policy")
            }
            break;
        case 4:
            var verified = verifyPolicy(type, msg, contract_name);
            if (verified){
                // verify_private_key = JSON.parse(keyStorage.getItem(contract_name)).verifyPrivatekey;  
                // deployed_address =  JSON.parse(keyStorage.getItem(contract_name)).deployed; 
                // var access_time = time + JSON.parse(policyStorage.getItem(contract_name)).time;
                // var msg_sig = web3.utils.sha3(msg);
                return grantTickets(type, msg, verify_private_key, access_time, contract_name, deployed_address);
            }else{
                console.log("failed pass policy")
            }
            break;
        default:
            console.log("type not applicable.");    
    }
}
var white_list; 
var black_list;
var fun_white_list;
var fun_black_list;
var var_white_list;
var var_black_list;

function verifyPolicy(type, msg, contract_name){
    var counter = 0;
    if (counter == 0){
        white_list = JSON.parse(policyStorage.getItem('Bank')).white;
        black_list = JSON.parse(policyStorage.getItem('Bank')).black;
        fun_white_list = JSON.parse(policyStorage.getItem(contract_name)).function.withdrawBalance.white;
        fun_black_list = JSON.parse(policyStorage.getItem(contract_name)).function.withdrawBalance.black;
        var_white_list = JSON.parse(policyStorage.getItem(contract_name)).args.userBalances.white;
        var_black_list = JSON.parse(policyStorage.getItem(contract_name)).args.userBalances.black;
        counter = counter+1;
    }
    switch(type){
        case 1:
            for(var i=0; i<black_list.length; i++){
                if(black_list[i] == msg[0])
                    return false;
            }
            for(var i=0; i<white_list.length; i++){
                if(white_list[i] == msg[0])
                    return true;
            }
            break;
        case 2:
            if (msg[1] != 'withdrawBalance')
                return false;
            for(var i=0; i<black_list.length; i++){
                if(black_list[i] == msg[0])
                    return false;
            }
            for(var i=0; i<fun_black_list.length; i++){
                if(fun_black_list[i] == msg[0])
                    return false;
            }
            for(var i=0; i<fun_white_list.length; i++){
                if(fun_white_list[i] == msg[0] && white_list[i] == msg[0])
                    return true;
            }
            // for(var i=0; i<white_list.length; i++){
            //     if(white_list[i] == msg[0])
            //         return true;
            // }
            break;
        case 3:
            if (msg[1] != 'withdrawBalance')
                return false;
            if (msg[2] != 'userBalances')
                return false;
            for(var i=0; i<black_list.length; i++){
                if(black_list[i] == msg[0])
                    return false;
            }
            for(var i=0; i<fun_black_list.length; i++){
                if(fun_black_list[i] == msg[0])
                    return false;
            }
            for(var i=0; i<var_black_list.length; i++){
                if(var_black_list[i] == msg[0])
                    return false;
            }
            for(var i=0; i<var_white_list.length; i++){
                if(fun_white_list[i] == msg[0] && fun_white_list[i] == msg[0] && white_list[i] == msg[0])
                    return true;
            }
            break;
        case 4:
            if (msg[1] != 'withdrawBalance')
                return false;
            if (msg[2] != 'userBalances')
                return false;
            for(var i=0; i<black_list.length; i++){
                if(black_list[i] == msg[0])
                    return false;
            }
            for(var i=0; i<fun_black_list.length; i++){
                if(fun_black_list[i] == msg[0])
                    return false;
            }
            for(var i=0; i<var_black_list.length; i++){
                if(var_black_list[i] == msg[0])
                    return false;
            }
            for(var i=0; i<var_white_list.length; i++){
                if(fun_white_list[i] == msg[0] && fun_white_list[i] == msg[0] && white_list[i] == msg[0])
                    return true;
            }
            for(var i=0; i<fun_white_list.length; i++){
                if(fun_white_list[i] == msg[0])
                    return true;
            }
            for(var i=0; i<white_list.length; i++){
                if(while_list[i] == msg[0])
                    return true;
            }
            break;  
    }
}


function addPrivateKey(contract_name, verify_private_key, publick_key, owner_address, deployed_address, update_key){
    var key = {owner:owner_address, verifyPrivatekey:verify_private_key, verifyPublickey:publick_key, deployed:deployed_address, update:update_key};
    var keyToStr = JSON.stringify(key);
    keyStorage.setItem(contract_name, keyToStr);
}

function getPublicKey(contract_name){
    return JSON.parse(keyStorage.getItem(contract_name)).verifyPublickey
}

function addPolicy(contract_name, method_name, white_list, black_list){
    var _white_list = [];
    for (var i=0; i< white_list.length; i++){
        _white_list.push(white_list[i]);
    }
    var _black_list = [];
    for (var i=0; i< black_list.length; i++){
        _black_list.push(black_list[i]);
    }
    var _list = {};
    _list['white'] = _white_list;
    _list['black'] = _black_list;
    var _function = {};
    _function['withdrawBalance'] = _list;
    var _args = {};
    _args['userBalances'] = _list;
    var policy = {time:1579247984, function: _function, args: _args, white:_white_list, black: _black_list};
    var policyToStr = JSON.stringify(policy);
    policyStorage.setItem(contract_name, policyToStr);
}

function deletePolicy(address){
    policyStorage.removeItem(address);
}

function updatePolicy(contract_name, signature, _whole_msg){
    var pk = JSON.parse(keyStorage.getItem(contract_name)).update;
    console.log(contract_name, signature, _whole_msg, pk)
    var res = web3.eth.accounts.recover(signature)
    console.log(res)
    if (pk == web3.eth.accounts.recover(signature)){
        var policy_time = JSON.parse(policyStorage.getItem(contract_name)).time
        var _function = JSON.parse(policyStorage.getItem(contract_name)).function
        var _args = JSON.parse(policyStorage.getItem(contract_name)).args
        var _white_list = JSON.parse(policyStorage.getItem(contract_name)).white
        var _black_list = JSON.parse(policyStorage.getItem(contract_name)).black
        var policy = {time:1579247984, function: _function, args: _args, white:_white_list, black: _black_list};
        var policyToStr = JSON.stringify(policy)
        policyStorage.setItem(contract_name, policyToStr)
    }
    else {
        console.log('update policy failed');
    }   
}

module.exports.addPolicy = addPolicy;
module.exports.getPublicKey = getPublicKey;
module.exports.deletePolicy = deletePolicy;
module.exports.updatePolicy = updatePolicy;
module.exports.synchronizeData = synchronizeData;
module.exports.applyTickets = applyTickets;
module.exports.clearIndex = clearIndex;