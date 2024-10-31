import React, { useState, useEffect } from 'react';
import styles from './SignInPage.module.css';
import { doSignInWithEmailAndPassword } from '../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import SignUpModal from '../../components/SignUpModal/SignUpModal';

export default function SignInPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { user } = useAuth();
    
    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal visibility state

    useEffect(() => {
        if (user) {
            navigate('/tasks');
        }
    }, [user, navigate]);

    const onButtonClick = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');

        try {
            await doSignInWithEmailAndPassword(email, password);
            console.log('User signed in successfully');
            navigate('/tasks');
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setEmailError('No user found with this email.');
            } else if (error.code === 'auth/wrong-password') {
                setPasswordError('Incorrect password.');
            } else {
                setEmailError('An error occurred. Please try again.');
            }
        }
    };

    // Toggle modal visibility
    const openSignUpModal = () => setIsModalOpen(true);
    const closeSignUpModal = () => setIsModalOpen(false);

    return (
        <div className={styles['signin-page-container']}>
            <div className={styles['login-container-div']}>
                <h2>Task Manager</h2>
                <form onSubmit={onButtonClick} className={styles['input-area-div']}>
                    <label>Username/Email</label>
                    <input
                        type="email"
                        placeholder="Enter email or username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
                    
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}

                    <button type="submit">Login</button>
                </form>

                <div className={styles['signup-div']}>
                    <p>Don't have an account?</p>
                    <button onClick={openSignUpModal} className={styles['signup-btn']}>Signup</button>
                </div>
            </div>

            {/* Render the SignUpModal component */}
            <SignUpModal isOpen={isModalOpen} onClose={closeSignUpModal} />
        </div>
    );
}
