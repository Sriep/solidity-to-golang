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
        goCode += node.name + " ";
        goCode += gf.typeOf(node.literal, history, parent);
        return goCode;
    },

    codeAccessorSig: function(node, history, parent) {
        assert(node);
        assert(!(node instanceof Array));
        // get accessor
        let goCode = "\t";
        goCode += this.codeGetSig(node, history, parent);
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
        goCode += " ";
        goCode += this.codeParams(node.literal.array_parts, history, parent);
        goCode += this.codeRetunType(node.literal, history, parent);
        return goCode;
    },

    codeParams: function(dimensions) {
        let goCode = "(";
        if (dimensions !== null && dimensions instanceof Array)
        {
            let start = true;
            for ( let i = 0 ; i < dimensions.length ; i++ ) {
                if (start)
                    start = false;
                else
                    goCode += ", ";
                goCode += "i" + i + " *big.Int";
            }
        }
        goCode +=")";
        return goCode;
    },

    codeRetunType: function(node, history, parent) {
        assert(node && node.type === "Type");
        let goCode = "(";
        let goType = gf.typeOf(node, history, parent);
        goCode += goType.substring(goType.lastIndexOf("]") + 1);
        return goCode + ")";
    },

    codeAccessors: function(node, history, parent) {
        let goCode = "";
        if (node.visibility === "public") {
            goCode = "func (this ";
            goCode += gc.structPrefix + parent.name + gc.structSuffix;
            goCode += ") ";
            goCode += this.codeGetSig(node, history, parent);
            goCode += " {\n";
            goCode += "\treturn this.get(\"" + node.name + "\").(";
            goCode += gf.typeOf(node.literal, history, parent) + ")";
            if (node.array_parts !== null && node.literal.array_parts instanceof Array)
            {
                for ( let i = node.literal.array_parts.length-1 ; i >=0  ; i-- ) {
                    goCode += "[i" + i + ".Uint64()]";
                }
            }
            goCode += "\n}\n";
        }
        return goCode;
    },



};