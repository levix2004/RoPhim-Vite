import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Slider from '../../components/Slider/Slider';
import { useEffect } from 'react';
const cx = classNames.bind(styles);

function Home() {

    

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <Slider></Slider>
            </div>
        </div>
    );
}

export default Home;
