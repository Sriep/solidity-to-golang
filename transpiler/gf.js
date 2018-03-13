'use strict';
const assert = require("assert");
const dic = require("./soltogo-dictionary.js");
const gc = require("./gc.js");

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

    typeOf(node, history, parent, localHistory) {
        if (node.type !== "Type")
            assert(node && node.type === "Type");

        let goCode = "";

        if (node.literal.type === "MappingExpression") {
            goCode += " map[";
            goCode += this.typeOf(node.literal.from, history, parent, localHistory);
            goCode += "]" + this.typeOf(node.literal.to, history, parent, localHistory);
        } else {
            goCode += gf.arrayPart(node.array_parts);
            if (dic.valueTypes.has(node.literal)) {
                goCode += dic.valueTypes.get(node.literal);
            } else {
                goCode += node.literal;
                if (history.sourceUnits.get(parent.name)) {
                    if ( history.sourceUnits.get(parent.name).identifiers.has(node.literal)) {
                        goCode += gc.suffixContract ? "_" + parent.name : "";
                    }
                } else {
                    goCode += "What";
                    assert(false, "strange type")
                    // todo check exists in localHistory or throw unkonwn
                }
            }
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
                goCode += this.getIdentifier(item.name);
            else if (item.type === "Literal")
                goCode += this.getLiteral(item.value);
            else
                assert(false);
            first = false;
        }
        return goCode;
    },


    getLiteral: function(value) {
        switch (this.getLiteralType(value)) {
            case "bool":
                return value;
            case "string":
                return value;
            case "int":
                return "big.NewInt(" + value + ")";
            case "float":
                return "big.NewFloat(" + value + ")";
            default:
                assert(false, "unimplemented value type")
                return value; // todo ??????
        }
    },

    getIdentifier: function(identifier, history, localHistory, parent) {
        return identifier; //todo check exists and if state varable
    },

    getLiteralType: function(value) {
        if (value === "true" || value === "false") {
            return "bool";
        } else if (/^[+\-]?\d+$/.test(value)) {
            return "int";
        } else if (/^[-+]?[0-9]*\.?[0-9]+$/.test(value)) {
            // Maybe use /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/
            return "float";
        } else {
            return "string";
        }
    },

    getBigType: function (expression) {
        if (expression.includes("big.NewFloat"))
            return "Float";
        if (expression.includes("big.NewInt"))
            return "Int";
    },

    getBigOperator: function (operator) {
        switch (operator) {
            case "+":
                return "Add";
            case "-":
                return "Sub";
            case "*":
                return "Mul";
            case "/":
                return "Div";
            case "%":
                return "Mod";
            case "**":
                return "Exp";
            case "==":
                return "Cmp";
            case "!=":
                return "Cmp";
            case "<":
                return "Cmp";
            case "<=":
                return "Cmp";
            case ">":
                return "Cmp";
            case ">=":
                return "Cmp";
            case ">>":
                return "Rsh";
            case "<<":
                return "Lsh";
            default:
                assert(false, "not impimented big operator");
                return "";
        }
    }

};
module.exports = gf;