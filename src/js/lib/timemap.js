function Timemap(dateObj) {
    'use strict';

    var dateObj = dateObj || new Date(),
    month = dateObj.getMonth(), // cus javascript starts month at 0
    day = dateObj.getDate(),
    dayOfWeek = dateObj.getDay(),
    year = dateObj.getFullYear(),
    time = dateObj.getTime(),
    hour = dateObj.getHours(),
    minutes = dateObj.getMinutes(),
    seconds = dateObj.getSeconds();

    var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    var days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    function format(str) {
        return str.replace(/Y/, year) // 2015
        .replace(/y/, year.toString().substr(2,3)) //15
        .replace(/mm/, month+1) //5, 9, 11
        .replace(/MM/, (month.toString().length > 1) ? month + 1 : '0'+(month+1)) // 05, 09, 11
        .replace(/M/, months[month]) // January, March, June
        .replace(/m/, months[month].toString().substr(0,3)) // Jan, Mar, Jun
        .replace(/dd/, day) // 1, 5, 20, 26
        .replace(/DD/, (day.toString().length > 1) ? day : '0'+day) // 01, 04, 15, 22
        .replace(/d/, days[dayOfWeek].toString().substr(0,3)) // Mon, Tue
        .replace(/D/, days[dayOfWeek]); // Monday, Tuesday
    }
    
    return {
        date: dateObj,
        format: format
    };
};

if(typeof module !== 'undefined' && module.exports) {
    module.exports = Timemap;
}
