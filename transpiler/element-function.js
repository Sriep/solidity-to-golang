'use strict';
const assert = require("assert");
const block = require("./block.js");
const localHistory = require("./history-local");
const gc = require("./gc.js");
const gf = require("./gf.js");

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
        goCode += gc.suffixContract ? "_" + parent.name : "";
        goCode += "(";
        if (node.params instanceof Array && node.params.length > 0) {
            let start = true;
            let data = history.findIdData(node.name, parent);
            let localHistory = data.localHistory;
            for (let param of node.params) {
                if (start)
                    start = false;
                else
                    goCode += ", ";
                goCode += param.id + " ";
                goCode += gf.typeOf(param.literal, history, parent);
                if (!localHistory.memoryVariables.has(param.id)
                    && !localHistory.stateVariables.has(param.id) )
                    localHistory.addVariableName(param, param.id, "internal", "memory", parent);
            }
        }
        goCode += ")";
        if (node.returnParams instanceof Array && node.returnParams.length > 0) {
            goCode += "(";
            let start = true;
            for (let  retParm of node.returnParams ) {
                if (start)
                    start = false;
                else
                    goCode += ", ";
                goCode += " " + gf.typeOf(retParm.literal, history, parent);
            }
            goCode += ")";
        }
        return goCode;
    },

    codeFunction: function(node, history, parent) {
        let goCode = "func (this ";
        goCode += gc.structPrefix +  parent.name + gc.structSuffix;
        goCode += ") ";
        goCode += this.getSignature(node, history, parent);
        goCode += " {\n";
        goCode += this.codeFunctionBody(node, history, parent);
        goCode += "}\n";
        return goCode;
    },

    codeFunctionBody: function(node, history, parent) {
        return block.code(node.body.body, history, localHistory, parent, 1);
    }

};



























