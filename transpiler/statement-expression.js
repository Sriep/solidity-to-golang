'use strict';
const assert = require("assert");
const gc = require("./gc.js");
const gf = require("./gf.js");

module.exports = {

    code: function(node, history, localHistory, parent) {
        assert(node && node.type === "ExpressionStatement");

        if (node.expression.type === "AssignmentExpression") {
           return this.codeAssignment(node.expression, history, localHistory, parent);
        } else if (node.expression.type === "DeclarativeExpression")  {
            return this.codeDeclaration(node.expression, history, localHistory, parent);
        } else {
            return ""//todo throw???????
        }
    },

    codeAssignment: function(node, history, localHistory, parent) {
        assert(node && node.type === "AssignmentExpression");
        switch(node.left.type) {
            case "DeclarativeExpression":
                return this.codeDeclarativeAssignment(node, history, localHistory, parent);
            case "CallExpression":
                break;
            case "NewExpression":
                break;
            case "SequenceExpression":
                return this.codeSequenceExpression(node, history, localHistory, parent);
            default:
                throw(new Error("unknown expression left part"));
        }
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

    codeDeclarativeAssignment: function(node, history, localHistory, parent) {
        assert(node && node.type === "AssignmentExpression");
        let storageType = node.left.storage_location ? node.left.storage_location : "memory";
        let goCode = "\t";
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

    codeDeclaration: function(node, history, localHistory, parent) {
        assert(node && node.type === "DeclarativeExpression");
        let storageType = node.storage_location ? node.storage_location : "memory";
        let goCode = "\t";
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

    codeSequenceExpression: function(node, history, localHistory, parent) {
        assert(node && node.left.type === "SequenceExpression"
                    && node.right.type === "SequenceExpression");

        let goCode = "\t";
        goCode += gf.codeSequence(node.left.expressions);
        assert(node.operator === "=");
        goCode += " := ";
        goCode += gf.codeSequence(node.right.expressions);

        return goCode;
    }

};