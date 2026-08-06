import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    EVENTS_TEAM: 'EVENTS_TEAM'
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get credentials securely from environment variables
    const SUPERADMIN_EMAIL = import.meta.env.VITE_SUPERADMIN_EMAIL || 'superadmin@gdgcit.com';
    const SUPERADMIN_PASSWORD = import.meta.env.VITE_SUPERADMIN_PASSWORD || 'GDG#SuperAdmin2026!';
    const EVENTSTEAM_EMAIL = import.meta.env.VITE_EVENTSTEAM_EMAIL || 'events@gdgcit.com';
    const EVENTSTEAM_PASSWORD = import.meta.env.VITE_EVENTSTEAM_PASSWORD || 'GDG#EventsTeam2026!';

    useEffect(() => {
        // Restore session on page load
        const storedUser = localStorage.getItem('gdg_admin_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error('Failed to restore auth session:', err);
                localStorage.removeItem('gdg_admin_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const cleanEmail = email.trim().toLowerCase();

        // 1. Check Super Admin credentials
        if (cleanEmail === SUPERADMIN_EMAIL.toLowerCase() && password === SUPERADMIN_PASSWORD) {
            const userData = {
                email: cleanEmail,
                name: 'Super Admin / Head',
                role: ROLES.SUPER_ADMIN,
                loggedInAt: new Date().toISOString()
            };
            setUser(userData);
            localStorage.setItem('gdg_admin_user', JSON.stringify(userData));
            return { success: true, user: userData };
        }

        // 2. Check Events Team credentials
        if (cleanEmail === EVENTSTEAM_EMAIL.toLowerCase() && password === EVENTSTEAM_PASSWORD) {
            const userData = {
                email: cleanEmail,
                name: 'Events Team Lead',
                role: ROLES.EVENTS_TEAM,
                loggedInAt: new Date().toISOString()
            };
            setUser(userData);
            localStorage.setItem('gdg_admin_user', JSON.stringify(userData));
            return { success: true, user: userData };
        }

        return { success: false, error: 'Invalid email or password. Please check your credentials.' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('gdg_admin_user');
    };

    const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;
    const isEventsTeam = user?.role === ROLES.EVENTS_TEAM;

    const value = {
        user,
        loading,
        login,
        logout,
        isSuperAdmin,
        isEventsTeam,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
