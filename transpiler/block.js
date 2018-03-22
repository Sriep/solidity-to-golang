'use strict';
const assert = require("assert");
const expression = require("./statement-expression.js");
const varDeclaration = require("./statement-var-declare.js");
const returnStatement = require("./statement-return.js");
const iterationStatement = require("./statement-iteration.js");
const StatHistory = require("./statement-history.js");

module.exports = {

    codeFunctionBlock: function( node, history, parent, localHistory)
    {
        assert(node && node instanceof Array);
        let goCode = "";
        let declarations = { code: ""};
        let bodyCode = this.code(node, history, parent, localHistory, new StatHistory(), declarations);
        if (declarations.code !== "") {
            goCode = declarations.code;
            //goCode += "\n\t// Declarations have to be at top of file as go variable scope are block based\n"
            //    + "\t// and Solidity scope is function based.\n";
        }
        goCode += bodyCode;
        return goCode;
    },

    code: function( node, history, parent, localHistory, statHistory, declarations) {
        assert(node && node instanceof Array);

        let goCode = "";
        for ( let statement of node ) {
            goCode += this.codeStatement(statement, history, parent, localHistory, statHistory, declarations);
        }
        return goCode;
    },

    codeStatement: function(statement, history, parent, localHistory, statHistory, declarations) {
        assert(statement);

        let goCode ="";
        switch (statement.type) {
            case "BlockStatement":
                goCode += "{\n";
                statHistory.depth++;
                goCode += this.code(statement.body, history, parent, localHistory, statHistory, declarations);
                statHistory.depth--;
                goCode += "\n" +"\t".repeat(statHistory.depth) + "}";
                break;
            case "VariableDeclaration":
                declarations.code += varDeclaration.code(statement, history, parent, localHistory, statHistory);
                declarations.code += "\n";
                break;
            case "VariableDeclarationTuple":
                //goCode += varDeclaration.codeTuple(statement, history, parent, localHistory);
                break; // todo Bug in grammar??????
            case "EmptyStatement":
                break;
            case "PlaceholderStatement":
                break;
            case "ExpressionStatement":
                goCode += expression.code(statement, history, parent, localHistory, statHistory, declarations);
                break;
            case "IfStatement":
                const ifStatement = require("./statement-if.js");
                goCode += ifStatement.code(statement, history, parent, localHistory, statHistory, declarations, false);
                break;
            case "DoWhileStatement":
                goCode += iterationStatement.codeDoWhile(statement, history, parent, localHistory, statHistory, declarations);
                break;
            case "WhileStatement":
                goCode += iterationStatement.codeWhile(statement, history, parent, localHistory, statHistory, declarations);
                break;
            case "ForStatement":
                goCode += iterationStatement.codeFor(statement, history, parent, localHistory, statHistory, declarations);
                break;
            case "InlineAssemblyStatement":
                break;
            case "ContinueStatement":
                goCode += "\t".repeat(statHistory.depth) + "continue";
                break;
            case "BreakStatement":
                goCode += "\t".repeat(statHistory.depth) + "break";
                break;
            case "ReturnStatement":
                goCode += returnStatement.code(statement, history, parent, localHistory, statHistory);
                break;
            case "ThrowStatement":
                goCode += "\t".repeat(statHistory.depth) + "panic(\"\")";
                break;
            case "UsingStatement":
                break;
            default:
                throw( new Error("Unrecognised statement type" + statemet.type));
        }
        let preCode = "";
        // When need to split statements across multiple lines. Used for push.
        if (statHistory.previousStatments.length >0) {
            for ( let statment of statHistory.previousStatments) {
                preCode +=  "\t".repeat(statHistory.depth) +  statment + "\n"
            }
        }
        goCode = preCode + goCode;
        goCode += "\n";
        return goCode;
    }
};