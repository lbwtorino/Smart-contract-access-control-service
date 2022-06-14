var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
policyStorage = new LocalStorage('./data/policy');
keyStorage = new LocalStorage('./data/key');
bitStorage = new LocalStorage('./data/bitsize');
indexStorage = new LocalStorage('./data/index');
test1OwnerStorage = new LocalStorage('./data/move1');


function synchronizeData(verify_private_key, public_key, owner_address, policy_balance, policy_time, contract_name, deployed_address, white_list, black_list){
    addPrivateKey(contract_name, verify_private_key, public_key, owner_address, deployed_address);
    var _size = 8;
    if (getCounter(contract_name) == null){
        var _bit = [];
        for (var i=0; i<_size; i++){
            var _sub_bit = [0,0]
            _bit.push(_sub_bit);
        }
        var counterDic = {size:_size, counter:0, bit:_bit};
        var counterDicToStr = JSON.stringify(counterDic);
        initCounter(contract_name, counterDicToStr);
        initIndex(contract_name);
        test1OwnerStorage.setItem("index", 0);
    }
    var method_name = "setA";
    addPolicy(contract_name, policy_balance, policy_time, method_name, white_list, black_list);
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

function grantTickets(type, message, verify_private_key, access_time, contract_name, deployed_address) {
    switch(type) {
        case 1:
            if (test1OwnerStorage.getItem("index") == null){
                test1OwnerStorage.setItem("index", 0);
            }
            var _address = deployed_address.toString();
            var _type = type.toString();
            var _access = access_time.toString();
            var _index = 0;
            // var test_index = _index + 1;
            // test1OwnerStorage.setItem("index", test_index);
            var _whole_msg = deployed_address.substring(2)+'000000000000000000000000'.toString() +type.toString() +access_time.toString() + _index.toString();
            var _vsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).v.toString();
            var _rsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).r.toString();
            var _ssignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).s.toString();
            return [_address, _type, _access, _index, _whole_msg, _vsignature, _rsignature, _ssignature];
            break;
        case 2:
            if (test1OwnerStorage.getItem("index") == null){
                test1OwnerStorage.setItem("index", 0);
            }
            var _address = deployed_address.toString();
            var _type = type.toString();
            var _access = access_time.toString();
            var _index = 0;
            // var test_index = _index + 1;
            // testOwnerStorage.setItem("index", test_index);
            var _whole_msg = deployed_address.substring(2)+'000000000000000000000000'.toString() +type.toString() +access_time.toString() + _index.toString();
            var _vsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).v.toString();
            var _rsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).r.toString();
            var _ssignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).s.toString();
            return [_address, _type, _access, _index, _whole_msg, _vsignature, _rsignature, _ssignature];
            break;
        case 3:
            if (test1OwnerStorage.getItem("index") == null){
                test1OwnerStorage.setItem("index", 0);
            }
            var _address = deployed_address.toString();
            var _type = type.toString();
            var _access = access_time.toString();
            var _index = 0;
            // var test_index = _index + 1;
            // testOwnerStorage.setItem("index", test_index);
            var _whole_msg = deployed_address.substring(2)+'000000000000000000000000'.toString() +type.toString() +access_time.toString() + _index.toString();
            var _vsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).v.toString();
            var _rsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).r.toString();
            var _ssignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).s.toString();
            return [_address, _type, _access, _index, _whole_msg, _vsignature, _rsignature, _ssignature];
            break;
        case 4:
            var whole_msg = type.toString() + access_time.toString() + message;
            var signature = web3.eth.accounts.sign(whole_msg, verify_private_key);
            return [whole_msg, signature.signature];
            break;
        case 5:
            /*
            var _address = [];
            var _type = [];
            var _access = [];
            var _index = [];
            var _whole_msg = [];
            var _vsignature = [];
            var _rsignature = [];
            var _ssignature = [];
            */
            //for (var i=0; i<ticket_number; i++){
                // var tickets_index =  getCounter(contract_name).counter;
                // var size_map = getCounter(contract_name).size;
                // var current_round = getIndexStorage(contract_name).round;
                // var inner_index;
                // if (tickets_index+1 <= (current_round+1)*size_map ){
                //     inner_index = (tickets_index % size_map + getIndexStorage(contract_name).index) % size_map;
                //     while (getCounter(contract_name).bit[inner_index][0] != 0){
                //         inner_index = (inner_index + 1) % size_map;
                //         tickets_index += 1;
                //     }
                //     updateCounter(contract_name, tickets_index, inner_index);
                // }else if((current_round+1)*size_map < tickets_index+1){
                //     current_round += 1;
                //     var new_position = findLongestZero(contract_name);
                //     var each_value = getCounter(contract_name).bit;
                //     inner_index = (tickets_index % size_map + new_position) % size_map;
                //     each_value[inner_index][0] = 1;
                //     each_value[inner_index][1] = current_round;
                //     var counter_dic = {size:size_map, counter:tickets_index, start_position:new_position, bit:each_value};
                //     var counterToStr = JSON.stringify(counter_dic);
                //     bitStorage.setItem(contract_name, counterToStr);
                //     updateIndexStorage(contract_name, new_position, current_round);
                //     updateCounter(contract_name, tickets_index, inner_index)
                // }else{
                //     console.log("error!");
                // }
                if (test1OwnerStorage.getItem("index") == null){
                    test1OwnerStorage.setItem("index", 0);
                }
                var ti_index = [1, 2, 5, 6, 14]
                var _address = deployed_address.toString();
                var _type = type.toString();
                var _access = access_time.toString();
                var _index = parseInt(test1OwnerStorage.getItem("index"));
                var inner_index = _index+1;
                test1OwnerStorage.setItem("index", inner_index);
                var test_index = ti_index[_index];
                var _whole_msg = deployed_address.substring(2)+'000000000000000000000000'.toString() +type.toString() +access_time.toString() + test_index.toString();
                var _vsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).v.toString();
                var _rsignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).r.toString();
                var _ssignature = web3.eth.accounts.sign(_whole_msg, verify_private_key).s.toString();
            //}
            return [_address, _type, _access, test_index, _whole_msg, _vsignature, _rsignature, _ssignature];
            break;
        default:
            console.log("failed to apply tickets")
    }
}

