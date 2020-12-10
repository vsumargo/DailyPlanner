let m = moment(); //set m to current moment
let currentYear = m.year();
let currentMonth = m.month();
let currentDate = m.date();
let currentEventDate = "";
let dailyScheduleEvents = JSON.parse(localStorage.getItem('dailyScheduleEvents'));
if(dailyScheduleEvents === null){
    dailyScheduleEvents = [];
}

// function to create and plot the calendar
function displayCalendar(){
    let lastDateOfCurrentMonth = m.clone().endOf('month').date();
    let lastDateOfLastMonth = m.clone().subtract(1,'month').endOf('month').date();
    let dateBox = 42; //calendar date box number
    let firstDayofCurrentMonth = m.clone().startOf('month').day();
    let numberofDaysbeforeFirstDateOfCurrentMonth = 
        lastDateOfLastMonth - firstDayofCurrentMonth + 1;
    let numberofDaysAfterLastDateofCurrentMonth = 
        dateBox - lastDateOfCurrentMonth - firstDayofCurrentMonth;
    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    $('.month').text(months[m.month()]);
    $('.currentDate').text(m.format("dddd, MMMM Do YYYY" ));
    
    // for loop to plot the previous month date on the first line of the calendar
    for(let i = lastDateOfLastMonth; i >= numberofDaysbeforeFirstDateOfCurrentMonth ; i-- ){
        let newDiv = $('<div>').attr({
            'class' : 'prev-month-date',
            'value'    :   i   ,
        });
        newDiv.text(i);
        $('.calendarDate').append(newDiv);
    };

    // for loop to plot the current month date
    let eventAdded = JSON.parse(localStorage.getItem('dailyScheduleEvents'));
    if(eventAdded === null){
        eventAdded = [];
    }
    let newArrayofEvents = [];
    let newArrayofReminders = [];
    for(let j = 1 ; j <= lastDateOfCurrentMonth ; j++){
        // debugger;
        newArrayofEvents = [];
        newArrayofReminders = [];
        if(j === moment().date() && m.month() === moment().month()){
            let newDiv = $('<div>').attr({
                'class' : 'date',
                'id'    : 'today', 
                'value'    :   j   ,
            });
            newDiv.text(j);
            $('.calendarDate').append(newDiv);        
        }else{
            let newDiv = $('<div>').attr({
                'class' : 'date',
                'value'    :   j   ,
            });
            newDiv.text(j);
            $('.calendarDate').append(newDiv);
        }
        // display number of events in relation to the exact date of the events or reminder
        newArrayofEvents = eventAdded.filter(function(el){
            return el.year === currentYear && el.month === currentMonth && el.date === j && el.type === 'event'
        });
        if(newArrayofEvents.length !== 0){
        $(`div[class=date][value=${j}]`).append($('<div>').attr({'value':j, 'class':'event-summary'}).text(`${newArrayofEvents.length} Events`));   
        }
        // display number reminders in relation to the exact date of the events or reminder
        newArrayofReminders = eventAdded.filter(function(el){
            return el.year === currentYear && el.month === currentMonth && el.date === j && el.type === 'reminder'
        });
        if(newArrayofReminders.length !== 0){
        $(`div[class=date][value=${j}]`).append($('<div>').attr({'value':j, 'class':'reminder-summary'}).text(`${newArrayofReminders.length} Reminders`));
        }   
    }
    
    // for loop to plot the numbers for the next month date on the last line of the calendar
    for (let k = 1 ; k <= numberofDaysAfterLastDateofCurrentMonth ; k++ ){
        let newDiv = $('<div>').attr({
            'class' : 'next-month-date',
            'value'    :   k   ,
        });
        newDiv.text(k);
        $('.calendarDate').append(newDiv);
    }
}

// function to display Modal Pop Up when time block is clicked
function displayModal(){
    $('.schedule').removeAttr('style');
    $('.event-detail').removeAttr('style');
    let eventDetailTimevalue = event.currentTarget.getAttribute('value');
    currentEventDate = m.clone().set('hour', eventDetailTimevalue).set('m', 0).set('second',0);
    $('.selected-date-and-time').text(currentEventDate.format("dddd, MMMM Do YYYY @ HH:mm"));
    $('.modalEvent').attr('style','display:block');
    $('body').css({
        'background-color' : 'rgba(209, 208, 208, 0.8)',
        'z' : 1,
    });
    $(`p[value=${event.currentTarget.getAttribute('value')}]`).attr('style', 'background-color:rgb(142, 255, 151)');
        $(`[id=${event.currentTarget.getAttribute('value')}]`).attr('style', `border: 2px solid black;
        background-color:rgb(142, 255, 151);`);
}

