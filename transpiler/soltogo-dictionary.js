'use strict';
module.exports = {

    valueTypes : new Map([
        ["bool", "bool"],
        [ "uint", "*big.Int" ],
        [ "uint8", "uint8"],
        [ "uint16", "uint16" ],
        [ "uint32", "uint32" ],
        [ "uint64", "uint64" ],
        [ "uint128", "*big.Int" ],
        [ "uint256", "*big.Int"],
        [ "int", "*big.Int" ],
        [ "int8", "uint8"],
        [ "int16", "uint16" ],
        [ "int32", "uint32" ],
        [ "int64", "uint64" ],
        [ "int128", "*big.Int" ],
        [ "int256", "*big.Int" ],
        [ "fixed", "float64" ], //TODO support fixedMxN
        [ "ufixed", "float64" ], //TODO support ufixedMxN
        [ "address" , "*big.Int"], //TODO add address object to prefix
        [ "byte" , "byte"] //TODO add bytes1 to bytes32
    ])
};