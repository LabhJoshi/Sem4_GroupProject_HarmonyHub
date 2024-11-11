//new code

import React, { useState } from 'react';
import axios from 'axios';
import './login-signup.css';  // Import the CSS file'
import Gaana from './Gaana.js';
import { useLocation} from 'react-router-dom';

export default function LoginSignup() {
    const [isLogin, setIsLogin] = useState(true);

    const ENDPOINT = 'http://127.0.0.1:8000/api';
    const [username, setUserName] = useState('');
    const [pass, setPassword] = useState('');
    const [c_pass, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const toggleView = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="container_signin">
            <div className="left-side">
                <Gaana />
            </div>
            <div className="right-side">
                {isLogin ? (
                    <Login
                        username={username}
                        setUserName={setUserName}
                        pass={pass}
                        setPassword={setPassword}
                        ENDPOINT={ENDPOINT}
                        toggleView={toggleView}
                    />
                ) : (
                    <Signup
                        username={username}
                        setUserName={setUserName}
                        pass={pass}
                        setPassword={setPassword}
                        c_pass={c_pass}
                        setConfirmPassword={setConfirmPassword}
                        email={email}
                        setEmail={setEmail}
                        ENDPOINT={ENDPOINT}
                        toggleView={toggleView}
                    />
                )}
            </div>
        </div>
    );
}

function Login({ username, setUserName, pass, setPassword, ENDPOINT, toggleView }) {
    // const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const queryToken = queryParams.get("token");

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        const data = { 'username': username, 'password': pass }
        const username_response = await axios.get(`${ENDPOINT}/get-username/`);
        var db_username = username_response.data['username'];

        var flag = false;
        for (let i = 0; i < db_username.length; i++) {
            if (username === db_username[i]) {
                flag = true;
            }
        }

        const password_verify = await axios.post(`${ENDPOINT}/verify_password/`, data);

        if (password_verify.data['is_correct'] && flag) {
            alert('Login successful...');
            window.location.href=`/player?token=${queryToken}`;
        } else {
            alert('Invalid Username or Password !!!');
        }
    }

    return (
        <div className='login-form-container'>
            <h2 className="logo">HarmonyHub</h2>
            <form onSubmit={handleLoginSubmit} className='loginform'>
                <label htmlFor='username' className='input-label'>
                    Username
                </label>
                <input
                    type='text'
                    name='username'
                    id='username'
                    placeholder='Enter your username'
                    className='input'
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
                <label htmlFor='password' className='input-label'>
                    Password
                </label>
                <input
                    type='password'
                    name='password'
                    id='password'
                    placeholder='Enter your password'
                    className='input'
                    value={pass}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className='submit'>Login</button>
            </form>
            <div className='links'>
                <a onClick={toggleView} className='need-help'>New user? Sign Up</a>
            </div>
        </div>
    );
}

function Signup({
    username, setUserName, pass, setPassword,
    c_pass, setConfirmPassword, email, setEmail,
    ENDPOINT, toggleView
}) {

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (pass === c_pass) {
            const email_response = await axios.get(`${ENDPOINT}/get-email/`);
            var db_email = email_response.data['email'];

            const username_response = await axios.get(`${ENDPOINT}/get-username/`);
            var db_username = username_response.data['username'];

            let flag = 0;
            for (let i = 0; i < db_email.length; i++) {
                if (email === db_email[i]) {
                    flag = 1;
                } else if (username === db_username[i]) {
                    flag = 2;
                }
            }

            if (flag === 0) {
                const data = { 'username': username, 'email': email, 'password': pass };
                 await axios.post(`${ENDPOINT}/register/`, data);
                alert('Registration successful !!!');
            } else if (flag === 1) {
                alert('Email already taken !!!');
            } else if (flag === 2) {
                alert('Username is already taken !!!');
            }
        } else {
            alert("Passwords do not match!");
        }
    }

    return (
        <div className='login-form-container'>
            <h2 className="logo">HarmonyHub</h2>
            <form onSubmit={handleRegisterSubmit} className='loginform'>
                <label htmlFor='username' className='input-label'>
                    Username
                </label>
                <input
                    type='text'
                    name='username'
                    id='username'
                    placeholder='Create your username'
                    className='input'
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
                <label htmlFor='email' className='input-label'>
                    Email
                </label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='Enter your email-address'
                    className='input'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor='password1' className='input-label'>
                    Password
                </label>
                <input
                    type='password'
                    name='password1'
                    id='password1'
                    placeholder='Create password'
                    className='input'
                    value={pass}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label htmlFor='password2' className='input-label'>
                    Confirm Password
                </label>
                <input
                    type='password'
                    name='password2'
                    id='password2'
                    placeholder='Confirm password'
                    className='input'
                    value={c_pass}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" className='submit'>Sign Up</button>
            </form>
            <div className='links'>
                <a onClick={toggleView} className='need-help'>Already have an account? Log In</a>
            </div>
        </div>
    );
}
