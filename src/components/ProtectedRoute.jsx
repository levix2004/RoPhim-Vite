import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
    const { user } = useAuth();
    const { addToast } = useToast();

    useEffect(() => {
        if (!user) {
            addToast('Vui lòng đăng nhập để xem trang này!', 'warning');
        }
    }, [user, addToast]);

    if (!user) {
    
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;