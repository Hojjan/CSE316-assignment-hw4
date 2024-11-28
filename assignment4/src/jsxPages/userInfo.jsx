import React, {useContext, useState, useRef, useEffect} from "react";
import '../cssPages/userInfo.css'
import { ProfileContext } from "./profileContext";
import { hashutil } from "../hashutil/javascript/Hashutil";
import Navbar from "./navbar";

function Userinfo(){
    const [pop, setPop] = useState(false); /* Set popUps closed as default */
    const [popTitle, setPopTitle] = useState(""); /* For different contents of Pop Ups */
    const [popContent, setPopContent] = useState(null);
    const overlayRef = useRef(null);
    const [activeButton, setActiveButton] = useState(null);
    const { profileImage, setProfileImage } = useContext(ProfileContext);
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);

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

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (userId) {
            fetch(`http://localhost:3001/api/user/profile?userId=${userId}`)
                .then((response) => response.json())
                .then((data) => {
                    setEmail(data.email_address);
                    setPassword(data.password);
                    setUsername(data.username);

                    if (data.img_src && data.img_src !== "") {
                        setProfileImage(data.img_src); // 서버에서 프로필 이미지 URL 설정
                    }
                    else{
                        setProfileImage("./user.png");
                    }
                })
                .catch((error) => console.error("Error fetching profile image:", error));
        }
    }, []);

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
                <p>Old Password</p>
                <input type="password" id="oldPassword" placeholder="Enter the old password" />

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
                <input type="file" id="newImage" accept="image/*" onChange={(event) => setUploadedFile(event.target.files[0])}/>
            </div>
        );
        setPop(true);
    };

    const handlePasswordVerify = async () => {
        const oldPasswordInput = document.getElementById("oldPassword").value;
        const newPasswordInput = document.getElementById("newPassword").value;

        const hashedOldPassword = hashutil(email, oldPasswordInput);
        if (hashedOldPassword !== password) {
            alert("Old password is incorrect!");
            return;
        }

        const userId = localStorage.getItem("userId");

        if (!newPasswordInput) {
            alert("Please enter new password.");
            return;
        }

        try {
            const hashedNewPassword = hashutil(email, newPasswordInput);
            const response = await fetch("http://localhost:3001/api/user/updatePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    hashedPassword: hashedNewPassword,
                }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                setPassword(newPasswordInput); // 새로운 비밀번호로 상태 업데이트
                alert("Password updated successfully!");
                closePopup(); // 팝업 닫기
            } else {
                alert(result.error || "Failed to update password.");
            }
        } catch (error) {
            alert("An error occurred while updating the password.");
        }
    
    }

    const handleImageUpload = async () => {
        const userId = localStorage.getItem("userId");

        if (uploadedFile) {
            const formData = new FormData();
            formData.append("image", uploadedFile);
            formData.append("userId", userId);

            try {
                const response = await fetch("http://localhost:3001/api/user/uploadProfileImage", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    setProfileImage(result.imageUrl); // 프로필 이미지 업데이트
                    alert("Image uploaded and saved successfully!");
                } else {
                    alert(result.error || "Image upload failed");
                }
            } catch (error) {
                alert("An error occurred while uploading the image.");
            }
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
                    <p>Email: {email}</p>
                        <div>
                            <p>Password: ********* </p>
                            <button id="change-password" onClick={passwordPopup} style={buttonStyle("password")}>Change Password</button>
                        </div>
                </div>
                <div>
                    <p>Name: {username} </p>
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
                                    <button id="uploadBtn"  onClick={handleImageUpload}>Upload Image</button>
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
                                    <button id="saveBtn"  onClick={handlePasswordVerify}>Save changes</button>
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