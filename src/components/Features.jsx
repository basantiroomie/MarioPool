import React from 'react';
import "../index.css"; // Ensure this is the correct path for your CSS

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="feature-grid"> {/* Updated class name to match CSS */}
        <div className="feature">
          <img src="/images/share3.webp" alt="Route Matching" width="300" height="150" />
          <h3>Route Matching</h3>
          <p>Get matched with the best routes for your commute.</p>
        </div>
        <div className="feature">
          <img src="/images/pre.png" alt="Incentives" width="250" height="150" />
          <h3>Incentives</h3>
          <p>Earn rewards and save money by carpooling.</p>
        </div>
        <div className="feature">
          <img src="/images/user.png" alt="User-Friendly Interface" width="150" height="100" />
          <h3>User-Friendly Interface</h3>
          <p>Easy to use with a seamless experience.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;