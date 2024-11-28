import React, { useState } from "react";
import '../cssPages/signin.css'
import { Link } from "react-router-dom";
import axios from "axios";
import { hashutil } from "../hashutil/javascript/Hashutil";

function Signin(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    React.useEffect(() => {
        // 페이지에 들어올 때 배경 변경
        document.body.classList.add('page-white-bg');
        return () => {
            // 페이지를 떠날 때 원래 배경 복원
            document.body.classList.remove('page-white-bg');
        };
    }, []);

    const handleSignin = () => {
        if (!email) {
            alert("Please enter your email.");
            return;
        }

        if (!password) {
            alert("Please enter your password.");
            return;
        }


        const hashedPassword = hashutil(email, password);
        const newAccount = {email: email, password: hashedPassword};


        axios.post('http://localhost:3001/api/user/signin', newAccount)
            .then((response) => {
                const { message, userId, accessToken, refreshToken } = response.data;
                alert(message);
                if (response.status === 200) { // 상태 코드가 200인지 확인
                    localStorage.setItem("userId", userId);
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    window.location.href = '/homepage'; // 홈 페이지로 리다이렉트
                }
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data.error); // 서버에서 받은 오류 메시지 표시
                } else {
                    alert("An error occurred. Please try again.");
                }
            });
    };

    return(
        <div className="wholeSignIn">
            <p className="title">Sign in</p>
            <div className="containers">
                <div className="email-container">
                    <p>E-mail</p>
                    <input type="text" className="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div> 
                <div className="password-container">
                    <p>Password</p>
                    <input type="text" className="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
            </div>
            <div className="signButtons">
                <button className="signin-signin" onClick={handleSignin}>Sign in</button>
                <Link to="/signup">
                    <button className="signin-signup">Sign up</button>
                </Link>
            </div>
        </div>
    );
}

export default Signin;