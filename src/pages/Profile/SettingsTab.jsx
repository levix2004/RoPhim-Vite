import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
const cx = classNames.bind(styles);

export default function SettingsTab({ userInfo, avatarUrl, onUpdateSuccess }) {
    const [editUsername, setEditUsername] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { updateUser } = useAuth();
    const { addToast } = useToast();
    useEffect(() => {
        if (userInfo.username) {
            setEditUsername(userInfo.username);
        }
    }, [userInfo]);

    const handleUpdateProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);
        try {
            const bodyData = {
                username: editUsername,
                avatarUrl: avatarUrl,
            };

            if (editPassword && editPassword.trim() !== '') {
                bodyData.password = editPassword;
            }

            const res = await fetch('http://rophim-be-dr9q.onrender.com/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bodyData),
            });

            const data = await res.json();

            if (data.success) {
                onUpdateSuccess(data.data);
                updateUser({ username: editUsername });
                setEditPassword('');
                addToast('Cập nhật thông tin thành công!', 'success');
            } else {
                addToast(data.message || 'Có lỗi xảy ra khi cập nhật thông tin.', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi lưu thông tin:', error);
            addToast('Có lỗi xảy ra khi lưu thông tin.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('settings-container')}>
            <h3>Thông tin tài khoản</h3>
            <form className={cx('form-settings')}>
                <div className={cx('form-group')}>
                    <label>Tên hiển thị</label>
                    <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
                </div>
                <div className={cx('form-group')}>
                    <label>Email đăng nhập</label>
                    <input type="email" value={userInfo.email || ''} disabled />
                </div>
                <div className={cx('form-group')}>
                    <label>Đổi Mật khẩu mới</label>
                    <input
                        type="password"
                        placeholder="Để trống nếu không muốn đổi"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                    />
                </div>
                <button type="button" disabled={loading} className={cx('btn-save')} onClick={handleUpdateProfile}>
                    {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Lưu thay đổi'}
                </button>
            </form>
        </div>
    );
}
