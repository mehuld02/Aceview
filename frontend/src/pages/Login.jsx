import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // (Add real auth check here if needed)
    login();
    navigate('/profile');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* your input fields */}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login