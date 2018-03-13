'use strict';
module.exports = {

    valueTypes : new Map([
        ["bool", "bool"],
        [ "uint", "*big.Int" ],
        [ "uint8", "*big.Int" ],
        [ "uint16", "*big.Int" ],
        [ "uint32", "*big.Int"  ],
        [ "uint64", "*big.Int" ],
        [ "uint128", "*big.Int" ],
        [ "uint256", "*big.Int"],
        [ "int", "*big.Int" ],
        [ "int8", "*big.Int" ],
        [ "int16", "*big.Int"  ],
        [ "int32", "*big.Int" ],
        [ "int64", "*big.Int" ],
        [ "int128", "*big.Int" ],
        [ "int256", "*big.Int" ],
        [ "fixed", "float64" ], //TODO support fixedMxN
        [ "ufixed", "float64" ], //TODO support ufixedMxN
        [ "address" , "*big.Int"], //TODO add address object to prefix
        [ "byte" , "byte"] //TODO add bytes1 to bytes32
    ])
};