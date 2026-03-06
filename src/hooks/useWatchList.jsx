import { useState, useEffect } from 'react';
import { useAuth } from './useAuth'; 

export const useWatchlist = (movie) => {
    const [liked, setLiked] = useState(false);
    const { requireAuth } = useAuth();
    console.log(movie?.slug);
    useEffect(() => {
        const checkIsLiked = async () => {
            if (!movie || !movie.slug) return; 

            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch(`http://localhost:3000/api/user/watchlist/status?refId=${movie.slug}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setLiked(data.isLiked);
            } catch (error) {
                console.error("Lỗi check like:", error);
            }
        };

        checkIsLiked();
    }, [movie?.slug]);

    const toggleLike = async () => {
        requireAuth(async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            const previousState = liked;
            setLiked(!previousState);

            try {
                if (!previousState) {
                    const payload = {
                        movieData: {
                            refId: movie.slug,
                            title: movie.name,
                            poster_url: movie.poster_url,
                            slug: movie.slug,
                            origin_name: movie.origin_name,
                            thumb_url: movie.thumb_url,
                            year: movie.year,
                        }
                    };

                    const res = await fetch('http://localhost:3000/api/user/watchlist', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(payload)
                    });

                    if (!res.ok) throw new Error("Lỗi thêm watchlist");

                } else {
                    const res = await fetch(`http://localhost:3000/api/user/watchlist/${movie.slug}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!res.ok) throw new Error("Lỗi xóa watchlist");
                }
            } catch (error) {
                console.error("Lỗi thao tác tim:", error);
                setLiked(previousState); 
                alert("Có lỗi kết nối, vui lòng thử lại!");
            }
        });
    };

    return { liked, toggleLike };
};