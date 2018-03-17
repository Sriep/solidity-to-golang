'use strict';
const assert = require("assert");
const gc = require("./gc.js");
const gf = require("./gf.js");

module.exports = {

    code: function(node, history, parent) {
        assert(node);
        assert(!(node instanceof Array));

        let goCode = "\t";
        goCode += gc.hideDataPrefix;
        goCode += node.name;
        goCode += this.getType(node, history, parent);
        return goCode;
    },

    codeAccessorSig: function(node, history, parent) {
        assert(node);
        assert(!(node instanceof Array));

        // get accessor
        let goCode = "\t";
        goCode += this.codeGetSig(node, history, parent);
        goCode += "\n";

        // set accessor
        goCode += "\t";
        goCode += this.codeSetSig(node, history, parent);
        goCode += "\n";
        return goCode;
    },

    codeGetSig: function(node, history, parent) {
        let goCode = "";
        if (node.visibility !== "public") {
            goCode += gc.hideDataPrefix + node.name;
        } else {
            goCode += node.name.charAt(0).toUpperCase() + node.name.slice(1);
        }
        goCode += gc.suffixContract ? "_" + parent.name : "";
        goCode += " ()( " + this.getType(node, history, parent) + " )";
        return goCode;
    },

    codeSetSig: function(node, history, parent) {
        let goCode = "";
        if (node.visibility !== "public") {
            goCode += gc.hideDataPrefix + gc.setPrefix +  node.name;
        } else {
            goCode += gc.setPrefix;
            goCode += node.name.charAt(0).toUpperCase() + node.name.slice(1);
        }
        goCode += gc.suffixContract ? "_" + parent.name : "";
        goCode +=  " ( v ";
        goCode += this.getType(node, history, parent) + ")";
        return goCode;
    },

    codeAccessors: function(node, history, parent) {
        let goCode = "";
        if (node.visibility === "public") {
            goCode = "func (this ";
            goCode += gc.structPrefix + parent.name + gc.structSuffix;
            goCode += ") ";
            goCode += this.codeGetSig(node, history, parent);

            goCode += " {\n";
            goCode += "\tv := this.get(\"" + node.name + "\").(";
            goCode += this.getType(node, history, parent) + ")\n";
            goCode += "\treturn v\n}\n";
        }
        return goCode;
    },

    getType: function(node, history, parent) {
        let goCode = "";
        if (node.literal.literal.type === "MappingExpression") {
            goCode += " map [";
            goCode += history.expandType(node.literal.literal.from.literal, parent);
            goCode += "] ";
            goCode += history.expandType(node.literal.literal.to.literal, parent);
        } else {
            goCode += " " + gf.arrayPart(node.literal.array_parts);
            goCode += history.expandType(node.literal.literal, parent);
        }
        return goCode;
    }

};