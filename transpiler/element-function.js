'use strict';
const assert = require("assert");
module.exports = {
    codeExternal: function(node, history, parent) {
        return "";
    },

    codeInterface: function(node, history, parent) {
        if (node.visibility === "private")
            return "";
        let goCode = "\t";
        goCode += node.visibility === "internal" ? "__" + node.name : node.name;
        goCode += "(";
        if (node.params instanceof Array && node.params.length > 0) {
            let start = true;
            for (let param of node.params) {
                if (start)
                    start = false;
                else
                    goCode += ", ";
                goCode += param.name + " " + param.literal.literal;
            }
        }
        goCode += ")"
        if (node.returnParams instanceof Array && node.returnParams.length > 0) {
            for (let  retParm of node.returnParams ) {
                goCode += " " + retParm.literal.literal;
            }
        }
        goCode += "  //This a function\n";
        return goCode;
    }
};