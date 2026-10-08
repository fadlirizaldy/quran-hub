import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { IDataSurah } from "@/utils/api.interface";

const AudioPlayer = ({ data }: { data?: IDataSurah }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    if (!audio) return;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateCurrentTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateCurrentTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audio]);

  const handlePlaySound = async (url: string) => {
    const currentAudio = audio?.src === url ? audio : new Audio(url);
    if (currentAudio !== audio) {
      currentAudio.volume = volume;
      setCurrentTime(0);
      setDuration(0);
      setAudio(currentAudio);
    }

    if (!currentAudio.paused) {
      currentAudio.pause();
      return;
    }

    try {
      if (
        currentAudio.duration > 0 &&
        currentAudio.currentTime >= currentAudio.duration
      ) {
        currentAudio.currentTime = 0;
      }
      await currentAudio.play();
      setHasStartedAudio(true);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      toast.error("Unable to play audio. Please try again.");
    }
  };

  const handleSeek = (time: number) => {
    if (!audio || !Number.isFinite(duration)) return;
    audio.currentTime = Math.max(0, Math.min(time, duration));
    setCurrentTime(audio.currentTime);
  };

  const handleVolumeChange = (nextVolume: number) => {
    setVolume(nextVolume);
    if (audio) audio.volume = nextVolume;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <>
      {!hasStartedAudio ? (
        <button
          type="button"
          className="mt-6 flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!data?.audioFull["01"]}
          onClick={() => {
            const url = data?.audioFull["01"];
            if (url) void handlePlaySound(url);
          }}
        >
          <Icon icon="bi:play-fill" className="text-primary text-lg" />
          Play Surah
        </button>
      ) : (
        <div className="mt-10 rounded-lg bg-gray-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-300 p-2 text-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Go back 10 seconds"
                disabled={!audio || duration === 0}
                onClick={() => handleSeek(currentTime - 10)}
              >
                <Icon icon="ic:round-replay-10" className="text-xl" />
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-300 p-2 text-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={isPlaying ? "Pause surah" : "Play surah"}
                disabled={!data?.audioFull["01"]}
                onClick={() => {
                  const url = data?.audioFull["01"];
                  if (url) void handlePlaySound(url);
                }}
              >
                <Icon
                  icon={isPlaying ? "bi:pause-fill" : "bi:play-fill"}
                  className="text-primary text-sm"
                />
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-300 p-2 text-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Skip forward 10 seconds"
                disabled={!audio || duration === 0}
                onClick={() => handleSeek(currentTime + 10)}
              >
                <Icon icon="ic:round-forward-10" className="text-xl" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Icon
                icon={
                  volume === 0
                    ? "material-symbols:volume-off"
                    : volume < 0.5
                      ? "material-symbols:volume-down"
                      : "material-symbols:volume-up"
                }
                className="text-lg text-slate-500"
                onClick={() => handleVolumeChange(volume === 0 ? 0.5 : 0)}
              />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                aria-label="Audio volume"
                onChange={(event) =>
                  handleVolumeChange(Number(event.target.value))
                }
                className="h-1 w-24 cursor-pointer accent-primary"
              />
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="min-w-9 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={1}
              value={Math.min(currentTime, duration || 0)}
              aria-label="Seek through surah audio"
              disabled={!audio || duration === 0}
              onChange={(event) => handleSeek(Number(event.target.value))}
              className="h-1 w-full cursor-pointer accent-primary disabled:cursor-not-allowed"
            />
            <span className="min-w-9">{formatTime(duration)}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default AudioPlayer;
