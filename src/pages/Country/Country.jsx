import classNames from 'classnames/bind';
import styles from './Country.module.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading/Loading';

const cx = classNames.bind(styles);

function Country() {
    const { slug } = useParams();
    const [movies, setMovies] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchApi = async () => {
            try {
                setLoading(true);
                const request = await fetch(`https://phimapi.com/v1/api/quoc-gia/${slug}/?limit=16`);
                const data = await request.json();
                setMovies(data.data);
                setLoading(false);
            } catch {
                console.log('error');
            }
        };
        fetchApi();
    }, [slug]);
    if (loading) {
        return <Loading />;
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <p className={cx('title-page')}>Phim {movies.titlePage}</p>
                <div className={cx('product-list')}>
                    {movies.items?.map((movie, index) => {
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
    );
}

export default Country;
