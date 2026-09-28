import React, { useEffect, useRef, useState } from 'react';

export const BackgroundScrollAnimation: React.FC = () => {
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const pendingSeekTimeRef = useRef<number | null>(null);

  // Perform seek with fastSeek when supported and pending queue when busy
  const performSeek = (targetTime: number) => {
    const video = videoRef.current;
    if (!video || isNaN(video.duration) || video.duration <= 0) return;

    const clampedTime = Math.min(Math.max(targetTime, 0.001), video.duration - 0.04);
    
    // Avoid redundant seeks if within 20ms of the target frame
    if (Math.abs(video.currentTime - clampedTime) < 0.02) {
      return;
    }

    if (video.seeking || isSeekingRef.current) {
      pendingSeekTimeRef.current = clampedTime;
      return;
    }

    isSeekingRef.current = true;
    if ('fastSeek' in video && typeof (video as any).fastSeek === 'function') {
      try {
        (video as any).fastSeek(clampedTime);
      } catch {
        video.currentTime = clampedTime;
      }
    } else {
      video.currentTime = clampedTime;
    }
  };

  const handleSeeked = () => {
    isSeekingRef.current = false;
    if (pendingSeekTimeRef.current !== null) {
      const nextTime = pendingSeekTimeRef.current;
      pendingSeekTimeRef.current = null;
      performSeek(nextTime);
    }
  };

  useEffect(() => {
    const handleScrollOrResize = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const totalDocHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.offsetHeight
      );
      // Map progress from top of first page (0) to bottom of last page (1)
      const maxScroll = Math.max(totalDocHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      targetProgressRef.current = progress;
    };

    // 60fps animation loop for gentle, silky smooth video scrubbing
    const updateLoop = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      
      // Precision threshold to settle accurately on the final frame
      if (Math.abs(diff) < 0.0004) {
        currentProgressRef.current = targetProgressRef.current;
      } else {
        // 0.14 lerp gives a slower, gentler, perfectly fluid camera drift
        currentProgressRef.current += diff * 0.14;
      }

      const p = currentProgressRef.current;
      const video = videoRef.current;

      if (video && !isNaN(video.duration) && video.duration > 0) {
        // Reset seeking flag if browser finished seek
        if (!video.seeking && isSeekingRef.current && pendingSeekTimeRef.current === null) {
          isSeekingRef.current = false;
        }

        const targetTime = p * video.duration;
        performSeek(targetTime);
      }

      rafIdRef.current = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    handleScrollOrResize();
    rafIdRef.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Handle video ready and seeking events to ensure smooth scrubbing
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoReady(true);
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const totalDocHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.offsetHeight
      );
      const maxScroll = Math.max(totalDocHeight - window.innerHeight, 1);
      const initialProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      targetProgressRef.current = initialProgress;
      currentProgressRef.current = initialProgress;
      if (!isNaN(videoRef.current.duration) && videoRef.current.duration > 0) {
        performSeek(initialProgress * videoRef.current.duration);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-slate-950"
      aria-hidden="true"
    >
      {/* 1. Original Uploaded Video: Scrubbed via scroll with ~50% background visibility */}
      <video
        ref={videoRef}
        src="/videos/Space_to_institute_camera_zoom_20260918220515.mp4"
        preload="auto"
        muted
        playsInline
        tabIndex={-1}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={() => setVideoReady(true)}
        onSeeking={() => { isSeekingRef.current = true; }}
        onSeeked={handleSeeked}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none ${
          videoReady ? 'opacity-50' : 'opacity-0'
        }`}
        style={{
          // Hardware acceleration for fluid 60fps scrub without repaints
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          willChange: 'opacity',
        }}
      >
        <source src="/videos/Space_to_institute_camera_zoom_20260918220515.mp4" type="video/mp4" />
        <source src="/videos/earth_to_kurla_zoom.mp4" type="video/mp4" />
      </video>

      {/* 2. Atmospheric Background Overlays (ensures website content remains clearly readable above 50% video) */}
      <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-slate-950/85 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/30 via-transparent to-slate-950/75 pointer-events-none" />
    </div>
  );
};


