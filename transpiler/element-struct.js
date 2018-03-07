'use strict';
const assert = require("assert");
const stateVariable = require("./element-state-variable.js");

module.exports = {
    codeExternal: function(node, history, parent) {
        return "";
    },

    code: function(node, history, parent) {
        assert(node);
        assert(!(node instanceof Array));

        let goCode = "struct {";
        for (let body of node.body) {
            goCode += "\t" + stateVariable.code(body, history, parent) + "\n"
        }
        goCode += "}\n";
        return goCode;
    },

};