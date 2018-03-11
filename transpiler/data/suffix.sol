
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