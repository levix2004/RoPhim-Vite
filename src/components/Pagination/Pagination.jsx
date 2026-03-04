import React from 'react';
import classNames from 'classnames/bind';
import styles from './Pagination.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong, faRightLong } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (!totalPages || totalPages <= 1) return null;

    const handleBack = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className={cx('pagination')}>
            <div className={cx('nav-page')}>
                <div 
                    className={cx('nav-btn', { disabled: currentPage === 1 })} 
                    onClick={handleBack}
                >
                    <FontAwesomeIcon icon={faLeftLong} />
                </div>
                
                <div className={cx('current-page')}>
                    Trang <span className={cx('num')}>{currentPage}</span> / {totalPages}
                </div>
                
                <div 
                    className={cx('nav-btn', { disabled: currentPage === totalPages })} 
                    onClick={handleNext}
                >
                    <FontAwesomeIcon icon={faRightLong} />
                </div>
            </div>
        </div>
    );
}

export default Pagination;