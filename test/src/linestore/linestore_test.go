package linestore

import (
	"testing"
	"math/big"
)


func TestSetGet(t *testing.T) {

	myLine := NewLineStore()

	for m := -5 ; m<5 ; m++ {
		for c:= 1 ; c < 5 ; c++ {
			myArray := makeLine(m, c)
			bigM := big.NewInt(int64(m))
			bigC := big.NewInt(int64(c))
			myLine.NewLine(bigM, bigC)
			lineRange := myLine.Upper().Int64() -  myLine.Lower().Int64()

			for i := 0 ; i < int(lineRange) ; i++ {
				bigI := big.NewInt(int64(i))
				point := myLine.Line(bigI)
				resX := point.x.Int64()
				resY := point.y.Int64()

				if resX != int64(myArray[i][0]) {
					t.Fatalf("Got wrong x value at index %d expected %d got %d.", i, myArray[i][0], resX);
				}
				if resY != int64(myArray[i][1]) {
					t.Fatalf("Got wrong y value at index %d expected %d got %d.", i, myArray[i][1], resY);
				}
			}
		}
	}
}

func makeLine(M int, C int) (array [][2]int) {
	for  i := -5 ; i < 5 ; i++  {
		var point = [2]int {i, M*i+C}
		array = append(array, point)
	}
	return array
}