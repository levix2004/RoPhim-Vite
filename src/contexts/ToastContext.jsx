import React, { createContext, useContext, useState, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './ToastContext.module.scss'; // File CSS ở Bước 2

const cx = classNames.bind(styles);
const ToastContext = createContext();

export function ToastProvider({ children }) {
    
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now(); 
        
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            
            <div className={cx('toast-container')}>
                {toasts.map((toast) => (
                    <div key={toast.id} className={cx('toast', toast.type)}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// Custom hook để gọi cho lẹ
export const useToast = () => useContext(ToastContext);