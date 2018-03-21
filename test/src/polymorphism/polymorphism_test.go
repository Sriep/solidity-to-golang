package polymorphism

import (
    "testing"
    "math/big"
)


func TestSetGet(t *testing.T) {
    spider := NewSpider()
    cat := NewCat()
    human := NewHuman()

    legs := human.CountLegs(spider)
    big6 := big.NewInt(6)
    if 0 != legs.Cmp(big6)  {
        t.Fatalf("Spider should have 6 legs not %d", legs.Uint64())
    }
    legs = human.CountLegs(cat)
    if  0 != legs.Cmp(big.NewInt(4))    {
        t.Fatalf("Spider should have 4 legs not %d", legs.Uint64())
    }
    legs = human.CountLegs(human)
    if  0 != legs.Cmp(big.NewInt(2))   {
        t.Fatalf("Spider should have 2 legs not %d", legs.Uint64())
    }
};