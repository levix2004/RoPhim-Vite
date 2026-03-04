import React, { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import classNames from 'classnames/bind';
import styles from './M3u8Player.module.scss'; 

const cx = classNames.bind(styles);

function M3u8Player({ src, onProgress, startTime }) {
    const playerContainerRef = useRef(null);
    const artInstance = useRef(null);

    useEffect(() => {
        // 1. Khởi tạo Artplayer
        const art = new Artplayer({
            container: playerContainerRef.current,
            url: src,
            type: 'm3u8',
            theme: '#ffd875', 
            volume: 0.8,
            isLive: false,
            muted: false,
            autoplay: false,
            pip: true, 
            autoSize: false,
            autoMini: true,
            screenshot: true, 
            setting: true, 
            loop: false,
            flip: true,
            playbackRate: true, 
            aspectRatio: true,
            fullscreen: true,
            fullscreenWeb: true,
            subtitleOffset: true,
            miniProgressBar: true, 
            mutex: true,
            backdrop: true,
            playsInline: true,
            autoPlayback: true,
            airplay: true,
            
            customType: {
                m3u8: function (video, url, art) {
                    if (Hls.isSupported()) {
                        if (art.hls) art.hls.destroy();
                        const hls = new Hls();
                        hls.loadSource(url);
                        hls.attachMedia(video);
                        art.hls = hls;
                        art.on('destroy', () => hls.destroy());
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = url;
                    } else {
                        art.notice.show = 'Trình duyệt không hỗ trợ phát video này';
                    }
                },
            },
        });

        art.on('ready', () => {
            if (startTime > 0) {
                art.currentTime = startTime;
                art.notice.show = `Đã tiếp tục từ ${Math.floor(startTime / 60)}:${Math.floor(startTime % 60)}`;
            }
        });

        art.on('video:timeupdate', () => {
            if (onProgress) {
                onProgress({
                    currentTime: art.currentTime,
                    duration: art.duration,
                });
            }
        });

        artInstance.current = art;
        return () => {
            if (artInstance.current && artInstance.current.destroy) {
                artInstance.current.destroy(false);
            }
        };
    }, [src, startTime]);
    return (
        <div 
            ref={playerContainerRef} 
            className={cx('art-player-wrapper')} 
            style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}
        ></div>
    );
}

export default M3u8Player;