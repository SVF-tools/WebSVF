
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC8Yufy9Z69MaeXbnmFLX8SOu51ZpyWkTA",
  authDomain: "web-test-email.firebaseapp.com",
  databaseURL: "https://web-test-email.firebaseio.com",
  projectId: "web-test-email",
  storageBucket: "web-test-email.appspot.com",
  messagingSenderId: "709401871584",
  appId: "1:709401871584:web:a9a1108f3530e3b9c67c85"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference signup-email collection
var messagesRef = firebase.database().ref('signup-email');

// Listen for form submit
document.getElementById("signupform").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  // Get EmailID
  var email = getInputVal("header-email");

  //console.log(email);

  // Save message
  saveMessage(email);

  // Show alert
  document.getElementById("alertsignup").style.display = 'block';

  var delayInMilliseconds = 2000; //2 seconds

  setTimeout(function() {
    window.open( 
        "http://13.55.161.159:8080", "_blank");
  }, delayInMilliseconds);

  // Hide alert after 3 seconds
  setTimeout(function(){
    document.getElementById("alertsignup").style.display = 'none';
  },45000);//45 Seconds
  
}

// Function to get get form values
function getInputVal(id) {
  return document.getElementById(id).value;
}

// Save message to firebase
function saveMessage(email){
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
      email:email
    });
  }
