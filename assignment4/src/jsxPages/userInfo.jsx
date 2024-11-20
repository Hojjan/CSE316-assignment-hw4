import React, {useState, useRef, useEffect} from "react";
import '../cssPages/userInfo.css'

function Userinfo(){
    const [pop, setPop] = useState(false); /* Set popUps closed as default */
    const [popTitle, setPopTitle] = useState(""); /* For different contents of Pop Ups */
    const [popContent, setPopContent] = useState(null);
    const overlayRef = useRef(null);
    const [activeButton, setActiveButton] = useState(null);

    useEffect(() => {
        if (overlayRef.current) {
            overlayRef.current.style.display = pop ? 'block' : 'none';
        }
    }, [pop]);

    /* Change name Pop Up */
    const namePopup = () => {
        if (pop) return;
        setActiveButton("name");
        setPopTitle("Change your name");
        setPopContent(
            <div>
                <p>New Name</p>
                <input type="text" id="newName" placeholder="Enter new name" />
            </div>
        );
        setPop(true);
    };

    /* Change Password Pop Up */
    const passwordPopup = () => {
        if (pop) return;
        setActiveButton("password");
        setPopTitle("Change your password");
        setPopContent(
            <div>
                <p>New Password</p>
                <input type="password" id="newPassword" placeholder="Enter the new password" />
            </div>
        );
        setPop(true);
    };

    /* Change Image Pop Up */
    const ImagePopup = () => {
        if (pop) return;
        setActiveButton("image");
        setPopTitle("Change your image");
        setPopContent(
            <div>
                <p>New Image</p>
                <input type="file" id="newImage" />
            </div>
        );
        setPop(true);
    };

    /* Close Pop Up */
    const closePopup = () => {
        setPop(false);
        setActiveButton(null);
    };


    const buttonStyle = (buttonName) => ({
        backgroundColor: activeButton === buttonName ? "black" : "white",
        color: activeButton === buttonName ? "white" : "black"
    });

    return(
        <div className="wholeUserInfo">
            <div>
                <h1>User Information</h1>
            </div>
            <div class="profileImage">
                <img src="./user.png" alt="profile" width="150" />  
            </div>
            <div>
                <button id="change-image" onClick={ImagePopup} style={buttonStyle("image")}>Change Image</button>
            </div>
            <div className="change">
                <div>
                    <p>Email: hochan.jun@stonybrook.edu</p>
                        <div>
                            <p>Password:*****</p>
                            <button id="change-password" onClick={passwordPopup} style={buttonStyle("password")}>Change Password</button>
                        </div>
                </div>
                <div>
                    <p>Name: Hochan Jun</p>
                    <button id="change-name" onClick={namePopup} style={buttonStyle("name")}>Change Name</button>
                </div>
            </div>

            {pop && (
                <div>
                    {/* Darker background when Pop Up */}
                    <div id="overlay" className="overlay" ref={overlayRef}></div>
                    <div className="popup">
                        <div className="popup-inner">
                            <h3>{popTitle}</h3>
                            <div className="popup-content">{popContent}</div>
                            <div className="popUpButtons">
                                <button id="closeBtn" onClick={closePopup}>Close</button>
                                <button id="saveBtn">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default Userinfo;