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

