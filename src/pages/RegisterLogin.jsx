import React from 'react';

const RegisterLogin = () => {
  return (
    <div>
      <h2>Sign Up or Login</h2>
      <form className="register-form">
        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="text" placeholder="Home Address" />
        <select>
          <option>Choose your company</option>
          <option>Company A</option>
          <option>Company B</option>
        </select>
        <label>
          <input type="checkbox" /> I agree to the terms and conditions
        </label>
        <button type="submit">Register</button>
      </form>
      <form className="login-form">
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
        <a href="#reset-password">Forgot password?</a>
      </form>
    </div>
  );
};

export default RegisterLogin;
