import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, getDoc, setDoc, addDoc, collection, getDocs, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCvYmwgv2HiWBC3woSwJBe9KjQcS4SbP1I",
    authDomain: "anesthesiologist-scheduler.firebaseapp.com",
    projectId: "anesthesiologist-scheduler",
    storageBucket: "anesthesiologist-scheduler.appspot.com",
    messagingSenderId: "301504784764",
    appId: "1:301504784764:web:83c217b107332837d2dcf9",
    measurementId: "G-2EY4JLCD29"
}; 

// initialize firebase 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db=getFirestore();

//Variables to store user info for display
let userFName = "";
let userLName = "";

//Displaying User Information for User
onAuthStateChanged(auth, (user)=>{
    const loggedUID=localStorage.getItem('loggedUID'); 
    if(loggedUID){
        console.log(user);
        const docRef = doc(db, "users", loggedUID); 
        getDoc(docRef)
        .then((docSnap)=>{
            if(docSnap.exists()){
                const userData=docSnap.data();
                userFName = userData.name_F;
                userLName = userData.name_L;
                document.getElementById('loggedUserFName').innerText=userFName;
                document.getElementById('loggedUserEmail').innerText=userData.email;
                document.getElementById('loggedUserLName').innerText=userLName;
            }
            else{
                console.log("no document found matching id")
            }
        })
        .catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage)
        })
    }
    else{
        console.log("User Id not Found in Local storage")
    }
})

//Logout action
const logoutButton=document.getElementById('logout');

