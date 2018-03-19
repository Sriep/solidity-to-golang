package constructor

import (
    "testing"
    "strconv"
)

func TestSetGetMessage(t *testing.T) {
    originalMessage := "message " + strconv.Itoa(0)
    myStore := NewInbox(originalMessage);
    rtOriginal := myStore.Message();
    if (rtOriginal != originalMessage) {
        t.Fatalf("Set message to %s but got %s back", originalMessage, rtOriginal);
    }


    for  i  := 1; i < 10; i++ {
        newMessage := "new message number" + strconv.Itoa(i)
        myStore.SetMessage(newMessage)
        rtMessage := myStore.Message()
        if rtMessage != newMessage {
            t.Fatalf("Set message to %s but got %s back", newMessage, rtMessage)
        }
    }
};