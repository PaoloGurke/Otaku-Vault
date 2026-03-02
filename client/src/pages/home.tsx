import { useState, useRef } from "react";
import "../styles/loading.scss";

export default function Home() {

  const [videoIndex, setVideoIndex] = useState<number | null>(null);
  const [isEnding, setIsEnding] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showMerch, setShowMerch] = useState(false);
  const [showStart, setShowStart] = useState(true);

  const [showAdventureText, setShowAdventureText] = useState(false);
  const [adText, setAdText] = useState("");
  const [adRotation, setAdRotation] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const adastraRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videos = ["/clip1.mp4", "/clip2.mp4"];

  /* ⭐ CINEMATIC ADVENTURE TEXT SEQUENCE */
  const playAdventureText = () => {

    setTimeout(() => {

      setShowAdventureText(true);

      const sequence = [
        { text: "Ad", rotate: 25, delay: 0 },
        { text: "Astra", rotate: -25, delay: 500 },
        { text: "Abyssosque", rotate: 0, delay: 1000 }
      ];

      sequence.forEach((item, index) => {

        setTimeout(() => {
          setAdText(item.text);
          setAdRotation(item.rotate);

          if (index === sequence.length - 1) {
            setTimeout(() => setShowAdventureText(false), 800);
          }

        }, item.delay);

      });

    }, 3200); // ⭐ Anticipation delay

  };

  /* ⭐ START EXPERIENCE */
  const startExperience = () => {

    setShowStart(false);

    playAdventureText();

    if (!adastraRef.current) return;

    adastraRef.current.currentTime = 0;
    adastraRef.current.volume = 1;
    adastraRef.current.play();

    setTimeout(() => {

      setShowLoading(true);

      if (audioRef.current) {
        audioRef.current.volume = 0.6;
        audioRef.current.play();
      }

      setTimeout(() => {
        setVideoIndex(0);
      }, 800);

    }, 6000);

    setTimeout(() => {
      adastraRef.current?.pause();
    }, 6000);
  };

  /* ⭐ VIDEO FLOW */
  const handleVideoEnd = () => {

    if (videoIndex === 0) {
      setVideoIndex(1);
      return;
    }

    if (videoIndex === 1) {

      setIsEnding(true);

      setTimeout(() => {
        setVideoIndex(null);
        setShowMerch(true);
      }, 2200);
    }
  };

  const handleVideoProgress = () => {

    if (!videoRef.current) return;

    const video = videoRef.current;

    if (videoIndex === 1) {
      if (video.duration && video.duration - video.currentTime <= 1) {
        setShowLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      <audio ref={audioRef} src="/soundbg.mp3" loop />
      <audio ref={adastraRef} src="/adastra.mp3" />

      {/* ⭐ START SCREEN */}
      {showStart && (
        <div className="
          fixed inset-0 z-50
          flex items-center justify-between
          px-32
          bg-black/40 backdrop-blur-2xl
        ">

          {/* 🌸 CHARACTER LEFT BOTTOM */}
          <div className="hidden md:block absolute bottom-0 left-10">

            <div className="
              absolute bottom-0 left-1/2 -translate-x-1/2
              w-[420px] h-[160px]
              bg-white/20 blur-3xl rounded-full
            "/>

            <img
              src="/kathy.png"
              alt="kathy"
              className="
                w-[500px]
                object-contain
                pointer-events-none
              "
              style={{
                transform: "translateY(140px)"
              }}
            />

          </div>

          {/* 🎮 RIGHT UI */}
       <div className="
  flex flex-col items-center text-center gap-6
  mx-auto
">

           <h1 className="
  text-6xl font-bold tracking-widest
  bg-gradient-to-r from-white via-purple-300 to-white
  bg-clip-text text-transparent
">
  <span
  className="flex items-center justify-center gap-8"
  style={{ fontFamily: "GenshinFont" }}
>
  <img
    src="/ovlogo.png"
    alt="logo"
    className="w-[100px] h-[100px] object-contain"
  />

  <span className="bg-gradient-to-r from-white via-purple-300 to-white bg-clip-text text-transparent">
    WELCOME TRAVELER
  </span>
</span>
</h1>

            <p className="opacity-70 text-lg max-w-md">
              What would you like to do?
            </p>

            <div className="flex flex-col gap-5 w-72">

              <button
                onClick={startExperience}
                className="
                  py-4 rounded-2xl
                  bg-white/10 border border-white/30
                  backdrop-blur-lg
                  hover:bg-white/25
                  hover:scale-105
                  transition
                "
              >
                🛍 Enter The Store
              </button>

              <button className="
                py-4 rounded-2xl
                bg-white/5 border border-white/20
                backdrop-blur-lg
                hover:bg-white/15 hover:scale-105 transition
              ">
                🌙 Explore Collection
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ⭐ ADVENTURE TEXT */}
      {showAdventureText && (
        <div className="
          fixed inset-0 z-50
          flex items-center justify-center
          pointer-events-none
        ">
          <h1
            className="text-7xl font-bold transition-all duration-300"
            style={{
              transform: `rotate(${adRotation}deg)`,
              textShadow: "0 0 25px rgba(255,255,255,0.6)"
            }}
          >
            {adText}
          </h1>
        </div>
      )}

      {/* 🎬 VIDEO PLAYER */}
      {videoIndex !== null && (
        <video
          ref={videoRef}
          key={videoIndex}
          autoPlay
          muted
          playsInline
          src={videos[videoIndex]}
          onEnded={handleVideoEnd}
          onTimeUpdate={handleVideoProgress}
          className={`
            fixed inset-0 w-full h-full object-cover z-20
            transition-all duration-1000
            ${isEnding ? "blur-xl scale-110 opacity-0" : "opacity-100"}
          `}
        />
      )}

      {/* 🔥 LOADING */}
      {showLoading && (
        <div className="
          loading fixed inset-0 z-30
          flex flex-col items-center justify-center
          pointer-events-none
        ">
          <div className="loader loader-top">
            <div className="inner one"></div>
            <div className="inner two"></div>
            <div className="inner three"></div>
          </div>

          <div className="loading-text mt-6">
            <span>L</span>
            <span>O</span>
            <span>A</span>
            <span>D</span>
            <span>I</span>
            <span>N</span>
            <span>G</span>
          </div>
        </div>
      )}

      {/* 🛍 MERCH */}
      {showMerch && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <h1 className="text-7xl font-extrabold tracking-widest animate-pulse">
            🛍 OTAKU VAULT
          </h1>
        </div>
      )}

    </div>
  );
}