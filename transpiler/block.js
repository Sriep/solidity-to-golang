'use strict';
const assert = require("assert");
const expression = require("./statement-expression.js");
const varDeclaration = require("./statement-var-declare.js");
const returnStatement = require("./statement-return.js");
const iterationStatement = require("./statement-iteration.js");

module.exports = {

    codeFunctionBlock: function( node, history, parent, localHistory)
    {
        assert(node && node instanceof Array);
        let goCode = "";
        let declarations = { code: ""};
        let bodyCode = this.code(node, history, parent, localHistory, 1, declarations);
        if (declarations.code !== "") {
            goCode = declarations.code;
            //goCode += "\n\t// Declarations have to be at top of file as go variable scope are block based\n"
            //    + "\t// and Solidity scope is function based.\n";
        }
        goCode += bodyCode;
        return goCode;
    },

    code: function( node, history, parent, localHistory, depth, declarations) {
        assert(node && node instanceof Array);

        let goCode = "";
        for ( let statement of node ) {
            goCode += this.codeStatement(statement, history, parent, localHistory, depth, declarations);
        }
        return goCode;
    },

    codeStatement: function(statement, history, parent, localHistory, depth, declarations) {
        assert(statement);

        let goCode ="";
        switch (statement.type) {
            case "BlockStatement":
                goCode += "{\n";
                goCode += this.code(statement.body, history, parent, localHistory, depth+1, declarations);
                goCode += "\n" +"\t".repeat(depth) + "}";
                break;
            case "VariableDeclaration":
                declarations.code += varDeclaration.code(statement, history, parent, localHistory, depth);
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
                goCode += expression.code(statement, history, parent, localHistory, depth, declarations);
                break;
            case "IfStatement":
                const ifStatement = require("./statement-if.js");
                goCode += ifStatement.code(statement, history, parent, localHistory, depth, declarations);
                break;
            case "DoWhileStatement":
                goCode += iterationStatement.codeDoWhile(statement, history, parent, localHistory, depth, declarations);
                break;
            case "WhileStatement":
                goCode += iterationStatement.codeWhile(statement, history, parent, localHistory, depth, declarations);
                break;
            case "ForStatement":
                goCode += iterationStatement.codeFor(statement, history, parent, localHistory, depth, declarations);
                break;
            case "InlineAssemblyStatement":
                break;
            case "ContinueStatement":
                goCode += "\t".repeat(depth) + "continue";
                break;
            case "BreakStatement":
                goCode += "\t".repeat(depth) + "break";
                break;
            case "ReturnStatement":
                goCode += returnStatement.code(statement, history, parent, localHistory, depth);
                break;
            case "ThrowStatement":
                goCode += "\t".repeat(depth) + "panic(\"\")";
                break;
            case "UsingStatement":
                break;
            default:
                throw( new Error("Unrecognised statement type" + statemet.type));
        }
        goCode += "\n";
        return goCode;
    }
};