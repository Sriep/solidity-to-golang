package fibonacci

import (
	"testing"
	"math/big"
)

func TestSetGet(t *testing.T) {

	fibContract := NewFibonacci()

	for i  := 0; i < 10; i++ {
		bigI := big.NewInt(int64(i))
		ithFib := fib(i);
		bigFibFor := fibContract.FibFor(bigI)
		if ithFib != bigFibFor.Int64() {
			t.Fatalf("%dth fibonacci returned %d instead of %d.", i, bigFibFor.Uint64(), ithFib)
		}
	}
}

func fib(n int) (int64) {
	if (n == 0) {
		return 0
	} else  if (n == 1) {
		return 1
	}
	xm1 := 1
	x := 1
	xp1 := 0
	for i := 3 ; i <= n ; i++ {
		xp1 = xm1 + x;
		xm1 = x;
		x = xp1;
	}
	return int64(x);
}