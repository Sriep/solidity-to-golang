'use strict';
const assert = require("assert");

const gf = {
    defaultArraySize: 10,

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

    typeOf(node) {
        assert(node && node.type === "Type");

        let goCode = "";

        if (node.literal.type === "MappingExpression") {
            goCode += " map[";
            goCode += this.typeOf(node.literal.from);
            goCode += "]" + this.typeOf(node.literal.to);
        } else {
            goCode += gf.arrayPart(node.array_parts);
            goCode += node.literal;
        }

        return goCode;
    },

    codeSequence: function(sequence) {
        assert(sequence instanceof Array);
        let goCode = "";
        let first = true;
        for (let item of sequence) {
            goCode += first ? "" : ", ";
            if (item.type === "Identifier")
                goCode += item.name;
            else if (item.type === "Literal")
                goCode += item.value;
            else
                assert(false);
            first = false;
        }
        return goCode;
    }

};
module.exports = gf;