// ============================================
// Firebase Configuration
// استبدل هذه البيانات ببيانات مشروعك الحقيقي
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyBilJQnyNKclAp5CP7oNKNqexEuwvHYVak",
    authDomain: "ayman-portfolio-a59f5.firebaseapp.com",
    projectId: "ayman-portfolio-a59f5",
    storageBucket: "ayman-portfolio-a59f5.firebasestorage.app",
    messagingSenderId: "184230361489",
    appId: "1:184230361489:web:7a2133c67dd4348d670230"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Services (conditional - not all pages load all SDKs)
const db = firebase.firestore();
const auth = typeof firebase.auth === 'function' ? firebase.auth() : null;
const storage = typeof firebase.storage === 'function' ? firebase.storage() : null;

// Auth State Observer
function onAuthStateChanged(callback) {
    if (auth) return auth.onAuthStateChanged(callback);
}

// Sign In
async function signIn(email, password) {
    if (auth) return auth.signInWithEmailAndPassword(email, password);
}

// Sign Out
async function signOut() {
    if (auth) return auth.signOut();
}
