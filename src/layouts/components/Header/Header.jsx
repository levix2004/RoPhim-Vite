import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react/headless';
import { faCaretDown, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Search from '../../../components/Search/Search';

const cx = classNames.bind(styles);

function Header() {
    const [isScroll, setIsScroll] = useState(false);
    const [categories, setCategories] = useState([]);
    const [country, setCountry] = useState([]);
    const [loading, setLoading] = useState(true);
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
    return (
        <div className={cx('wrapper', { scrolled: isScroll })}>
            <div className={cx('container')}>
                <div className={cx('logo')}>
                    <div>
                        <Link to={'/'}>
                            <img src="https://www.rophim.me/images/logo.svg" alt=""></img>
                        </Link>
                    </div>
                </div>
                <Search />
                <div className={cx('menu-bar')}>
                    <div className={cx('menu-inner')}>
                        <div className={cx('menu-item')}>
                            <ul className={cx('menu-item-ul')}>
                                <Link to={'/chu-de'}>
                                    <li>Chủ đề</li>
                                </Link>
                                <Tippy
                                    offset={[200, 35]}
                                    interactive
                                    hideOnClick={true}
                                    trigger="click"
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
                                    offset={[200, 35]}
                                    interactive
                                    hideOnClick={true}
                                    trigger="click"
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
