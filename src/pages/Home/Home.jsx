import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Slider from '../../components/Slider/Slider';
import { useEffect, useState } from 'react';
const cx = classNames.bind(styles);

function Home() {
    const [movies, setMovies] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const [moviesApi, tvSeriesApi, singleMoviesApi, newMoviesApi] = await Promise.all([
                    fetch(`https://phimapi.com/v1/api/danh-sach/phim-chieu-rap/?limit=12`),
                    fetch(`https://phimapi.com/v1/api/danh-sach/phim-bo/?limit=12`),
                    fetch(`https://phimapi.com/v1/api/danh-sach/phim-le/?limit=12`),
                    fetch(`https://phimapi.com/danh-sach/phim-moi-cap-nhat/?limit=12`),
                ]);
                const [moviesData, tvSeriesData, singleMoviesData, newMoviesData] = await Promise.all([
                    moviesApi.json(),
                    tvSeriesApi.json(),
                    singleMoviesApi.json(),
                    newMoviesApi.json(),
                ]);
                setMovies({
                    moviesApi: moviesData,
                    tvSeriesApi: tvSeriesData,
                    singleMoviesApi: singleMoviesData,
                    newMoviesApi: newMoviesData,
                });
                setLoading(false);
            } catch {
                console.log('error');
            }
        };
        fetchApi();
    }, []);

    if (loading) {
        return <h1>Đang tải</h1>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <Slider movies={movies.moviesApi.data.items}></Slider>
            </div>
        </div>
    );
}

export default Home;
