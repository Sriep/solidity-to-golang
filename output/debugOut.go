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
	___pubSV *big.Int
	___intSV *big.Int
	___priSV *big.Int

}
type _Derived_pub interface {
	_Base_pub
	PubSV_Derived ()(  *big.Int )
	setPubSV_Derived ( v  *big.Int )
	ExtF_Derived(_value uint)
	PubF_Derived(_value uint) uint
	IntF_Derived(_value uint) uint
	PriF_Derived(_value uint) uint

}
type Derived interface {
	Base
	_Derived_pub

}
type _Derived_int interface {
	_Base_int
	_Derived_pub
	___intSV_Derived ()(  *big.Int )
	___setintSV_Derived ( v  *big.Int )

}
type _Derived_pri interface {
	_Base_pri
	_Derived_int
	___priSV_Derived ()(  *big.Int )
	___setpriSV_Derived ( v  *big.Int )

}
func main() {
    fmt.Println("hello")
}