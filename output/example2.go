package main
import (
    "os"
    "math/big"
    "crypto/sha256"
    "fmt"
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
    gasLimit *big.Int		//current block gaslimit
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
    return block.gasLimit.Sub(block.gasLimit, tx.gassprice)
}

// ********************** Contract base ********************************

type Contract struct {
    address
    svStorage map[string]interface{}
}
func (s *Contract) get(variableName string) (interface{}) {
    return s.svStorage[variableName]
}
func (s *Contract) set(variableName string, value interface{}) {
    s.svStorage[variableName] = value;
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
type _StandardToken_st struct {
	Contract
	this *_StandardToken_st
}
type _StandardToken_pub interface {
	Xx_StandardToken ()(  *big.Int )
	setXx_StandardToken ( v  *big.Int)
	IncXX_StandardToken(amount *big.Int)

}
type StandardToken interface {
	_StandardToken_pub

}
type _StandardToken_int interface {
	_StandardToken_pub

}
type _StandardToken_pri interface {
	_StandardToken_int

}
func NewStandardToken() (*_StandardToken_st) {
	p := new(_StandardToken_st)
	p.this = p
	p.createStorage()
	p.set("Xx",  new(*big.Int))
	p.set("StArray",  new([4]*big.Int))
	return p
}

func (this _StandardToken_st) Xx_StandardToken ()(  *big.Int ) {
	v := this.get("xx").( *big.Int)
	return v
}
type stuff_StandardToken struct {
		___cabbage *big.Int
}
func (this _StandardToken_st) IncXX_StandardToken(amount *big.Int) {

	// Declarations have to be at top of file as go variable scope are block based
	// and Solidity scope is function based.
	this.get(stArray).([4]*big.Int)[3]=new(big.Int).Add(this.get(xx).(*big.Int), amount)
}

type _Ownable_st struct {
	Contract
	this *_Ownable_st
}
type _Ownable_pub interface {

}
type Ownable interface {
	_Ownable_pub

}
type _Ownable_int interface {
	_Ownable_pub

}
type _Ownable_pri interface {
	_Ownable_int

}
func NewOwnable() (*_Ownable_st) {
	p := new(_Ownable_st)
	p.this = p
	p.createStorage()
	return p
}


type _A_st struct {
	Contract
	this *_A_st
}
type _A_pub interface {
	_StandardToken_pub
	_Ownable_pub

}
type A interface {
	StandardToken
	Ownable
	_A_pub

}
type _A_int interface {
	_StandardToken_int
	_Ownable_int
	_A_pub

}
type _A_pri interface {
	_StandardToken_pri
	_Ownable_pri
	_A_int

}
func NewA() (*_A_st) {
	p := new(_A_st)
	p.this = p
	p.createStorage()
	p.set("Xx",  new(*big.Int))
	p.set("StArray",  new([4]*big.Int))
	return p
}


type _APRInflationToken_st struct {
	Contract
	this *_APRInflationToken_st
}
type _APRInflationToken_pub interface {
	_StandardToken_pub
	_Ownable_pub
	StartDate_APRInflationToken ()(  *big.Int )
	setStartDate_APRInflationToken ( v  *big.Int)
	Balances_APRInflationToken ()(  map [*big.Int] *big.Int )
	setBalances_APRInflationToken ( v  map [*big.Int] *big.Int)
	Reveal_APRInflationToken(av *big.Int)( *big.Int,  *big.Int)

}
type APRInflationToken interface {
	StandardToken
	Ownable
	_APRInflationToken_pub

}
type _APRInflationToken_int interface {
	_StandardToken_int
	_Ownable_int
	_APRInflationToken_pub
	___dataArray_undefined ()(  [10]*big.Int )
	___setdataArray_undefined ( v  [10]*big.Int)

}
type _APRInflationToken_pri interface {
	_StandardToken_pri
	_Ownable_pri
	_APRInflationToken_int
	___dailyAdjust_undefined ()(  *big.Int )
	___setdailyAdjust_undefined ( v  *big.Int)

}
func NewAPRInflationToken() (*_APRInflationToken_st) {
	p := new(_APRInflationToken_st)
	p.this = p
	p.createStorage()
	p.set("Xx",  new(*big.Int))
	p.set("StArray",  new([4]*big.Int))
	p.set("StartDate",  new(*big.Int))
	p.set("dailyAdjust", 1)
	p.set("dataArray",  new([10]*big.Int))
	p.set("M_aLotOfIntegers",  new([10]*big.Int))
	p.set("M_pairsOfFlags",  new([2][10]bool))
	p.set("LotsOfDimentions",  new([1][22][32][111]*big.Int))
	p.set("Balances",  make( map[*big.Int]*big.Int))
	p.set("Choice",  new(ActionChoices_APRInflationToken))
	p.set("NumCampaigns",  new(*big.Int))
	p.set("Campaigns",  make( map[*big.Int]Campaign_APRInflationToken))
	p.set("MyText",  new(string))
	p.set("Bob",  new(stuff_APRInflationToken))
	return p
}

func (this _APRInflationToken_st) StartDate_APRInflationToken ()(  *big.Int ) {
	v := this.get("startDate").( *big.Int)
	return v
}
func (this _APRInflationToken_st) Balances_APRInflationToken ()(  map [*big.Int] *big.Int ) {
	v := this.get("balances").( map [*big.Int] *big.Int)
	return v
}
type ActionChoices_APRInflationToken int
type Funder_APRInflationToken struct {
		___addr *big.Int
		___amount *big.Int
}
type Campaign_APRInflationToken struct {
		___beneficiary *big.Int
		___fundingGoal *big.Int
		___numFunders *big.Int
		___amount2 *big.Int
		___funders map [*big.Int] Funder_APRInflationToken
}
func (this _APRInflationToken_st) Reveal_APRInflationToken(av *big.Int)( *big.Int,  *big.Int) {
	var ar [22]*big.Int
	var d StandardToken
	var fund Funder_APRInflationToken
	var arra [14][33]*big.Int
	var a [10]*big.Int
	var arrayOfPairs [2][10]*big.Int
	var i *big.Int
	var abc *big.Int
	var anint *big.Int
	var j *big.Int

	// Declarations have to be at top of file as go variable scope are block based
	// and Solidity scope is function based.

	
	___bob.cabbage=big.NewInt(545)
	d = new(StandardToken)
	av=d.xx()
	ar[4]=big.NewInt(3)
IncXX(av)
	Xx=big.NewInt(77)
	___choice=__ActionChoices_APRInflationToken.GoLeft


	a = new([10]*big.Int)
	arrayOfPairs = new([2][10]*big.Int)
	i = new(big.Int).Add(big.NewInt(2), big.NewInt(1))
	abc = i
	___myText="hi there"
	StartDate=new(big.Int).Add(this.get(startDate).(*big.Int), big.NewInt(4))
	if 0 == abc.Cmp(i) || !(0 == i.Cmp(big.NewInt(4))){
			i, abc, undefined[2]=big.NewInt(1), big.NewInt(2), big.NewInt(3)

		}

	if 0 > big.NewInt(2).Cmp(abc) && 0 == av.Cmp(big.NewInt(3)) || 0 <= i.Cmp(abc){
			StartDate=new(big.Int).Mul(big.NewInt(3), i)
			abc=big.NewInt(3)
			av=big.NewInt(3)
			a[3]=big.NewInt(8)
			arrayOfPairs[1][1]=big.NewInt(3333)
			fund.amount=big.NewInt(7)

		} else {
			i=big.NewInt(7)
			anint = -big.NewInt(44)
			ar[2]=big.NewInt(3)
			this.set("ar[7]", anint)

		}

	for 0 < i.Add(i, big.NewInt(1)).Cmp(big.NewInt(27)){
i.Add(i, big.NewInt(1))

		}

	for __ok := true; __ok; __ok = 0 < i.Cmp(big.NewInt(5)){
i.Add(i, big.NewInt(1))

		}

	for 	j = big.NewInt(12) ; 0 > j.Cmp(this.get(startDate).(*big.Int)) ; j.Sub(j, big.NewInt(1)){
			if 0 == i.Cmp(big.NewInt(3)){
					continue

				} else 				if 0 == j.Cmp(big.NewInt(3)){
						break

					}


			i=new(big.Int).Add(i, j)

		}

	i, abc=big.NewInt(2), big.NewInt(7)
	return big.NewInt(3), i
}

func main() {
    args := os.Args[1:]
    if len(args) >= 5 {
        var coinbase address
        for i := 0; i < len(os.Args[0]) && i<20; i++ {
            coinbase[i] = os.Args[0][i]
        }
        var difficulty *big.Int
        var gaslimit *big.Int
        var number *big.Int
        var timestamp *big.Int
        difficulty.SetString(os.Args[1], 10)
        gaslimit.SetString(os.Args[2], 10)
        number.SetString(os.Args[3], 10)
        timestamp.SetString(os.Args[4], 10)
        block = block_ {coinbase, difficulty ,gaslimit, number, timestamp}
    } else {
        block = block_ {}
    }

    fmt.Println("Hi")
}