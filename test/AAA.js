// var localStorageMemory = require('./localstorage')
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
var LocalStorage = require('node-localstorage').LocalStorage;
policyStorage = new LocalStorage('./data/policy');
keyStorage = new LocalStorage('./data/key');
bitStorage = new LocalStorage('./data/bitsize');
indexStorage = new LocalStorage('./data/index');

function synchronizeData(verify_private_key, owner_address, policy_balance, policy_time, contract_name, deployed_address){
    addPrivateKey(contract_name, verify_private_key, owner_address, deployed_address);
    // console.dir(getCounter(contract_name))
    var _size = 8;
    if (getCounter(contract_name) == null){
        var _bit = [];
        for (var i=0; i<_size; i++){
            // console.dir("==========")
            var _sub_bit = [0,0]
            _bit.push(_sub_bit);
        }
        var counterDic = {size:_size, counter:0, bit:_bit};
        var counterDicToStr = JSON.stringify(counterDic);
        initCounter(contract_name, counterDicToStr);
        initIndex(contract_name);
    }
    // console.log(getCounter(contract_name))
    addPolicy(contract_name, policy_balance, policy_time);
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

function grantTickets(type, message, verify_private_key, access_time, contract_name, ticket_number, deployed_address) {
    switch(type) {
        case 1:
            var whole_msg = type.toString() + access_time.toString() + message;
            var signature = web3.eth.accounts.sign(whole_msg, verify_private_key);
            return [whole_msg, signature.signature];
            break;
        case 2:
            var whole_msg = type.toString() + access_time.toString() + message;
            var signature = web3.eth.accounts.sign(whole_msg, verify_private_key);
            return [whole_msg, signature.signature];
            break;
        case 3:
            var whole_msg = type.toString() + access_time.toString() + message;
            var signature = web3.eth.accounts.sign(whole_msg, verify_private_key);
            return [whole_msg, signature.signature];
            break;
        case 4:
            var whole_msg = type.toString() + access_time.toString() + message;
            var signature = web3.eth.accounts.sign(whole_msg, verify_private_key);
            return [whole_msg, signature.signature];
            break;
        case 5:
            var _address = [];
            var _big = [];
            var _type = [];
            var _access = [];
            var _index = [];
            var _whole_msg = [];
            var _vsignature = [];
            var _rsignature = [];
            var _ssignature = [];
            for (var i=0; i<ticket_number; i++){
                var tickets_index =  getCounter(contract_name[i]).counter;
                var size_map = getCounter(contract_name[i]).size;
                var current_round = getIndexStorage(contract_name[i]).round;
                var inner_index;
                if (tickets_index+1 <= (current_round+1)*size_map ){
                    inner_index = (tickets_index % size_map + getIndexStorage(contract_name[i]).index) % size_map;
                    while (getCounter(contract_name[i]).bit[inner_index][0] != 0){
                        inner_index = (inner_index + 1) % size_map;
                        tickets_index += 1;
                    }
                    updateCounter(contract_name[i], tickets_index, inner_index);
                }else if((current_round+1)*size_map < tickets_index+1){
                    current_round += 1;
                    var new_position = findLongestZero(contract_name[i]);
                    var each_value = getCounter(contract_name[i]).bit;
                    inner_index = (tickets_index % size_map + new_position) % size_map;
                    each_value[inner_index][0] = 1;
                    each_value[inner_index][1] = current_round;
                    var counter_dic = {size:size_map, counter:tickets_index, start_position:new_position, bit:each_value};
                    var counterToStr = JSON.stringify(counter_dic);
                    bitStorage.setItem(contract_name[i], counterToStr);
                    updateIndexStorage(contract_name[i], new_position, current_round);
                    updateCounter(contract_name[i], tickets_index, inner_index)
                }else{
                    console.log("error!");
                }
                // console.log("grant index:"+tickets_index);
                _address.push(deployed_address[i].toString());
                _type.push(type.toString());
                _access.push(access_time.toString());
                _index.push(tickets_index.toString());
                _big.push('0000000'.toString()+type.toString() + '000000'.toString()+access_time.toString() + '0000000'.toString()+tickets_index.toString());
                _whole_msg.push(deployed_address[i].substring(2)+'000000000000000000000000'.toString() +type.toString() +access_time.toString() + tickets_index.toString());
                //console.dir(_whole_msg[0])
                //console.dir(_whole_msg[0].length)
                //console.log(web3.eth.accounts.sign(_whole_msg, verify_private_key[0]));
                _vsignature[i] = web3.eth.accounts.sign(_whole_msg[i], verify_private_key[i]).v.toString();
                _rsignature[i] = web3.eth.accounts.sign(_whole_msg[i], verify_private_key[i]).r.toString();
                _ssignature[i] = web3.eth.accounts.sign(_whole_msg[i], verify_private_key[i]).s.toString();
            }
            return [_address, _type, _access, _index, _whole_msg, _vsignature, _rsignature, _ssignature, _big];
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
            if (JSON.parse(policyStorage.getItem(contract_name)).balance > balance){
                var verify_private_key = JSON.parse(keyStorage.getItem(contract_name)).verifyPrivatekey;
                var access_time = time + JSON.parse(policyStorage.getItem(contract_name)).time;
                return grantTickets(type, msg, verify_private_key, access_time, contract_name);
            }else{
                console.log("failed pass policy")
            }
            break;
        case 2:
            if (JSON.parse(policyStorage.getItem(contract_name)).balance > balance){
                var verify_private_key = JSON.parse(keyStorage.getItem(contract_name)).verifyPrivatekey;                
                var access_time = time + JSON.parse(policyStorage.getItem(contract_name)).time;
                // var msg_sig = web3.utils.sha3(msg);
                return grantTickets(type, msg, verify_private_key, access_time, contract_name);
            }else{
                console.log("failed pass policy")
            }
            break;
        case 3:
            if (JSON.parse(policyStorage.getItem(contract_name)).balance > balance){
                var verify_private_key = JSON.parse(keyStorage.getItem(contract_name)).verifyPrivatekey;                
                var access_time = time + JSON.parse(policyStorage.getItem(contract_name)).time;
                return grantTickets(type, msg, verify_private_key, access_time, contract_name);
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
            var ticket_number = contract_name.length;
            if (JSON.parse(policyStorage.getItem(contract_name[0])).balance > balance){
                var verify_private_key = [];
                var deployed_address = [];
                for (var i=0; i<ticket_number; i++){
                    verify_private_key[i] = JSON.parse(keyStorage.getItem(contract_name[i])).verifyPrivatekey;  
                    deployed_address[i] =  JSON.parse(keyStorage.getItem(contract_name[i])).deployed; 
                }
                var access_time = time + JSON.parse(policyStorage.getItem(contract_name[0])).time;
                // var msg_sig = web3.utils.sha3(msg);
                return grantTickets(type, msg, verify_private_key, access_time, contract_name, ticket_number, deployed_address);
            }else{
                console.log("failed pass policy")
            }
            break;
        default:
            console.log("type not applicable.");    
    }
}

function addPrivateKey(contract_name, verify_private_key, owner_address, deployed_address){
    var key = {owner:owner_address, verifyPrivatekey:verify_private_key, deployed:deployed_address};
    var keyToStr = JSON.stringify(key);
    keyStorage.setItem(contract_name, keyToStr);
}

function addPolicy(contract_name, policy_balance, policy_time){
    var policy = {balance:policy_balance, time:policy_time};
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


// module.exports.mysql = mysql;
// module.exports.addPrivateKey = addPrivateKey;
// module.exports.addPolicy = addPolicy;
// module.exports.deletePolicy = deletePolicy;
// module.exports.updatePolicy = updatePolicy;
module.exports.synchronizeData = synchronizeData;
module.exports.applyTickets = applyTickets;
module.exports.clearIndex = clearIndex;
module.exports.findLongestZero = findLongestZero;