logoutButton.addEventListener('click', ()=>{
    localStorage.removeItem('loggedUID');
    signOut(auth)
    .then(()=>{
        window.location.href="login.html";
    })
    .catch((error)=>{
        //const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    })
})





/**
 * initialize calendar
 * prevMonth
 * nextMonth
 * various button event listeners 
 * gotodate 
 * save event to database 
 * get events from database 
 * remove event from database 
 * --> buttons that create events for request off or request on 
 * --> request pending, request cancel, Admin--> request denied
 * --> other users, accept request swap 
 */

//Series of variables connecting ot the HTML classes
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".currMonth"),
  prev = document.querySelector(".prevMonth"),
  daysContainer = document.querySelector(".days"),
  next = document.querySelector(".nextMonth"),
  todayBtn = document.querySelector(".today-btn"),
  dateInput = document.querySelector(".month-input"),
  gotoBtn = document.querySelector(".goto-btn"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  reqOffBTN = document.querySelector(".request-off"),
  eventsContainer = document.querySelector(".events"),
  reqOnBTN = document.querySelector(".request-on");


//Variables to display the chosen day on Calendar
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
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

//Array to hold the set of requests for that day
const requestsMap = [];
//console.log(requestsMap);

//Function: 
// add days in days with class day 
// and prev-date next-date on previous month and next month days 
// and active (selected date) day on today
function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;
  
    date.innerHTML = months[month] + " " + year;
  
    let days = "";

    //This for loop loads up the previous month's days to fill up the prev set
    for (let x = day; x > 0; x--) {
      days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    //This for loop loads up the current month's days to fill up the current set
    for (let i = 1; i <= lastDate; i++) {
      days += `<div class="day curr-date">${i}</div>`;
    }

    //This for loop loads up the next month's days to fill up the next set
    for (let j = 1; j <= nextDays; j++) {
      days += `<div class="day next-date">${j}</div>`;
    }

    daysContainer.innerHTML = days;
    addListner();
  }

//Function: decrement month to go to previous month
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

//Function: increment month to go to next month
function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

//Button Listeners for going to previous or next month on prev or next buttons on Calendar
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);
  
initCalendar();

//Function: add active on day
//Note: Clicking on a date for selecting date will only work for the current month
//Dates within the previous or next month will not be able to be selected
function addListner() {
  const days = document.querySelectorAll(".day.curr-date");
  days.forEach((day) => {
    day.addEventListener("click", async (e) => {
      getActiveDay(e.target.innerHTML);
      console.log("addListener's showing activeDate", activeDate);
      await getRequests();
      console.log("addListener's show requestsMap: ", requestsMap)
      updateRequests();
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      e.target.classList.add("active");
    });
  });
}


//Clicking Today Button will go back to current (today) date (Day, Month, Year)
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

//Function: Uses Date input to go to selected date (Day, Month, Year)
function gotoDate() {
  console.log("printing input date: ", dateInput.value.split('-')); 
  let mMyY = dateInput.value.split('-'); //split it into months and years 
  let yY=Number(mMyY[0]); //aquire year and make it into number 
  let mM=Number(mMyY[1]); //aquire month and make it into number 
  month = mM - 1; //subtract to adjust to monthes array
  year = yY; 
  initCalendar()
}

//Button Listener for going to inputted date
gotoBtn.addEventListener("click",gotoDate);

//Function: get the active day's "day name" and date 
// then update eventday and eventdate
let activeDate;
function getActiveDay(date) {
  const day = new Date(year, month, date);
  activeDate = day; 
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//Function to show the requests on selected(active) day
function updateRequests() { 
  let requests = ""; 
  //Get Requests Handles getting the requests from database into requestsMap 
  //If there is no requests in requestsMap (length == 0), show no events
  if (requestsMap.length == 0) {
    requests = `<div class="no-event">
              <h3>No Events</h3>
              </div>`;
  }
  else { 
    //Else: there is at least 1 request on this day 
    //then we iterate through the requests for the specified day 
    //and then show those events
    requestsMap.forEach((element) => {
      requests += `<div class="event">
            <div class="name">
              <i class="fas fa-circle"></i>
              <h3 class="request-name">${element.user}</h3>
            </div>
            <div class="event-type">
              <span class="request-type">${element.request}</span>
            </div>
        </div>`;
    });
  }
  eventsContainer.innerHTML = requests;
}

/**
 * Description of Firebase Database Hierarchy for Requests
 * Collection: "requests"
 *  Document: request | Document names are the string form of a date
 *    Collection: "Requests" 
 *      Document: Requests | Document names are the names of different Users 
 *        Values: 
 *          request: either "on" or "off" represent request to "take on shift" or "day off"
 *          user: == name of user 
 */

//Function: Add user's request to the database for the active (selected) date
async function addRequest(reqType) {
  //Formation for values of user's shift request
  const newReq = {
    user: userFName + ' ' + userLName,
    request: reqType,
  }; 

  //Go to requests collection for the specified date and input the user's shift requests for that day
  //innately: a single user can only do 1 request, 
  //  multiple requests (including confliction: by doing "off" request then "on" request or vice versa) 
  //  will only set user request to the latest request
  const docRef = doc(db, "requests", activeDate.toString(), "Requests", userFName + ' ' + userLName); 
  setDoc(docRef, newReq)
  .then(()=> { alert("Shift Request successfully made."); })
  .catch((error) => { alert(error.message); });

  await getRequests();
  updateRequests();
}

//Button Listener for adding User's shift request
reqOffBTN.addEventListener("click", function () { addRequest("off"); }); 
reqOnBTN.addEventListener("click",  function () { addRequest("on"); }); 

/**
 * from the addRequest: 
 * newReq is what we want to add in 
 * const docRef=doc(db, "requests", THEDATE, "testing?"); 
 * setDoc(docRef, newReq)
 * .then(()=> { alert("request successfully made"); })
 * .catch((error) => { alert(error.message); })
 * 
 */



//Function: Get the list of user shift requests on the active (selected) date 
//  and put them into requestsMap for displaying (via updateRequests)
async function getRequests() {
  //Gets the collection respective to the active (selected) date
  const colRef = await getDocs(collection(db, "requests", activeDate.toString(), "Requests"));

  //Resets the entire requests map: 
  //  Firsts empties the requestsMap
  //  Then gets all user requests from colRef add them there 
  while(requestsMap.length > 0) { requestsMap.pop(); }
  colRef.forEach((doc) => {
    requestsMap.push({ ...doc.data() });
  });
}
getRequests()