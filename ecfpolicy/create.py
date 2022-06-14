#!/usr/bin/env python2
# -*- coding: utf-8 -*-

method_file = open('/Users/liubowen/sutd/SCticket/code/ecfpolicy/method.txt')
method_name = []
for line in method_file:
    method_name.append(line)
method_file.close()
print method_name

abi_file = open('/Users/liubowen/sutd/SCticket/code/ecfpolicy/abi.txt')
abi_name = []
for line in abi_file:
    abi_name.append(line)
abi_file.close()
print abi_name

bytecode_file = open('/Users/liubowen/sutd/SCticket/code/ecfpolicy/bytecode.txt')
bytecode_name = []
for line in bytecode_file:
    bytecode_name.append(line)
bytecode_file.close()
print bytecode_name

lines = []
fp = open('/Users/liubowen/sutd/SCticket/code/ecfpolicy/header.txt' )
for line in fp:
    lines.append(line)
fp.close()

lines.append('var attackContract = web3.eth.contract('+abi_name[0]+');');

mid1_file = open('/Users/liubowen/sutd/SCticket/code/ecfpolicy/middle1.txt')
for line in mid1_file:
    lines.append(line)
mid1_file.close()

lines.append('data:\''+ bytecode_name[0]+'\',');

mid2_file = open('/Users/liubowen/sutd/SCticket/code/ecfpolicy/middle2.txt')
for line in mid2_file:
    lines.append(line)
mid2_file.close()

lines.append('attack.'+method_name[0]+'.call({from:me});');

foot_file = open('/Users/liubowen/sutd/SCticket/code/ecfpolicy/foot.txt')
for line in foot_file:
    lines.append(line)
foot_file.close()

s = '\n'.join(lines)
fp = open('/Users/liubowen/sutd/SCticket/code/ecfpolicy/result.js', 'w')
fp.write(s)
fp.close()



