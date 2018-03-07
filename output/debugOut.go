package main

import (
    "fmt"
    "math/big"
    "time"
    //"reflect"
)

const (
    SECONDS = 1
    MINUTES = 60 * SECONDS
    HOURS   = 60 * MINUTES
    DAYS    = 24 * HOURS
    WEEKS   = 7 * DAYS
    YEARS   = 365 * DAYS
)

func now() int64 {
    return time.Now().Unix() // 123
}

//***************** StandardToken start struct declarations  *****************
type StandardToken_S struct {
	xx *big.Int

}

//***************** StandardToken start interface declarations  *****************
type StandardToken interface {
	__xx() ( *big.Int)

}

//***************** StandardToken start external declarations  *****************

//***************** StandardToken end external declarations  *****************



//***************** Ownable start struct declarations  *****************
type Ownable_S struct {

}

//***************** Ownable start interface declarations  *****************
type Ownable interface {

}

//***************** Ownable start external declarations  *****************

//***************** Ownable end external declarations  *****************



//***************** A start struct declarations  *****************
type A_S struct {
	StandardToken_S
	Ownable_S

}

//***************** A start interface declarations  *****************
type A interface {
	StandardToken
	Ownable

}

//***************** A start external declarations  *****************

//***************** A end external declarations  *****************



//***************** APRInflationToken start struct declarations  *****************
type APRInflationToken_S struct {
	StandardToken_S
	Ownable_S
	startDate *big.Int
	dailyAdjust *big.Int
	data *big.Int
	dataArray [10]*big.Int
	m_aLotOfIntegers [10]*big.Int
	m_pairsOfFlags [2][10]bool
	lotsOfDimentions [1][22][32][111]*big.Int
	balances map [*big.Int] *big.Int
//Declared enumerationActionChoices
	choice int
	defaultChoice int
//Declared struct Funder
//Declared struct Campaign
	numCampaigns *big.Int
//Declared event NewRequest
//Declared modifier canAdjustDaily
//Declared function reveal
//Declared function APRInflationToken
//Declared function aprMintAdjustment
//Declared function _setDailyAdjustControl

}

//***************** APRInflationToken start interface declarations  *****************
type APRInflationToken interface {
	StandardToken
	Ownable
	startDate() ( *big.Int)
	__data() ( *big.Int)
	__dataArray() ( [10]*big.Int)
	__m_aLotOfIntegers() ( [10]*big.Int)
	__m_pairsOfFlags() ( [2][10]bool)
	__lotsOfDimentions() ( [1][22][32][111]*big.Int)
	balances() ( map [*big.Int] *big.Int)
	__choice() ( int)
	__defaultChoice() ( int)
	__numCampaigns() ( *big.Int)
	reveal()  //This a function
	APRInflationToken(undefined int)  //This a function
	aprMintAdjustment() bool  //This a function
	_setDailyAdjustControl() uint256  //This a function

}

//***************** APRInflationToken start external declarations  *****************

//***************** APRInflationToken end external declarations  *****************

func main() {
    fmt.Println("hello")
}