import { useParams } from 'react-router-dom';
import styles from './Movie.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faPlay, faPlus, faShare } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Movie() {
    const { slug } = useParams();
    const [movie, setMovie] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            const request = await fetch(`https://phimapi.com/phim/${slug}`);
            const data = await request.json();
            setMovie(data.movie);
            setLoading(false);
        };
        fetchMovie();
    }, []);
    if (loading) {
        return (
            <>
                <h1>Đang tải</h1>
            </>
        );
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('movie-thumb')}>
                <img src={movie.thumb_url}></img>
            </div>
            <div className={cx('container')}>
                <div className={cx('movie-side')}>
                    <div className={cx('info')}>
                        <div className={cx('movie-img')}>
                            <img src={movie.poster_url}></img>
                        </div>
                        <div className={cx('movie-title')}>
                            <p>{movie.name}</p>
                        </div>
                        <div className={cx('movie-origin-name')}>
                            <p>{movie?.origin_name}</p>
                        </div>
                        <div className={cx('movie-stats')}>
                            <p>IMDb {movie?.tmdb.vote_average}</p>
                            <p>{movie?.year}</p>
                            <p>{movie?.time}</p>

                            <p>{movie?.status}</p>
                        </div>
                        <div className={cx('movie-categories')}>
                            {movie?.category.map((item, index) => (
                                <p key={index}>{item.name}</p>
                            ))}
                        </div>
                        <div className={cx('movie-desc')}>
                            <p className={cx('label')}>Giới thiệu: </p>
                            <p>{movie.content}</p>
                        </div>
                        <div className={cx('movie-time')}>
                            <p className={cx('label')}>Thời lượng: </p>
                            <p>{movie.time}</p>
                        </div>
                        <div className={cx('movie-coun')}>
                            <p className={cx('label')}>Quốc gia: </p>
                            <p>{movie.country[0].name}</p>
                        </div>
                        <div className={cx('movie-direc')}>
                            <p className={cx('label')}>Đạo diễn</p>
                            <p>{movie.director[0]}</p>
                        </div>
                    </div>
                </div>
                <div className={cx('movie-main')}>
                    <div className={cx('inner')}>
                        <div className={cx('toolbar')}>
                            <div className={cx('watch-btn')}>
                                <FontAwesomeIcon icon={faPlay} />
                                <p>Xem ngay</p>
                            </div>
                            <div className={cx('like-btn')}>
                                <FontAwesomeIcon icon={faHeart} className={cx('icon')}/>
                                <p>Yêu thích</p>
                            </div>
                            <div className={cx('add-btn')}>
                                <FontAwesomeIcon icon={faPlus} className={cx('icon')}/>
                                <p>Thêm vào</p>
                            </div>
                            <div className={cx('share-btn')}>
                                <FontAwesomeIcon icon={faShare} className={cx('icon')}/>
                                <p>Chia sẻ</p>
                            </div>
                            <div className={cx('cmt-btn')}>
                                <FontAwesomeIcon icon={faComment} className={cx('icon')}/>
                                <p>Bình luận</p>
                            </div>
                        </div>
                        <div className={cx("content-box")}>
                            <div className={cx('tabs-nav')}></div>
                            <div className={cx('tab-content')}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Movie;
