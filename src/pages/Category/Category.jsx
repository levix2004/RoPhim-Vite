import classNames from 'classnames/bind';
import styles from './Category.module.scss';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong, faRightLong, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../components/Loading/Loading';
import axios from 'axios';
import Pagination from '../../components/Pagination/Pagination';


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
                const res = await axios.get(`https://phimapi.com/v1/api/the-loai/${slug}?limit=32&page=${page}`);
                console.log(res);
                setMovies(res.data.data);
                setLoading(false);
            } catch {
                console.log('error');
            }
        };
        fetchApi();
    }, [slug, page]);
    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };
    if (loading) {
        return <Loading />;
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <p className={cx('title-page')}>Phim {movies.titlePage}</p>

                <div className={cx('product-list', 'fade-in')}>
                    {movies.items?.map((movie, index) => (
                        <div key={index} className={cx('product-item')}>
                            <div className={cx('product-img')}>
                                <Link to={`/xem-phim/${movie.slug}`}>
                                    <img src={`https://phimimg.com/${movie.poster_url}`} alt="" />
                                </Link>
                            </div>
                            <div className={cx('product-name')}>{movie.name}</div>
                            <div className={cx('product-origin-name')}>{movie.origin_name}</div>
                        </div>
                    ))}
                </div>
                <Pagination 
                    currentPage={page} 
                    totalPages={movies?.params?.pagination?.totalPages || 1} 
                    onPageChange={handlePageChange} 
                />
            </div>
        </div>
    );
}

export default Category;
