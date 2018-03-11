'use strict';
const assert = require("assert");
const block = require("./block.js");
const gc = require("./gc.js");

module.exports = {

    codeSignature: function(node, history, parent) {
        assert(node);
        let goCode = "\t";
        goCode += this.getSignature(node, history, parent);
        goCode += "\n";
        return goCode;
    },

    getSignature: function(node, history, parent) {
        let goCode = "";
        if (node.visibility === "internal" || node.visibility === "private") {
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
        return goCode;
    },

    codeFunction: function(node, history, parent) {
        let goCode = "func (this ";
        goCode += gc.structPrefix +  parent + gc.structSuffix;
        goCode += ") ";
        goCode += this.getSignature(node, history, parent);
        goCode += " {\n";
        goCode += this.codeFunctionBody(node, history, parent);
        goCode += "}\n";
        return goCode;
    },

    codeFunctionBody: function(node, history, parent) {
        return block.code(node.body.body, history, parent);
    }

};



























