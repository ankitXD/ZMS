import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Reels data structure - Animal Zoo Moments
const reelsData = [
  {
    id: 1,
    videoUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp4", // Replace with actual zoo animal videos
    thumbnail: "/placeholder.png",
    title: "Lion Feeding Time",
    description:
      "Watch our majestic lions enjoy their daily meal in the savanna habitat",
    likes: 2845,
    comments: 128,
  },
  {
    id: 2,
    videoUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp4",
    thumbnail: "/placeholder.png",
    title: "Elephant Bath Routine",
    description: "Our gentle giants love their morning bath and playtime",
    likes: 3912,
    comments: 245,
  },
  {
    id: 3,
    videoUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp4",
    thumbnail: "/placeholder.png",
    title: "Penguin Parade",
    description: "Daily waddle parade of our adorable penguin colony",
    likes: 5234,
    comments: 189,
  },
  {
    id: 4,
    videoUrl: "https://res.cloudinary.com/demo/video/upload/sample.mp4",
    thumbnail: "/placeholder.png",
    title: "Monkey Playtime",
    description:
      "Energetic monkeys swinging and playing in their natural habitat",
    likes: 4156,
    comments: 167,
  },
];

const ReelCard = ({ reel, onClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef(null);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    // Autoplay video muted on mount
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = true;
    const playPromise = vid.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(() => {
        // autoplay blocked or failed
        console.warn("Autoplay failed");
      });
    }

    // cleanup: pause when unmounting
    return () => {
      try {
        vid.pause();
      } catch {
        // ignore pause error during cleanup
      }
    };
  }, []);

  return (
    <div
      className="relative w-full max-w-[280px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-xl hover:shadow-2xl transition-shadow cursor-pointer group"
      style={{ aspectRatio: "9 / 16" }}
      onClick={onClick}
    >
      {/* Video element - autoplay muted */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        preload="auto"
        loop
        muted
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none"></div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-50">
        <div className="space-y-2">
          <h3 className="text-white text-base font-bold drop-shadow-lg line-clamp-2">
            {reel.title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white/90 text-xs">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike();
                }}
                className="flex items-center gap-1 hover:text-red-400 transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                />
                <span>
                  {(isLiked ? reel.likes + 1 : reel.likes).toLocaleString()}
                </span>
              </button>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {reel.comments}
              </span>
            </div>
            <button
              onClick={(e) => e.stopPropagation()}
              className="text-white/90 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Popup Modal Component
const ReelModal = ({ reel, onClose, onNext, onPrev, hasNext, hasPrev }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef(null);

  const toggleMute = () => {
    const vid = videoRef.current;
    const next = !isMuted;
    setIsMuted(next);
    if (vid) vid.muted = next;
  };

  const togglePlayPause = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
    } else {
      vid.play();
      setIsPlaying(true);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    // Autoplay video with sound on modal open
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = isMuted;
    const playPromise = vid.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          console.warn("Autoplay failed in modal");
          setIsPlaying(false);
        });
    }

    // cleanup: pause when unmounting
    return () => {
      try {
        vid.pause();
      } catch {
        // ignore
      }
    };
  }, [reel.id, isMuted]); // Re-run when reel changes

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
      {/* Close Button - Top Right Corner */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[10002] bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Control Buttons - Top Left Corner */}
      <div className="absolute top-4 left-4 z-[10002] flex gap-2">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Previous Button */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-[10001] bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Next Button */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-[10001] bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Video Container */}
      <div
        className="relative w-full max-w-2xl mx-4"
        style={{ aspectRatio: "9 / 16" }}
      >
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="w-full h-full object-contain rounded-lg"
          playsInline
          loop
          controls={false}
        />

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none rounded-lg"></div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-50">
          <div className="space-y-3">
            <h3 className="text-white text-xl font-bold drop-shadow-lg">
              {reel.title}
            </h3>
            <p className="text-white/90 text-sm drop-shadow-lg">
              {reel.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-white/90">
                <button
                  onClick={toggleLike}
                  className="flex items-center gap-2 hover:text-red-400 transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                  />
                  <span className="text-base">
                    {(isLiked ? reel.likes + 1 : reel.likes).toLocaleString()}
                  </span>
                </button>
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-base">{reel.comments}</span>
                </span>
              </div>
              <button className="text-white/90 hover:text-white transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Reels = () => {
  const [selectedReelIndex, setSelectedReelIndex] = useState(null);

  const openModal = (index) => {
    setSelectedReelIndex(index);
  };

  const closeModal = () => {
    setSelectedReelIndex(null);
  };

  const goToNext = () => {
    if (selectedReelIndex < reelsData.length - 1) {
      setSelectedReelIndex(selectedReelIndex + 1);
    }
  };

  const goToPrev = () => {
    if (selectedReelIndex > 0) {
      setSelectedReelIndex(selectedReelIndex - 1);
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Zoo Verse Reels 🦁🐘🐧
          </h1>
          <p className="text-lg text-gray-600">
            Experience amazing moments with our animals - feeding, playing, and
            living their best lives
          </p>
        </div>
      </div>

      {/* Reels Container - Responsive grid that fits on screen */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[auto] items-stretch justify-items-center">
          {reelsData.map((reel, index) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              onClick={() => openModal(index)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedReelIndex !== null && (
        <ReelModal
          reel={reelsData[selectedReelIndex]}
          onClose={closeModal}
          onNext={goToNext}
          onPrev={goToPrev}
          hasNext={selectedReelIndex < reelsData.length - 1}
          hasPrev={selectedReelIndex > 0}
        />
      )}
    </div>
  );
};

export default Reels;
