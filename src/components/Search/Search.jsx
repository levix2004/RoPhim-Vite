import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { faCircleXmark, faClose, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react/headless';
import { useEffect, useRef, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
const cx = classNames.bind(styles);

function Search() {
    const inputRef = useRef();
    const [search, setSearch] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const debounceValue = useDebounce(searchValue, 500);
    useEffect(() => {
        const fetchApi = async () => {
            if (!debounceValue.trim()) {
                setSearch([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            const request = await fetch(`https://phimapi.com/v1/api/tim-kiem?keyword=${searchValue}&limit=6`);
            const data = await request.json();
            setSearch(data.data.items);
            setLoading(false);
        };
        fetchApi();
    }, [debounceValue]);

    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
            if (searchValue == '') {
                setSearch([]);
            }
        }
    };

    const handleClear = () => {
        setSearchValue('');
        setSearch([]);
        inputRef.current.focus();
    };
    return (
        <Tippy
            interactive
            hideOnClick={true}
            trigger="click"
            offset={[30, 5]}
            placement="bottom-start"
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
                                        <p>{movie.lang}</p>
                                        <p>{movie.time}</p>
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
                    <input
                        onChange={handleChange}
                        ref={inputRef}
                        value={searchValue}
                        placeholder="Tìm kiếm phim, diễn viên"
                    ></input>
                    {!!searchValue && !loading && (
                        <div className={cx('clear-icon')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </div>
                    )}
                    {loading && (
                        <div className={cx('loading-icon')}>
                            <FontAwesomeIcon icon={faSpinner} />
                        </div>
                    )}
                </div>
            </div>
        </Tippy>
    );
}

export default Search;
