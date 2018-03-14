'use strict';
const assert = require("assert");
const gc = require("./gc.js");
const gf = require("./gf.js");

module.exports = {

    code: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "ExpressionStatement");

        return this.codeExpression(node.expression, history, localHistory, parent, depth);
    },

    codeExpression: function(node, history, localHistory, parent, depth) {
        switch(node.type) {
            case "AssignmentExpression":
                return this.codeAssignment(node, history, localHistory, parent, depth);
            case "DeclarativeExpression":
                return this.codeDeclaration(node, history, localHistory, parent,depth);
            case "BinaryExpression":
                return this.codeBinary(node, history, localHistory, parent, depth);
            case "Literal":
                return gf.getLiteral(node.value, history, localHistory, parent, depth);
            case "Identifier":
                return gf.getIdentifier(node.name, history, localHistory, parent, depth);
            case "UnaryExpression":
                return this.codeUnary(node, history, localHistory, parent, depth);
            case "MemberExpression":
                return this.codeMember(node, history, localHistory, parent, depth);
            case "SequenceExpression":
                return this.codeSequence(node, history, localHistory, parent, depth);
            case "NewExpression":
                return this.codeNewExpression(node, history, localHistory, parent, depth);
            case "CallExpression":
                return this.codeCallExpression(node, history, localHistory, parent, depth);
            default:
                assert(false, "unknown expression type");
        }
    },

    codeAssignment: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "AssignmentExpression");
        let goCode = "\t".repeat(depth);
        let left = "";
        let isStorage = false;
        switch(node.left.type) {
            case "DeclarativeExpression":
                return this.codeDeclarativeAssignment(node, history, localHistory, parent, depth);
            case "CallExpression":
                break;
            case "NewExpression":
                break;
            case "SequenceExpression":
                left = this.codeSequence(node.left, history, localHistory, parent, depth);
                break;
            case "Identifier":
                left = gf.getIdentifier(node.left.name, history, localHistory, parent);
                isStorage = history.sourceUnits.get(parent.name).stateVariables.has(left);
                break;
            case "MemberExpression":
                left =  this.codeMember(node.left, history, localHistory, parent, depth);
                isStorage = true;
                break;
            default:
                throw(new Error("unknown expression left part"));
        }
        let right = this.codeExpression(node.right, history, localHistory, parent, depth);
        if (isStorage) {
            if (node.operator !== "=")
                assert(node.operator === "=");
            goCode += "this.set(\"" + left + "\", " + right +")";
        } else {
            goCode += left + node.operator + right;
        }
        return goCode;
    },

    codeDeclarativeAssignment: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "AssignmentExpression");
        let storageType = node.left.storage_location ? node.left.storage_location : "memory";
        let goCode = "\t".repeat(depth);
        let left = node.left.name;
        let right = this.codeExpression(node.right, history, localHistory, parent, depth);

        if (storageType === "storage") {
            goCode += "this.set(\"" + left + "\", " + right + ")";
            localHistory.addVariable(left, gf.typeOf(node.left.literal, history, parent, localHistory), "storage");
        } else {
            goCode += node.left.name + " := " + right;
            //localHistory.addVariable(left, gf.typeOf(node.left.literal, history, parent, localHistory), "memory");
            localHistory.addVariable(node.left, history, parent);
        }

        return goCode;
    },

    codeDeclaration: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "DeclarativeExpression");
        let storageType = node.storage_location ? node.storage_location : "memory";
        let goCode = "\t".repeat(depth);
        if (storageType === "storage") {
            goCode += "this.set(\"" + node.name + "\", ";
            goCode += " new(" + gf.typeOf(node.literal, history, parnet, localHistory) + ")";
            goCode += ")";
        } else {
            goCode += "var " + node.name + " " + gf.typeOf(node.literal, history, parent, localHistory);
        }

        return goCode;
    },

    codeSequence: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "SequenceExpression");

        let goCode = "";
        goCode += gf.codeSequence(node.expressions, history, parent, localHistory);
        return goCode;
    },

    codeUnary: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "UnaryExpression");
        let goCode = "";
        switch (node.argument.type) {
            case "BinaryExpression":
                assert(node.operator === "!", "unknown binary operator");
                goCode += node.operator + "(";
                goCode += this.codeBinary(node.argument, history, localHistory, parent) + ")";
                break;
            case "Literal":
                assert(node.operator === "-" || node.operator === "+" , "unknown binary operator");
                goCode += node.operator + gf.getValue(node.argument, history, parent, localHistory);
                break;
            case"Identifier":
                assert(node.operator === "-" || node.operator === "+" , "unknown binary operator");
                goCode += (node.operator) + gf.getIdentifier(node.argumnet.name, history, localHistory, parent);
                break;
            default:
                assert(false, "unknown UnitaryExpression");
        }
        return goCode;
    },

    codeBinary: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "BinaryExpression");
        assert(node.left && node.right && node.operator);

        let goCode = "";
        let left = this.codeExpression(node.left, history, localHistory, parent, depth);
        let right = this.codeExpression(node.right, history, localHistory, parent, depth);
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

    codeNewExpression: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "NewExpression");
        let goCode = "";
        goCode += "new(";
        goCode += gf.typeOf(node.callee, history, parent, localHistory );
        goCode += ")";
        return goCode;
    },

    codeCallExpression:function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "CallExpression");

        let goCode = "";
        goCode += this.codeExpression(node.callee, history, localHistory, parent, depth);
        goCode += this.codeArguments(node.arguments, history, localHistory, parent, depth);

        return goCode;
    },

    codeArguments: function(argArray, history, localHistory, parent, depth) {
        assert(argArray && argArray instanceof Array);
        let goCode = "(";
        let start = true;
        for ( let arg of argArray) {
            if (start)
                start = false;
            else
                goCode += ", ";
            goCode += this.codeExpression(arg, history, localHistory, parent, depth);
        }
        goCode += ")";
        return goCode;
    },

    codeMember: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "MemberExpression");
        let goCode = "";
        goCode += this.codeExpression(node.object, history, localHistory, parent, depth);
        goCode += "[";
        switch (node.property.type) {
            case "Literal":
                goCode += node.property.value;
                break;
            case "Identifier":
                goCode += gf.getLiteral(node.property.name, history, localHistory, parent);
                goCode += ".Uint64()";
                break;
            default:
                assert(false, "unsupported member expression"); //todo
        }
        goCode += "]";
        return goCode; // to    do codeMember
    }

};