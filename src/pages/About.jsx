import React from 'react';
import "../index.css"; // Assuming you're adding custom styles in a separate CSS file

const About = () => {
  return (
    <div className="about-container">
      <section className="about-section">
        <h1>About MarioPool</h1>
        <p>
          MarioPool is a revolutionary platform that connects drivers and passengers, allowing them to share rides and reduce travel costs. We focus on creating eco-friendly solutions by reducing the number of vehicles on the road, thus contributing to significant CO2 reduction.
        </p>
      </section>

      <section className="carpooling-section">
        <h2>Find a Ride, Share a Ride</h2>
        <p>
          MarioPool makes it easy for corporate teams and MNCs to offer carpooling rides, ensuring safety, convenience, and cost savings. By connecting employees for shared rides, we help companies promote eco-friendly commuting practices while reducing travel expenses and carbon footprints. Whether it's for daily commutes or corporate events, MarioPool is your partner in creating a sustainable travel culture.
        </p>
      </section>

      <section className="eco-friendly-section">
        <h2>Eco-Friendly Travel</h2>
        <p>
          By joining MarioPool, you're making a conscious decision to help the environment. Carpooling with MarioPool leads to fewer cars on the road, reducing harmful CO2 emissions and making our planet a better place for future generations.
        </p>
      </section>

      <section className="corporate-assistance-section">
        <h2>Corporate Carpooling Assistance</h2>
        <p>
          We also offer tailored carpooling solutions for businesses. Our corporate carpooling plans help companies reduce their environmental impact, promote sustainable commuting, and offer incentives for employees to ride together. Contact us to learn how MarioPool can help your organization go green.
        </p>
      </section>

      <section className="team-section">
        <h2>Makers of MarioPool</h2>
        <div className="team-grid">
          <div className="team-member">
            <h3>Megha Prasad</h3>
            <p>Lead Developer</p>
          </div>
          <div className="team-member">
            <h3>A Kirti Kumari</h3>
            <p>Frontend Developer</p>
          </div>
          <div className="team-member">
            <h3>Tanu Shree Kumawat</h3>
            <p>Backend Developer</p>
          </div>
          <div className="team-member">
            <h3>Disha K</h3>
            <p>Product Developer</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;