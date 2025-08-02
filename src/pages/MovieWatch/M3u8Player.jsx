import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useEffect, useRef } from 'react';
import './M3u8Player.scss';
function M3u8Player({ src }) {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        let timeout;
        if (videoRef.current) {
            if (!playerRef.current) {
                timeout = setTimeout(() => {
                    playerRef.current = videojs(videoRef.current, {
                        autoplay: false,
                        preload: 'auto',
                        controls: true,
                        responsive: true,
                        fluid: true,
                        sources: [
                            {
                                src: src,
                                type: 'application/x-mpegURL',
                            },
                        ],
                    });
                }, 0);
            }
        }
        return () => {
            if (playerRef.current && !playerRef.current.isDisposed()) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
            clearTimeout(timeout);
        };
    }, []);
    useEffect(() => {
        if (playerRef.current && src) { 
            playerRef.current.src({ src, type: 'application/x-mpegURL' });
            
        }
    }, [src]);
    return (
        <div data-vjs-player className="video-wrapper">
            <video ref={videoRef} className="video-js vjs-big-play-centered" />
        </div>
    );
}

export default M3u8Player;
