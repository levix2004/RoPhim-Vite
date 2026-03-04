import { useParams } from 'react-router-dom';
import styles from './Movie.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faComment, 
    faHeart, 
    faPlay, 
    faPlus, 
    faShare, 
    faBarsStaggered, 
    faCaretDown, 
    faLanguage,
    faAngleRight,
    faFlag,
    faToggleOff
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/Loading/Loading';
import { useWatchlist } from '../../hooks/useWatchList';

const cx = classNames.bind(styles);

function Movie() {
    const { slug } = useParams();
    const [movie, setMovie] = useState({});
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const { requireAuth } = useAuth(); 
    const [suggestedMovies, setSuggestedMovies] = useState([]);
    const { liked, toggleLike } = useWatchlist(movie);

    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            try {
                const request = await fetch(`https://phimapi.com/phim/${slug}`);
                const data = await request.json();
                setMovie(data.movie);
                
                const vietsubServer =
                    data.episodes.find((s) => s.server_name.toLowerCase().includes('vietsub')) || data.episodes[0];
                setEpisodes(vietsubServer?.server_data || []);
                
                setLoading(false);
            } catch (error) {
                console.error("Lỗi tải phim:", error);
                setLoading(false);
            }
        };
        fetchMovie();
    }, [slug]);

    useEffect(() => {
        if (movie.country && movie.country.length > 0) {
            async function fetchSuggestions() {
                try {
                    const res = await fetch(`https://phimapi.com/v1/api/quoc-gia/${movie.country[0].slug}?limit=12`);
                    const data = await res.json();
                    setSuggestedMovies(data.data.items.slice(0, 12));
                } catch (err) {
                    console.error('Lỗi tải đề xuất:', err);
                }
            }
            fetchSuggestions();
        }
    }, [movie]);
    if (loading) {
        return (
            <Loading/>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('movie-thumb')}>
                <img src={movie.thumb_url} alt="thumb"></img>
            </div>
            <div className={cx('container')}>
                <div className={cx('movie-side')}>
                    <div className={cx('info')}>
                        <div className={cx('movie-img')}>
                            <img src={movie.poster_url} alt="poster"></img>
                        </div>
                        <div className={cx('movie-title')}>
                            <p>{movie.name}</p>
                        </div>
                        <div className={cx('movie-origin-name')}>
                            <p>{movie?.origin_name}</p>
                        </div>
                        <div className={cx('movie-stats')}>
                            <p>IMDb {movie?.tmdb?.vote_average}</p>
                            <p>{movie?.year}</p>
                            <p>{movie?.time}</p>
                            <p>{movie?.status}</p>
                        </div>
                        <div className={cx('movie-categories')}>
                            {movie?.category?.map((item, index) => (
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
                            <p>{movie.country && movie.country[0]?.name}</p>
                        </div>
                        <div className={cx('movie-direc')}>
                            <p className={cx('label')}>Đạo diễn</p>
                            <p>{movie.director && movie.director[0]}</p>
                        </div>
                    </div>
                </div>
                <div className={cx('movie-main')}>
                    <div className={cx('inner')}>
                        <div className={cx('toolbar')}>
                            <Link to={`/xem-phim/${slug}`}>
                                <div className={cx('watch-btn')}>
                                    <FontAwesomeIcon icon={faPlay} />
                                    <p>Xem ngay</p>
                                </div>
                            </Link>
                            
                            <div 
                                className={cx('like-btn')} 
                                onClick={toggleLike}
                                style={{ cursor: 'pointer' }}
                            >
                                <FontAwesomeIcon 
                                    icon={faHeart} 
                                    className={cx('icon', { red: liked })} 
                                />
                                <p>{liked ? 'Đã thích' : 'Yêu thích'}</p>
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
                                                        Danh sách tập{' '}
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
                                                    state={{ episode: ep.name }} 
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
                                <div className={cx('sg-content', { active: 4 == active })}>
                                    <div className={cx('list-product')}>
                                        {suggestedMovies.map((movie, index) => {
                                            return (
                                                <div key={index} className={cx('product-item')}>
                                                    <div className={cx('product-img')}>
                                                        <img src={`https://phimimg.com/${movie.poster_url}`} alt="" />
                                                    </div>
                                                    <div className={cx('product-name')}>{movie.name}</div>
                                                    <div className={cx('product-origin-name')}>{movie.origin_name}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Movie;