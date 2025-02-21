import {initializeApp} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js"
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

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

//Button/Function: Takes in User information to register new account 
const submitSignup = document.getElementById('submit');
submitSignup.addEventListener("click",function(event) {
  event.preventDefault();

  //inputs 
  const name_first          = document.getElementById('nameF').value;
  const name_last           = document.getElementById('nameL').value;
  const email_Sign_Up       = document.getElementById('email').value;
  const password_Sign_Up    = document.getElementById('password').value;

  //Using inputs, create a new account for the user
  //Then go to the login page for user to login
  createUserWithEmailAndPassword(auth, email_Sign_Up, password_Sign_Up)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    const userData={
      email: email_Sign_Up, 
      name_F: name_first, 
      name_L: name_last
    };
    alert("Account Created");
    const docRef=doc(db, "users", user.uid); 
    setDoc(docRef, userData)
    .then(()=>{
      window.location.href='login.html'
    })
    .catch((error)=>{
      const errorMessage = error.message;
      alert(errorMessage);
    });
  })
  .catch((error) => {
    const errorMessage = error.message;
    alert(errorMessage);
  });

})

//Button/Function: Takes user to the login page
const swapToLogIn = document.getElementById('toLogIn');
swapToLogIn.addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href='login.html';
})