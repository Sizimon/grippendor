'use client';
import { useRef, useEffect } from 'react';

export const BackgroundVideo = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            // Set playback speed (1.0 = normal speed)
            videoRef.current.playbackRate = 1; // 0.5 = half speed (slower)
            // videoRef.current.playbackRate = 2.0; // 2.0 = double speed (faster)
        }
    }, []);

    return (
        <section className="fixed flex justify-center p-0 bg-background w-full h-lvh z-0">
            {/* Banner Video */}
            <div className="absolute inset-0 w-full h-full z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className='w-full h-full object-cover opacity-65 blur-xs'
                >
                    <source src="/grippendor/bg.webm" type="video/webm" />
                </video>
            </div>
        </section>
    )
}