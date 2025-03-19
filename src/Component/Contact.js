import React from 'react';
import "../styles/Contact.css";

function Contact(props) {
    return (<div className="contact">
        <div className="container-contact">
            <div className="contact-section">
                <div className="contact-text">
                    <p>Join Our New Session</p>
                    <h1>Call and Enroll Now</h1>
                    <h1>+374 95 12 12 16</h1>
                </div>
                <a href="/contact" className="button">Contact Us</a>
            </div>
        </div>
    </div>);
}

export default Contact;
