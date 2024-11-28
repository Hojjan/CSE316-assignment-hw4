import React from "react";
import { Navigate } from "react-router-dom";

function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token; // 토큰이 존재하면 true, 없으면 false
}

function ProtectedRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/signin" />;
}

export default ProtectedRoute;
