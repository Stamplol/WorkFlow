import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAGpNQEF7OTyEXwB1Y1Oq_vJCwqlitgwkc",
  authDomain: "workflow-92b7a.firebaseapp.com",
  projectId: "workflow-92b7a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

window.login = function() {
  signInWithPopup(auth, provider).then(result => {
    localStorage.setItem("email", result.user.email);
    window.location = "app.html";
  });
}