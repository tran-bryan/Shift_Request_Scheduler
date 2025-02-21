import {initializeApp} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js"
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

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
  
//Button/Function: Takes in user login credentials to login
const submitLogin = document.getElementById('submit');
submitLogin.addEventListener("click", function(event) {
  event.preventDefault();

  //inputs 
  const email_Login       = document.getElementById('email').value;
  const password_Login    = document.getElementById('password').value;

  //Using credentials, login the user
  signInWithEmailAndPassword(auth, email_Login, password_Login)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    alert("Account Logged In");
    localStorage.setItem('loggedUID', user.uid);
    window.location.href = 'display.html';
  })
  .catch((error) => {
    const errorMessage = error.message;
    alert(errorMessage);
  });
})

//Button/Function: Takes user to the signup page 
const swapToSignUp = document.getElementById('toSignUp');
swapToSignUp.addEventListener("click", function(event) {
  event.preventDefault();
  window.location.href = 'signup.html';
})