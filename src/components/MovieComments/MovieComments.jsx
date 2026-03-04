import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './MovieComments.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from '../../hooks/useAuth';

const cx = classNames.bind(styles);

export default function MovieComments({ movieSlug }) {
    const { user, requireAuth } = useAuth();

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            if (!movieSlug) return;
            try {
                
                const res = await fetch(`http://localhost:3000/api/comment/${movieSlug}`);
                const data = await res.json();
                if (data.success) {
                    setComments(data.data);
                }
            } catch (error) {
                console.error('Lỗi tải bình luận:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [movieSlug]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        requireAuth(async () => {
            if (rating === 0) {
                alert('Vui lòng chọn số sao đánh giá!');
                return;
            }
            if (!content.trim()) {
                alert('Vui lòng nhập nội dung bình luận!');
                return;
            }

            setIsSubmitting(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:3000/api/comment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        movieSlug: movieSlug,
                        rating: rating,
                        content: content,
                    }),
                });

                const data = await res.json();
                if (data.success) {
                    setComments([data.data, ...comments]);
                    setContent('');
                    setRating(0);
                } else {
                    alert(data.message || 'Có lỗi xảy ra khi gửi bình luận.');
                }
            } catch (error) {
                console.error('Lỗi gửi bình luận:', error);
                alert('Mạng không ổn định, vui lòng thử lại.');
            } finally {
                setIsSubmitting(false);
            }
        });
    };

    return (
        <div className={cx('comments-wrapper')}>
            <h3 className={cx('title')}>Bình luận & Đánh giá</h3>

            <div className={cx('comment-form-container')}>
                <div className={cx('user-avatar')}>
                    <img
                        src={user?.avatar || 'https://files.fullstack.edu.vn/f8-prod/user_avatars/1/623d4b2d95cec.png'}
                        alt="User"
                    />
                </div>
                <form className={cx('comment-form')} onSubmit={handleSubmit}>
                    <div className={cx('star-rating')}>
                        <span className={cx('label')}>Đánh giá phim:</span>
                        <div className={cx('stars')}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FontAwesomeIcon
                                    key={star}
                                    icon={star <= (hoverRating || rating) ? faStarSolid : faStarRegular}
                                    className={cx('star-icon', { active: star <= (hoverRating || rating) })}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={cx('input-group')}>
                        <textarea
                            placeholder={
                                user
                                    ? 'Hãy chia sẻ cảm nghĩ của bạn về bộ phim này...'
                                    : 'Vui lòng đăng nhập để bình luận'
                            }
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="3"
                        ></textarea>
                        <button type="submit" disabled={isSubmitting} className={cx('submit-btn')}>
                            <FontAwesomeIcon icon={faPaperPlane} /> Gửi
                        </button>
                    </div>
                </form>
            </div>

            <div className={cx('comments-list')}>
                {loading ? (
                    <p className={cx('loading-text')}>Đang tải bình luận...</p>
                ) : comments.length > 0 ? (
                    comments.map((cmt) => (
                        <div key={cmt._id} className={cx('comment-item')}>
                            <div className={cx('cmt-avatar')}>
                                <img
                                    src={
                                        cmt.user?.avatar ||
                                        'https://files.fullstack.edu.vn/f8-prod/user_avatars/1/623d4b2d95cec.png'
                                    }
                                    alt="avatar"
                                />
                            </div>
                            <div className={cx('cmt-body')}>
                                <div className={cx('cmt-header')}>
                                    <span className={cx('cmt-author')}>{cmt.user?.username || 'Người dùng'}</span>
                                    <span className={cx('cmt-time')}>
                                        {new Date(cmt.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                <div className={cx('cmt-rating')}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FontAwesomeIcon
                                            key={star}
                                            icon={star <= cmt.rating ? faStarSolid : faStarRegular}
                                            className={cx('star-small', { active: star <= cmt.rating })}
                                        />
                                    ))}
                                </div>
                                <p className={cx('cmt-content')}>{cmt.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={cx('empty-text')}>
                        Chưa có bình luận nào. Hãy là người đầu tiên đánh giá bộ phim này!
                    </p>
                )}
            </div>
        </div>
    );
}
