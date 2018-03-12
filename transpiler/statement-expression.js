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
                return node.value;
            case "Identifier":
                return node.name;
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
                return this.codeSequence(node, history, localHistory, parent, depth);
            case "Identifier":
                goCode += node.left.name ;
                break;
            case "MemberExpression":
                return this.codeMember(node, history, localHistory, parent, depth);
            default:
                throw(new Error("unknown expression left part"));
        }
        assert(node.operator);
        goCode += node.operator;
        goCode += this.codeExpression(node.right, history, localHistory, parent, depth);

        return goCode;
    },

    codeRight: function(node, history, localHistory, parent) {
        switch(node.type) {
            case "Literal":
                return node.value;
            case "Identifier":
                return node.name;
            default:
                assert(false);
                return "";     //todo
        }
     },

    codeDeclarativeAssignment: function(node, history, localHistory, parent, depth) {
        assert(node && node.type === "AssignmentExpression");
        let storageType = node.left.storage_location ? node.left.storage_location : "memory";
        let goCode = "\t".repeat(depth);
        if (storageType === "storage") {
            goCode += "this.set(\"" + node.left.name + "\", ";
            goCode += this.codeRight(node.right, history, localHistory,parent);
            goCode += ")";
        } else {
            goCode += node.left.name;
            goCode += " := ";
            goCode += this.codeRight(node.right, history, localHistory,parent)
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
            goCode += " new(" + gf.typeOf(node.literal) + ")";
            goCode += ")";
        } else {
            //var ar [22]uint
            goCode += "var " + node.name + " " + gf.typeOf(node.literal);
        }

        return goCode;
    },

    codeSequence: function(node, history, localHistory, parent, depth) {
        assert(node && node.left.type === "SequenceExpression"
                    && node.right.type === "SequenceExpression");

        let goCode = "\t".repeat(depth);
        goCode += gf.codeSequence(node.left.expressions);
        assert(node.operator === "=");
        goCode += " := ";
        goCode += gf.codeSequence(node.right.expressions);

        return goCode;
    },

    codeBinary: function(node, history, localHistory, parent, depth) {
        return ""; // todo codeConditional
    },

    codeMember: function(node, history, localHistory, parent, depth) {
        return ""; // todo codeMember
    }

};