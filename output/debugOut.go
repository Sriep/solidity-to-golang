package main

import (
    "fmt"
    "math/big"
    "time"
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


type _Base_st struct {

}
type _Base_pub interface {

}
type Base interface {
	_Base_pub

}
type _Base_int interface {
	_Base_pub

}
type _Base_pri interface {
	_Base_int

}

type _Derived_st struct {
	_Base_st
	pubSV *big.Int
	intSV *big.Int
	priSV *big.Int

}
type _Derived_pub interface {
	_Base_pub
	PubSV_Derived ()(  *big.Int )
	setPubSV_Derived ( v  *big.Int)
	PubF_Derived(_value uint) uint

}
type Derived interface {
	Base
	_Derived_pub
	ExtF_Derived(_value uint)

}
type _Derived_int interface {
	_Base_int
	_Derived_pub
	___intSV_Derived ()(  *big.Int )
	___setintSV_Derived ( v  *big.Int)
	__intF_Derived(_value uint) uint

}
type _Derived_pri interface {
	_Base_pri
	_Derived_int
	___priSV_Derived ()(  *big.Int )
	___setpriSV_Derived ( v  *big.Int)
	__priF_Derived(_value uint) uint

}
func (this _Derived_st) PubSV_Derived ()(  *big.Int ) {}
func (this _Derived_st) setPubSV_Derived ( v  *big.Int) {}
func (this _Derived_st) ___intSV_Derived ()(  *big.Int ) {}
func (this _Derived_st) ___setintSV_Derived ( v  *big.Int) {}
func (this _Derived_st) ___priSV_Derived ()(  *big.Int ) {}
func (this _Derived_st) ___setpriSV_Derived ( v  *big.Int) {}
func (this _Derived_st) ExtF_Derived(_value uint) {}
func (this _Derived_st) PubF_Derived(_value uint) uint {}
func (this _Derived_st) __intF_Derived(_value uint) uint {}
func (this _Derived_st) __priF_Derived(_value uint) uint {}

func main() {
    fmt.Println("hello")
}