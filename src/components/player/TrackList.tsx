
import React from 'react';
import { useAudio, Track } from '@/contexts/AudioContext';
import { formatTime } from '@/utils/formatTime';
import { Play, Pause, Plus } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface TrackListProps {
  tracks: Track[];
  showCover?: boolean;
  showAddToPlaylist?: boolean;
  playlistId?: string;
  allowRemove?: boolean;
  emptyState?: React.ReactNode;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  showCover = true,
  showAddToPlaylist = true,
  playlistId,
  allowRemove = false,
  emptyState
}) => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlay,
    playlists,
    addToPlaylist,
    removeFromPlaylist
  } = useAudio();
  
  const handlePlay = (track: Track) => {
    if (currentTrack && currentTrack.id === track.id) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };
  
  const handleAddToPlaylist = (track: Track, playlistId: string) => {
    addToPlaylist(playlistId, track);
  };
  
  const handleRemoveFromPlaylist = (trackId: string, playlistId: string) => {
    if (playlistId) {
      removeFromPlaylist(playlistId, trackId);
    }
  };
  
  if (tracks.length === 0) {
    return emptyState ? (
      <>{emptyState}</>
    ) : (
      <div className="p-4 text-center text-playnow-text-secondary">
        No tracks in this playlist. Add some tracks to get started.
      </div>
    );
  }
  
  return (
    <div className="w-full">
      {tracks.map((track) => {
        const isCurrentTrack = currentTrack && currentTrack.id === track.id;
        const isCurrentPlaying = isCurrentTrack && isPlaying;
        
        return (
          <div 
            key={track.id}
            className={`group grid grid-cols-[auto_1fr_auto] gap-4 p-3 rounded-md hover:bg-playnow-card transition-colors duration-300 ${
              isCurrentTrack ? 'bg-playnow-card' : ''
            }`}
          >
            <div className="flex items-center">
              {showCover && (
                <div className="relative mr-3">
                  <img 
                    src={track.cover} 
                    alt={`${track.title} cover`} 
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <button
                    className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-md transition-opacity duration-300 ${
                      isCurrentPlaying || !isCurrentTrack ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                    }`}
                    onClick={() => handlePlay(track)}
                    aria-label={isCurrentPlaying ? 'Pause' : 'Play'}
                  >
                    {isCurrentPlaying ? 
                      <Pause className="text-white" size={24} /> : 
                      <Play className="text-white" size={24} />
                    }
                  </button>
                </div>
              )}
              
              {!showCover && (
                <button
                  className="w-10 h-10 flex items-center justify-center mr-2"
                  onClick={() => handlePlay(track)}
                  aria-label={isCurrentPlaying ? 'Pause' : 'Play'}
                >
                  {isCurrentPlaying ? 
                    <Pause className={`text-playnow-accent`} size={24} /> : 
                    <Play className={`opacity-0 group-hover:opacity-100 text-playnow-text-secondary hover:text-playnow-accent transition-colors duration-300`} size={24} />
                  }
                </button>
              )}
            </div>
            
            <div 
              className="flex flex-col justify-center cursor-pointer"
              onClick={() => handlePlay(track)}
            >
              <p className={`font-medium truncate ${isCurrentTrack ? 'text-playnow-accent' : 'text-playnow-text'}`}>
                {track.title}
              </p>
              <p className="text-sm text-playnow-text-secondary truncate">
                {track.artist}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-playnow-text-secondary">{formatTime(track.duration)}</span>
              
              {showAddToPlaylist && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="touch-target opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-label="Add to playlist"
                    >
                      <Plus size={18} className="text-playnow-text-secondary hover:text-playnow-accent" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {playlists.length > 0 ? (
                      playlists.map((playlist) => (
                        <DropdownMenuItem 
                          key={playlist.id}
                          onClick={() => handleAddToPlaylist(track, playlist.id)}
                        >
                          Add to {playlist.name}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>No playlists available</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {allowRemove && playlistId && (
                <button
                  className="touch-target opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={() => handleRemoveFromPlaylist(track.id, playlistId)}
                  aria-label="Remove from playlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-playnow-text-secondary hover:text-playnow-accent">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackList;
