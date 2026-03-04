import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './MovieCard.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faHeart, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

export default function MovieCard({ movie, isVertical = true }) {
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeoutRef = useRef(null);
    const navigate = useNavigate();

    const imgUrl = isVertical ? `https://phimimg.com/${movie.poster_url}` : `https://phimimg.com/${movie.thumb_url}`;

    const handleMouseEnter = () => {
        hoverTimeoutRef.current = setTimeout(() => setIsHovered(true), 400);
    };

    const handleMouseLeave = () => {
        clearTimeout(hoverTimeoutRef.current);
        setIsHovered(false);
    };

    return (
        <div className={cx('card-wrapper')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Link to={`/xem-phim/${movie.slug}`} className={cx('product-link')}>
                <div className={cx('product-img', { vertical: isVertical, horizontal: !isVertical })}>
                    <img src={imgUrl} alt={movie.name} />
                </div>
                <div className={cx('product-name')}>{movie.name}</div>
                <div className={cx('product-origin-name')}>{movie.origin_name}</div>
            </Link>

            {isHovered && (
                <div className={cx('hover-card-popup')}>
                    <div className={cx('hover-img-wrapper')}>
                        <img src={`https://phimimg.com/${movie.thumb_url}`} alt={movie.name} />
                        <div className={cx('hover-logo')}>{movie.name}</div>
                    </div>

                    <div className={cx('hover-info')}>
                        <h4 className={cx('hover-title')}>{movie.origin_name}</h4>

                        <div className={cx('action-buttons')}>
                            <button className={cx('btn-primary')} onClick={() => navigate(`/xem-phim/${movie.slug}`)}>
                                <FontAwesomeIcon icon={faPlay} /> Xem ngay
                            </button>
                            <button className={cx('btn-secondary')} title="Thêm vào tủ phim">
                                <FontAwesomeIcon icon={faHeart} />
                            </button>
                            <button
                                className={cx('btn-secondary')}
                                title="Chi tiết"
                                onClick={() => navigate(`/phim/${movie.slug}`)}
                            >
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </button>
                        </div>

                        <div className={cx('meta-tags')}>
                            <span className={cx('imdb')}>IMDb {movie?.tmdb?.vote_average || 'N/A'}</span>
                            <span className={cx('quality')}>{movie.quality || 'FHD'}</span>
                            <span className={cx('year')}>{movie.year}</span>
                            <span className={cx('episode')}>{movie.episode_current || 'Full'}</span>
                        </div>

                        <div className={cx('genres')}>Hành động • Viễn tưởng</div>
                    </div>
                </div>
            )}
        </div>
    );
}
