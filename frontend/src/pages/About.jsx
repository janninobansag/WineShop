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
  <h2>About This Project</h2>
  <p>
    WineShop is a school project developed for educational purposes only. This website was created as a partial 
    requirement for our course, demonstrating our skills in full-stack web development using the MERN stack 
    (MongoDB, Express.js, React, and Node.js).
  </p>
  <p>
    This project showcases an e-commerce platform for wine sales, featuring user authentication, product 
    management, shopping cart functionality, order processing, inventory management, and admin dashboard. 
    All wines and images used are for demonstration purposes only.
  </p>
</div>

<div className="about-values">
  <h2>Our Team</h2>
  <div className="values-grid">
    <div className="value-card">
      <h3>Aki Sato Katto</h3>
      <p>3rd Year Student</p>
      
    </div>
     <div className="value-card">
      <h3>Jan Niño Andrie M. Bansag</h3>
      <p>3rd Year Student</p>
      <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>Full Stack Developer</p>
    </div>
    <div className="value-card">
      <h3>Kimuelle Daño</h3>
      <p>3rd Year Student</p>
      
    </div>
   
    <div className="value-card">
      <h3>Richard</h3>
      <p>3rd Year Student</p>
      
    </div>
  </div>
</div>

<div className="about-cta" style={{ marginTop: '2rem', textAlign: 'center' }}>
  <p style={{ color: '#888', marginBottom: '1rem' }}>
    University of Cebu Pardo-Talisay (UCPT) | 3rd Year - BS Information Technology
  </p>
  <p style={{ color: '#666', fontSize: '0.85rem' }}>
    Instructor: Mr. Carlo Petalver
  </p>
  <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '1rem' }}>
    This website is for educational purposes only. All product images and descriptions are for demonstration.
  </p>
</div>

        

        <Link to="/" className="auth-btn about-cta">Start Shopping</Link>
      </div>
    </div>
  );
};

export default About;