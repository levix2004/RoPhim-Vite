import styles from './Slider.module.scss';
import classNames from 'classnames/bind';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState, useRef } from 'react';

// Import Swiper styles
import 'swiper/css';
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faHeart, faPlay } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
function Slider({ movies }) {
    const swiperRef = useRef(null);
    const [activeIndex, setActiceIndex] = useState(0);
    const [movieDetail, setMovieDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const requestMovies = movies.map((movie) =>
                    fetch(`https://phimapi.com/phim/${movie.slug}`).then((res) => res.json()),
                );
                const details = await Promise.all(requestMovies);
                setMovieDetail(details);
                setLoading(false);
            } catch {
                console.log('error');
            }
        };
        fetchApi();
    }, [movies]);

    if (loading) {
        return (
            <div>
                <h1>Đang tải...</h1>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <Swiper
                    modules={[Pagination]}
                    spaceBetween={50}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    onSlideChange={(swiper) => setActiceIndex(swiper.realIndex)}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                >
                    {movies.slice(0, 6).map((movie, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <img src={`https://phimimg.com/${movie.thumb_url}`} alt=""></img>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                <div className={cx('movie-info')}>
                    <div className={cx('movie-title')}>
                        <p>{movieDetail[activeIndex]?.movie?.name}</p>
                    </div>
                    <div className={cx('movie-origin-name')}>
                        <p>{movieDetail[activeIndex]?.movie?.origin_name}</p>
                    </div>
                    <div className={cx('movie-stats')}>
                        <p>IMDb {movieDetail[activeIndex]?.movie?.tmdb.vote_average}</p>
                        <p>{movieDetail[activeIndex]?.movie?.year}</p>
                        <p>{movieDetail[activeIndex]?.movie?.time}</p>
                        <p>{movieDetail[activeIndex]?.movie?.lang}</p>
                        <p>{movieDetail[activeIndex]?.movie?.status}</p>
                    </div>
                    <div className={cx('movie-categories')}>
                        {movieDetail[activeIndex]?.movie?.category.map((item, index) => (
                            <p key={index}>{item.name}</p>
                        ))}
                    </div>
                    <div className={cx('movie-story')}>
                        <p>{movieDetail[activeIndex]?.movie?.content}</p>
                    </div>
                    <div className={cx('touch')}>
                        <a className={cx('button-play')}>
                            <FontAwesomeIcon className={cx('play-icon')} icon={faPlay} />
                        </a>
                        <div className={cx('touch-group')}>
                            <a className={cx('item')}>
                                <FontAwesomeIcon className={cx('heart-icon')} icon={faHeart} />
                            </a>
                            <a className={cx('item')}>
                                <FontAwesomeIcon className={cx('circleinfo-icon')} icon={faCircleInfo} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('swiper-thumbnails')}>
                {movies.slice(0, 6).map((movie, index) => (
                    <img
                        key={index}
                        src={`https://phimimg.com/${movie.thumb_url}`}
                        alt=""
                        className={cx('thumb', { active: index === activeIndex })}
                        onClick={() => swiperRef.current?.slideTo(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Slider;
