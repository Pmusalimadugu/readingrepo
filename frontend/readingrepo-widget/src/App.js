import React, { useEffect, useState } from 'react';
import './App.css';
// Import firebase components
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider  } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAR12TN1sRzz9uGzFhgEt7TctNrGMC90Q0",
  authDomain: "readingrepo-f6ca9.firebaseapp.com",
  projectId: "readingrepo-f6ca9",
  storageBucket: "readingrepo-f6ca9.appspot.com",
  messagingSenderId: "159221877726",
  appId: "1:159221877726:web:f257cfbc6a826ad9f96b4f",
  measurementId: "G-MM4JPG7SQP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);


//main app function
function App() {

  // null if not logged in, data otherwise
  const [user] = useAuthState(auth);

  return (
    <div className="readingrepo-widget">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}
function SignIn() {

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Yo yo you should log in bro</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  return (
    <>
      <p>Logged in! I think 🙏</p>
    </>
  )
}

export default App;