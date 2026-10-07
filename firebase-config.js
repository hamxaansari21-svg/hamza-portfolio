
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMzJ5TizBhP4mbRneyrPw9WjtaVVGwevg",
  authDomain: "hamza-portfolio-837c1.firebaseapp.com",
  projectId: "hamza-portfolio-837c1",
  storageBucket: "hamza-portfolio-837c1.firebasestorage.app",
  messagingSenderId: "79266016805",
  appId: "1:79266016805:web:605145da3fd71c721a19cc"
};

const app = initializeApp(firebaseConfig);

export { app };