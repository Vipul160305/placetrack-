import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('placement_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('placement_token');
            const storedUser = localStorage.getItem('placement_user');
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = (userData, tokenStr) => {
        setUser(userData);
        setToken(tokenStr);
        localStorage.setItem('placement_token', tokenStr);
        localStorage.setItem('placement_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('placement_token');
        localStorage.removeItem('placement_user');
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('placement_user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export default AuthContext;
