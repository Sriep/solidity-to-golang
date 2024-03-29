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

    getSignature: function(node, history, parent, localHistory) {
        let goCode = "";
        if (node.name === parent.name) {
            goCode += gc.constructorPrefix + node.name;
        } else if (node.visibility === "internal" || node.visibility === "private") {
            goCode += gc.hideFuncPrefix + node.name;
            goCode += gc.suffixContract ? "_" + parent.name : "";
        } else {
            goCode += node.name.charAt(0).toUpperCase() + node.name.slice(1);
        }

        //let data = history.findIdData(node.name, parent);
        //let localHistory = history.findIdData(node.name, parent).localHistory;
        goCode += this.codeFunctionParameters(node.params, history, parent, localHistory);
        if (node.returnParams)
            goCode += this.codeReturnParameters(node.returnParams, history, parent);
        return goCode;
    },

    codeFunctionParameters: function(node, history, parent, localHistory) {
        if (node === null)
            return "()";
        assert(node && node instanceof Array);
        let goCode ="";
        goCode += "(";
        let start = true;
        for (let param of node) {
            assert(param && param.type === "InformalParameter");
            if (start)
                start = false;
            else
                goCode += ", ";
            goCode += param.id + " ";
            let dataType = gf.typeOf(param.literal, history, parent);
            goCode += dataType;
            //Function parameter written in two locations, so maybe already added
            if (localHistory && !localHistory.variables.has(param.id) && !localHistory.constants.has(param.id)) {
                let isMemory = !param.is_storage;
                localHistory.addVariableName(param, param.id, isMemory, dataType);
            }
        }
        goCode += ")";
        return goCode;
    },

    codeFunctionArguments: function(node) {
        assert(node && node instanceof Array);
        let goCode = "(";
        let start = true;
        for (let param of node) {
            assert(param && param.type === "InformalParameter");
            if (start)
                start = false;
            else
                goCode += ", ";
            goCode += param.id + " ";
        }
        goCode += ")";
        return goCode;
    },

    codeReturnParameters: function(node, history, parent) {
        assert(node && node instanceof Array);
        let goCode ="";
        goCode += "(";
        let start = true;
        for (let  retParm of node ) {
            if (start)
                start = false;
            else
                goCode += ", ";
            goCode += " " + gf.typeOf(retParm.literal, history, parent);
        }
        goCode += ")";
        return goCode;
    },

    codeFunction: function(node, history, parent) {
        if (!node.body)
            return"";
        let goCode = "func (this ";
        goCode += gc.structPrefix +  parent.name + gc.structSuffix;
        goCode += ") ";
        goCode += this.getSignature(node, history, parent, localHistory);
        goCode += " {\n";
        goCode += this.codeFunctionBody(node, history, parent, localHistory);
        goCode += "}\n";
        localHistory.clear();
        return goCode;
    },

    codeFunctionBody: function(node, history, parent, localHistory) {
        return block.codeFunctionBlock(node.body.body, history, parent, localHistory, 1);
    }

};



























