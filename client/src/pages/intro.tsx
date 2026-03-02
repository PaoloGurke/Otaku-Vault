import { useState, useRef } from "react";
import { useLocation } from "wouter";
import "../styles/loading.scss";

export default function Intro() {

  const [, navigate] = useLocation();

  const [canPlayIntro, setCanPlayIntro] = useState(false);
  const [introScale, setIntroScale] = useState(false);
  const [isAudioFading, setIsAudioFading] = useState(false);
  const [showWhiteFade, setShowWhiteFade] = useState(false);
  const [freezeFrame, setFreezeFrame] = useState(false);

  const introVideoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">

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

          /* ⭐ Zoom + audio fade start */
          if (remaining <= 3) {
            setIntroScale(true);
            setIsAudioFading(true);
          }

          /* ⭐ White flash */
          if (remaining <= 1.5) {
            setShowWhiteFade(true);
          }

          /* ⭐ Smooth audio fade */
          if (isAudioFading && introVideoRef.current) {
            introVideoRef.current.volume = Math.max(
              0,
              introVideoRef.current.volume * 0.97
            );
          }

        }}

        onEnded={() => {
          setFreezeFrame(true);

          /* Small cinematic delay before navigation */
          setTimeout(() => {
            navigate("/home");
          }, 800);
        }}
      />

      {/* ⭐ FREEZE LAST FRAME */}
      {freezeFrame && (
        <div className="absolute inset-0 bg-black" />
      )}

      {/* ⭐ WHITE FLASH CINEMATIC */}
      {showWhiteFade && (
        <div className="
          fixed inset-0 bg-black z-40
          animate-[fadeIn_700ms_ease-in-out]
        " />
      )}

      {/* ⭐ PLAY BUTTON */}
      {!canPlayIntro && (
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

    </div>
  );
}