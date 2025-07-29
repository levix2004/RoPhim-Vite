import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react/headless';
import { useEffect, useState } from 'react';
const cx = classNames.bind(styles);

function Search() {
    const [search, setSearch] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            const request = await fetch(`https://phimapi.com/v1/api/tim-kiem?keyword=Thuoc&limit=5`);
            const data = await request.json();
            setSearch(data.data.items);
            setLoading(false);
        };
        fetchApi();
    }, []);
    if (loading) {
        return (
            <div>
                <h1>Đang tải</h1>
            </div>
        );
    }
    return (
        <Tippy
            interactive
            hideOnClick="toggle"
            trigger="click"
            offset={[15, 5]}
            render={(attrs) => (
                <div className={cx('search-tippy')} tabIndex="100" {...attrs}>
                    <div className={cx('sm-list')}>
                        <p className={cx('sm-header')}>Danh sách phim</p>
                        {search.map((movie) => (
                            <div className={cx('sm-item')}>
                                <div className={cx('sm-thumb')}>
                                    <img src={`https://phimimg.com/${movie.poster_url}`} alt=""></img>
                                </div>
                                <div className={cx('sm-info')}>
                                    <div className={cx('name')}>{movie.name}</div>
                                    <div className={cx('origin-name')}>{movie.origin_name}</div>
                                    <div className={cx('stats')}>
                                        <p>Tiếng Việt</p>
                                        <p>108 phút</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={cx('show-all')}>Toàn bộ kết quả</div>
                </div>
            )}
        >
            <div className={cx('search')}>
                <div className={cx('search-inner')}>
                    <div className={cx('search-icon')}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
                    <input placeholder="Tìm kiếm phim, diễn viên"></input>
                </div>
            </div>
        </Tippy>
    );
}

export default Search;
