import React, { useState } from "react";
import '../cssPages/signin.css'
import { Link } from "react-router-dom";


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
                <button className="signin-signin">Sign in</button>
                <Link to="/signup">
                    <button className="signin-signup">Sign up</button>
                </Link>
            </div>
        </div>
    );
}

export default Signin;