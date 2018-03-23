//Write your own contracts here. Currently compiles using solc v0.4.15+commit.bbb8e64f.
pragma solidity ^0.4.18;

contract  Day {

    enum Days { Monday, Tuseday, Wednesday, Thursday, Friday, Saturday, Sunday }
    Days public today;

    function setDay(Days _today) public {
        today = _today;
    }

}

contract Tomorrow {
    Day thisDay;

    function getTomorrow() public view returns(Day.Days) {
        if (thisDay.today() == Day.Days.Sunday) {
            return Day.Days.Monday;
        } else if (thisDay.today() == Day.Days.Monday) {
            return Day.Days.Tuseday;
        } else if (thisDay.today() == Day.Days.Tuseday) {
            return Day.Days.Wednesday;
        } else if (thisDay.today() == Day.Days.Wednesday) {
            return Day.Days.Thursday;
        } else if (thisDay.today() == Day.Days.Thursday) {
            return Day.Days.Friday;
        } else if (thisDay.today() == Day.Days.Friday) {
            return Day.Days.Saturday;
        } else if (thisDay.today() == Day.Days.Saturday) {
            return Day.Days.Sunday;
        }
    }

    function setToDay(Day.Days _today) public {
        thisDay = new Day();
        thisDay.setDay(_today);
    }
}

