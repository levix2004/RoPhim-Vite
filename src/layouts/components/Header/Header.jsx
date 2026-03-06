import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react/headless';
import { faCaretDown, faUser, faBell, faGear, faSignOut, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Search from '../../../components/Search/Search';
import LoginModal from '../../../components/AuthModal/LoginModal';
import RegisterModal from '../../../components/AuthModal/RegisterModal';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../contexts/ToastContext';
const cx = classNames.bind(styles);

function Header() {
    const location = useLocation();
    const [isScroll, setIsScroll] = useState(false);
    const [categories, setCategories] = useState([]);
    const [country, setCountry] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();
    const { setShowLoginModal, setShowRegisterModal } = useAuth();

    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScroll(window.scrollY > 1);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchCategoriesApi = async () => {
            try {
                setLoading(true);
                const [categoryApi, countryApi] = await Promise.all([
                    fetch(`https://phimapi.com/the-loai`),
                    fetch(`https://phimapi.com/quoc-gia`),
                ]);
                const [categoryData, countryData] = await Promise.all([categoryApi.json(), countryApi.json()]);
                setCategories(categoryData);
                setCountry(countryData);
                setLoading(false);
            } catch {
                console.log('error');
            }
        };
        fetchCategoriesApi();
    }, []);
    const handleLogout = () => {
        logout();
        addToast('Đăng xuất thành công', 'success');
        window.location.href = '/';
    };
    const renderUserMenu = (attrs) => (
        <div className={cx('user-dropdown')} tabIndex="-1" {...attrs}>
            <div className={cx('user-info')}>
                <img
                    src={user?.avatarUrl || 'https://files.fullstack.edu.vn/f8-prod/user_avatars/1/623d4b2d95cec.png'}
                    alt="avatar"
                    className={cx('avatar-small')}
                />
                <span className={cx('username')}>{user?.username || 'Thành viên'}</span>
            </div>
            <hr />
            <ul className={cx('menu-list')}>
                <li>
                    <Link to="/profile">
                        <FontAwesomeIcon icon={faUserCircle} /> Hồ sơ cá nhân
                    </Link>
                </li>
                <li>
                    <Link to="/settings">
                        <FontAwesomeIcon icon={faGear} /> Cài đặt
                    </Link>
                </li>
                <li onClick={handleLogout} className={cx('logout-item')}>
                    <FontAwesomeIcon icon={faSignOut} /> Đăng xuất
                </li>
            </ul>
        </div>
    );

    return (
        <>
            <div className={cx('wrapper', { scrolled: isScroll })}>
                <div className={cx('container')}>
                    <div className={cx('logo')}>
                        <div>
                            <Link to={'/'}>
                                <img src="/logo.svg" alt="Logo" />
                            </Link>
                        </div>
                    </div>

                    <Search />

                    <div className={cx('menu-bar')}>
                        <div className={cx('menu-inner')}>
                            <div className={cx('menu-item')}>
                                <ul className={cx('menu-item-ul')}>
                                    <Tippy
                                        offset={[0, 15]}
                                        interactive
                                        hideOnClick={true}
                                        trigger="click"
                                        placement="bottom-start"
                                        render={(attrs) => (
                                            <div className={cx('tippy-box')} tabIndex="-1" {...attrs}>
                                                <div className={cx('tippy-container')}>
                                                    {categories.map((cate, index) => (
                                                        <Link key={index} to={`/the-loai/${cate.slug}`}>
                                                            <div className={cx('grid-4-col')}>{cate.name}</div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    >
                                        <li className={cx('no-hover')}>
                                            Thể loại{' '}
                                            <span style={{ padding: 5 }}>
                                                <FontAwesomeIcon icon={faCaretDown} />
                                            </span>
                                        </li>
                                    </Tippy>

                                    <Link to={`/danh-sach/phim-le`}>
                                        <li>Phim lẻ</li>
                                    </Link>
                                    <Link to={`/danh-sach/phim-bo`}>
                                        <li>Phim bộ</li>
                                    </Link>
                                    <Link to={`/danh-sach/phim-chieu-rap`}>
                                        <li>Phim chiếu rạp</li>
                                    </Link>

                                    <Tippy
                                        offset={[0, 15]}
                                        interactive
                                        hideOnClick={true}
                                        trigger="click"
                                        placement="bottom-start"
                                        render={(attrs) => (
                                            <div className={cx('tippy-box')} tabIndex="-1" {...attrs}>
                                                <div className={cx('tippy-container')}>
                                                    {country.map((coun, index) => (
                                                        <Link key={index} to={`/quoc-gia/${coun.slug}`}>
                                                            <div className={cx('grid-4-col')}>{coun.name}</div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    >
                                        <li className={cx('no-hover')}>
                                            Quốc gia{' '}
                                            <span style={{ padding: 5 }}>
                                                <FontAwesomeIcon icon={faCaretDown} />
                                            </span>
                                        </li>
                                    </Tippy>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {user ? (
                        <div className={cx('main-user')}>
                            <Tippy content="Thông báo" placement="bottom">
                                <button className={cx('action-btn')}>
                                    <FontAwesomeIcon icon={faBell} />
                                    <span className={cx('badge')}>3</span>
                                </button>
                            </Tippy>
                            <Tippy interactive trigger="click" placement="bottom-end" render={renderUserMenu}>
                                <div className={cx('user-avatar')}>
                                    {console.log('User data in header:', user)}
                                    <img
                                        src={
                                            user?.avatarUrl ||
                                            'https://files.fullstack.edu.vn/f8-prod/user_avatars/1/623d4b2d95cec.png'
                                        }
                                        alt="User"
                                    />
                                </div>
                            </Tippy>
                        </div>
                    ) : (
                        <>
                            <div className={cx('subscribe')}>
                                <div className={cx('sub-inner')}>
                                    <div className={cx('sub-btn')}>
                                        <button onClick={() => setShowRegisterModal(true)}>
                                            <span>
                                                <FontAwesomeIcon className={cx('sub-icon')} icon={faUser} />
                                            </span>
                                            Đăng ký
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('login')}>
                                <div className={cx('login-inner')}>
                                    <div className={cx('login-btn')}>
                                        <button onClick={() => setShowLoginModal(true)}>
                                            <span>
                                                <FontAwesomeIcon className={cx('login-icon')} icon={faUser} />
                                            </span>
                                            Đăng nhập
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Header;
