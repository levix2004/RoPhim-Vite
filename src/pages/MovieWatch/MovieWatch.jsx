import classNames from 'classnames/bind';
import styles from './MovieWatch.module.scss';
import M3u8Player from './M3u8Player';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleRight,
    faArrowLeft,
    faBarsStaggered,
    faCaretDown,
    faFlag,
    faHeart,
    faLanguage,
    faMessage,
    faPlay,
    faPlus,
    faShare,
    faStar,
    faToggleOff,
} from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);

function MovieWatch() {
    const { slug } = useParams();
    const [episodes, setEpisodes] = useState([]);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchApi() {
            try {
                setLoading(true);
                const request = await fetch(`https://phimapi.com/phim/${slug}`);
                const data = await request.json();
                setMovie(data.movie);
                const vietsubServer =
                    data.episodes.find((s) => s.server_name.toLowerCase().includes('vietsub')) || data.episodes[0];
                setEpisodes(vietsubServer.server_data);
                setCurrentEpisode(vietsubServer.server_data[0]);
                setLoading(false);
            } catch {
                console.log('Error');
            }
        }
        fetchApi();
    }, [slug]);
    const [suggestedMovies, setSuggestedMovies] = useState([]);

    useEffect(() => {
        async function fetchSuggestions() {
            try {
                const res = await fetch('https://phimapi.com/v1/api/danh-sach/phim-chieu-rap/?limit=10');
                const data = await res.json();
                setSuggestedMovies(data.data.items.slice(0, 8)); // lấy 5 phim đầu
            } catch (err) {
                console.error('Lỗi tải đề xuất:', err);
            }
        }

        fetchSuggestions();
    }, []);
    if (loading) {
        return (
            <div>
                <h1>Đang tải</h1>
            </div>
        );
    }
    const changeEpisode = (src) => {
        console.log(src);
        setCurrentEpisode(src);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('watch-player')}>
                    <div className={cx('bread-crumb')}>
                        <Link to={'/'}>
                            <p className={cx('bread-name')}>
                                <FontAwesomeIcon icon={faArrowLeft} className={cx('arrow-icon')} />
                                Xem phim {movie.name}
                            </p>
                        </Link>
                    </div>
                    {currentEpisode && (
                        <div className={cx('watch-wrapper')}>
                            <div className={cx('watch-ratio')}>
                                <M3u8Player src={currentEpisode.link_m3u8} />
                            </div>
                            <div className={cx('row-player-control')}>
                                <div className={cx('control-item')}>
                                    <div className={cx('like-box')}>
                                        <FontAwesomeIcon icon={faHeart} className={cx('icon')} /> Yêu thích
                                    </div>
                                    <div className={cx('add-box')}>
                                        <FontAwesomeIcon icon={faPlus} className={cx('icon')} /> Thêm vào
                                    </div>
                                    <div className={cx('theater-mode')}>
                                        Rạp phim{' '}
                                        <FontAwesomeIcon
                                            icon={faToggleOff}
                                            style={{ paddingLeft: '8px', fontSize: '30px' }}
                                            className={cx('icon')}
                                        />
                                    </div>
                                    <div className={cx('share-box')}>
                                        <FontAwesomeIcon icon={faShare} className={cx('icon')} /> Chia sẻ
                                    </div>
                                    <div className={cx('flex-grow')}></div>
                                    <div className={cx('report-box')}>
                                        <FontAwesomeIcon icon={faFlag} className={cx('icon')} /> Báo lỗi
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className={cx('info-section')}>
                    <div className={cx('watch-main')}>
                        <div className={cx('movie-info')}>
                            <div className={cx('thumb')}>
                                <img src={movie.poster_url} alt=""></img>
                            </div>
                            <div className={cx('info')}>
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
                                    <p>{movie?.lang}</p>
                                    <p>{movie?.status}</p>
                                </div>
                                <div className={cx('movie-categories')}>
                                    {movie?.category.map((item, index) => (
                                        <p key={index}>{item.name}</p>
                                    ))}
                                </div>
                            </div>
                            <div className={cx('desc-line')}>
                                <div className={cx('description')}>
                                    <p>{movie.content}</p>
                                </div>
                                <div className={cx('more-info')}>
                                    <a>
                                        Thông tin phim{' '}
                                        <span>
                                            <FontAwesomeIcon icon={faAngleRight} />
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className={cx('episodes-section')}>
                            <div className={cx('ep-header')}>
                                <div className={cx('ss-header')}>
                                    <div className={cx('header-box')}>
                                        <p>
                                            <span>
                                                <FontAwesomeIcon icon={faBarsStaggered} className={cx('bars-icon')} />
                                            </span>{' '}
                                            Phần 1{' '}
                                            <span>
                                                <FontAwesomeIcon icon={faCaretDown} className={cx('drop-icon')} />
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
                                    <Link key={index} to={'#'}>
                                        <div
                                            className={cx('ep-box', { active: ep.name == currentEpisode.name })}
                                            onClick={() => changeEpisode(ep)}
                                        >
                                            <p>
                                                {' '}
                                                <FontAwesomeIcon icon={faPlay} className={cx('play-icon')} />
                                                {ep.name}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={cx('watch-side')}>
                        {/* <div className={cx('ws-rate')}>
                                <div className={cx('line-box')}>
                                    <div className={cx('rate')}><FontAwesomeIcon icon={faStar}/><p>Đánh giá</p></div>
                                    <div className={cx('comments')}><FontAwesomeIcon icon={faMessage}/><p>Bình luận</p></div>
                                </div>
                                <div className={cx('w-rate')}></div>
                            </div> */}
                        <div className={cx('suggest-movies')}>
                            <div className={cx('sm-list')}>
                                <p className={cx('sm-header')}>Đề xuất cho bạn</p>
                                {suggestedMovies.map((movie, index) => (
                                    <div key={index} className={cx('sm-item')}>
                                        <div className={cx('sm-thumb')}>
                                            <img src={`https://phimimg.com/${movie.poster_url}`} alt=""></img>
                                        </div>
                                        <div className={cx('sm-info')}>
                                            <div className={cx('name')}>{movie.name}</div>
                                            <div className={cx('origin-name')}>{movie.origin_name}</div>
                                            <div className={cx('stats')}>
                                                <p>{movie.lang}</p>
                                                <p>{movie.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieWatch;
