import React, { useEffect, useRef, useState } from 'react';
import './videoPalyer.scss'
interface VideoPlayerProps {
    videoSrc: string; // Define the type of videoSrc as a string
    cover: string; // Define the type of videoSrc as a string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc, cover }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [restOfTime, setRestOfTime] = useState<string>("00:00");

    const handleVideoClick = () => {
        const video = videoRef.current;

        if (video) {
            if (!isPlaying) {
                video.controls = true;
                video.play();
                setIsPlaying(true);
            } else {
            }
        }
    };


    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    };
    const restTime = (all: number, current: number) => {
        const restTime = all - current
        const restOfTime = formatTime(restTime)
        setRestOfTime(restOfTime)
    }
    useEffect(() => {
        restTime(videoRef.current?.duration || 0, videoRef.current?.currentTime || 0)
    }, [videoRef.current?.currentTime])
    return (
        <div className='vedio-player-container'>
            <video
                ref={videoRef}
                onClick={handleVideoClick}
                poster={cover}
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="video-controls">
                {
                    !isPlaying &&
                    (<span className="video-time">
                        - {restOfTime}
                    </span>)
                }
            </div>
        </div>
    );
};

export default VideoPlayer;
