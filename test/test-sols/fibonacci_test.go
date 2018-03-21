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
			t.Fatalf("%dth for fibonacci returned %d instead of %d.", i, bigFibFor.Uint64(), ithFib)
		}

		bigFibWhile := fibContract.FibWhile(bigI)
		if ithFib != bigFibWhile.Int64() {
			t.Fatalf("%dth while fibonacci returned %d instead of %d.", i, bigFibWhile.Uint64(), ithFib)
		}

		bigFibDo := fibContract.FibDo(bigI)
		if ithFib != bigFibDo.Int64() {
			t.Fatalf("%dth do fibonacci returned %d instead of %d.", i, bigFibDo.Uint64(), ithFib)
		}

		bigFibRecurse := fibContract.FibRecurse(bigI)
		if ithFib != bigFibRecurse.Int64() {
			t.Fatalf("%dth recursive fibonacci returned %d instead of %d.", i, bigFibRecurse.Uint64(), ithFib)
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