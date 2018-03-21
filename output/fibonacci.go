package fibonacci
import (
    "math/big"
    "crypto/sha256"
    "time"
)

//Solidity Constants -
const (
    // time units todo leap years and leap seconds
    SECONDS = 1
    MINUTES = 60 * SECONDS
    HOURS   = 60 * MINUTES
    DAYS    = 24 * HOURS
    WEEKS   = 7 * DAYS
    YEARS   = 365 * DAYS

    // Either units
    wei = 1
    szabo = 1000000000000
    finney = 1000000000000000
    either = 1000*finney
)


// ***************** Solidity global functions ***********************************
//
// todo workout implimnentation, usally wrapper around go library import

//now (uint): current block timestamp (alias for block.timestamp)
//for now we can hard code it to make tests easier
func now() int64 {
    return time.Now().Unix()
}
// compute (x + y) % k where the addition is performed with arbitrary precision
// and does not wrap around at 2**256. Assert that k != 0 starting from version 0.5.0.
func addmod(x *big.Int, y *big.Int, k *big.Int)  (*big.Int) {
    var m *big.Int
    return m.Mod(x.Add(x,y),k)
}

// compute (x * y) % k where the multiplication is performed with arbitrary precision
// and does not wrap around at 2**256. Assert that k != 0 starting from version 0.5.0.
func mulmod(x *big.Int, y *big.Int, k *big.Int)  (*big.Int) {
    var m *big.Int
    return m.Mod(x.Mul(x,y),k)
}

// compute the Ethereum-SHA-3 (Keccak-256) hash of the (tightly packed) arguments
func keccak256(args ...interface{})  ([]byte) {
    return sha256_(args)   //todo keccak256
}

//compute the SHA-256 hash of the (tightly packed) arguments
func sha256_(args ...interface{})  ([]byte) {// todo sha256
    h := sha256.New()
    var a []byte
    h.Write(a)
    return h.Sum(nil)
}

//alias to keccak256
func sha3(args ...interface{})  ([]byte){
    return keccak256(args)
}

//compute RIPEMD-160 hash of the (tightly packed) arguments
func ripemd160(args ...interface{}) ([]byte) {
    return sha256_(args) //todo ripemd160
}

//recover the address associated with the public key
// from elliptic curve signature or return zero on error
func ecrecover(_hash byte, v uint8, r [32]byte, s []byte) (address) {
    var a [20]byte
    return a //todo ecrecover
}

func resolveTightlyPackedArguments(args ...interface{}) ([]byte){
    var rtv []byte
    idx := 0
    for _,p := range args {
        switch p.(type) {
        case string:
            byteArray := []byte(p.(string))
            for  _, byte := range byteArray {
                rtv[idx] = byte
                idx++
            }
        case int:
            rtv[idx] = byte(p.(int))
            idx++
        default:
        //todo ??
        }
    }
    return rtv //todo resolveTightlyPackedArguments
}

// ********************** address type ***************************

type address [20]byte //todo use [20]byte, *bigInt uint bytes or make interface???
func (a address) balance() (*big.Int) {
    return big.NewInt(0) //todo address.balance
}
func (a address) send(ammount *big.Int) (bool) {
    return false //todo address.send
}

// ******************* Global structures ********************************

type block_ struct {
    coinbase address 		//current block miner’s address
    difficulty *big.Int		//current block difficulty
    gaslimit *big.Int		//current block gaslimit
    number *big.Int			//current block number
    timestamp *big.Int		//current block timestamp as seconds since unix epoch
}
var block block_
// hash of the given block - only works for 256 most recent blocks excluding current
func (b block_) blockhash(blockNumber *big.Int) [32]byte { // todo block.blockhash [32] byte or *big.Int?
    var a [32]byte
    return a
}

type msg_ struct {
    data []byte
    gas *big.Int
    sender address
    sig [4]byte
    value *big.Int
}
var msg msg_

type tx_ struct {
    gassprice *big.Int
    origin address
}
var tx tx_

func gasleft() *big.Int { //todo should this be here?
    return block.gaslimit.Sub(block.gaslimit, tx.gassprice)
}

// ********************** Contract base ********************************

