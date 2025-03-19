import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../styles/Newsletter.css';
import ModalNewsletter from './ModalNewsletter';
import {API_URL_Newsletter} from "../api"

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
    }, [modalOpen, responseMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalOpen(true)

        try {
            const response = await axios.post(`${API_URL_Newsletter}`, {email});
            setResponseMessage(response.data.message || 'Everything is normal, the data has been sent successfully.');
            setModalOpen(true);
            setEmail('');
        } catch (error) {
            setResponseMessage('There was an error saving the contact.');
            setModalOpen(true);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div className="newsletter-section">
            <div className="newsletter-content container">
                <div className="newsletter-title">
                    <h4>Join Our Newsletter</h4>
                    <span>Subscribe to our newsletter to get our latest updates & news.</span>
                </div>
                <form className="newsletter-input-container" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="button">Subscribe Now</button>
                </form>
                <ModalNewsletter
                    isOpen={modalOpen}
                    onClose={closeModal}
                    message={responseMessage}
                />
            </div>
        </div>
    );
};

export default Newsletter;
