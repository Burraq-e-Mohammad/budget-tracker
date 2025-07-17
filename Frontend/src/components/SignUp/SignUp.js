import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';
import logo from '../../assets/images/logo.png';
import SignUpImage from '../../assets/images/SignUp.png';
import eyeImage from '../../assets/images/eye.png';
import envelopeImage from '../../assets/images/envelope.png';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = '*First Name is required';
    if (!lastName) newErrors.lastName = '*Last Name is required';
    if (!email) newErrors.email = '*Email is required';
    if (!password) newErrors.password = '*Password is required';
    if (password !== confirmPassword) newErrors.confirmPassword = '*Passwords do not match';
    if (!amount) newErrors.amount = '*Amount is required';
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
      const response = await axios.post('http://localhost:4000/api/users/SignUp', {
        firstName,
        lastName,
        email,
        password,
        amount,
      });
      console.log(response.data); // Log response data for debugging
      alert(response.data.message); // Show success message
      navigate('/SignIn'); // Redirect to SignIn page
    } catch (error) {
      console.error('Sign-up error:', error.response ? error.response.data : error.message);
      setErrors({ form: '*Error signing up. Please try again.' });
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="signUp">
      <div className='first-half'>
        <div className='logo-heading'>
          <img className='logo' src={logo} alt="logo" />
          <h1 className='heading'>Budget Tracker</h1>
        </div>
        <div className="signup-container">
          <h1>Sign Up</h1>
          <p>Welcome to our community</p>
          <form className="form" onSubmit={handleSubmit}>
            <div className='input-1-2-container'>
              <div>
                <h5 className='first-name'>First Name</h5>
                <input
                  className='input-1'
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && <h3 className="error-message">{errors.firstName}</h3>}
              </div>
              <div>
                <h5 className='last-name'>Last Name</h5>
                <input
                  className='input-2'
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && <h3 className="error-message">{errors.lastName}</h3>}
              </div>
            </div>
            <h5 className='email'>Email</h5>
            <input
              className='input-3'
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <h3 className="error-message">{errors.email}</h3>}
            <span className="icon-01-su"><img src={envelopeImage} alt="" /></span>
            <h5 className='password'>Password</h5>
            <input
              className='input-4'
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <h3 className="error-message">{errors.password}</h3>}
            <span className="icon-02-su"><img src={eyeImage} alt="" /></span>
            <h5 className='confirm-password'>Confirm Password</h5>
            <input
              className='input-5'
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <h3 className="error-message">{errors.confirmPassword}</h3>}
            <span className="icon-03-su"><img src={eyeImage} alt="" /></span>
            <h5 className='budget-limit'>Budget Limit</h5>
            <input
              className='input-6'
              type="text"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {errors.amount && <h3 className="error-message">{errors.amount}</h3>}
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Signing Up...' : 'SIGN UP'}
            </button>
          </form>
          <h3 className="login-text">
            Already have an account? <Link to="/SignIn">Log in</Link>
          </h3>
        </div>
      </div>
      <div className='second-half'>
        <img className="signUp-img" src={SignUpImage} alt="SignUp image" />
      </div>
    </div>
  );
};

export default SignUp;
