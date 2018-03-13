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
                return this.codeLiteral(node.value, history, localHistory, parent, depth);
            case "Identifier":
                return this.codeIdentifier(node.name, history, localHistory, parent, depth);
            case "UnaryExpression":
                return this.codeUnary(node, history, localHistory, parent, depth);
            case "MemberExpression":
                return this.codeMember(node, history, localHistory, parent, depth);
            case "SequenceExpression":
                return this.codeSequence(node, history, localHistory, parent, depth);
            default:
                assert(false, "unknown expression type");
        }
    },

    codeAssignment: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "AssignmentExpression");
        let goCode = "\t".repeat(depth);
        switch(node.left.type) {
            case "DeclarativeExpression":
                return this.codeDeclarativeAssignment(node, history, localHistory, parent, depth);
            case "CallExpression":
                break;
            case "NewExpression":
                break;
            case "SequenceExpression":
                goCode += this.codeSequence(node.left, history, localHistory, parent, depth);
                break;
            case "Identifier":
                goCode += this.codeIdentifier(node.left.name, history, localHistory, parent, depth);
                break;
            case "MemberExpression":
                goCode +=  this.codeMember(node.left, history, localHistory, parent, depth);
                break;
            default:
                throw(new Error("unknown expression left part"));
        }
        assert(node.operator);
        goCode += node.operator;
        goCode += this.codeExpression(node.right, history, localHistory, parent, depth);

        return goCode;
    },

    codeDeclarativeAssignment: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "AssignmentExpression");
        let storageType = node.left.storage_location ? node.left.storage_location : "memory";
        let goCode = "\t".repeat(depth);
        if (storageType === "storage") {
            goCode += "this.set(\"" + node.left.name + "\", ";
            goCode += this.codeExpression(node.right, history, localHistory, parent, depth);
            goCode += ")";
        } else {
            goCode += node.left.name;
            goCode += " := ";
            goCode += this.codeExpression(node.right, history, localHistory, parent, depth);
        }
        assert(node.left.literal.type === "Type");
        localHistory.addVariable(node.left.name, node.left.literal.literal ,storageType);
        return goCode;

    },

    codeDeclaration: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "DeclarativeExpression");
        let storageType = node.storage_location ? node.storage_location : "memory";
        let goCode = "\t".repeat(depth);
        if (storageType === "storage") {
            goCode += "this.set(\"" + node.name + "\", ";
            goCode += " new(" + gf.typeOf(node.literal, history, parnet, ) + ")";
            goCode += ")";
        } else {
            goCode += "var " + node.name + " " + gf.typeOf(node.literal);
        }

        return goCode;
    },

    codeSequence: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "SequenceExpression");

        let goCode = "";
        goCode += gf.codeSequence(node.expressions);
        return goCode;
    },

    codeUnary: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "UnaryExpression");
        let goCode = "";
        switch (node.argument.type) {
            case "BinaryExpression":
                assert(node.operator === "!", "unknown binary operator");
                goCode += node.operator + "(";
                goCode += this.codeBinary(node.argument) + ")";
                break;
            case "Literal":
                assert(node.operator === "-" || node.operator === "+" , "unknown binary operator");
                goCode += gf.getLiteral(node.operator + node.argument.value);
                break;
            case"Identifier":
                assert(node.operator === "-" || node.operator === "+" , "unknown binary operator");
                goCode += gf.getLiteral(node.operator + this.codeIdentifier(node.argumnet.name, history, localHistory, parent, depth));
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

    codeIdentifier: function(identifier, history, localHistory, parent) {
        return gf.getIdentifier(identifier, history, localHistory, parent); //todo check exists and if state varable
    },

    codeLiteral: function(value) {
        return gf.getLiteral(value);
    },

    codeMember: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "MemberExpression");
        let goCode = "";
        goCode += this.codeExpression(node.object);
        goCode += "[";
        switch (node.property.type) {
            case "Literal":
                goCode += node.property.value;
                break;
            case "Identifier":
                goCode += this.codeIdentifier(node.property.name, history, localHistory, parent);
                goCode += ".Uint64()";
                break;
            default:
                assert(false, "unsupported member expression"); //todo
        }
        goCode += "]";
        return goCode; // to    do codeMember
    }

};