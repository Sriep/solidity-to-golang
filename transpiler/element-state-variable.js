'use strict';
const assert = require("assert");
const dic = require("./soltogo-dictionary");


module.exports = {
    defaultArraySize: 10,

    code: function(node, history, name) {
        assert(node);
        assert(!(node instanceof Array));

        if (node.literal.literal.type === "MappingExpression") {
            return "\t// mapping expressions not implemented";
        }

        let goCode = "\t";
        goCode +=  node.name;
        goCode += this.arrayPart(node.literal.array_parts);
        goCode += " " + dic.valueTypes.get(node.literal.literal);
        goCode += this.tags(node);
        history.addStateVariable(node, name);

        return goCode;
    },

    tags: function(node) {
        let tag = " ";
        if (node.is_constant) {
            if (node.value ===  null)
                throw(new Error("Uninitialized constant variable " + node.name));
            tag += "`is-constant:\"true\"`";
        }
        return tag;
    },

    arrayPart: function(dimensions) {
        assert(dimensions instanceof Array);
        let goCode = "";
        for ( let i in dimensions ) {
            if (dimensions[i] === null) {
                goCode += " [" + this.defaultArraySize + "]";
            } else if (dimensions[i] === undefined) {
                console.log("Parser unable to resolve array size");
                goCode += " [" + this.defaultArraySize + "]";
            } else {
                goCode += " [" + dimensions[i] + "]";
            }
        }
        return goCode;
    }

};