// src/components/VerifyEmail.jsx

import { useAuth } from '../context/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../App.css'; // Or a dedicated CSS file

const VerifyEmail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResendEmail = async () => {
    if (!user) {
      setError("You are not logged in. Please sign up or log in again.");
      return;
    }
    try {
      await sendEmailVerification(user);
      setMessage("A new verification email has been sent. Please check your inbox (and spam folder).");
      setError('');
    } catch (err) {
      setError("Failed to send verification email. Please try again later.");
      setMessage('');
    }
  };

  return (
    <div className="login-container dark">
      <div className="login-form dark">
        <h2>Verify Your Email ✅</h2>
        <p>
          A verification link has been sent to your email address: <strong>{user?.email}</strong>
        </p>
        <p>
          Please click the link in the email to activate your account. You will not be able to log in until your email is verified.
        </p>
        <button onClick={handleResendEmail}>
          Resend Verification Email
        </button>
        <button onClick={() => navigate('/login')} style={{ marginTop: '10px' }}>
          Back to Login
        </button>
        {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;