'use strict';
const assert = require("assert");
const gc = require("./gc.js");

module.exports = {
    defaultArraySize: 10,

    code: function(node, history, parent, hide) {
        assert(node);
        assert(!(node instanceof Array));

        let goCode = "\t";
        goCode += hide ? gc.hideDataPrefix : "";
        goCode += node.name;
        goCode += this.getType(node, history, parent);
        return goCode + "\n";
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
        goCode += gc.suffixContract ? "_" + parent : "";
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
        goCode += gc.suffixContract ? "_" + parent : "";
        goCode +=  " ( v ";
        goCode += this.getType(node, history, parent) + ")";
        return goCode;
    },

    codeAccessors: function(node, history, parent) {
        let goCode = "func (this ";
        goCode += gc.structPrefix +  parent + gc.structSuffix;
        goCode += ") ";
        goCode += this.codeGetSig(node, history, parent);
        goCode += " {}\n";

        goCode += "func (this ";
        goCode += gc.structPrefix +  parent + gc.structSuffix;
        goCode += ") ";
        goCode += this.codeSetSig(node, history, parent);
        goCode += " {}\n";

        return goCode;
    },

    arrayPart: function(dimensions) {
        assert(dimensions instanceof Array);
        let goCode = "";
        for ( let dim of dimensions ) {
            if (dim === null) {
                goCode += "[" + this.defaultArraySize + "]";
            } else if (dim === undefined) {
                console.log("Parser unable to resolve array size");
                goCode += "[" + this.defaultArraySize + "]";
            } else {
                goCode += "[" + dim + "]";
            }
        }
        return goCode;
    },

    codeInterface: function(node, history, parent) {
        assert(node);
        assert(!(node instanceof Array));
        return "";
    },

    codeExternal: function(node, history, parent) {
        return "";
    },

    getType: function(node, history, parent) {
        let goCode = "";
        if (node.literal.literal.type === "MappingExpression") {
            goCode += " map [";
            goCode += history.expandType(node.literal.literal.from.literal, parent);
            goCode += "] ";
            goCode += history.expandType(node.literal.literal.to.literal, parent);
        } else {
            goCode += " " + this.arrayPart(node.literal.array_parts);
            goCode += history.expandType(node.literal.literal, parent);
        }
        return goCode;
    }

};