type Contract struct {
    address
    svStorage map[string]interface{}
}
func (s *Contract) get(variableName string) (interface{}) {
    return s.svStorage[variableName]
}
func (s *Contract) set(variableName string, value interface{})  (interface{}) {
    s.svStorage[variableName] = value;
    return s.svStorage[variableName]
}
func (s *Contract) createStorage() {
    if nil == s.svStorage {
        s.svStorage = make(map[string]interface{})
    }
}
func (s *Contract) selfdestruct(recipient address) {
    // todo selfdestruct
}

// ********************** End header ********************************
//
//******************** Generated code follows ***********************
type _A_st struct {
	Contract
	this *_A_st
}
type _A_pub interface {
	Hi()( string)

}
type A interface {
	_A_pub

}
type _A_int interface {
	_A_pub

}
type _A_pri interface {
	_A_int

}
func NewA() (*_A_st) {
	p := new(_A_st)
	p.this = p
	p.createStorage()
	return p
}

func (this _A_st) Hi()( string) {
	return "hi"
}

type _Fibonacci_st struct {
	Contract
	this *_Fibonacci_st
}
type _Fibonacci_pub interface {
	FibRecurse(n *big.Int)( *big.Int)
	FibWhile(n *big.Int)( *big.Int)
	FibDo(n *big.Int)( *big.Int)
	FibFor(n *big.Int)( *big.Int)

}
type Fibonacci interface {
	_Fibonacci_pub

}
type _Fibonacci_int interface {
	_Fibonacci_pub

}
type _Fibonacci_pri interface {
	_Fibonacci_int

}
func NewFibonacci() (*_Fibonacci_st) {
	p := new(_Fibonacci_st)
	p.this = p
	p.createStorage()
	return p
}

func (this _Fibonacci_st) FibRecurse(n *big.Int)( *big.Int) {
	var aa A
	if n.Cmp(big.NewInt(0)) == 0{
		return big.NewInt(0)

	} else 	if n.Cmp(big.NewInt(1)) == 0{
		return big.NewInt(1)

	}



	aa=new(A)
aa.hi()
	return new(big.Int).Add(this.FibRecurse(new(big.Int).Sub(n, big.NewInt(1))), this.FibRecurse(new(big.Int).Sub(n, big.NewInt(2))))
}
func (this _Fibonacci_st) FibWhile(n *big.Int)( *big.Int) {
	var xm1 *big.Int
	var x *big.Int
	var xp1 *big.Int
	var i *big.Int
	if n.Cmp(big.NewInt(0)) == 0 {
		return big.NewInt(0)

	} else 	if n.Cmp(big.NewInt(1)) == 0 {
		return big.NewInt(1)

	}

	xm1 = big.NewInt(1)
	x = big.NewInt(1)

	i = big.NewInt(3)
	for i.Cmp(new(big.Int).Add(n, big.NewInt(1))) < 0{
		xp1=new(big.Int).Add(xm1, x)
		xm1=x
		x=xp1
		i.Add(i, big.NewInt(1))

	}

	return x
}
func (this _Fibonacci_st) FibDo(n *big.Int)( *big.Int) {
	var xm1 *big.Int
	var x *big.Int
	var xp1 *big.Int
	var i *big.Int
	if n.Cmp(big.NewInt(0)) == 0 {
		return big.NewInt(0)

	} else 	if n.Cmp(big.NewInt(1)) == 0 || n.Cmp(big.NewInt(2)) == 0{
		return big.NewInt(1)

	}


	xm1 = big.NewInt(1)
	x = big.NewInt(1)

	i = big.NewInt(3)
	for __ok := true; __ok; __ok = !(new(big.Int).Add(n, big.NewInt(1)).Cmp(i) <= 0){
		xp1=new(big.Int).Add(xm1, x)
		xm1=x
		x=xp1
		i.Add(i, big.NewInt(1))

	}

	return x
}
func (this _Fibonacci_st) FibFor(n *big.Int)( *big.Int) {
	var xm1 *big.Int
	var x *big.Int
	var xp1 *big.Int
	var i *big.Int
	if n.Cmp(big.NewInt(0)) == 0 {
		return big.NewInt(0)

	} else 	if n.Cmp(big.NewInt(1)) == 0 {
		return big.NewInt(1)

	}

	xm1 = big.NewInt(1)
	x = big.NewInt(1)

	for 	i = big.NewInt(3) ; i.Cmp(n) <= 0 ; 	i.Add(i, big.NewInt(1)){
		xp1=new(big.Int).Add(xm1, x)
		xm1=x
		x=xp1

	}

	return x
}
