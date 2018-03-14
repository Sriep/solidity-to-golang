'use strict';
const assert = require("assert");
const stateVariable = require("./element-state-variable.js");
const gc = require("./gc.js");

module.exports = {
    codeExternal: function(node, history, parent) {
        return "";
    },

    code: function(node, history, parent) {
        assert(node);
        assert(!(node instanceof Array));

        let goCode = "type " + node.name;
        goCode += gc.suffixContract ? "_" + parent.name : "";
        goCode += " struct {\n";
        for (let body of node.body) {
            goCode += "\t" + stateVariable.code(body, history, parent) + "\n"
        }
        goCode += "}\n";
        return goCode;
    },

};