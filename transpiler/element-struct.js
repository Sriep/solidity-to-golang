'use strict';
const assert = require("assert");
const stateVariable = require("./element-state-variable.js");

module.exports = {
    code: function(node, history, parent) {
        assert(node);
        assert(!(node instanceof Array));

        let goCode = "struct {";
        for (let i in node.body) {
            goCode += stateVariable.code(node.body[i], history, parent) + ";"
        }
        goCode += "}";

        // Type declarations we just store the declaration code for use later.
        history.addType(node.name, parent, goCode);
        return "";
    }
};