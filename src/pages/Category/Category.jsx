import classNames from 'classnames/bind';
import styles from './Category.module.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong, faRightLong, faSpinner } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Category() {
    // const pageNumber = useRef(1);
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
    }, [slug, page]);
    const handleBack = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };
    const handleNext = () => {
        setPage(page + 1);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <p className={cx('title-page')}>Phim {movies.titlePage}</p>
                {loading ? (
                    <div className={cx('loading')}>
                        <FontAwesomeIcon icon={faSpinner} className={cx('spinner')} size="3x" />
                    </div>
                ) : (
                    <div className={cx('product-list','fade-in')}>
                        {movies.items?.map((movie, index) => (
                            <div key={index} className={cx('product-item')}>
                                <div className={cx('product-img')}>
                                    <img src={`https://phimimg.com/${movie.poster_url}`} alt="" />
                                </div>
                                <div className={cx('product-name')}>{movie.name}</div>
                                <div className={cx('product-origin-name')}>{movie.origin_name}</div>
                            </div>
                        ))}
                    </div>
                )}
                <div className={cx('pagination')}>
                    <div className={cx('nav-page')}>
                        <div className={cx('fr-btn')} onClick={() => handleBack()}>
                            <FontAwesomeIcon icon={faLeftLong} />
                        </div>
                        <div className={cx('current-page')}>
                            Trang <span className={cx('num')}>{page} </span>/ {movies?.params?.pagination?.totalPages}
                        </div>
                        <div className={cx('back-btn')} onClick={() => handleNext()}>
                            <FontAwesomeIcon icon={faRightLong} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Category;
