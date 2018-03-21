package array_dyncon

import (
	"testing"
	"math/big"
)


func TestSetGet(t *testing.T) {
	const arrayLength = 3;
	myContract := NewArrayPush()


	for i := 0 ; i<arrayLength ; i++ {
		bigI := big.NewInt(int64(i))
		startLen := myContract.ArrayLength(bigI)
		if 0 != startLen.Cmp(big.NewInt(0)) {
			t.Fatalf("Inital array length sould be zero  not %d", startLen.Int64())
		}
	}


	for x := 0; x < arrayLength ; x++ {
		bigX := big.NewInt(int64(x))

		for value := 0 ; value < 20 ; value++  {
			rtvLength := myContract.ArrayLength(bigX).Int64()
			if rtvLength != int64(value) {
				t.Fatalf("arrayLength before push returned %d instead of %d.", rtvLength, x);
			}

			bigValue := big.NewInt(int64(value))
			myContract.Push(bigX, bigValue)

			rtvLength = myContract.ArrayLength(bigX).Int64()
			if rtvLength != int64(value+1) {
				t.Fatalf("arrayLength after push returned %d instead of %d.", rtvLength, x+1);
			}

			rtv := myContract.MyArray(bigValue, bigX).Int64()

			if rtv != int64(value) {
				t.Fatalf("Returned wrong array element at position %d %d", value, x);
			}
		}
	}
}