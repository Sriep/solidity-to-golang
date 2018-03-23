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
        goCode += "(" + this.codeParams(node.literal, history, parent) + ")";
        goCode += this.codeRetunType(node.literal, history, parent);
        return goCode;
    },

    //Called recursively as we could have an arbitrary depth of nested maps and arrays
    codeParams: function(node, history, parent, start, pos) {
        start = start === undefined ? true : start;
        pos = pos ? pos : 0;
        let goCode = "";
        if (node.literal.type === "MappingExpression"){
            if (start)
                start = false;
            else
                goCode += ", ";
            goCode += "i" + pos + " " + gf.typeOf(node.literal.from, history, parent);
            pos++;
            goCode += this.codeParams(node.literal.to, history, parent, start, pos)
        } else if (node.array_parts !== null && node.array_parts instanceof Array){
            for ( let i = pos ; i < node.array_parts.length + pos ; i++ ) {
                if (start)
                    start = false;
                else
                    goCode += ", ";
                goCode += "i" + i + " *big.Int";
            }
        } else {
            assert(false, "unknown parameter type");
        }

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
            goCode += "\treturn ";
            if (node.is_constant) {
                goCode += gf.getIdentifier(node.name, history, parent);
            } else {
                goCode += "this.get(\"" + node.name + "\").(";
                if (node.literal.array_parts instanceof Array && node.literal.array_parts.length > 0)
                    goCode += gf.isDynamic(node.literal) ? "" : "*";
                goCode += gf.typeOf(node.literal, history, parent) + ")";
                goCode += this.codeMapArrayAccess(node.literal, history, parent);
              /*  if (node.array_parts !== null && node.literal.array_parts instanceof Array)
                {
                    for ( let i = node.literal.array_parts.length-1 ; i >=0  ; i-- ) {
                        goCode += "[i" + i + ".Uint64()]";
                    }
                }*/
            }
            goCode += "\n}\n";
        }
        return goCode;
    },

    codeMapArrayAccess: function(node, history, parent, pos) {
        pos = pos ? pos : 0;
        let goCode = "";
        if (node.literal.type === "MappingExpression"){
            goCode += "[i" + pos + "]";
            pos++;
            goCode += this.codeMapArrayAccess(node.literal.to, history, parent, pos)
        } else if (node.array_parts !== null
            && node.array_parts instanceof Array
            && node.array_parts.length > 0){
            for ( let i = node.array_parts.length + pos -1 ; i >= 0 ; i-- ) {
                goCode += "[i" + i + ".Uint64()]";
            }
        } else {
            // Should mean that we are looking at the type of a map value
            return "";
        }

        return goCode;
    }



};