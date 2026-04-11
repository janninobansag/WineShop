import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About WineShop</h1>
        <p>A passion for exceptional wine, delivered to you.</p>
      </div>

      <div className="about-content">
        <div className="about-story">
          <h2>Our Story</h2>
          <p>
            Founded in 2024, WineShop was born out of a simple desire: to make world-class wines accessible to everyone. 
            We travel to the rolling hills of Tuscany, the sun-drenched vineyards of Napa Valley, and the historic estates 
            of Bordeaux to bring you a curated selection that you won't find in your local supermarket.
          </p>
          <p>
            We believe that every bottle tells a story. Whether you are celebrating a special occasion, 
            pairing a meal with the perfect vintage, or simply unwinding after a long day, we have the perfect pour for you.
          </p>
        </div>

        <div className="about-values">
          <h2>Why Choose Us?</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>🍇 Curated Selection</h3>
              <p>Every wine in our collection is hand-picked by our expert sommeliers for its quality, taste, and story.</p>
            </div>
            <div className="value-card">
              <h3>✈️ Global Sourcing</h3>
              <p>We partner directly with family-owned vineyards across 15 different countries to bring the world to your doorstep.</p>
            </div>
            <div className="value-card">
              <h3>📦 Secure Packaging</h3>
              <p>Our bottles are packed in specialized shock-absorbent materials to ensure they arrive in pristine condition.</p>
            </div>
            <div className="value-card">
              <h3>🤝 Customer First</h3>
              <p>Have a question? Our dedicated wine experts are available 24/7 to help you find exactly what you're looking for.</p>
            </div>
          </div>
        </div>

        <Link to="/" className="auth-btn about-cta">Start Shopping</Link>
      </div>
    </div>
  );
};

export default About;