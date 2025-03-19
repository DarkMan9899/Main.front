import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ContactPage.css';
import { API_URL_Contact_Page } from "../api";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');  // Ensure this matches the root element of your app

function ContactPage() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setModalIsOpen(true);
    };

    const handleConfirmSubmit = () => {
        setModalIsOpen(false);

        axios.post(`${API_URL_Contact_Page}`, { name, phone, message })
            .then(response => {
                setName('');
                setPhone('');
                setMessage('');
                toast.success('Request successful!', {
                    position: "top-right",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .catch(error => {
                toast.error('Error submitting the form.', {
                    position: "top-right",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    };

    const handleCancelSubmit = () => {
        setModalIsOpen(false);
    };

    const openSocialMedia = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div>
            <ToastContainer />
            <div className="text_title_contactPage">
                <h1>Contact Us</h1>
            </div>
            <div className="contactPage-container">
                <div className="container">
                    <div className="contactPage-section">
                        <div className="contactPage_content">
                            <div>
                                <div className="contact_text">
                                    <span>
                                        We'd love to hear from you! Whether you have questions about our courses, need assistance with enrollment, or simply want to learn more about what we offer, we're here to help. Fill out the form below with your name, email, and message, and we'll get back to you as soon as possible. You can also call us, email us and reach out on social media.
                                    </span>
                                </div>
                                <div className="icon_contact">
                                    <i className="fa-solid fa-phone-flip"></i>
                                    <p className="contact-phone">+374 95 12 12 16</p>
                                </div>
                                <div className="icon_contact">
                                    <div className="mail_link">
                                        <div className="mail_link_text">
                                            <i className="fa-solid fa-envelope"></i>
                                            <p className="contact-email">academy.polyglott@gmail.com</p>
                                        </div>
                                        <div className="mail_button">
                                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=academy.polyglott@gmail.com&su=Contact%20Us"
                                               className="button1" target="_blank">Send Email via Gmail</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="soc_info">
                                <i className="fa-brands fa-facebook-f"
                                   onClick={() => openSocialMedia("https://www.facebook.com/academypolyglot")}></i>
                                <i className="fa-brands fa-instagram"
                                   onClick={() => openSocialMedia("https://www.instagram.com/academy.polyglot/")}></i>
                                <i className="fa-brands fa-vk"
                                   onClick={() => openSocialMedia("https://vk.me/club225918715")}></i>
                                <i className="fa-brands fa-telegram"
                                   onClick={() => openSocialMedia("https://salebot.site/TG_1")}></i>
                                <i className="fab fa-linkedin-in"
                                   onClick={() => openSocialMedia("https://www.linkedin.com/company/academy-polyglot/")}></i>
                            </div>
                        </div>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="input_list">
                                <label>Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="input_list">
                                <label>Phone</label>
                                <input type="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </div>
                            <div className="input_list">
                                <label>Message</label>
                                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                            </div>
                            <button className="button" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Confirm Submission"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <div className="modal-contentt">
                    <p>Thank you for your message. It has been sent and is under review. We will get back to you as soon as possible.</p>
                    <div className="modal-buttons">
                        <button className="button" onClick={handleConfirmSubmit}>Close</button>
                        {/*<button className="button" onClick={handleCancelSubmit}>No</button>*/}
                    </div>
                </div>

            </Modal>
        </div>
    );
}

export default ContactPage;
