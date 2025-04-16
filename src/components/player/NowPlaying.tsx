
import React from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { formatTime } from '@/utils/formatTime';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  VolumeX,
  List
} from 'lucide-react';

const NowPlaying: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    duration, 
    currentTime,
    volume,
    isMuted,
    isShuffled,
    isRepeating,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    togglePlaylistView
  } = useAudio();
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
  };
  
  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const volumeBar = e.currentTarget;
    const rect = volumeBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, percent)));
  };
  
  // If no track is playing, show placeholder
  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-playnow-card border-t border-playnow-divider flex items-center px-4 z-50 shadow-lg">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 w-1/3">
            <div className="w-16 h-16 bg-playnow-divider rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-playnow-text-secondary">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <div>
              <p className="text-playnow-text font-medium">Select a track</p>
              <p className="text-playnow-text-secondary text-sm">to start playing</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center space-x-6">
              <button className="player-control touch-target opacity-50 cursor-not-allowed" disabled aria-label="Shuffle">
                <Shuffle size={18} />
              </button>
              <button className="player-control touch-target opacity-50 cursor-not-allowed" disabled aria-label="Previous track">
                <SkipBack size={22} />
              </button>
              <button 
                className="bg-playnow-accent/50 hover:bg-playnow-accent/50 text-black rounded-full w-10 h-10 flex items-center justify-center opacity-50 cursor-not-allowed"
                disabled
                aria-label="Play"
              >
                <Play size={22} />
              </button>
              <button className="player-control touch-target opacity-50 cursor-not-allowed" disabled aria-label="Next track">
                <SkipForward size={22} />
              </button>
              <button className="player-control touch-target opacity-50 cursor-not-allowed" disabled aria-label="Repeat">
                <Repeat size={18} />
              </button>
            </div>
            
            <div className="w-full mt-2 flex items-center space-x-2">
              <span className="text-xs text-playnow-text-secondary">0:00</span>
              <div className="progress-bar flex-grow h-1.5 rounded-full bg-playnow-divider/50">
                <div className="progress-bar-fill w-0 h-full rounded-full bg-playnow-divider/50"></div>
              </div>
              <span className="text-xs text-playnow-text-secondary">0:00</span>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-4 w-1/3">
            <button 
              className="player-control touch-target text-playnow-text-secondary hover:text-playnow-text"
              onClick={togglePlaylistView}
              aria-label="Toggle playlist view"
            >
              <List size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <button 
                className="player-control touch-target text-playnow-text-secondary hover:text-playnow-text"
                aria-label="Mute"
              >
                <VolumeX size={20} />
              </button>
              <div 
                className="volume-slider w-24 h-1.5 bg-playnow-divider/50 rounded-full"
                role="slider"
                aria-label="Volume"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={0}
              >
                <div 
                  className="volume-slider-fill h-full rounded-full bg-playnow-divider/50" 
                  style={{ width: `0%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-playnow-card border-t border-playnow-divider flex items-center px-4 z-50 shadow-lg">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4 w-1/3">
          <img 
            src={currentTrack.cover} 
            alt={`${currentTrack.title} album cover`} 
            className="w-16 h-16 object-cover rounded-md shadow-md"
          />
          <div>
            <p className="text-playnow-text font-medium truncate max-w-[200px]">{currentTrack.title}</p>
            <p className="text-playnow-text-secondary text-sm truncate max-w-[200px]">{currentTrack.artist}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center w-1/3">
          <div className="flex items-center space-x-6">
            <button 
              className={`player-control touch-target ${isShuffled ? 'text-playnow-accent' : 'text-playnow-text-secondary hover:text-playnow-text'}`}
              onClick={toggleShuffle}
              aria-label={isShuffled ? "Disable shuffle" : "Enable shuffle"}
              aria-pressed={isShuffled}
            >
              <Shuffle size={18} />
            </button>
            <button 
              className="player-control touch-target text-playnow-text-secondary hover:text-playnow-text"
              onClick={playPrevious}
              aria-label="Previous track"
            >
              <SkipBack size={22} />
            </button>
            <button 
              className="bg-playnow-accent hover:bg-playnow-accent-hover text-black rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all duration-300"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={22} /> : <Play size={22} />}
            </button>
            <button 
              className="player-control touch-target text-playnow-text-secondary hover:text-playnow-text"
              onClick={playNext}
              aria-label="Next track"
            >
              <SkipForward size={22} />
            </button>
            <button 
              className={`player-control touch-target ${isRepeating ? 'text-playnow-accent' : 'text-playnow-text-secondary hover:text-playnow-text'}`}
              onClick={toggleRepeat}
              aria-label={isRepeating ? "Disable repeat" : "Enable repeat"}
              aria-pressed={isRepeating}
            >
              <Repeat size={18} />
            </button>
          </div>
          
          <div className="w-full mt-2 flex items-center space-x-2">
            <span className="text-xs text-playnow-text-secondary">{formatTime(currentTime)}</span>
            <div 
              className="progress-bar flex-grow h-1.5 rounded-full bg-playnow-divider/50 relative cursor-pointer transition-all duration-300 group hover:h-2"
              onClick={handleProgressClick}
              role="slider"
              aria-label="Playback position"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
            >
              <div 
                className="progress-bar-fill h-full rounded-full bg-playnow-accent relative transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"></div>
              </div>
            </div>
            <span className="text-xs text-playnow-text-secondary">{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4 w-1/3">
          <button 
            className="player-control touch-target text-playnow-text-secondary hover:text-playnow-text transition-colors duration-300"
            onClick={togglePlaylistView}
            aria-label="Toggle playlist view"
          >
            <List size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <button 
              className="player-control touch-target text-playnow-text-secondary hover:text-playnow-text transition-colors duration-300"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <div 
              className="volume-slider w-24 h-1.5 bg-playnow-divider/50 rounded-full cursor-pointer relative group hover:h-2 transition-all duration-300"
              onClick={handleVolumeChange}
              role="slider"
              aria-label="Volume"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={isMuted ? 0 : Math.round(volume * 100)}
            >
              <div 
                className="volume-slider-fill h-full rounded-full bg-playnow-accent relative transition-all duration-300" 
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
