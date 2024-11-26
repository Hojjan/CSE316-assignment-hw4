import React, { useState } from "react";
import '../cssPages/signup.css'
import axios from "axios";
import { hashutil } from "../hashutil/javascript/Hashutil";


function Signup(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkpw, setCheckpw] = useState('');
    const [username, setUsername] = useState('');

    React.useEffect(() => {
        // 페이지에 들어올 때 배경 변경
        document.body.classList.add('page-white-bg');
        return () => {
            // 페이지를 떠날 때 원래 배경 복원
            document.body.classList.remove('page-white-bg');
        };
    }, []);

    const handleSignup = () => {
        if (!email) {
            alert("Email is not entered.");
            return;
        }

        if (!password || !checkpw) {
            alert("Password or confirm password is not entered.");
            return;
        }
        
        if (!username) {
            alert("Username is not entered.");
            return;
        }

        if (password !== checkpw) {
            alert("Confirm password is not the same with password.");
            return;
        }

        // 비밀번호 해싱
        const hashedPassword = hashutil(email, password);
        const action = "signup"
        const newAccount = {action, email: email, password: hashedPassword, username: username}

        // 서버로 데이터 전송
        axios.post('http://localhost:3001/api/user', newAccount)
            .then((response) => {
                alert("Account successfully created!");
                setEmail("");
                setPassword("");
                setCheckpw("");
                setUsername("");
            })
            .catch((error) => {
                if (error.response) {
                    console.error("Error response:", error.response);
                    alert(`Error: ${error.response.data.error}`);
                } else {
                    console.error("Error:", error);
                    alert("An error occurred. Please try again.");
                }
            });

    };

    return(
        <div className="wholeSignUp">
            <p className="title">Sign up</p>
            <div className="email-container">
                <p>E-mail</p>
                <input type="text" className="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div> 
            <div className="password-container">
                <p>Password</p>
                <input type="text" className="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="password-container">
                <p>Password Check</p>
                <input type="text" className="password-check" value={checkpw} onChange={(e) => setCheckpw(e.target.value)}/>
            </div>
            <div className="username">
                <p>User Name</p>
                <input type="text" className="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="signButton">
                <button className="signup-signup" onClick={handleSignup}>Sign up</button>
            </div>
        </div>
    );
}

export default Signup;