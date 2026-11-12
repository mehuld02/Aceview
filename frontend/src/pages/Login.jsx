import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'; // <-- IMPORT getDoc
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  sendEmailVerification
} from 'firebase/auth';
import { useState, useEffect } from 'react';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.emailVerified) {
      console.log('User is already logged in and verified. Redirecting...');
      navigate('/'); 
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        // --- SIGN UP LOGIC ---
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          createdAt: serverTimestamp(),
          bio: "",
          location: ""
        });
        setMessage('Registration successful! A verification email has been sent. Please check your inbox.');
      } else {
        // --- LOGIN LOGIC ---
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        if (!userCredential.user.emailVerified) {
          setError('Please verify your email address before logging in. An email was sent to your inbox upon registration.');
          setLoading(false); // Stop loading before returning
          return; 
        }
        
        // Check if the user's profile is complete
        const userDocRef = doc(db, "users", userCredential.user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (!userData.bio || !userData.location) {
            navigate('/profile'); // Incomplete profile
          } else {
            navigate('/'); // Complete profile
          }
        } else {
          console.error("No user document found in Firestore!");
          navigate('/profile'); // Send to profile page as a fallback
        }
      }
    } catch (err) {
      // ... (error handling)
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const additionalInfo = getAdditionalUserInfo(result);
      
      if (additionalInfo?.isNewUser) {
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: serverTimestamp(),
          bio: "",
          location: ""
        });
        // New users from Google should be sent to complete their profile
        navigate('/profile');
      } else {
        // Existing user, check if their profile is complete
        const userDocRef = doc(db, "users", result.user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (!userData.bio || !userData.location) {
            navigate('/profile'); // Incomplete profile
          } else {
            navigate('/'); // Complete profile
          }
        } else {
            console.error("No user document found in Firestore!");
            navigate('/profile'); // Send to profile page as a fallback
        }
      }
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // ... (rest of the JSX return statement is unchanged)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">{isSignUp ? 'Create Your Account' : 'Welcome Back'}</h2>
        
        {error && <p className="p-3 text-sm text-center text-white bg-red-500 rounded-md">{error}</p>}
        {message && <p className="p-3 text-sm text-center text-white bg-green-500 rounded-md">{message}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-500"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-400 bg-gray-800">or</span>
          </div>
        </div>

        <button 
          type="button" 
          disabled={loading}
          className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-black bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white disabled:opacity-50" 
          onClick={handleGoogleSignIn}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span>{isSignUp ? 'Sign up with Google' : 'Sign in with Google'}</span>
        </button>
        
        <div className="text-sm text-center text-gray-400">
          <span>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            type="button"
            className="ml-1 font-medium text-blue-500 hover:underline"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setMessage('');
            }}
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;