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
            goCode += stateVariable.code(body, history, parent) + ";"
        }
        goCode += "}";
        goCode = goCode.replace(/\t/g,"");
        goCode = goCode.replace(/\n/g,"");

        node.goCode = goCode;
        history.addIdentifier(node.name, parent);

        console.log("Declared structure" + node.name +"\n" + goCode);
        return "//Declared structure" + node.name +"\n";

        //goCode = goCode.replace(/\t/g,"");
        //goCode = goCode.replace(/\n/g,"");
    },

    codeInterface: function(node, history, parent) {
        return "";
    }
};