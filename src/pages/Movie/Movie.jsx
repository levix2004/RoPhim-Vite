import { useParams } from 'react-router-dom';
import styles from './Movie.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faPlay, faPlus, faShare } from '@fortawesome/free-solid-svg-icons';
import { faBarsStaggered, faCaretDown, faLanguage } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

function Movie() {
    const { slug } = useParams();
    const [movie, setMovie] = useState({});
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            const request = await fetch(`https://phimapi.com/phim/${slug}`);
            const data = await request.json();
            setMovie(data.movie);
            const vietsubServer =
                data.episodes.find((s) => s.server_name.toLowerCase().includes('vietsub')) || data.episodes[0];
            setEpisodes(vietsubServer.server_data);
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
                                <FontAwesomeIcon icon={faHeart} className={cx('icon')} />
                                <p>Yêu thích</p>
                            </div>
                            <div className={cx('add-btn')}>
                                <FontAwesomeIcon icon={faPlus} className={cx('icon')} />
                                <p>Thêm vào</p>
                            </div>
                            <div className={cx('share-btn')}>
                                <FontAwesomeIcon icon={faShare} className={cx('icon')} />
                                <p>Chia sẻ</p>
                            </div>
                            <div className={cx('cmt-btn')}>
                                <FontAwesomeIcon icon={faComment} className={cx('icon')} />
                                <p>Bình luận</p>
                            </div>
                        </div>
                        <div className={cx('content-box')}>
                            <div className={cx('tabs-nav')}>
                                <p className={cx({ active: 1 == active })} onClick={() => setActive(1)}>
                                    Tập phim
                                </p>
                                <p className={cx({ active: 2 == active })} onClick={() => setActive(2)}>
                                    Gallery
                                </p>
                                <p className={cx({ active: 3 == active })} onClick={() => setActive(3)}>
                                    Diễn viên
                                </p>
                                <p className={cx({ active: 4 == active })} onClick={() => setActive(4)}>
                                    Đề xuất
                                </p>
                            </div>
                            <div className={cx('tab-content')}>
                                <div className={cx('ep-content', { active: 1 == active })}>
                                    <div className={cx('episodes-section')}>
                                        <div className={cx('ep-header')}>
                                            <div className={cx('ss-header')}>
                                                <div className={cx('header-box')}>
                                                    <p>
                                                        <span>
                                                            <FontAwesomeIcon
                                                                icon={faBarsStaggered}
                                                                className={cx('bars-icon')}
                                                            />
                                                        </span>{' '}
                                                        Phần 1{' '}
                                                        <span>
                                                            <FontAwesomeIcon
                                                                icon={faCaretDown}
                                                                className={cx('drop-icon')}
                                                            />
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={cx('caption-box')}>
                                                <button className={cx('cap-btn')}>
                                                    <span>
                                                        <FontAwesomeIcon icon={faLanguage} />
                                                    </span>
                                                    Phụ đề
                                                </button>
                                            </div>
                                        </div>
                                        <div className={cx('ep-body')}>
                                            {episodes.map((ep, index) => (
                                                <Link
                                                    key={index}
                                                    to={`/xem-phim/${slug}`}
                                                    state={{ episode: ep }} // truyền episode qua state
                                                >
                                                    <div className={cx('ep-box')}>
                                                        <p>
                                                            <FontAwesomeIcon
                                                                icon={faPlay}
                                                                className={cx('play-icon')}
                                                            />
                                                            {ep.name}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('gall-content', { active: 2 == active })}></div>
                                <div className={cx('actor-content', { active: 3 == active })}></div>
                                <div className={cx('sg-content', { active: 4 == active })}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Movie;
