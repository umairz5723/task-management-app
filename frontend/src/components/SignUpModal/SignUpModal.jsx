import React, { useState } from 'react';
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth'; // Update import statement
import styles from './SignUpModal.module.css';

export default function SignUpModal({ isOpen, onClose }) {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await doCreateUserWithEmailAndPassword(firstName, email, password); // Make sure to pass firstName
            console.log('User signed up successfully');
            onClose(); // Close the modal on successful signup
        } catch (error) {
            setError('Error signing up. Please try again.');
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>
                <h2>Sign Up</h2>
                <form className={styles.form} onSubmit={handleSignUp}>
                    <label>First Name</label>
                    <input
                        type="text"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className={styles.errorText}>{error}</p>}
                    <button className={styles.signUpButton} type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    );
}
