import React, { useState } from 'react';
import './ResetPass.css';
import logo from '../../assets/images/logo.png';
import featuresImage from '../../assets/images/Features.png';
import characterImage from  '../../assets/images/Character.png';
import deviceImage from '../../assets/images/Device.png';
import policyImage from '../../assets/images/Policy.png';
import { Link } from 'react-router-dom';

const ResetPass = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Simple validation example
    if (!email) {
      validationErrors.email = "*Email is required";
    }

    if (Object.keys(validationErrors).length === 0) {
      // Proceed with form submission
      console.log('Form submitted');
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="resetPass">
      <div className='first-half'>
        <div className='logo-heading'>
          <img className='logo' src={logo} alt="logo" />
          <h1 className='heading'>Budget Tracker</h1>
        </div>
        <div className="resetpass-container">
          <h1>Reset Password</h1>
          <p>Enter your email for a reset link.</p>
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
            <button type="submit" className="resetpass-button">Send Reset Password Link</button>
          </form>
          <h3 className="login-text">
            Don’t have an account? <Link to="/SignUp">Sign Up</Link>
          </h3>
        </div>
      </div>
      <div className='second-half'>
        <img className="features-img" src={featuresImage} alt="featuresImage" />
        <img className="character-img" src={characterImage} alt="characterImage" />
        <img className="device-img" src={deviceImage} alt="deviceImage" />
        <img className="policy-img" src={policyImage} alt="policyImage" />
      </div>
    </div>
  );
};

export default ResetPass;
