'use strict';
const assert = require("assert");

module.exports = {
    defaultArraySize: 10,

    code: function(node, history, parent) {
        assert(node);
        assert(!(node instanceof Array));

        let goCode = "\t";
        if (node.literal.literal.type === "MappingExpression") {
            goCode += node.name + " map [";
            goCode += history.expandType(node.literal.literal.from.literal, parent);
            goCode += "] ";
            goCode += history.expandType(node.literal.literal.to.literal, parent);
        } else {
            goCode +=  node.name;
            goCode += " " + this.arrayPart(node.literal.array_parts);
            goCode += history.expandType(node.literal.literal, parent);
        }
        return goCode + "\n";
    },

    arrayPart: function(dimensions) {
        assert(dimensions instanceof Array);
        let goCode = "";
        for ( let dim of dimensions ) {
            if (dim === null) {
                goCode += " [" + this.defaultArraySize + "]";
            } else if (dim === undefined) {
                console.log("Parser unable to resolve array size");
                goCode += " [" + this.defaultArraySize + "]";
            } else {
                goCode += " [" + dim + "]";
            }
        }
        return goCode;
    },

    codeExternal: function(node, history, parent) {
        return "";
    },

    codeInterface: function(node, history, parent) {
        return "";
    }

};