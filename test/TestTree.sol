pragma solidity ^0.4.24;

import "./RedBlackTree.sol";

contract TestTree {
    using RedBlackTree for RedBlackTree.Tree;

    RedBlackTree.Tree public tree;

    function insert(uint64 id, uint value) public {
        //lbw
        require(value != 0);
        require(tree.items[id].value == 0);
        tree.insert(id, value);
    }
    // event LogValue(uint _value);
    // function find(uint value) public constant returns (/*uint64, */uint, /*uint,*/) {
    //     //lbw
    //     // emit LogValue(value);
    //     return (tree.find(value));
    // }
    function find(uint value) public constant returns (bool) {
        //lbw
        // emit LogValue(value);
        // var (id, _value, itemValue, test) = tree.find1(value);
        return tree.find1(value);
    }

    function remove(uint64 id) public {
        tree.remove(id);
    }

    function getItem(uint64 id) public constant returns (uint64 parent, uint64 left, uint64 right, uint value, bool red) {
        RedBlackTree.Item memory item = tree.items[id];
        parent = item.parent;
        left = item.left;
        right = item.right;
        //lbw
        value = item.value;
        red = item.red;
    }
}