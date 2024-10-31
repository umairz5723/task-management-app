import React, { useState, useEffect, useContext } from "react";
import { auth } from "../../src/firebase/firebase"; // Adjust the import path if necessary
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User authenticated:", user); // Log user object
                setCurrentUser(user); // Directly use the user object
                setUserLoggedIn(true);
            } else {
                console.log("No user authenticated."); // Log when no user
                setCurrentUser(null);
                setUserLoggedIn(false);
            }
            setLoading(false);
        });
        return unsubscribe; // Cleanup subscription on unmount
    }, []);

    const value = {
        currentUser,   
        userLoggedIn,
        loading,
        displayName: currentUser ? currentUser.displayName : '',
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/* Render children only when loading is false */}
        </AuthContext.Provider>
    );
}
