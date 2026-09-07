// GET HTML ELEMENTS

const today = document.getElementById("today");

const resetBtn = document.getElementById("resetBtn");

const taskProgress =
    document.getElementById("taskProgress");

const taskBar =
    document.getElementById("taskBar");

const habitProgress =
    document.getElementById("habitProgress");

const habitBar =
    document.getElementById("habitBar");

const waterTotal =
    document.getElementById("waterTotal");

const waterBtn =
    document.getElementById("waterBtn");

const calorieTotal =
    document.getElementById("calorieTotal");

const calorieInput =
    document.getElementById("calorieInput");

const calorieBtn =
    document.getElementById("calorieBtn");

const timerTask =
    document.getElementById("timerTask");

const timer =
    document.getElementById("timer");

const timerBtn =
    document.getElementById("timerBtn");

const timerReset =
    document.getElementById("timerReset");

const timerMessage =
    document.getElementById("timerMessage");

const activityGraph =
    document.getElementById("activityGraph");

const summaryTasks =
    document.getElementById("summaryTasks");

const summaryHabits =
    document.getElementById("summaryHabits");

const summaryWater =
    document.getElementById("summaryWater");

const summarySleep =
    document.getElementById("summarySleep");


// DEFAULT DATA

const defaults = {

    tasks: [
        {
            id: 1,
            text: "Morning walk",
            done: false
        },

        {
            id: 2,
            text: "Plan healthy meals",
            done: false
        }
    ],

    habits: [
        {
            id: 1,
            text: "1K steps",
            category: "Fitness",
            done: false
        },

        {
            id: 2,
            text: "10 min meditation",
            category: "Mental Wellness",
            done: false
        }
    ],

    water: 0,

    calories: 0,

    sleep: [],

    activity: [],

    savedQuotes: []

};

// LOAD DATA FROM LOCAL STORAGE

let data =
    JSON.parse(
        localStorage.getItem("fitTrackData")
    ) || defaults;

// SAVE DATA

function save() {

    localStorage.setItem(
        "fitTrackData",
        JSON.stringify(data)
    );

}


// SHOW TODAY'S DATE

function showToday() {

    const currentDate = new Date();

    today.textContent =
        currentDate.toLocaleDateString(
            undefined,
            {
                weekday: "long",
                month: "long",
                day: "numeric"
            }
        );

}


// CALCULATE PERCENTAGE

function calculatePercentage(items) {

    if (items.length === 0) {

        return 0;

    }


    const completed =
        items.filter(function(item) {

            return item.done === true;

        }).length;


    return Math.round(
        (completed / items.length) * 100
    );

}


// UPDATE DASHBOARD STATISTICS

function renderStats() {

    // TASK PROGRESS
    
    const taskPercentage =
        calculatePercentage(data.tasks);


    taskProgress.textContent =
        taskPercentage + "%";


    taskBar.style.width =
        taskPercentage + "%";


        // HABIT PROGRESS
    
    const habitPercentage =
        calculatePercentage(data.habits);


    habitProgress.textContent =
        habitPercentage + "%";


    habitBar.style.width =
        habitPercentage + "%";


        // WATER
    
    waterTotal.textContent =
        data.water + " ml";


    summaryWater.textContent =
        data.water + " ml";


        // CALORIES
    
    calorieTotal.textContent =
        data.calories + " kcal";


        // TASK SUMMARY
    
    const completedTasks =
        data.tasks.filter(function(task) {

            return task.done === true;

        }).length;


    summaryTasks.textContent =
        completedTasks;


        // HABIT SUMMARY
    
    const completedHabits =
        data.habits.filter(function(habit) {

            return habit.done === true;

        }).length;


    summaryHabits.textContent =
        completedHabits;


        // SLEEP SUMMARY
    
    if (data.sleep.length > 0) {

        const totalSleep =
            data.sleep.reduce(
                function(total, hours) {

                    return total + hours;

                },
                0
            );


        const averageSleep =
            (
                totalSleep / data.sleep.length
            ).toFixed(1);


        summarySleep.textContent =
            averageSleep + " h";

    } else {

        summarySleep.textContent =
            "0 h";

    }


    // --------------------------------------
    // ACTIVITY GRAPH
    // --------------------------------------

    activityGraph.innerHTML = "";


    for (let i = 0; i < 28; i++) {

        const square =
            document.createElement("i");


        if (data.activity[i] > 1) {

            square.className = "high";

        } else if (data.activity[i]) {

            square.className = "low";

        }


        activityGraph.appendChild(square);

    }

}


// ==========================================
// ADD WATER
// ==========================================

waterBtn.onclick = function() {

    data.water += 250;

    save();

    renderStats();

};


// ==========================================
// ADD CALORIES
// ==========================================

calorieBtn.onclick = function() {

    const calories =
        Number(calorieInput.value) || 0;


    data.calories += calories;


    calorieInput.value = "";


    save();

    renderStats();

};


// ==========================================
// RESET TODAY'S WATER AND CALORIES
// ==========================================

resetBtn.onclick = function() {

    const confirmReset =
        confirm(
            "Reset today’s water and calories?"
        );


    if (confirmReset) {

        data.water = 0;

        data.calories = 0;


        save();

        renderStats();

    }

};


// ==========================================
// TIMER VARIABLES
// ==========================================

let seconds = 1500;

let timerId = null;


// ==========================================
// DISPLAY TIMER
// ==========================================

function renderTimer() {

    const minutes =
        Math.floor(seconds / 60);


    const remainingSeconds =
        seconds % 60;


    timer.textContent =
        minutes +
        ":" +
        String(remainingSeconds).padStart(2, "0");

}


// ==========================================
// START / PAUSE TIMER
// ==========================================

timerBtn.onclick = function() {

    // --------------------------------------
    // PAUSE TIMER
    // --------------------------------------

    if (timerId) {

        clearInterval(timerId);

        timerId = null;


        timerBtn.textContent =
            "Resume focus";


        return;

    }


    // --------------------------------------
    // START TIMER
    // --------------------------------------

    timerBtn.textContent =
        "Pause";


    timerId =
        setInterval(function() {

            seconds--;

            renderTimer();


            // Timer finished

            if (seconds === 0) {

                clearInterval(timerId);

                timerId = null;


                timerBtn.textContent =
                    "Start focus";


                timerMessage.textContent =
                    "Great work! Your focus session is complete.";

            }

        }, 1000);

};


// ==========================================
// RESET TIMER
// ==========================================

timerReset.onclick = function() {

    clearInterval(timerId);

    timerId = null;


    seconds = 1500;


    renderTimer();


    timerBtn.textContent =
        "Start focus";


    timerMessage.textContent = "";

};


// ==========================================
// INITIAL PAGE LOAD
// ==========================================

showToday();

renderStats();

renderTimer();
