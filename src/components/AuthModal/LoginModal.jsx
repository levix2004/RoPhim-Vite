import { useState } from 'react';
import styles from './AuthModal.module.scss';
import classNames from 'classnames/bind';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

export default function LoginModal() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { login, onSwitchToRegister, onCloseLoginModal } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {

            const userData = await authService.login(email, password);


            login(userData);
            
        } catch (err) {

            setErrorMessage(err.response?.data?.message || 'Email hoặc mật khẩu không đúng!');
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className={cx('modal')} onClick={onCloseLoginModal}>

            <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
                <button onClick={onCloseLoginModal} className={cx('close-btn')}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                <h2>Chào mừng trở lại</h2>
                <p>
                    Chưa có tài khoản?
                    <span onClick={onSwitchToRegister} className={cx('switch-link')}>
                        Đăng ký ngay
                    </span>
                </p>

                {errorMessage && <div className={cx('error-msg')}>{errorMessage}</div>}

                <form onSubmit={handleLogin}>
                    <div className={cx('input-group')}>
                        <input
                            type="email"
                            placeholder="Email của bạn"
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

                    <div style={{textAlign: 'right', marginBottom: '15px', fontSize: '13px'}}>
                        <span style={{color: '#b3b3b3', cursor: 'pointer'}}>Quên mật khẩu?</span>
                    </div>

                    <button type="submit" disabled={loading} className={cx('submit-btn')}>
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className={cx('logo')}>
                    <img src="/blog-rophim-logo.png" alt="Logo" />
                </div>
            </div>
        </div>
    );
}