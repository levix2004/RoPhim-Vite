import classNames from 'classnames/bind';
import styles from './Category.module.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function Category() {
    const { slug } = useParams();
    const [movies, setMovies] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    useEffect(() => {
        const fetchApi = async () => {
            try {
                setLoading(true);
                const request = await fetch(`https://phimapi.com/v1/api/the-loai/${slug}?limit=32&page=${page}`);
                const data = await request.json();
                console.log(data.data);
                setMovies(data.data);
                setLoading(false);
            } catch {
                console.log('error');
            }
        };
        fetchApi();
    }, [slug,page]);
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
                <div className={cx('pagination')}>
                    <ul>
                        <li onClick={() => setPage(1)}>1</li>
                        <li onClick={() => setPage(2)}>2{console.log('page 2')}</li>
                        <li onClick={() => setPage(3)}>3 {console.log("page 3")}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Category;
