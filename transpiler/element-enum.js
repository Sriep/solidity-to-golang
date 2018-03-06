'use strict';
const assert = require("assert");

module.exports = {
    code: function(node, history, parent) {
        assert(node);
        assert(!(node instanceof Array));


        history.addType(node.name, parent, "int");
        // todo implement enumeration items

        console.log("Declared enumeration" + node.name);
        return "//Declared enumeration" + node.name + "\n";
    }
};