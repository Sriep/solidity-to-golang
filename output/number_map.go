package number_map
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
type _NumberMap_st struct {
	Contract
	this *_NumberMap_st
}
type _NumberMap_pub interface {
	Test (i0 *big.Int, i1 *big.Int, i2 *big.Int)(*big.Int)
	Test2 (i0 *big.Int, i1 *big.Int, i2 *big.Int, i3 *big.Int)(*big.Int)
	Name (i0 *big.Int)(string)

}
type NumberMap interface {
	Add(_number *big.Int, _name string)
	Test (i0 *big.Int, i1 *big.Int, i2 *big.Int)(*big.Int)
	Test2 (i0 *big.Int, i1 *big.Int, i2 *big.Int, i3 *big.Int)(*big.Int)
	Name (i0 *big.Int)(string)

}
type _NumberMap_int interface {
	Add(_number *big.Int, _name string)
	Test (i0 *big.Int, i1 *big.Int, i2 *big.Int)(*big.Int)
	Test2 (i0 *big.Int, i1 *big.Int, i2 *big.Int, i3 *big.Int)(*big.Int)
	Name (i0 *big.Int)(string)

}
type _NumberMap_pri interface {
	Test (i0 *big.Int, i1 *big.Int, i2 *big.Int)(*big.Int)
	Test2 (i0 *big.Int, i1 *big.Int, i2 *big.Int, i3 *big.Int)(*big.Int)
	Name (i0 *big.Int)(string)
	Add(_number *big.Int, _name string)

}
func NewNumberMap() (*_NumberMap_st) {
	p := new(_NumberMap_st)
	p.this = p
	p.createStorage()
	p.set("test",  make( map[*big.Int][][3]*big.Int))
	p.set("test2",  make( map[*big.Int] map[*big.Int][4][]*big.Int))
	p.set("name",  make( map[*big.Int]string))
	return p
}

func (this _NumberMap_st) Test (i0 *big.Int, i1 *big.Int, i2 *big.Int)(*big.Int) {
	return this.get("test").( map[*big.Int][][3]*big.Int)[i0][i2.Uint64()][i1.Uint64()][i0.Uint64()]
}
func (this _NumberMap_st) Test2 (i0 *big.Int, i1 *big.Int, i2 *big.Int, i3 *big.Int)(*big.Int) {
	return this.get("test2").( map[*big.Int] map[*big.Int][4][]*big.Int)[i0][i1][i3.Uint64()][i2.Uint64()][i1.Uint64()][i0.Uint64()]
}
func (this _NumberMap_st) Name (i0 *big.Int)(string) {
	return this.get("name").( map[*big.Int]string)[i0]
}
func (this _NumberMap_st) Add(_number *big.Int, _name string) {
	this.get("name").(map[*big.Int]string)[_number]=_name
}
