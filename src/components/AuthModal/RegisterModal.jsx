import { useState } from 'react';
import styles from './AuthModal.module.scss';
import classNames from 'classnames/bind';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

export default function RegisterModal() {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { onSwitchToLogin, onCloseRegisterModal } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage('');


        if (password !== confirmPassword) {
            setErrorMessage('Mật khẩu nhập lại không khớp!');
            return;
        }

        setLoading(true);
        try {

            await authService.register(username, email, password);
            

            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            onSwitchToLogin(); 
            
        } catch (err) {
    
            setErrorMessage(err.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('modal')} onClick={onCloseRegisterModal}>
            <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
                <button onClick={onCloseRegisterModal} className={cx('close-btn')}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                <h2>Tạo tài khoản</h2>
                <p>
                    Đã có tài khoản?
                    <span onClick={onSwitchToLogin} className={cx('switch-link')}>
                        Đăng nhập ngay
                    </span>
                </p>

                {errorMessage && <div className={cx('error-msg')}>{errorMessage}</div>}

                <form onSubmit={handleRegister}>
                    <div className={cx('input-group')}>
                        <input
                            type="text"
                            placeholder="Tên hiển thị"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div className={cx('input-group')}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className={cx('input-group')}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span 
                            className={cx('toggle-password')}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                    

                    <div className={cx('input-group')}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className={cx('submit-btn')}>
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>

                <div className={cx('logo')}>
                    <img src="/logo.svg" alt="Logo" />
                </div>
            </div>
        </div>
    );
}