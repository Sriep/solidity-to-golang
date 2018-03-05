'use strict';
const assert = require("assert");

module.exports = {
    defaultArraySize: 10,

    code: function(node, history, parent) {
        assert(node);
        assert(!(node instanceof Array));

        //let tags = " `";
        let goCode = "\t";
        //if (node.is_constant)
            //tags += "is-constant:\"\" ";
        if (node.literal.literal.type === "MappingExpression") {
            goCode += node.name + " map [";
           // tags += "type-from:\"" + node.literal.literal.from.literal +"\"";
            goCode += history.expandType(node.literal.literal.from.literal, parent);
            goCode += "] ";
            //tags += " type-to:\"" + node.literal.literal.to.literal +"\" ";
            goCode += history.expandType(node.literal.literal.to.literal, parent);
        } else {
            goCode +=  node.name;
            //tags += "type:\"" + node.literal.literal +"\" ";
            goCode += " " + this.arrayPart(node.literal.array_parts);
            goCode += history.expandType(node.literal.literal, parent);
        }
        //goCode += tags + "location:\"storage\"`";
        history.addStateVariable(node, parent);
        return goCode + "\n";
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