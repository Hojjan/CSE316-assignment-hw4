import React, { createContext, useState, useEffect } from "react";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profileImage, setProfileImage] = useState("./user.png");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (userId) {
            fetch(`http://localhost:3001/api/user/profile?userId=${userId}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.img_src && data.img_src !== "") {
                        setProfileImage(data.img_src); // 서버에서 불러온 값으로 초기화
                    }
                })
                .catch((error) => console.error("Error fetching profile image:", error))
                .finally(() => setLoading(false)); // 로딩 완료
        } else {
            setLoading(false); // 유저 ID가 없을 경우 로딩 완료
        }
    }, []);

    return (
        <ProfileContext.Provider value={{ profileImage, setProfileImage, loading }}>
            {children}
        </ProfileContext.Provider>
    );
};
