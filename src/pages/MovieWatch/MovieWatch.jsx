import classNames from 'classnames/bind';
import styles from './MovieWatch.module.scss';
import M3u8Player from './M3u8Player';
import { useEffect, useRef, useState } from 'react';
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
import { useLocation } from 'react-router-dom';

import Loading from '../../components/Loading/Loading';
import { useWatchlist } from '../../hooks/useWatchList';
import MovieComments from '../../components/MovieComments/MovieComments';
import decodeHtml from '../../untils/decodeHtml';

const cx = classNames.bind(styles);

function MovieWatch() {
    const location = useLocation();
    const selectedEpFromState = location.state?.episode || null;
    const { slug } = useParams();
    const [episodes, setEpisodes] = useState([]);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const lastSaveTimeRef = useRef(0);
    const [suggestedMovies, setSuggestedMovies] = useState([]);
    const stateCurrentTime = location.state?.currentTime;
    const [savedTime, setSavedTime] = useState(stateCurrentTime || 0);
    const { liked, toggleLike } = useWatchlist(movie);
    useEffect(() => {
        async function fetchApi() {
            try {
                setLoading(true);
                window.scrollTo({ top: 200, behavior: 'smooth' });
                const request = await fetch(`https://phimapi.com/phim/${slug}`);
                const data = await request.json();

                setMovie(data.movie);

                const vietsubServer =
                    data.episodes.find((s) => s.server_name.toLowerCase().includes('vietsub')) || data.episodes[0];
                const listEpisodes = vietsubServer.server_data;

                setEpisodes(listEpisodes);

                if (selectedEpFromState) {
                    const foundEpisode = listEpisodes.find((ep) => ep.name == selectedEpFromState);

                    if (foundEpisode) {
                        console.log('Tìm thấy tập đã xem:', foundEpisode);
                        setCurrentEpisode(foundEpisode);
                    } else {
                        setCurrentEpisode(listEpisodes[0]);
                    }
                } else {
                    setCurrentEpisode(listEpisodes[0]);
                }
                // ---------------------------

                setLoading(false);
            } catch (e) {
                console.log('Error fetch movie:', e);
                setLoading(false);
            }
        }
        fetchApi();
    }, [slug]);
    useEffect(() => {
        const fetchHistory = async () => {
            if (stateCurrentTime !== undefined && stateCurrentTime !== null) {
                return;
            }
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await fetch(`http://rophim-be-dr9q.onrender.com/api/user/history/detail?slug=${slug}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (data.currentTime) {
                    setSavedTime(data.currentTime);
                }
            } catch (error) {
                console.error('Lỗi lấy lịch sử:', error);
            }
        };

        fetchHistory();
    }, [slug, stateCurrentTime]);
    useEffect(() => {
        async function fetchSuggestions() {
            try {
                const res = await fetch('https://phimapi.com/v1/api/danh-sach/phim-chieu-rap/?limit=10');
                const data = await res.json();
                setSuggestedMovies(data.data.items.slice(0, 8));
            } catch (err) {
                console.error('Lỗi tải đề xuất:', err);
            }
        }

        fetchSuggestions();
    }, []);
    if (loading) {
        return <Loading />;
    }
    const changeEpisode = (src) => {
        console.log(src);
        setCurrentEpisode(src);
        setSavedTime(0);
        lastSaveTimeRef.current = 0;
    };

    const handleProgress = async ({ currentTime, duration }) => {
        if (Math.abs(currentTime - lastSaveTimeRef.current) > 10) {
            console.log('Đã xem đến giây:', currentTime);
            lastSaveTimeRef.current = currentTime;
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('Người dùng chưa đăng nhập, không lưu lịch sử.');
                    return;
                }
                const payload = {
                    movieData: {
                        refId: movie.slug,
                        title: movie.name,
                        poster_url: movie.poster_url,
                        slug: slug,
                        totalEpisodes: movie.episode_total || 0,
                    },
                    episode: currentEpisode.name,
                    currentTime: currentTime,
                    duration: duration,
                };

                const response = await fetch('http://rophim-be-dr9q.onrender.com/api/user/history', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error('Lỗi Server khi lưu lịch sử');
                }

                const data = await response.json();
                console.log('✅ Đã lưu lịch sử:', currentTime, data);
            } catch (error) {
                console.error('❌ Lỗi lưu lịch sử:', error);
            }
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('watch-player')}>
                    <div className={cx('bread-crumb')}>
                        <Link to={`/phim/${slug}`}>
                            <p className={cx('bread-name')}>
                                <FontAwesomeIcon icon={faArrowLeft} className={cx('arrow-icon')} />
                                Xem phim {movie.name}
                            </p>
                        </Link>
                    </div>
                    {currentEpisode && (
                        <div className={cx('watch-wrapper')}>
                            {console.log(currentEpisode.link_m3u8)}
                            <div className={cx('watch-ratio')}>
                                <M3u8Player
                                    key={currentEpisode.link_m3u8}
                                    src={currentEpisode.link_m3u8}
                                    onProgress={handleProgress}
                                    startTime={savedTime}
                                />
                            </div>
                            <div className={cx('row-player-control')}>
                                <div className={cx('control-item')}>
                                    <div
                                        className={cx('like-box')}
                                        onClick={() => {
                                            toggleLike(movie);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faHeart} className={cx('icon', { red: liked })} /> Yêu
                                        thích
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
                                    <p>{decodeHtml(movie.content)}</p>
                                </div>
                                <div className={cx('more-info')}>
                                    <a href={`/phim/${slug}`}>
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
                                            Danh sách tập{' '}
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
                        <div className={cx('suggest-movies')}>
                            <div className={cx('sm-list')}>
                                <p className={cx('sm-header')}>Đề xuất cho bạn</p>
                                {suggestedMovies.slice(0, 6).map((movie, index) => (
                                    <Link key={index} to={`/xem-phim/${movie.slug}`}>
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
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <MovieComments movieSlug={movie.slug} />
            </div>
        </div>
    );
}

export default MovieWatch;
