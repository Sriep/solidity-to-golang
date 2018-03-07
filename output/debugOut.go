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


type _StandardToken_st struct {

}
type _StandardToken_pub interface {

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

type _Ownable_st struct {

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

type _A_st struct {
	_StandardToken_S_st
	_Ownable_S_st

}
type _A_pub interface {
	_StandardToken_S_pub
	_Ownable_S_pub

}
type A interface {
	StandardToken_S
	Ownable_S
	_A_pub

}
type _A_int interface {
	_StandardToken_S_int
	_Ownable_S_int
	_A_pub

}
type _A_pri interface {
	_StandardToken_S_pri
	_Ownable_S_pri
	_A_int

}

type _APRInflationToken_st struct {
	_StandardToken_S_st
	_Ownable_S_st

}
type _APRInflationToken_pub interface {
	_StandardToken_S_pub
	_Ownable_S_pub

}
type APRInflationToken interface {
	StandardToken_S
	Ownable_S
	_APRInflationToken_pub

}
type _APRInflationToken_int interface {
	_StandardToken_S_int
	_Ownable_S_int
	_APRInflationToken_pub

}
type _APRInflationToken_pri interface {
	_StandardToken_S_pri
	_Ownable_S_pri
	_APRInflationToken_int

}
func main() {
    fmt.Println("hello")
}