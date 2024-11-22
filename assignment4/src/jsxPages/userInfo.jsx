import React, {useState, useRef, useEffect} from "react";
import '../cssPages/userInfo.css'
import Navbar from "./navbar";

function Userinfo(){
    const [pop, setPop] = useState(false); /* Set popUps closed as default */
    const [popTitle, setPopTitle] = useState(""); /* For different contents of Pop Ups */
    const [popContent, setPopContent] = useState(null);
    const overlayRef = useRef(null);
    const [activeButton, setActiveButton] = useState(null);
    const [profileImage, setProfileImage] = useState("./user.png");

    React.useEffect(() => {
        // 페이지에 들어올 때 배경 변경
        document.body.classList.add('page-white-bg');
        return () => {
            // 페이지를 떠날 때 원래 배경 복원
            document.body.classList.remove('page-white-bg');
        };
    }, []);

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
                <input type="file" id="newImage" accept="image/*" onChange={handleImageUpload}/>
            </div>
        );
        setPop(true);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImage(reader.result); // Set the uploaded image as the profile picture
            };
            reader.readAsDataURL(file); // Read the uploaded file as a Data URL
        }
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

            <Navbar profileImage={profileImage} />

            <div>
                <h1>User Information</h1>
            </div>
            <div class="profileImage">
                <img src={profileImage} alt="profile" className="circle-image" />  
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
                    <div className={`popup ${activeButton === "image" ? "image-popup" : ""}`}>
                        <div className="popup-inner">
                            <h3>{popTitle}</h3>
                            
                            {activeButton === "image" ? (
                            <>
                                <div className="popup-content">
                                    {popContent}
                                    <button id="uploadBtn"  onClick={() => alert("Image uploaded!")}>Upload Image</button>
                                </div>
                                <div className="popUpButtons">
                                    <button id="closeBtn"  onClick={closePopup}>Close</button>
                                </div>
                            </>
                            ) : (
                            <>
                                <div className="popup-content">
                                    {popContent}
                                </div>
                                <div className="popUpButtons">
                                    <button id="closeBtn"  onClick={closePopup}>Close</button>
                                    <button id="saveBtn"  onClick={() => alert("Changes saved!")}>Save changes</button>
                                </div>
                            </>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default Userinfo;