// function to create and plot the Daily Planner time blocks
function renderDailySchedule(){
    let eventAdded = JSON.parse(localStorage.getItem('dailyScheduleEvents'));

    // create HTML elements for the time blocks
    for(let l = 0; l <= 23; l++){
        let newTimeDiv = $('<div>').attr({
            'class' : 'schedule',
            'id'    : l,
            'value' : l,
        });
        $('.dayScheduler').append(newTimeDiv);
        
        let span = $('<span>').attr({
            'class' : 'hourly-time'});
        if(l < 12 && l <10){
            span.text(`0${l} AM`);
            $(`div[id=${l}]`).append(span);
        }else if (l <12 && l > 9){
            span.text(`${l} AM`);
            $(`div[id=${l}]`).append(span);
        }else{
            span.text(`${l} PM`);
            $(`div[id=${l}]`).append(span);
        };


        let newParagraphEl = $('<p>').attr({
            'class' : 'event-detail',
            'value' : l,
            
        });
        $(`div[id=${l}]`).append(newParagraphEl);

        // for loop to load and plot the events or reminder saved on the time blocks
        // for loop to go through the array of the saved items in the localStorage
        for(let m = 0; m < dailyScheduleEvents.length; m++){
            let eventYear = eventAdded[m].year;
            let eventMonth= eventAdded[m].month;
            let eventDate = eventAdded[m].date;
            let eventTime = eventAdded[m].time;
            let eventType = eventAdded[m].type;
            let eventTitle = eventAdded[m].title;
            let eventNotes = eventAdded[m].note;
            
            if( l === eventTime && currentYear === eventYear && currentMonth === eventMonth &&
                currentDate === eventDate ){
                let title = $('<h5>').attr({
                    'class' : `event-title ${eventType}`,
                });
                title.text(eventTitle);
                $(`p[value=${l}]`).append(title);

                let notes = $('<h6>').attr({
                    'class' : `event-notes ${eventType}`,
                });
                notes.text(eventNotes);
                $(`p[value=${l}]`).append(notes);
            }
        }
    };

    // add click event listener to each time block the function insert event or reminder note
    $('.event-detail').on('click', function(event){
        console.log(event);
        displayModal();
    });
};


// function used to indicate the red line on the current time
let currentTime = moment().hour();
function currentTimeBox(){
    if(m.year() === moment().year() && m.month() === moment().month() && m.date() === moment().date()){ 
        $(`p[value=${currentTime}]`).attr('style', 'background-color:white');
        $(`[id=${currentTime}]`).attr('style', `border-top: 2px solid red;
        border-bottom: 2px solid red`);
    }
}

// add click event listener to the "left arrow" button to go to previous month calendar
$('#previousBtn').on('click', function(){
    m = m.subtract(1,"M");
    currentYear = m.year();
    currentMonth = m.month();
    $('.prev-month-date').remove();
    $('.next-month-date').remove();
    $('.date').remove();
    $('.today').remove();
    $('div[class=schedule]').remove();
    $('span[class=hourly-time]').remove();
    $('p[class=event-detail]').remove();
    $('h5[class=event-title]').remove();
    $('h6[class=event-notes]').remove();
    displayCalendar();
    renderDailySchedule();
    currentTimeBox();
});

// add click event listener to the "right arrow" button to go to next month calendar
$('#nextBtn').on('click', function(){
    m = m.add(1,'M');
    currentYear = m.year();
    currentMonth = m.month();  
    $('.prev-month-date').remove();
    $('.next-month-date').remove();
    $('.date').remove();
    $('.today').remove();
    $('div[class=schedule]').remove();
    $('span[class=hourly-time]').remove();
    $('p[class=event-detail]').remove();
    $('h5[class=event-title]').remove();
    $('h6[class=event-notes]').remove();
    displayCalendar();
    renderDailySchedule();
    currentTimeBox();
});

// add click event listener when clicking on the date box on the calendar
$('.calendarDate').on('click', function(event){
    let value = event.target.getAttribute('value');
    m = m.set('date', value);
    currentDate = m.date();
    $('.currentDate').text(m.format("dddd, MMMM Do YYYY" ));
    $('div[class=schedule]').remove();
    $('span[class=hourly-time]').remove();
    $('p[class=event-detail]').remove();
    $('h5[class=event-title]').remove();
    $('h6[class=event-notes]').remove();
    renderDailySchedule();
    currentTimeBox();
})

// run these functions on referesh or start up
displayCalendar();
renderDailySchedule();
currentTimeBox();

// add event listener to cross button to close the modal pop up
$('#closeBtn').on('click',function(event){
    console.log(event);
    $('.modalEvent').attr('style','display:none');
    $('body').css({
        'background-color' : 'white',
        'z' : 0,
    });
    $('.schedule').removeAttr('style');
    $('.event-detail').removeAttr('style');
    currentTimeBox();
})

// function when save button on Modal pop up is click
function saveEventButton(){
    let eventDetails = {
        year : currentEventDate.year(),
        month: currentEventDate.month(),
        date : currentEventDate.date(),
        time : currentEventDate.hour(),
        type : $('#event-type-list').val(),
        title: $('.add-title').val(),
        note: $('.add-notes').val(),
    };
    console.log(eventDetails);
    dailyScheduleEvents.push(eventDetails);
    localStorage.setItem('dailyScheduleEvents', JSON.stringify(dailyScheduleEvents));
    $('.modalEvent').attr('style','display:none');
    $('.prev-month-date').remove();
    $('.next-month-date').remove();
    $('.date').remove();
    $('.today').remove();
    $('div[class=schedule]').remove();
    $('span[class=hourly-time]').remove();
    $('p[class=event-detail]').remove();
    $('h5[class=event-title]').remove();
    $('h6[class=event-notes]').remove();
    renderDailySchedule();
    currentTimeBox();
    displayCalendar();
    $('.add-title').val("");
    $('.add-notes').val("");
    $('body').css({
        'background-color' : 'white',
        'z' : 0,
    });
    $('.schedule').removeAttr('style');
    $('.event-detail').removeAttr('style');
    currentTimeBox();
};

// add click event listener on the save button in the Modal pop up box
$('#save-event-button').on('click', function(event){
    event.preventDefault();
    console.log(event);
    if($('.add-title').val()===""){
        alert("Please Enter a Valid Title")
    }else if($('.add-title').val()!=="" && $('.add-notes').val()===""){
        $('.add-notes').val("-");
        saveEventButton();
    }
    else{
        saveEventButton();
    };
})



