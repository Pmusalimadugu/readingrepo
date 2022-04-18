import React, { useEffect, useRef, useState } from 'react';
import './App.css';
// Import firebase components
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, serverTimestamp, doc, setDoc, addDoc} from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import axios from 'axios';

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
  console.log(user);
  return (
    <div className="readingrepo-widget">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <LandingPage /> : <SignIn />}
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


function LandingPage() {

  return (<>
  
    <section>
        {<Library />}
    </section>
    <section>
        {<ChatRoom />}
    </section>
    <section>
        {<Search />}
    </section>
    </>)
}

function Library() {
  const booksRef = collection(firestore, 'books');
  const q = query(booksRef, orderBy('createdAt'), limit(5));
  const [books] = useCollectionData(q, {idField: 'id'});

  return (<>
    <main>
      {books && books.map(book => <Book key={book.id} message={book} />)}
    </main>
  </>)
}

function Book(props) {
  const { text, id } = props.message;

  return (
    <>
      <p>{text}</p>
    </>
    
  )
}

function Book1(props) {
  const book = props.message;

  return (
    <>
      <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.title}/>
    </>
    
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = collection(firestore, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(5));

  const [messages] = useCollectionData(q, {idField: 'id'});

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    const msgData = {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    }
    
    await addDoc(collection(firestore, 'messages'), msgData);
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="user profile" />
      <p>{text}</p>
    </div>
  </>)
}

function Search() {
  const [formValue, setFormValue] = useState('');
  const [books, setBooks] = useState([]);


  const searchBooks = async (e) => {
    e.preventDefault();
    axios.get('https://www.googleapis.com/books/v1/volumes?q=' + formValue + '&maxResults=10')
      .then(function (response) {
        console.log(response.data.items);
        setBooks(response.data.items);
        
      });
    setFormValue('');

  }

  return (<>
    <form onSubmit={searchBooks}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="search for a book" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>

    <main>
      {books && books.map(book => <Book1 key={book.id} message={book} />)}
    </main>
  </>)
}


export default App;