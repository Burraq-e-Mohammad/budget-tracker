import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';
import logo from '../../assets/images/logo.png';
import SignInImage from '../../assets/images/SignIn.png';
import eyeImage from '../../assets/images/eye.png';
import envelopeImage from '../../assets/images/envelope.png';
import unionImage from '../../assets/images/Union.png';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = '*Email is required';
    if (!password) newErrors.password = '*Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:4000/api/users/SignIn', {
        email,
        password,
      });

      console.log(response.data); // Log response data
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        setErrors({});
        navigate('/dashboard');
      } else {
        setErrors({ form: '*Invalid email or password' });
      }
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
      } else {
        console.error("Error Message:", error.message);
      }
      setErrors({ form: '*Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signIn">
      <div className='first-half'>
        <div className='logo-heading'>
          <img className='logo' src={logo} alt="logo" />
          <h1 className='heading'>Budget Tracker</h1>
        </div>
        <div className="signin-container">
          <h1>Welcome Back!</h1>
          <p>Sign in to continue to Budget Tracker</p>
          <form className="form" onSubmit={handleSubmit}>
            <h5 className='email'>Email</h5>
            <input
              className='input-3'
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <h3 className="error-message">{errors.email}</h3>}
            {errors.form && <h3 className="error-message">{errors.form}</h3>}
            <span className="icon-01-si">
              <img src={envelopeImage} alt="" />
            </span>
            <h5 className='password'>Password</h5>
            <input
              className='input-4'
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <h3 className="error-message">{errors.password}</h3>}
            <span className="icon-02-si">
              <img src={eyeImage} alt="" />
            </span>
            <div className="check-box">
              <input className='check' type="checkbox" />
              <h3 className='cb-text'>Remember me</h3>
              <h3 className="cb-text-02">
                <Link to="/ResetPass">Forgot Password?</Link>
              </h3>
            </div>
            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? 'Signing In...' : 'SIGN IN'}
            </button>
          </form>
          <h3 className="login-text">
            Don’t have an account? <Link to="/SignUp">Sign Up</Link>
          </h3>
        </div>
      </div>
      <div className='second-half'>
        <img className="signIn-img" src={SignInImage} alt="SignIn image" />
        <img className='union-image' src={unionImage} alt="" />
      </div>
    </div>
  );
};

export default SignIn;
