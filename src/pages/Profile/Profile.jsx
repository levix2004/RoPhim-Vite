import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../components/Loading/Loading';

import HistoryTab from './HistoryTab';
import WatchlistTab from './WatchlistTab';
import SettingsTab from './SettingsTab';
import { useAuth } from '../../hooks/useAuth';

const cx = classNames.bind(styles);

function Profile() {
    const [activeTab, setActiveTab] = useState('history');
    const { updateUser } = useAuth();
    const [userInfo, setUserInfo] = useState({});
    const [avatarUrl, setAvatarUrl] = useState('https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg');
    const [loading, setLoading] = useState(true);
    
    const fileInputRef = useRef(null);
    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('http://localhost:3000/api/user/profile', {
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (data.success) {
                    setUserInfo(data.data);
                    if (data.data.avatar) setAvatarUrl(data.data.avatar);
                }
            } catch (error) {
                console.error('Lỗi tải dữ liệu profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setAvatarUrl(previewUrl);

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const token = localStorage.getItem('token');
            const uploadRes = await fetch('http://localhost:3000/api/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const uploadData = await uploadRes.json();

            if (uploadData.success) {
                setAvatarUrl(uploadData.url);
                updateUser({ avatar: uploadData.url, avatarUrl: uploadData.url }); 
                
            } else {
                alert('Lỗi xử lý ảnh từ server: ' + uploadData.message);
                setAvatarUrl(userInfo.avatar || 'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API upload ảnh:', error);
            alert('Máy chủ đang bận hoặc chưa khởi động đúng API Upload.');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('profile-header')}>
                <div className={cx('cover-image')}>
                    <img src="https://assets.nflxext.com/ffe/siteui/vlv3/a73c4363-1dcd-4719-b3b1-373e7f667828/vn-vi/web/signup/hero-image.jpg" alt="Cover" />
                    <div className={cx('overlay')}></div>
                </div>

                <div className={cx('user-info')}>
                    <div className={cx('avatar-wrapper')}>
                        <div className={cx('avatar')}>
                            <img src={avatarUrl} alt="Avatar" />
                        </div>
                        <div className={cx('upload-btn')} onClick={() => fileInputRef.current.click()}>
                            <FontAwesomeIcon icon={faCamera} />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className={cx('details')}>
                        <h2 className={cx('username')}>{userInfo.username || 'Người dùng'}</h2>
                        <span className={cx('email')}>{userInfo.email}</span>
                        <span className={cx('role-badge')}>
                            {userInfo.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                        </span>
                    </div>
                </div>
            </div>

            <div className={cx('profile-nav')}>
                <button className={cx('nav-item', { active: activeTab === 'history' })} onClick={() => setActiveTab('history')}>
                    Lịch sử xem
                </button>
                <button className={cx('nav-item', { active: activeTab === 'watchlist' })} onClick={() => setActiveTab('watchlist')}>
                    Tủ phim của tôi
                </button>
                <button className={cx('nav-item', { active: activeTab === 'settings' })} onClick={() => setActiveTab('settings')}>
                    Thông tin tài khoản
                </button>
            </div>

            <div className={cx('profile-content')}>
                {activeTab === 'history' && <HistoryTab />}
                {activeTab === 'watchlist' && <WatchlistTab />}
                {activeTab === 'settings' && (
                    <SettingsTab 
                        userInfo={userInfo} 
                        avatarUrl={avatarUrl} 
                        onUpdateSuccess={(newUserInfo) => setUserInfo(newUserInfo)} 
                    />
                )}
            </div>
        </div>
    );
}

export default Profile;