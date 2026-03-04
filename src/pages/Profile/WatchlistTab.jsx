import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import Pagination from '../../components/Pagination/Pagination';
import Loading from '../../components/Loading/Loading';

const cx = classNames.bind(styles);

export default function WatchlistTab() {
    const [watchList, setWatchList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchList = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                setLoading(true);
                const res = await fetch(`http://localhost:3000/api/user/watchlist?page=${page}&limit=6`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (data.success) {
                    setWatchList(data.data || []);
                    setTotalPages(data.pagination.totalPages || 1);
                }
            } catch (error) {
                console.error('Lỗi tải tủ phim:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchList();
    }, [page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 200, behavior: 'smooth' });
    };
    if (loading) {
        return <Loading />;
    }
    return (
        <div className={cx('section-container')}>
            <h3>Danh sách yêu thích</h3>

            <div className={cx('movie-grid')}>
                {watchList.length > 0 ? (
                    watchList.map((item) => (
                        <Link to={`/xem-phim/${item.movie?.slug}`} key={item._id}>
                            <div className={cx('movie-card')}>
                                <div className={cx('poster-wrapper')}>
                                    <img
                                        src={item.movie?.posterUrl || item.movie?.poster_url}
                                        alt={item.movie?.title}
                                    />
                                    <div className={cx('play-icon')}>
                                        <FontAwesomeIcon icon={faPlay} />
                                    </div>
                                </div>
                                <div className={cx('movie-info')}>
                                    <p className={cx('movie-title')}>{item.movie?.title}</p>
                                    <span className={cx('movie-meta')}>{item.movie?.year}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p style={{ color: '#aaa' }}>Tủ phim của bạn đang trống.</p>
                )}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
}
