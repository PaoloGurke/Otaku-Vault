import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import "../styles/loading.scss";

export default function Intro() {
  const [, navigate] = useLocation();

  const [canPlayIntro, setCanPlayIntro] = useState(false);
  const [introScale, setIntroScale] = useState(false);
  const [isAudioFading, setIsAudioFading] = useState(false);
  const [showWhiteFade, setShowWhiteFade] = useState(false);
  const [freezeFrame, setFreezeFrame] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const introVideoRef = useRef<HTMLVideoElement | null>(null);

  // ⏱ 10s loading timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      
      {/* 🛠 GIF PRELOADER (Fixes the blank image on hover) */}
      <img src="/sayu nobg.gif" style={{ display: 'none' }} alt="preload" />

      {/* 🎬 VIDEO */}
      <video
        ref={introVideoRef}
        src="/clip4.mp4"
        playsInline
        muted={!canPlayIntro}
        autoPlay={canPlayIntro}
        className={`
          absolute inset-0 w-full h-full object-cover
          transition-all duration-1000
          ${introScale ? "scale-[5] opacity-0" : "scale-100 opacity-100"}
        `}
        onTimeUpdate={(e) => {
          const video = e.currentTarget;
          if (!video.duration) return;

          const remaining = video.duration - video.currentTime;

          if (remaining <= 3) {
            setIntroScale(true);
            setIsAudioFading(true);
          }

          if (remaining <= 1.5) {
            setShowWhiteFade(true);
          }

          if (isAudioFading && introVideoRef.current) {
            introVideoRef.current.volume = Math.max(
              0,
              introVideoRef.current.volume * 0.97
            );
          }
        }}
        onEnded={() => {
          setFreezeFrame(true);
          setTimeout(() => navigate("/home"), 800);
        }}
      />

      {/* FREEZE FRAME */}
      {freezeFrame && <div className="absolute inset-0 bg-black" />}

      {/* WHITE FLASH */}
      {showWhiteFade && (
        <div className="fixed inset-0 bg-black z-40 animate-[fadeIn_700ms_ease-in-out]" />
      )}

      {/* ⭐ LOADING SCREEN */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50">
          <div className="asset-loading-box text-white text-center">
            Preparing your Otaku Vault experience...
            <br />
            Loading cinematic assets...
          </div>
        </div>
      )}

      {/* ⭐ PLAY BUTTON */}
      {!isLoading && !canPlayIntro && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50">
          <img
            src="/playbutton.png"
            className="w-28 h-28 cursor-pointer hover:scale-110 transition"
            onClick={() => {
              setCanPlayIntro(true);
              if (introVideoRef.current) {
                introVideoRef.current.muted = false;
                introVideoRef.current.volume = 1;
                introVideoRef.current.play();
              }
            }}
          />
        </div>
      )}

      




      {/* ⭐ SKIP BUTTON (Visible until the very end) */}
{!freezeFrame && (
  <div 
    className="skip-btn-container" 
    onClick={() => navigate("/home")}
  >
    {/* 🛠 PRELOADER (Hidden) */}
    <img src="/sayu.gif" style={{ display: 'none' }} alt="preload" />

    <div className="sayu-wrapper">
      {/* STATIC: sayu nobg.png */}
      <img 
        src="/sayu nobg.png" 
        className="sayu-img static-img" 
        alt="Sayu Static" 
      />
      {/* ANIMATED: sayu.gif */}
      <img 
        src="/sayu.gif" 
        className="sayu-img hover-gif" 
        alt="Sayu Animated" 
      />
    </div>
    <span className="skip-label">SKIP INTRO</span>
  </div>
)}
    </div> /* <--- This was the missing closing tag! */
  );
}