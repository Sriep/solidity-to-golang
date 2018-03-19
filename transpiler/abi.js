const assert = require("assert");

module.exports = {

    interface: {},

    addToAbi: function(abi, node, parnet) {
        assert(node);
        this.interface[node.name] = node;
    }


};