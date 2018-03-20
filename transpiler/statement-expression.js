'use strict';
const assert = require("assert");
const gf = require("./gf.js");

module.exports = {

    code: function(node, history, parent, localHistory, depth, declarations) {
        assert(node && node.type === "ExpressionStatement");

        return this.codeExpression(node.expression, history, parent, localHistory, depth, declarations);
    },

    codeExpression: function(node, history, parent, localHistory, depth, declarations) {
        switch(node.type) {
            case "AssignmentExpression":
                return this.codeAssignment(node, history, parent, localHistory, depth, declarations);
            case "DeclarativeExpression":
                return this.codeDeclaration(node, history, parent, localHistory,depth, declarations);
            case "BinaryExpression":
                return this.codeBinary(node, history, parent, localHistory, depth);
            case "Literal":
                return gf.getLiteral(node.value, history, parent, localHistory, depth);
            case "Identifier":
                return gf.getIdentifier(node.name, history, parent, localHistory, depth);
            case "UnaryExpression":
                return this.codeUnary(node, history, parent, localHistory, depth);
            case "MemberExpression":
                return this.codeMember(node, history, parent, localHistory, depth);
            case "SequenceExpression":
                return this.codeSequence(node, history, parent, localHistory, depth);
            case "NewExpression":
                return this.codeNewExpression(node, history, parent, localHistory, depth);
            case "CallExpression":
                return this.codeCallExpression(node, history, parent, localHistory, depth);
            case "UpdateExpression":
                return this.codeUpdateExpression(node, history, parent, localHistory, depth);
            default:
                assert(false, "unknown expression type");
        }
    },

    codeAssignment: function(node, history, parent, localHistory, depth, declarations) {
        assert(node && node.type === "AssignmentExpression");
        let goCode = "\t".repeat(depth);
        let left = "";
        let right = "";
        switch(node.left.type) {
            case "DeclarativeExpression":
                return this.codeDeclarativeAssignment(node, history, parent, localHistory, depth, declarations);
            case "CallExpression":
                break;
            case "NewExpression":
                break;
            case "SequenceExpression":
                left = this.codeSequence(node.left, history, parent, localHistory, depth);
                break;
            case "Identifier":
                right = this.getGoIdentifier(node.right, history, parent, localHistory);
                if (localHistory.variables.has(node.left.name)) {
                    if (localHistory.variables.get(node.left.name).isMemory) {
                        goCode += left + node.operator + right;
                    } else {
                        localHistory.setNewAlias(node.left.name, right);
                    }
                } else {
                    goCode += "this.set(\"" + node.left.name + "\", " + right +")";
                }
                return goCode;
            case "MemberExpression":
                left =  this.codeMember(node.left, history, parent, localHistory, depth);
                break;
            default:
                throw(new Error("unknown expression left part"));
        }

        right = this.codeExpression(node.right, history, parent, localHistory, depth);
        if (node.operator !== "=")
            assert(node.operator === "=");

        goCode += left + node.operator + right;
        return goCode;
    },



    codeDeclarativeAssignment: function(node, history, parent, localHistory, depth, declarations) {
        assert(node && node.type === "AssignmentExpression");

        let goCode = "\t".repeat(depth);
        this.codeDeclaration(node.left, history, parent, localHistory, depth, declarations); //todo
        let right = this.codeExpression(node.right, history, parent, localHistory, depth);

        if (node.left.storage_location === "storage") {
            //goCode += node.left.name + " = \"" + right + "\"";
            localHistory.setNewAlias(node.left.name, right);

        } else {
            goCode += node.left.name + " = " + right;
        }
        return goCode;
    },

    codeDeclaration: function(node, history, parent, localHistory, depth, declarations) {
        assert(node && node.type === "DeclarativeExpression");
        if (!declarations)
            assert(declarations);
        let goCode = "\t";

        let dataType = gf.typeOf(node.literal, history, parent, localHistory);
        let isMemory;
        if (node.storage_location)
            isMemory = node.storage_location === "memory";
        else
            isMemory = !gf.isComplexType(dataType, history, parent, localHistory);
        node.storage_location = isMemory ? "memory" : "storage";

        // Don't need to declare aliases as they are only for compiler to replace
        if (isMemory) {
            goCode += "var " + node.name + " " + dataType;
            declarations.code += goCode + "\n";
        }
        localHistory.addVariableName(node, node.name, isMemory, dataType);
        return "";
    },

    codeSequence: function(node, history, parent, localHistory, ) {
        assert(node && node.type === "SequenceExpression");

        let goCode = "";
        goCode += gf.codeSequence(node.expressions, history, parent, localHistory);
        return goCode;
    },

    codeUnary: function(node, history, parent, localHistory, ) {
        assert(node && node.type === "UnaryExpression");
        let goCode = "";
        switch (node.argument.type) {
            case "BinaryExpression":
                assert(node.operator === "!", "unknown binary operator");
                goCode += node.operator + "(";
                goCode += this.codeBinary(node.argument, history, parent, localHistory) + ")";
                break;
            case "Literal":
                assert(node.operator === "-" || node.operator === "+" , "unknown binary operator");
                goCode += node.operator + gf.getValue(node.argument, history, parent, localHistory);
                break;
            case"Identifier":
                assert(node.operator === "-" || node.operator === "+" , "unknown binary operator");
                goCode += (node.operator) + gf.getIdentifier(node.argumnet.name, history, parent, localHistory);
                break;
            default:
                assert(false, "unknown UnitaryExpression");
        }
        return goCode;
    },

    codeBinary: function(node, history, parent, localHistory, depth) {
        assert(node && node.type === "BinaryExpression");
        assert(node.left && node.right && node.operator);

        let goCode = "";
        let left = "";
        if (node.left.type === "Identifier")
            left = this.getGoIdentifier(node.left, history, parent, localHistory);
        else
            left = this.codeExpression(node.left, history, parent, localHistory, depth);
        //let left = this.codeExpression(node.left, history, parent, localHistory, depth);
        let right ="";
        if (node.right.type === "Identifier")
            right = this.getGoIdentifier(node.right, history, parent, localHistory);
        else
            right = this.codeExpression(node.right, history, parent, localHistory, depth);
        //let right = this.codeExpression(node.right, history, parent, localHistory, depth);

        if (node.left.type === "BinaryExpression" || node.left.type === "UnaryExpression" ) {
            assert(node.right.type === "BinaryExpression" || node.right.type === "UnaryExpression");
            goCode += left;
            goCode += " " + node.operator + " ";
            goCode += right;
        } else {
            goCode += this.codeBigBinaryExpression(left, node.operator, right, "Float");
        }

        return goCode;
    },

    // Assumes that left and right are already big objects of the same type
    codeBigBinaryExpression: function(left, op, right, type) {
        assert(type === "Int" || type === "Float" || type === "Rat");
        let goCode = "";

        let bigOp = gf.getBigOperator(op);
        switch (bigOp) {
            case "Add":
            case "Sub":
            case "Mul":
            case "Div":
            case "Mod":
            case "Exp":
            case "Lsh":
            case "Rsh":
                goCode += "new(big.Int).";
                goCode += bigOp + "(" + left + ", " + right + ")";
                return goCode;
            case "Cmp":
                goCode += "0 " + op + " ";
                goCode += left + ".Cmp(" + right + ")";
                return goCode;
            default:
                assert(false, "unsupported big operator"); //todo
                return "";
        }
    },

    codeUpdateExpression: function(node, history, parent, localHistory, depth) {
        assert(node && node.type === "UpdateExpression");
        let goCode = "";
        let argument = this.codeExpression(node.argument,history, parent, localHistory, depth);
        goCode += argument + ".";

        assert(node.operator === "++" || node.operator === "--");
        goCode += node.operator === "++" ? "Add" : "Sub";

        goCode += "(" + argument + ", big.NewInt(1))";
        return goCode;
    },

    codeNewExpression: function(node, history, parent, localHistory) {
        assert(node && node.type === "NewExpression");
        let goCode = "";
        goCode += "new(";
        goCode += gf.typeOf(node.callee, history, parent, localHistory );
        goCode += ")";
        return goCode;
    },

    codeCallExpression:function(node, history, parent, localHistory, depth) {
        assert(node && node.type === "CallExpression");

        let goCode = "";

        // array push member special case.
        if (node.callee.type === "MemberExpression"
            && !node.callee.computed
            && node.callee.property.name === "push")
        {
            goCode += "big.NewInt(int64(len(";
            goCode += "this.set(\"" + node.callee.object.name + "\", ";
            goCode += "append(";
            if (node.callee.object.type === "Identifier") {
                goCode += this.getGoIdentifier(node.callee.object, history, parent, localHistory);
            } else {
                goCode = this.codeExpression(node.callee.object, history, parent, localHistory, depth);
            }
            goCode += ", " + this.codeArguments(node.arguments, history, parent, localHistory, depth);
            goCode += "))";
            goCode += gf.getSVTypeAssertion(node.callee.object, history, parent, localHistory);
            goCode += ") ))"
        } else {
            goCode += this.codeExpression(node.callee, history, parent, localHistory, depth);
            goCode += "(" + this.codeArguments(node.arguments, history, parent, localHistory, depth) + ")";
        }
        return goCode;
    },

    codeArguments: function(argArray, history, parent, localHistory, depth) {
        assert(argArray && argArray instanceof Array);
        let goCode = "";
        let start = true;
        for ( let arg of argArray) {
            if (start)
                start = false;
            else
                goCode += ", ";
            goCode += this.codeExpression(arg, history, parent, localHistory, depth);
        }
        return goCode;
    },

    getGoIdentifier: function(node, history, parent, localHistory){
        let goCode = "";
        assert(node && node.type === "Identifier");

        if (history.getStorageType(node.name, parent, localHistory) === "stateVariable") {
            goCode += "this.get(\"" + node.name + "\")";
            goCode += gf.getSVTypeAssertion(node, history, parent, localHistory);
        } else {
            goCode += history.findIdData(node.name, parent, localHistory).goName;
        }
        return goCode;
    },

    codeMember: function(node, history, parent, localHistory, depth) {
        assert(node && node.type === "MemberExpression");
        let goCode = "";
        let object="";
        if (node.object.type === "Identifier") {
            object += this.getGoIdentifier(node.object, history, parent, localHistory);
        } else {
            object = this.codeExpression(node.object, history, parent, localHistory, depth);
        }
        goCode += object;

        // node.computed true means an array, false then a structure
        goCode += node.computed ? "[" : ".";
        switch (node.property.type) {
            case "Literal":
                goCode += node.property.value ; //todo what about bigInts?
                break;
            case "Identifier": //todo check for special members like length and push
                if (node.property.name === "length" && !node.computed) {
                    return "big.NewInt(int64(len(" + object + ")))";
                }
                goCode += node.property.name;
                goCode += node.computed ? ".Uint64()" : "";
                break;
            default:
                assert(false, "unsupported member expression"); //todo
        }
        goCode += node.computed ? "]" : "";

        return goCode; // to    do codeMember
    }


};