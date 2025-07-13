import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react/headless';
import { faCaretDown, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function Header() {
    const [isScroll, setIsScroll] = useState(false)
    useEffect(() => {
        const handleScroll = () => {
            setIsScroll(window.scrollY > 1)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    },[])
    return (
        <div className={cx('wrapper',{scrolled: isScroll})}>
            <div className={cx('container')}>
                <div className={cx('logo')}>
                    <Link to={"/"}><img src="https://www.rophim.me/images/logo.svg" alt=""></img></Link>
                </div>
                <div className={cx('search')}>
                    <div className={cx('search-inner')}>
                        <div className={cx('search-icon')}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </div>
                        <input placeholder="Tìm kiếm phim, diễn viên"></input>
                    </div>
                </div>
                <div className={cx('menu-bar')}>
                    <div className={cx('menu-inner')}>
                        <div className={cx('menu-item')}>
                            <ul className={cx('menu-item-ul')}>
                                <Link to={"./chu-de"}><li>Chủ đề</li></Link>
                                <Tippy
                                    offset={[200,35]}
                                    interactive
                                    hideOnClick='toggle'
                                    trigger='click'
                                    render={(attrs) => (
                                        <div className={cx('tippy-box')} tabIndex="-1" {...attrs}>
                                            <div className={cx('tippy-container')}>
                                                <ul className={cx('column')}>
                                                    <li>Anime</li>
                                                    <li>Chuyển thể</li>
                                                    <li>Cổ trang</li>
                                                    <li>Disney</li>
                                                </ul>
                                                <ul className={cx('column')}>
                                                    <li>Bí ẩn</li>
                                                    <li>Chính kịch</li>
                                                    <li>Cung đấu</li>
                                                    <li>Cổ tích</li>
                                                </ul>
                                                <ul className={cx('column')}>
                                                    <li>Chiến tranh</li>
                                                    <li>Chính luận</li>
                                                    <li>Cuối tuần</li>
                                                    <li>Cổ điển</li>
                                                </ul>
                                                <ul className={cx('column')}>
                                                    <li>Chiếu rạp</li>
                                                    <li>Chính trị</li>
                                                    <li>Cách mạng</li>
                                                    <li>DC</li>
                                                </ul>
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

                                <li>Phim lẻ</li>
                                <li>Phim bộ</li>
                                <li>Phim chiếu rạp</li>
                                <li>Quốc gia</li>
                                <li>Diễn viên</li>
                                <li>Lịch chiếu</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={cx('subscribe')}>
                    <div className={cx('sub-inner')}>
                        <div className={cx('sub-btn')}>
                            <button>
                                {' '}
                                <span>
                                    <FontAwesomeIcon className={cx('sub-icon')} icon={faUser} />
                                </span>
                                Đăng kí
                            </button>
                        </div>
                    </div>
                </div>
                <div className={cx('login')}>
                    <div className={cx('login-inner')}>
                        <div className={cx('login-btn')}>
                            <button>
                                {' '}
                                <span>
                                    <FontAwesomeIcon className={cx('login-icon')} icon={faUser} />
                                </span>
                                Đăng nhập
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
