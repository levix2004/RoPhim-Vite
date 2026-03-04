import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Slider from '../../components/Slider/Slider';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import MovieCard from '../../components/MovieCard/MovieCard';

const cx = classNames.bind(styles);

function Home() {
    const [movies, setMovies] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const [moviesApi, tvSeriesApi, singleMoviesApi, animeMoviesApi, vNMoviesApi, cNMoviesApi, kRMoviesApi] =
                    await Promise.all([
                        fetch(`https://phimapi.com/v1/api/danh-sach/phim-chieu-rap/?limit=12`),
                        fetch(`https://phimapi.com/v1/api/danh-sach/phim-bo/?limit=12`),
                        fetch(`https://phimapi.com/v1/api/danh-sach/phim-le/?limit=12`),
                        fetch(`https://phimapi.com/v1/api/danh-sach/hoat-hinh/?limit=12`),
                        fetch(`https://phimapi.com/v1/api/quoc-gia/viet-nam`),
                        fetch(`https://phimapi.com/v1/api/quoc-gia/trung-quoc`),
                        fetch(`https://phimapi.com/v1/api/quoc-gia/han-quoc`),
                    ]);
                const [
                    moviesData,
                    tvSeriesData,
                    singleMoviesData,
                    animeMoviesData,
                    vNMoviesData,
                    cNMoviesData,
                    kRMoviesData,
                ] = await Promise.all([
                    moviesApi.json(),
                    tvSeriesApi.json(),
                    singleMoviesApi.json(),
                    animeMoviesApi.json(),
                    vNMoviesApi.json(),
                    cNMoviesApi.json(),
                    kRMoviesApi.json(),
                ]);
                setMovies({
                    moviesApi: moviesData,
                    tvSeriesApi: tvSeriesData,
                    singleMoviesApi: singleMoviesData,
                    animeMoviesApi: animeMoviesData,
                    vNMoviesApi: vNMoviesData,
                    cNMoviesApi: cNMoviesData,
                    kRMoviesApi: kRMoviesData,
                });
                setLoading(false);
            } catch {
                console.log('error');
            }
        };
        fetchApi();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper')}>
            <Slider movies={movies.moviesApi.data.items}></Slider>
            <div className={cx('container')}>
                <div className={cx('content-section')}>
                    {/*  */}
                    <div className={cx('product-section')}>
                        <div className={cx('product-container')}>
                            <div className={cx('row-intro')}>
                                <div className={cx('intro')}>
                                    <div
                                        className={cx('list-name')}
                                        style={{
                                            background:
                                                'linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(255, 0, 153) 130%)',
                                        }}
                                    >
                                        Phim Việt Nam mới
                                    </div>
                                    <div className={cx('more')}>
                                        Xem toàn bộ <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                                    </div>
                                </div>
                                {/* row1 */}
                                <div className={cx('row-product-swiper')}>
                                    {
                                        <Swiper
                                            className={cx('custom-swiper')}
                                            modules={[Navigation]}
                                            navigation={{
                                                prevEl: '.swiper-button-prev-1',
                                                nextEl: '.swiper-button-next-1',
                                            }}
                                            spaceBetween={50}
                                            slidesPerView={5}
                                            onSlideChange={() => console.log('slide change')}
                                            onSwiper={() => {}}
                                        >
                                            {movies.vNMoviesApi.data.items.map((movie, index) => {
                                                return (
                                                    <SwiperSlide key={index}>
                                                        <div className={cx('product-item')}>
                                                            <div className={cx('product-img')}>
                                                                <Link to={`/xem-phim/${movie.slug}`}>
                                                                    <img
                                                                        src={`https://phimimg.com/${movie.thumb_url}`}
                                                                        alt=""
                                                                    />
                                                                </Link>
                                                            </div>
                                                            <div className={cx('product-name')}>{movie.name}</div>
                                                            <div className={cx('product-origin-name')}>
                                                                {movie.origin_name}
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                );
                                            })}
                                        </Swiper>
                                    }
                                    <div className={cx('custom-navigation')}>
                                        <button className="swiper-button-prev-1">
                                            <FontAwesomeIcon icon={faAngleLeft} />
                                        </button>
                                        <button className="swiper-button-next-1">
                                            <FontAwesomeIcon icon={faAngleRight} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('row-intro')}>
                                <div className={cx('intro')}>
                                    <div
                                        className={cx('list-name')}
                                        style={{
                                            background:
                                                'linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(103, 65, 150) 130%)',
                                        }}
                                    >
                                        Phim Trung Quốc mới
                                    </div>
                                    <div className={cx('more')}>
                                        Xem toàn bộ <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                                    </div>
                                </div>
                                {/* row2 */}
                                <div className={cx('row-product-swiper')}>
                                    {
                                        <Swiper
                                            className={cx('custom-swiper')}
                                            modules={[Navigation]}
                                            navigation={{
                                                prevEl: '.swiper-button-prev-2',
                                                nextEl: '.swiper-button-next-2',
                                            }}
                                            spaceBetween={50}
                                            slidesPerView={5}
                                            onSlideChange={() => console.log('slide change')}
                                            onSwiper={() => {}}
                                        >
                                            {movies.cNMoviesApi.data.items.map((movie, index) => {
                                                return (
                                                    <SwiperSlide key={index}>
                                                        <div className={cx('product-item')}>
                                                            <div className={cx('product-img')}>
                                                                <Link to={`/xem-phim/${movie.slug}`}>
                                                                    <img
                                                                        src={`https://phimimg.com/${movie.thumb_url}`}
                                                                        alt=""
                                                                    />
                                                                </Link>
                                                            </div>
                                                            <div className={cx('product-name')}>{movie.name}</div>
                                                            <div className={cx('product-origin-name')}>
                                                                {movie.origin_name}
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                );
                                            })}
                                        </Swiper>
                                    }
                                    <div className={cx('custom-navigation')}>
                                        <button className="swiper-button-prev-2">
                                            <FontAwesomeIcon icon={faAngleLeft} />
                                        </button>
                                        <button className="swiper-button-next-2">
                                            <FontAwesomeIcon icon={faAngleRight} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('row-intro')}>
                                <div className={cx('intro')}>
                                    <div
                                        className={cx('list-name')}
                                        style={{
                                            background:
                                                'linear-gradient(235deg, rgb(255, 255, 255) 30%, rgb(247, 161, 11) 130%)',
                                        }}
                                    >
                                        Phim Hàn Quốc mới
                                    </div>
                                    <div className={cx('more')}>
                                        Xem toàn bộ <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                                    </div>
                                </div>
                                {/* row3 */}
                                <div className={cx('row-product-swiper')}>
                                    {
                                        <Swiper
                                            className={cx('custom-swiper')}
                                            modules={[Navigation]}
                                            navigation={{
                                                prevEl: '.swiper-button-prev-3',
                                                nextEl: '.swiper-button-next-3',
                                            }}
                                            spaceBetween={50}
                                            slidesPerView={5}
                                            onSlideChange={() => console.log('slide change')}
                                            onSwiper={() => {}}
                                        >
                                            {movies.kRMoviesApi.data.items.map((movie, index) => {
                                                return (
                                                    <SwiperSlide key={index}>
                                                        <div className={cx('product-item')}>
                                                            <Link
                                                                to={`/xem-phim/${movie.slug}`}
                                                                className={cx('product-link')}
                                                            >
                                                                <div className={cx('product-img')}>
                                                                    <img
                                                                        src={`https://phimimg.com/${movie.thumb_url}`}
                                                                        alt=""
                                                                    />
                                                                </div>
                                                                <div className={cx('product-name')}>{movie.name}</div>
                                                                <div className={cx('product-origin-name')}>
                                                                    {movie.origin_name}
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </SwiperSlide>
                                                );
                                            })}
                                        </Swiper>
                                    }
                                    <div className={cx('custom-navigation')}>
                                        <button className="swiper-button-prev-3">
                                            <FontAwesomeIcon icon={faAngleLeft} />
                                        </button>
                                        <button className="swiper-button-next-3">
                                            <FontAwesomeIcon icon={faAngleRight} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('row-product')}>
                        <p className={cx('row-product-name')}>Phim Chiếu Rạp</p>
                        {
                            <Swiper
                                className={cx('custom-swiper')}
                                modules={[]}
                                spaceBetween={50}
                                slidesPerView={8}
                                onSlideChange={() => console.log('slide change')}
                                onSwiper={() => {}}
                            >
                                {movies.moviesApi.data.items.map((movie, index) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <MovieCard movie={movie} isVertical={true} />
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        }
                    </div>
                    <div className={cx('row-product')}>
                        <p className={cx('row-product-name')}>Phim Bộ mới cóong</p>
                        {
                            <Swiper
                                className={cx('custom-swiper')}
                                modules={[]}
                                spaceBetween={50}
                                slidesPerView={8}
                                onSlideChange={() => console.log('slide change')}
                                onSwiper={() => {}}
                            >
                                {movies.tvSeriesApi.data.items.map((movie, index) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <div className={cx('product-item')}>
                                                <Link to={`/xem-phim/${movie.slug}`} className={cx('product-link')}>
                                                    <div className={cx('product-img')}>
                                                        <img src={`https://phimimg.com/${movie.poster_url}`} alt="" />
                                                    </div>
                                                    <div className={cx('product-name')}>{movie.name}</div>
                                                    <div className={cx('product-origin-name')}>{movie.origin_name}</div>
                                                </Link>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        }
                    </div>
                    <div className={cx('row-product')}>
                        <p className={cx('row-product-name')}>Phim Lẻ không phải Chẵn</p>
                        {
                            <Swiper
                                className={cx('custom-swiper')}
                                modules={[]}
                                spaceBetween={50}
                                slidesPerView={8}
                                onSlideChange={() => console.log('slide change')}
                                onSwiper={() => {}}
                            >
                                {movies.singleMoviesApi.data.items.map((movie, index) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <div className={cx('product-item')}>
                                                <Link to={`/xem-phim/${movie.slug}`} className={cx('product-link')}>
                                                    <div className={cx('product-img')}>
                                                        <img src={`https://phimimg.com/${movie.poster_url}`} alt="" />
                                                    </div>
                                                    <div className={cx('product-name')}>{movie.name}</div>
                                                    <div className={cx('product-origin-name')}>{movie.origin_name}</div>
                                                </Link>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
