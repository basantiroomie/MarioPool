import React from 'react';


const Subscription = () => {
  return (
    <div className="subscription-container">
      <h1 className="title">Choose Your Subscription Plan</h1>
      <div className="plans">
        <div className="plan-card">
          <h2>6 Months</h2>
          <p>$50</p>
          <button className="subscribe-btn">Subscribe Now</button>
        </div>
        <div className="plan-card popular">
          <h2>1 Year</h2>
          <p>$90</p>
          <span className="badge">Most Popular</span>
          <button className="subscribe-btn">Subscribe Now</button>
        </div>
        <div className="plan-card">
          <h2>5 Years</h2>
          <p>$400</p>
          <button className="subscribe-btn">Subscribe Now</button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;