import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import Pagination from '../../components/Pagination/Pagination';
import Loading from '../../components/Loading/Loading';

const cx = classNames.bind(styles);

export default function HistoryTab() {
    const [historyMovies, setHistoryMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                setLoading(true);
                const res = await fetch(`http://rophim-be-dr9q.onrender.com/api/user/history?page=${page}&limit=6`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setHistoryMovies(data.data || data.items || []);
                setTotalPages(data.pagination.totalPages || 1);
                console.log('Lịch sử xem:', data);
            } catch (error) {
                console.error('Lỗi tải lịch sử:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
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
            <h3>Tiếp tục xem</h3>
            <div className={cx('movie-grid')}>
                {historyMovies.length > 0 ? (
                    historyMovies.map((item) => {
                        const duration = item.duration || item.movie?.duration || 0;
                        const percent = duration > 0 ? Math.min((item.currentTime / duration) * 100, 100) : 0;

                        return (
                            <Link
                                to={`/xem-phim/${item.movie?.slug}`}
                                key={item._id}
                                state={{ episode: item.episode, currentTime: item.currentTime }}
                            >
                                <div className={cx('movie-card')}>
                                    <div className={cx('poster-wrapper')}>
                                        <img
                                            src={item.movie?.posterUrl || item.movie?.poster_url}
                                            alt={item.movie?.title}
                                        />
                                        <div className={cx('play-icon')}>
                                            <FontAwesomeIcon icon={faPlay} />
                                        </div>
                                        <div className={cx('progress-bar')}>
                                            <div className={cx('progress')} style={{ width: `${percent}%` }}></div>
                                        </div>
                                    </div>
                                    <div className={cx('movie-info')}>
                                        <p className={cx('movie-title')}>{item.movie?.title}</p>
                                        <span className={cx('movie-meta')}>
                                            {item.episode ? `${item.episode} - ` : ''}
                                            {Math.round(percent)}%
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <p style={{ color: '#aaa' }}>Bạn chưa xem bộ phim nào.</p>
                )}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
}