function findLongestZero(contract_name){
    var size = getCounter(contract_name).size;
    var each_value = getCounter(contract_name).bit;
    var zero_length = 0;
    var current_index = 0;
    var array_index = [];
    for(var i = 0; i < size; i++){
        if(each_value[i][0] == 1){
            current_index = i+1;            
        }else{
            if (zero_length < i - current_index + 1){
                zero_length = i - current_index + 1;
                array_index[0] = current_index;
                array_index[1] = i;
            }
        }
    }
    return array_index[0];
}

function applyTickets(type, msg, contract_name, balance, time){
    switch(type){
        case 1:
            var verified = verifyPolicy(type, msg, contract_name, balance, time);
            if (verified){
                verify_private_key = JSON.parse(keyStorage.getItem(contract_name)).verifyPrivatekey;  
                deployed_address =  JSON.parse(keyStorage.getItem(contract_name)).deployed; 
                var access_time = time + JSON.parse(policyStorage.getItem(contract_name)).time;
                // var msg_sig = web3.utils.sha3(msg);
                return grantTickets(type, msg, verify_private_key, access_time, contract_name, deployed_address);
            }else{
                console.log("failed pass policy")
            }
            break;
        case 2:
            var verified = verifyPolicy(type, msg, contract_name, balance, time);
            if (verified){
                verify_private_key = JSON.parse(keyStorage.getItem(contract_name)).verifyPrivatekey;  
                deployed_address =  JSON.parse(keyStorage.getItem(contract_name)).deployed; 
                var access_time = time + JSON.parse(policyStorage.getItem(contract_name)).time;
                // var msg_sig = web3.utils.sha3(msg);
                return grantTickets(type, msg, verify_private_key, access_time, contract_name, deployed_address);
            }else{
                console.log("failed pass policy")
            }
            break;
        case 3:
            var verified = verifyPolicy(type, msg, contract_name, balance, time);
            if (verified){
                verify_private_key = JSON.parse(keyStorage.getItem(contract_name)).verifyPrivatekey;  
                deployed_address =  JSON.parse(keyStorage.getItem(contract_name)).deployed; 
                var access_time = time + JSON.parse(policyStorage.getItem(contract_name)).time;
                // var msg_sig = web3.utils.sha3(msg);
                return grantTickets(type, msg, verify_private_key, access_time, contract_name, deployed_address);
            }else{
                console.log("failed pass policy")
            }
            break;
        case 4:
            if (JSON.parse(policyStorage.getItem(contract_name)).balance > balance){
                var verify_private_key = JSON.parse(keyStorage.getItem(contract_name)).verifyPrivatekey;                                
                var access_time = time + JSON.parse(policyStorage.getItem(contract_name)).time;
                return grantTickets(type, msg, verify_private_key, access_time, contract_name);
            }else{
                console.log("failed pass policy")
            }
            break;
        case 5:
            var verified = verifyPolicy(type, msg, contract_name, balance, time);
            console.log(verified)
            if (verified){
                verify_private_key = JSON.parse(keyStorage.getItem(contract_name)).verifyPrivatekey;  
                deployed_address =  JSON.parse(keyStorage.getItem(contract_name)).deployed; 
                var access_time = time + JSON.parse(policyStorage.getItem(contract_name)).time;
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
function verifyPolicy(type, msg, contract_name, balance, time){
    // if (JSON.parse(policyStorage.getItem(contract_name)).balance < balance)
    //     return false;
    var counter = 0;
    if (counter == 0){
        white_list = JSON.parse(policyStorage.getItem('Owner')).white;
        black_list = JSON.parse(policyStorage.getItem('Owner')).black;
        fun_white_list = JSON.parse(policyStorage.getItem(contract_name)).function.setA.white;
        fun_black_list = JSON.parse(policyStorage.getItem(contract_name)).function.setA.black;
        var_white_list = JSON.parse(policyStorage.getItem(contract_name)).args.a.white;
        var_black_list = JSON.parse(policyStorage.getItem(contract_name)).args.a.black;
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
            if (msg[1] != 'setA')
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
            if (msg[1] != 'setA')
                return false;
            if (msg[2] != 'a')
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
            // for(var i=0; i<fun_white_list.length; i++){
            //     if(fun_white_list[i] == msg[0])
            //         return true;
            // }
            // for(var i=0; i<white_list.length; i++){
            //     if(while_list[i] == msg[0])
            //         return true;
            // }
            break;
        case 4:
            if (msg[1] != 'setA')
                return false;
            if (msg[2] != 'a')
                return false;
            if (msg[3] < 500000)
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
            // for(var i=0; i<fun_white_list.length; i++){
            //     if(fun_white_list[i] == msg[0])
            //         return true;
            // }
            // for(var i=0; i<white_list.length; i++){
            //     if(while_list[i] == msg[0])
            //         return true;
            // }
            break; 
        case 5:
            if (msg[1] != 'setA')
                return false;
            if (msg[2] != 'a')
                return false;
            if (msg[3] < 500000)
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
            // for(var i=0; i<fun_white_list.length; i++){
            //     if(fun_white_list[i] == msg[0])
            //         return true;
            // }
            // for(var i=0; i<white_list.length; i++){
            //     if(while_list[i] == msg[0])
            //         return true;
            // }
            break;  
    }
    // return true;
}


function addPrivateKey(contract_name, verify_private_key, publick_key, owner_address, deployed_address){
    var key = {owner:owner_address, verifyPrivatekey:verify_private_key, verifyPublickey:publick_key, deployed:deployed_address};
    var keyToStr = JSON.stringify(key);
    keyStorage.setItem(contract_name, keyToStr);
}

function getPublicKey(contract_name){
    return JSON.parse(keyStorage.getItem(contract_name)).verifyPublickey
}

function addPolicy(contract_name, policy_balance, policy_time, method_name, white_list, black_list){
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
    _function['setA'] = _list;
    var _args = {};
    _args['a'] = _list;
    var policy = {balance:policy_balance, time:policy_time, function: _function, args: _args, white:_white_list, black: _black_list};
    var policyToStr = JSON.stringify(policy);
    policyStorage.setItem(contract_name, policyToStr);
}

function deletePolicy(address){
    policyStorage.removeItem(address);
}

function updatePolicy(address, policy_balance, policy_time){
    if(address && policyStorage.getItem(address)){
        var policy = {balance:policy_balance, time:policy_time};
        var policyToStr = JSON.stringify(policy);
        policyStorage.setItem(address, policyToStr);
    }else{
        console.log("policy not exist or valid address");
    }
}


// module.exports.addPrivateKey = addPrivateKey;
module.exports.addPolicy = addPolicy;
module.exports.getPublicKey = getPublicKey;
module.exports.deletePolicy = deletePolicy;
module.exports.updatePolicy = updatePolicy;
module.exports.synchronizeData = synchronizeData;
module.exports.applyTickets = applyTickets;
module.exports.clearIndex = clearIndex;
module.exports.findLongestZero = findLongestZero;




