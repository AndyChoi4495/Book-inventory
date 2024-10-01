import React, { createContext, useContext, useState } from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap';

// Create Context
const AlertContext = createContext();

// Provider Component
export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({
        message: '',
        variant: '',
    });

    const showAlert = (message, variant = 'info') => {
        setAlert({ message, variant });
        // Automatically dismiss after 3 seconds
        setTimeout(() => {
            setAlert({ message: '', variant: '' });
        }, 3000);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {alert.message && (
                <BootstrapAlert
                    variant={alert.variant}
                    className="position-fixed top-0 end-0 m-3"
                    style={{ zIndex: 9999 }}
                >
                    {alert.message}
                </BootstrapAlert>
            )}
        </AlertContext.Provider>
    );
};

// Custom Hook
export const useAlert = () => useContext(AlertContext);

// Alert Component (if using individual alerts)
function AlertComponent({ message, variant }) {
    if (!message) return null;

    return (
        <BootstrapAlert variant={variant} className="mt-3">
            {message}
        </BootstrapAlert>
    );
}

export default AlertComponent;
