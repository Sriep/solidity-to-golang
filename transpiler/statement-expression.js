'use strict';
const assert = require("assert");
const gf = require("./gf.js");
const dic = require("./soltogo-dictionary.js");

module.exports = {

    code: function(node, history, parent, localHistory, statHistory, declarations) {
        assert(node && node.type === "ExpressionStatement");

        return this.codeExpression(node.expression, history, parent, localHistory, statHistory, declarations);
    },

    codeExpression: function(node, history, parent, localHistory, statHistory, declarations) {
        switch(node.type) {
            case "AssignmentExpression":
                return this.codeAssignment(node, history, parent, localHistory, statHistory, declarations);
            case "DeclarativeExpression":
                return this.codeDeclaration(node, history, parent, localHistory,statHistory , declarations);
            case "BinaryExpression":
                return this.codeBinary(node, history, parent, localHistory, statHistory);
            case "Literal":
                return gf.getLiteral(node.value, history, parent, localHistory, statHistory);
            case "Identifier":
                return gf.getIdentifier(node.name, history, parent, localHistory, statHistory);
            case "UnaryExpression":
                return this.codeUnaryExpression(node, history, parent, localHistory, statHistory);
            case "MemberExpression":
                return this.codeMember(node, history, parent, localHistory, statHistory);
            case "SequenceExpression":
                return this.codeSequence(node, history, parent, localHistory, statHistory);
            case "NewExpression":
                return this.codeNewExpression(node, history, parent, localHistory, statHistory);
            case "CallExpression":
                return this.codeCallExpression(node, history, parent, localHistory, statHistory);
            case "UpdateExpression":
                return this.codeUpdateExpression(node, history, parent, localHistory, statHistory);
            case "ArrayExpression":
                return this.codeArrayExpression(node);
            default:
                assert(false, "unknown expression type");
        }
    },
 //   this.get("name").( map[*big.Int]string)[_number]= _name
//this.get("name").(* map[*big.Int]string)[_number.Uint64()]= new(big.Int).Set(_name)

    codeAssignment: function(node, history, parent, localHistory, statHistory, declarations) {
        assert(node && node.type === "AssignmentExpression");
        let goCode = "\t".repeat(statHistory.depth);
        let left = "";
        let right = "";
        switch(node.left.type) {
            case "DeclarativeExpression":
                return this.codeDeclarativeAssignment(node, history, parent, localHistory, statHistory, declarations);
            case "CallExpression":
                break;
            case "NewExpression":
                break;
            case "SequenceExpression":
                left = this.codeSequence(node.left, history, parent, localHistory, statHistory);
                break;
            case "Identifier":
                //right = this.getGoIdentifier(node.right, history, parent, localHistory);
                left  = this.codeExpression(node.left, history, parent, localHistory, statHistory);
                right = this.codeExpression(node.right, history, parent, localHistory, statHistory);

                if (localHistory.variables.has(node.left.name)) {
                    if (localHistory.variables.get(node.left.name).isMemory) {
                        //goCode += left + node.operator + right;
                        goCode += this.codeBigAssignment(left, node.operator, right);
                    } else {
                        localHistory.setNewAlias(node.left.name, right);
                    }
                } else {
                    if (node.operator === "=") {
                        goCode += "this.set(\"" + node.left.name + "\", " + right +")";
                    } else {
                        goCode += "this.set(\"" + node.left.name + "\", ";
                        goCode += this.codeBigBinaryExpression(left, node.operator.slice(0, -1), right);
                        goCode += ")";
                    }
                }
                return goCode;
            case "MemberExpression":
                left =  this.codeMember(node.left, history, parent, localHistory, statHistory);
                break;
            default:
                throw(new Error("unknown expression left part"));
        }

        right = this.codeExpression(node.right, history, parent, localHistory, statHistory);
        if (node.operator !== "=")
            assert(node.operator === "=");

        if (statHistory.lastType) {
            let baseType = gf.baseType(statHistory.lastType.dataType);
            if (dic.numericTypes.has(baseType)) {
                goCode += this.codeBigAssignment(left, node.operator, right);
            } else {
                goCode += left + node.operator + right;
            }
        } else {
            goCode += this.codeBigAssignment(left, node.operator, right);
        }

        //goCode += left + node.operator + right;
        return goCode;
    },

        codeDeclarativeAssignment: function(node, history, parent, localHistory, statHistory, declarations) {
        assert(node && node.type === "AssignmentExpression");

        let goCode = "\t".repeat(statHistory.depth);
        this.codeDeclaration(node.left, history, parent, localHistory, statHistory, declarations); //todo
        let right = this.codeExpression(node.right, history, parent, localHistory, statHistory);

        if (node.left.storage_location === "storage") {
            localHistory.setNewAlias(node.left.name, right);
        } else {
            goCode += node.left.name + " = ";
            if (node.right.type === "ArrayExpression") {
                goCode += gf.typeOf(node.left.literal);
            }
            goCode += right;
        }
        return goCode;
    },

    codeDeclaration: function(node, history, parent, localHistory, statHistory, declarations) {
        assert(node && node.type === "DeclarativeExpression");
        if (!declarations)
            assert(declarations);
        let goCode = "\t".repeat(statHistory.depth);

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

    codeUnaryExpression: function(node, history, parent, localHistory, statHistory) {
        assert(node && node.type === "UnaryExpression");
        let goCode = "";

        let argument ="";
        switch (node.argument.type) {
            case "BinaryExpression":
                argument += "(";
                argument += this.codeBinary(node.argument, history, parent, localHistory) + ")";
                break;
            case "Literal":
                argument += gf.getValue(node.argument, history, parent, localHistory);
                break;
            case"Identifier":
                argument +=  gf.getIdentifier(node.argument.name, history, parent, localHistory, statHistory);
                break;
            default:
                assert(false, "unknown UnitaryExpression");
        }

        switch (node.operator) {
            case "!":
                goCode += node.operator + argument;
                break;
            case "-":
                goCode += "new(big.Int).Neg(" + argument + ")";
                break;
            case "+":
                goCode += argument;
                break;
            case "~":
                goCode += "new(big.Int).Not(" + argument + ")";
                break;
            case "delete":
                goCode = this.codeDelete(node.argument, history, parent, localHistory, argument);
                break;
            default:
                assert(false, "unknown unary operator" + node.operator);
        }
        return goCode;
    },

    codeDelete: function(node, history, parent, localHistory, arg) {//todo handle structs
        assert(node, node.type === "Identifier", "deleting non identifier");
        let idType = history.getStorageType(node.name, parent, localHistory);
        let data = history.findIdData(node.name, history, parent, localHistory);
        let emptyVal = "";
        if (data.node.literal.literal.type === "MappingExpression") {
            emptyVal += " *make(" + data.dataType + ")"
        } else {
            emptyVal += " ";
            emptyVal += gf.isDynamic(data.node.literal) ? "*" : "";
            emptyVal += "new(" + data.dataType + ")";
        }

        if (idType === "stateVariable") {
            return  "this.set(\"" + node.name + "\"," + emptyVal +")";
        } else if (idType === "memory" || idType === "alias") {
            return arg + " = " + emptyVal;
        }
        assert(false, "don't how to delete " + idType);
    },

    codeBinary: function(node, history, parent, localHistory, statHistory) {
        assert(node && node.type === "BinaryExpression");
        assert(node.left && node.right && node.operator);

        let goCode = "";
        let left = "";
        if (node.left.type === "Identifier")
            left = this.getGoIdentifier(node.left, history, parent, localHistory);
        else
            left = this.codeExpression(node.left, history, parent, localHistory, statHistory);
        //let left = this.codeExpression(node.left, history, parent, localHistory, statHistory);
        let right ="";
        if (node.right.type === "Identifier")
            right = this.getGoIdentifier(node.right, history, parent, localHistory);
        else
            right = this.codeExpression(node.right, history, parent, localHistory, statHistory);
        //let right = this.codeExpression(node.right, history, parent, localHistory, statHistory);

        //if (node.left.type === "BinaryExpression" || node.left.type === "UnaryExpression" ) {
         if (this.isLogicalOperation(node.left, history, parent, localHistory)) {
            //assert(node.right.type === "BinaryExpression" || node.right.type === "UnaryExpression");
            goCode += left;
            goCode += " " + node.operator + " ";
            goCode += right;
        } else {
            goCode += this.codeBigBinaryExpression(left, node.operator, right);
        }

        return goCode;
    },

    isLogicalOperation: function(node, history, parent, localHistory) {
         switch (node.type) {
             case "BinaryExpression":
                 return ["<", "<=", ">", ">=", "||", "&&", "==", "!=", "!"].indexOf(node.operator) >= 0;
             case "UnaryExpression":
                 return false;
             case "Literal":
                 return node.value === true || node.value === false;
             case "Identifier":
                 return "bool" === history.findIdData(node.name, parent, localHistory).dataType;
             default:
                 return false;
         }
    },


    // Assumes that left and right are already big objects of the same type
    codeBigBinaryExpression: function(left, op, right) {
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
                goCode += left + ".Cmp(" + right + ")";
                goCode += " " + op + " 0";
                return goCode;
            default:
                assert(false, "unsupported big operator " + op); //todo
                return "";
        }
    },

    codeBigAssignment: function(left, op, right, type) {
        type = type ? type : "Int";
        //assert(type === "Int" || type === "Float" || type === "Rat");
        switch (op) {
            case "=":
                return left + "= new(big." + type + ").Set(" + right + ")";
            case "*=":
                return left + ".Mul(" + left + ", " + right + ")";
            case "/=":
                return left + ".Div(" + left + ", " + right + ")";
            case "%=":
                return left + ".Mod(" + left + ", " + right + ")";
            case "+=":
                return left + ".Sub(" + left + ", " + right + ")";
            case "-=":
                return left + ".Add(" + left + ", " + right + ")";
            case "<<=":
                return left + ".Lsh(" + left + ", " + right + ")";
            case ">>=":
                return left + ".Rsh(" + left + ", " + right + ")";
            case "&=":
                return left + ".And(" + left + ", " + right + ")";
            case "^=":
                return left + ".Xor(" + left + ", " + right + ")";
            case "|=":
                return left + ".Or(" + left + ", " + right + ")";
            default:
                assert(false, "unsupported big operator " + op); //todo
                return "";
        }
    },

    codeUpdateExpression: function(node, history, parent, localHistory, statHistory) {
        assert(node && node.type === "UpdateExpression");
        let goCode = "\t".repeat(statHistory.depth);
        let argument = this.codeExpression(node.argument,history, parent, localHistory, statHistory);
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

    codeCallExpression:function(node, history, parent, localHistory, statHistory) {
        assert(node && node.type === "CallExpression");

        let goCode = "";

        // array push member special case.
        if (node.callee.type === "MemberExpression"
            && !node.callee.computed
            && node.callee.property.name === "push")
        {
            goCode += this.codePush(node, history, parent, localHistory, statHistory)
        } else {
            // If no object assume called from contract.
            if (node.callee.type === "Identifier")
                goCode += "this.";
            goCode += this.codeExpression(node.callee, history, parent, localHistory, statHistory);
            goCode += "(" + this.codeArguments(node.arguments, history, parent, localHistory, statHistory) + ")";
        }
        return goCode;
    },

    codePush: function(node, history, parent, localHistory, statHistory) {
        let goCode = "";
        if (node.callee.object.type === "Identifier") {
            goCode += "big.NewInt(int64(len(";
            goCode += "this.set(\"" + node.callee.object.name + "\", ";
            goCode += "append(";
            if (node.callee.object.type === "Identifier") {
                goCode += this.getGoIdentifier(node.callee.object, history, parent, localHistory, statHistory);
            } else {
                goCode = this.codeExpression(node.callee.object, history, parent, localHistory, statHistory);
            }
            goCode += ", " + this.codeArguments(node.arguments, history, parent, localHistory, statHistory);
            goCode += "))";
            goCode += gf.getSVTypeAssertion(node.callee.object, history, parent, localHistory);
            goCode += ") ))"
        } else {
            goCode += "big.NewInt(int64(len(this.get(\"";
            goCode += gf.getObjectName(node.callee.object, history, parent, localHistory);
            goCode += "\")";
            goCode += gf.getSVTypeAssertion(node.callee.object, history, parent, localHistory);
            goCode += ") ))";
            let prevCode = "";
            if (node.callee.object.type === "Identifier") {
                prevCode += this.getGoIdentifier(node.callee.object, history, parent, localHistory);
            } else {
                prevCode += this.codeExpression(node.callee.object, history, parent, localHistory, statHistory);
            }
            prevCode += " = append(";
            if (node.callee.object.type === "Identifier") {
                prevCode += this.getGoIdentifier(node.callee.object, history, parent, localHistory);
            } else {
                prevCode += this.codeExpression(node.callee.object, history, parent, localHistory, statHistory);
            }
            prevCode += ", " + this.codeArguments(node.arguments, history, parent, localHistory, statHistory);
            prevCode += ")";
            statHistory.previousStatments.push(prevCode);
        }
        return goCode;
    },

    codeArguments: function(argArray, history, parent, localHistory, statHistory) {
        assert(argArray && argArray instanceof Array);
        let goCode = "";
        let start = true;
        for ( let arg of argArray) {
            if (start)
                start = false;
            else
                goCode += ", ";
            goCode += this.codeExpression(arg, history, parent, localHistory, statHistory);
        }
        return goCode;
    },

    getGoIdentifier: function(node, history, parent, localHistory, statHistory){
        let goCode = "";
        if (!node && node.type === "Identifier")
            assert(node && node.type === "Identifier");
        let storageType = history.getStorageType(node.name, parent, localHistory);
        if (storageType === "stateVariable") {
            goCode += "this.get(\"" + node.name + "\")";
            goCode += gf.getSVTypeAssertion(node, history, parent, localHistory);
        } else if (storageType === "constant") {
            goCode += gf.getIdentifier(node.name, history, parent, localHistory); //todo getIdentifier and findIdData seem to be doing same thing
        } else {
            goCode += history.findIdData(node.name, parent, localHistory).goName;
        }
        if (statHistory)
            statHistory.nestedIds.push(history.findIdData(node.name, parent, localHistory));

        return goCode;
    },
 //   this.get("name").( map[*big.Int]string)[_number]= _name
//this.get("name").(* map[*big.Int]string)[_number.Uint64()]= new(big.Int).Set(_name)
    codeMember: function(node, history, parent, localHistory, statHistory, reversing, nested) {
        assert(node && node.type === "MemberExpression");

        let goCode = "";
        let object="";

        if (node.object.type === "Identifier") {
            object += this.getGoIdentifier(node.object, history, parent, localHistory, statHistory);
            statHistory.nestedMembers.push(history.findIdData(node.object.name, parent, localHistory));
        } else if (node.object.type === "MemberExpression") {
            object = this.codeMember(node.object, history, parent, localHistory, statHistory, node.computed, true);
        } else {
            object = this.codeExpression(node.object, history, parent, localHistory, statHistory);
            assert(statHistory.nestedIds.length > 0);
            statHistory.nestedMembers.push(statHistory.nestedIds[0]);
        }
        goCode += object;

        // node.computed true means an array or map, false then a structure
        if (node.computed) {
            //Maps handle memebrs different to arrays. If this is the first memebr of map, then
            //its the map index not an array.
            if (!nested) {
                assert(statHistory.nestedMembers.length > 0);
                statHistory.lastType = statHistory.nestedMembers[statHistory.nestedMembers.length-1];
                let typeObj = gf.typeFormat(statHistory.nestedMembers.pop().dataType);
                if (!nested && typeObj === "map") {
                    goCode += "[";
                    goCode += this.codeExpression(node.property, history, parent, localHistory, statHistory);
                    goCode += "]";
                    if (statHistory.prevProperties && statHistory.prevProperties.length > 0)
                        statHistory.prevProperties.pop();
                    return goCode;
                }
            }
            //Need to reverse the order of arrays as Solidity uses different order to Go
            //Member expressions could be nested
            let previous = "";
            let preIndex = statHistory.prevProperties.length-1;
            if (preIndex >= 0) {
                previous = statHistory.prevProperties[preIndex];
                if (previous.length > 0)
                    goCode = goCode.slice(0, -1*previous.length);
            }
            let property = this.codeArrayProperty(node.property, history, parent, localHistory, statHistory);
            let newOrderedProperties = property + previous;
            goCode += newOrderedProperties;
            if (preIndex >=0)
                statHistory.prevProperties.pop();
            if (reversing) {
                statHistory.prevProperties.push(newOrderedProperties);
            }

        } else if (node.property.name === "length") {
            return "big.NewInt(int64(len(" + object + ")))";
        } else {
            goCode += this.codeStructProperty(node.property);
        }
        return goCode;
    },

    codeArrayProperty: function(node, history, parent, localHistory, statHistory) {
        let goCode = "";
        goCode += "[";
        switch (node.type) {
            case "Literal":
                goCode += node.value; //todo ????
                break;
            case "Identifier":
                goCode += node.name;
                goCode += ".Uint64()";
                break;
            default:
                goCode += this.codeExpression(node, history, parent, localHistory, statHistory);
                assert(false, "unsupported member expression"); //todo
        }
        goCode += "]";
        return goCode;
    },

    codeStructProperty: function(node) {
        let goCode = "";
        goCode += ".";
        switch (node.type) {
            case "Literal":
                goCode += node.value; //todo ????
                break;
            case "Identifier": //todo check for special members like length
                goCode += node.name;
                break;
            default:
                assert(false, "unsupported member expression"); //todo
        }
        return goCode;
    },

    codeArrayExpression: function(node) {
        assert(node && node.type === "ArrayExpression");
        let goCode = "";
        goCode += "{";
        if (node.elements instanceof Array)
        for (let item of node.elements) {
            if (item.type === "Identifier")
                goCode += item.name;
            else if (item.type === "Literal") {
                goCode += item.value;
            } else {
                assert(false, "Unsupported");
            }
            goCode += ", ";
        }
        goCode += "}";
        return goCode;
    }

};