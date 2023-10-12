import React from 'react';


const HomePage = () => {
  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>Welcome to Our Colorful Church</h1>
          <p>Connecting Faith, Love, and Community</p>
        </div>
      </header>

      {/* About Section */}
      <section className="about">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            We are a vibrant and diverse community of believers who gather to worship
            together, grow in faith, and serve our community.
          </p>
          <button className="btn-primary">Learn More</button>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="services-content">
          <h2>Our Services</h2>
          <p>
            Join us for our weekly worship services, Bible studies, and community
            events. We offer a variety of programs for all ages.
          </p>
          <button className="btn-secondary">View Schedule</button>
        </div>
      </section>

      {/* Events Section */}
      <section className="events">
        <div className="events-content">
          <h2>Upcoming Events</h2>
          {/* Display a list of upcoming events here */}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <div className="contact-content">
          <h2>Contact Us</h2>
          <p>
            Have questions or need more information? Feel free to get in touch with
            us.
          </p>
          <button className="btn-primary">Contact Us</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2023 Colorful Church. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
