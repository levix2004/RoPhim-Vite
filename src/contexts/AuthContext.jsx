// AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAppLoading, setIsAppLoading] = useState(true);

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    useEffect(() => {
        const initAuth = () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setIsAppLoading(false);
        };
        initAuth();
    }, []);

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData.user));

        setUser(userData.user); 
        setShowLoginModal(false);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const requireAuth = (action) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        action();
    };
    const updateUser = (newUserData) => {
        const updatedUser = { ...user, ...newUserData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };
    const onSwitchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const onSwitchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    const value = {
        user,
        isAppLoading,
        login,
        logout,
        requireAuth,
        updateUser,
        showLoginModal,
        setShowLoginModal,
        showRegisterModal,
        setShowRegisterModal,
        onSwitchToRegister,
        onSwitchToLogin,
        onCloseLoginModal: () => setShowLoginModal(false),
        onCloseRegisterModal: () => setShowRegisterModal(false),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
