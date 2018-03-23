package number_map

import (
	"testing"
	"math/big"
)

func TestSetGet(t *testing.T) {
	numMap := NewNumberMap()

	big0 := big.NewInt(0)
	big10 := big.NewInt(10)
	big77 := big.NewInt(77)

	numMap.Add(big0, "zero")
	numMap.Add(big10, "ten")
	numMap.Add(big77, "seventy seven")

	name := numMap.Name(big0)
	if "zero" != name   {
		t.Fatalf("Name of 0 should be zero not %s", name)
	}
	name = numMap.Name(big10)
	if "ten" != name   {
		t.Fatalf("Name of 10 should be ten not %s", name)
	}
	name = numMap.Name(big77)
	if "seventy seven" != name   {
		t.Fatalf("Name of 77 should be seventy seven not %s", name)
	}
};