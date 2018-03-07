'use strict';
const assert = require("assert");
const gc = require("./gc.js");

module.exports = {

    codeSignature: function(node, history, parent, hide) {
        assert(node);
        let goCode = "\t";

        if (hide) {
            goCode += gc.hideFuncPrefix + node.name;
        } else {
            goCode += node.name.charAt(0).toUpperCase() + node.name.slice(1);
        }
        goCode += gc.suffixContract ? "_" + parent : "";
        goCode += "(";
        if (node.params instanceof Array && node.params.length > 0) {
            let start = true;
            for (let param of node.params) {
                if (start)
                    start = false;
                else
                    goCode += ", ";
                goCode += param.id + " " + param.literal.literal;
            }
        }
        goCode += ")";
        if (node.returnParams instanceof Array && node.returnParams.length > 0) {
            for (let  retParm of node.returnParams ) {
                goCode += " " + retParm.literal.literal;
            }
        }
        goCode += "\n";
        return goCode;
    },

    codeFunction: function(node, history, parent) {

    }
};