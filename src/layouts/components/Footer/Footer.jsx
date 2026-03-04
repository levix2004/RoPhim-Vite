import React from 'react';
import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'; 

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('grid')}>
                    <div className={cx('col')}>
                        <Link to="/" className={cx('logo')}>
                            <span><img src="/blog-rophim-logo.png" alt="Logo PhimMới" /></span>
                        </Link>
                        <p className={cx('desc')}>
                            Rổ Phim - Trang xem phim trực tuyến miễn phí chất lượng cao. Cập nhật các bộ phim mới nhất, phim chiếu rạp, phim bộ vietsub nhanh nhất.
                        </p>
                    </div>

                    <div className={cx('col')}>
                        <h3 className={cx('heading')}>Danh mục</h3>
                        <ul className={cx('list')}>
                            <li><Link to="/the-loai/phim-le">Phim lẻ</Link></li>
                            <li><Link to="/the-loai/phim-bo">Phim bộ</Link></li>
                            <li><Link to="/the-loai/phim-chieu-rap">Phim chiếu rạp</Link></li>
                            <li><Link to="/the-loai/hoat-hinh">Hoạt hình</Link></li>
                        </ul>
                    </div>

                    <div className={cx('col')}>
                        <h3 className={cx('heading')}>Hỗ trợ</h3>
                        <ul className={cx('list')}>
                            <li><Link to="/faq">Hỏi đáp (FAQ)</Link></li>
                            <li><Link to="/contact">Liên hệ chúng tôi</Link></li>
                            <li><Link to="/terms">Điều khoản sử dụng</Link></li>
                            <li><Link to="/privacy">Chính sách bảo mật</Link></li>
                        </ul>
                    </div>

                    <div className={cx('col')}>
                        <h3 className={cx('heading')}>Kết nối với chúng tôi</h3>
                        <div className={cx('socials')}>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className={cx('social-item')}>
                                <Facebook size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className={cx('social-item')}>
                                <Twitter size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className={cx('social-item')}>
                                <Instagram size={20} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noreferrer" className={cx('social-item')}>
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={cx('bottom')}>
                    <p>© {new Date().getFullYear()} ROPHIM. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;