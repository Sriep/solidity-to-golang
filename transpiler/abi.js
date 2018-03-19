const assert = require("assert");
const gf = require("./gf.js");

module.exports = {

    interface: [],

    addToAbi: function(abi, node, history, parent) {
        assert(node);
        if (node.type === "StateVariableDeclaration") {
            abi.interface.push({
                constant: !!node.is_constant,
                inputs: [],
                name : node.name.charAt(0).toUpperCase() + node.name.slice(1),
                outputs: [
                    {
                        name: "",
                        type: gf.typeOf(node.literal, history, parent)
                    }
                ],
                payable: "false", //todo where to get this???
                stateMutability: "nonpayable", //todo whats this????
                type: "function"
            });
        } else if (node.type === "FunctionDeclaration") {
            let funcName = "";
            if (node.name === parent.name) {
                funcName = "New" + node.name;
            } else {
                funcName += node.name.charAt(0).toUpperCase() + node.name.slice(1);
            }
            let newAbi = {
                constant: !!node.is_constant,
                inputs: [],
                name : funcName,
                outputs: [],
                payable: "false", //todo where to get this???
                stateMutability: "nonpayable", //todo whats this????
                type: (node.name === parent.name) ? "constructor" : "function"
            };
            if (node.params) {
                for ( let param of node.params ) {
                    newAbi.inputs.push({
                        name: param.id,
                        type: gf.typeOf(param.literal, history, parent)
                    })
                }
            }
            if (node.returnParams) {
                for ( let param of node.params ) {
                    newAbi.outputs.push({
                        name: param.id,
                        type: gf.typeOf(param.literal, history, parent)
                    })
                }
            }
            this.interface.push(newAbi);
        }
    },

    addConstructor: function(abi, parent) {
        for (func of abi.interface) {
            if (func.name === "New" + parent.name)
                return;
        }
        abi.interface.push({
            constant: false,
            inputs: [],
            name: "New" + parent.name,
            outputs: [],
            payable: "false",
            stateMutability: "nonpayable",
            type: "constructor"
        })
    }
};