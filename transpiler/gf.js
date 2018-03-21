'use strict';
const assert = require("assert");
const dic = require("./soltogo-dictionary.js");
const gc = require("./gc.js");

const gf = {
    defaultArraySize: "",

    arrayPart: function(dimensions) {
        assert(dimensions instanceof Array);
        let goCode = "";
        for ( let i = dimensions.length -1 ; i >=0 ; i--) {//  let dim of dimensions.reverse() ) {
        //for ( let dim of dimensions ) {
            if (dimensions[i] === null) {
                goCode += "[" + this.defaultArraySize + "]";
            } else if (dimensions[i]  === undefined) {
                console.log("Parser unable to resolve array size");
                goCode += "[" + this.defaultArraySize + "]";
            } else {
                goCode += "[" + dimensions[i]  + "]";
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
                if (!history)
                    assert(history);
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

    isDynamic: function(node) {
        assert(node && node.type === "Type");
        return (node.array_parts instanceof Array
            && node.array_parts.length > 0
            && node.array_parts[node.array_parts.length-1] === null);
    },

    getObjectName: function(node) {
        if (node.type === "Identifier")
            return node.name;

        let ObjNode = node.object;
        while(ObjNode && ObjNode.type !== "Identifier") {
            ObjNode = ObjNode.object
        }
        assert(ObjNode.type === "Identifier");
        return ObjNode.name; //todo
    },

    getSVTypeAssertion: function(node, history, parent, localHistory){ //todo
        assert(node);

        let idNode;
        if (node.type !== "Identifier") {
            let ObjNode = node.object;
            while(ObjNode && ObjNode.type !== "Identifier") {
                ObjNode = ObjNode.object
            }
            assert(ObjNode.type === "Identifier");
            idNode = ObjNode;
        }  else {
            idNode = node;
        }

        let goCode = "";
        if (history.getStorageType(idNode.name, parent, localHistory) === "stateVariable") {
            let idData = history.findIdData(idNode.name, parent, localHistory);
            assert(idData, "cant find data on identifier" + idNode.name);

            goCode = ".(";
            if (idData.dataType.substring(0,2) !== "[]")
                goCode += "*";
            goCode += idData.dataType;
            goCode += ")";
        }
        return goCode;
    },

    codeSequence: function(sequence, history, parent, localHistory) {
        assert(sequence instanceof Array);
        let goCode = "";
        let first = true;
        for (let item of sequence) {
            goCode += first ? "" : ", ";
            if (item.type === "Identifier")
                goCode += this.getIdentifier(item.name, history, parent, localHistory);
            else if (item.type === "Literal")
                goCode += this.getLiteral(item.value, history, parent, localHistory);
            else if (item.type === "MemberExpression")
                goCode += this.getMemberValue(item, history, parent, localHistory);
            else
                assert(false);
            first = false;
        }
        return goCode;
    },

    getValue: function(node, history, parent, localHistory) {
        switch (node.type) {
            case "Literal":
                return this.getLiteral(node.value);
            case "MemberExpression":
                return this.getMemberValue(node, history, parent, localHistory); //todo
            default:
                assert(false, "unimplemented value type");
                return ""; // todo ??????
        }
    },

    getMemberValue: function(node, history, parent, localHistory) {
        assert(node && node.type === "MemberExpression");
        let goCode = "";
        if (node.object)
            goCode += node.object.name;
        goCode += "[";  //todo [ or . which?????
        switch (node.property.type) {
            case "Literal":
                goCode += node.property.value;
                break;
            case "Identifier":
                goCode += gf.getLiteral(node.property.name, history, parent, localHistory);
                goCode += ".Uint64()";
                break;
            default:
                assert(false, "unsupported member expression"); //todo
        }
        goCode += "]";
        return goCode; // to    do codeMember
    },

    getLiteral: function(value) {
        switch (this.getLiteralType(value)) {
            case "bool":
                return value;
            case "string":
                return "\"" + value + "\"";
            case "int":
                return "big.NewInt(" + value + ")";
            case "float":
                return "big.NewFloat(" + value + ")";
            default:
                assert(false, "unimplemented value type");
                return value; // todo ??????
        }
    },

    getIdentifier: function(id, history, parent, localHistory) {
        if (!history)
            assert(false);
        if  (!history.sourceUnits.get(parent.name))
            assert(false);
        if (history.publicFunctions.has(id)) {
            return history.publicFunctions.get(id).goName;
        } else if (history.publicTypes.has(id)) {
            return history.publicTypes.get(id).goName;
        }  else if (history.publicStateVariables.has(id)) {
            return history.publicStateVariables.get(id).goName;
        } else if (history.publicConstants.has(id)) {
            return history.publicConstants.get(id).value;

        } else if (history.sourceUnits.get(parent.name).functions.has(id)) {
            return history.sourceUnits.get(parent.name).functions.get(id).goName;
        } else if (history.sourceUnits.get(parent.name).dataTypes.has(id)) {
            return history.sourceUnits.get(parent.name).dataTypes.get(id).goName;
        }  else if (history.sourceUnits.get(parent.name).stateVariables.has(id)) {
            return history.sourceUnits.get(parent.name).stateVariables.get(id).goName;
        } else if (history.sourceUnits.get(parent.name).constants.has(id)) {
            return history.sourceUnits.get(parent.name).constants.get(id).value;
        
        } else if (localHistory) {
            if (localHistory.variables.has(id)) {
                return localHistory.variables.get(id).goName
            } else if (localHistory.constants.has(id)) {
                return localHistory.constants.get(id)
            }
        }
        throw(new Error("unkonw identifer " + identifier));
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

    isComplexType: function(typeId) {
        //assert(node && node.type = "Type");
        return dic.valueTypes.has(typeId); //todo impliment
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