
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/sonner';

// Define types for our tracks and playlists
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
  url: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: number;
}

// Context types
interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  isRepeating: boolean;
  showPlaylist: boolean;
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  queue: Track[];
  
  // Methods
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setCurrentTrack: (track: Track) => void;
  playTrack: (track: Track) => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  togglePlaylistView: () => void;
  createPlaylist: (name: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  setCurrentPlaylist: (playlist: Playlist) => void;
  reorderPlaylistTracks: (playlistId: string, startIndex: number, endIndex: number) => void;
}

// Create context with default values
const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Sample data for initial playlists and tracks
const sampleTracks: Track[] = [
  {
    id: '1',
    title: 'Sunflower',
    artist: 'Post Malone, Swae Lee',
    album: 'Spider-Man: Into the Spider-Verse',
    duration: 158,
    cover: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/85/Post_Malone_-_Sunflower.png/220px-Post_Malone_-_Sunflower.png',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    cover: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '3',
    title: 'Dance Monkey',
    artist: 'Tones and I',
    album: 'The Kids Are Coming',
    duration: 210,
    cover: 'https://upload.wikimedia.org/wikipedia/en/1/1f/Dance_Monkey_by_Tones_and_I.jpg',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: '4',
    title: 'Don\'t Start Now',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 183,
    cover: 'https://upload.wikimedia.org/wikipedia/en/3/30/Dua_Lipa_-_Don%27t_Start_Now.png',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: '5',
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    duration: 174,
    cover: 'https://upload.wikimedia.org/wikipedia/en/0/07/Harry_Styles_-_Watermelon_Sugar.png',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  }
];

const samplePlaylists: Playlist[] = [
  {
    id: 'playlist-1',
    name: 'My Favorites',
    tracks: sampleTracks.slice(0, 3),
    createdAt: Date.now()
  },
  {
    id: 'playlist-2',
    name: 'Workout Mix',
    tracks: sampleTracks.slice(2, 5),
    createdAt: Date.now() - 86400000
  }
];

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for track and playback
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  // State for playlists
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  
  // Audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    // Set up event listeners
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      if (audio) setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      if (audio) setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play().catch(err => console.error('Error replaying track:', err));
      } else {
        playNext();
      }
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    // Load saved data from localStorage
    loadFromLocalStorage();
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);
  
  // Update audio src when current track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing track:', err);
          setIsPlaying(false);
          toast.error('Error playing track. Please try again.');
        });
      }
    }
  }, [currentTrack]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Handle isPlaying changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing track:', err);
          setIsPlaying(false);
          toast.error('Error playing track. Please try again.');
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Save data to localStorage
  useEffect(() => {
    saveToLocalStorage();
  }, [playlists, volume, isMuted, isShuffled, isRepeating]);
  
  // Load data from localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedPlaylists = localStorage.getItem('playnow-playlists');
      const savedVolume = localStorage.getItem('playnow-volume');
      const savedIsMuted = localStorage.getItem('playnow-isMuted');
      const savedIsShuffled = localStorage.getItem('playnow-isShuffled');
      const savedIsRepeating = localStorage.getItem('playnow-isRepeating');
      
      if (savedPlaylists) {
        setPlaylists(JSON.parse(savedPlaylists));
      } else {
        // Load sample playlists if no saved data
        setPlaylists(samplePlaylists);
      }
      
      if (savedVolume) setVolumeState(parseFloat(savedVolume));
      if (savedIsMuted) setIsMuted(savedIsMuted === 'true');
      if (savedIsShuffled) setIsShuffled(savedIsShuffled === 'true');
      if (savedIsRepeating) setIsRepeating(savedIsRepeating === 'true');
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setPlaylists(samplePlaylists);
    }
  };
  
  // Save data to localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('playnow-playlists', JSON.stringify(playlists));
      localStorage.setItem('playnow-volume', volume.toString());
      localStorage.setItem('playnow-isMuted', isMuted.toString());
      localStorage.setItem('playnow-isShuffled', isShuffled.toString());
      localStorage.setItem('playnow-isRepeating', isRepeating.toString());
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  };
  
  // Playback methods
  const play = () => {
    setIsPlaying(true);
  };
  
  const pause = () => {
    setIsPlaying(false);
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  const playNext = () => {
    if (!currentTrack || !currentPlaylist) return;
    
    let nextTrack: Track | undefined;
    
    if (isShuffled) {
      // Pick a random track from the playlist that's not the current track
      const availableTracks = currentPlaylist.tracks.filter(t => t.id !== currentTrack.id);
      if (availableTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        nextTrack = availableTracks[randomIndex];
      } else {
        nextTrack = currentPlaylist.tracks[0];
      }
    } else {
      // Get the current index and play the next track
      const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex < currentPlaylist.tracks.length - 1) {
        nextTrack = currentPlaylist.tracks[currentIndex + 1];
      } else if (isRepeating) {
        // If repeating and at the end, play the first track
        nextTrack = currentPlaylist.tracks[0];
      }
    }
    
    if (nextTrack) {
      playTrack(nextTrack);
    } else {
      setIsPlaying(false);
    }
  };
  
  const playPrevious = () => {
    if (!currentTrack || !currentPlaylist) return;
    
    // Get the current index and play the previous track
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    
    // If at the beginning, restart the current track unless we're in shuffle mode
    if (currentIndex <= 0) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    } else {
      const previousTrack = currentPlaylist.tracks[currentIndex - 1];
      playTrack(previousTrack);
    }
  };
  
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };
  
  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };
  
  const togglePlaylistView = () => {
    setShowPlaylist(!showPlaylist);
  };
  
  // Playlist management methods
  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      tracks: [],
      createdAt: Date.now()
    };
    
    setPlaylists([...playlists, newPlaylist]);
    toast.success(`Playlist "${name}" created`);
  };
  
  const addToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId) {
        // Check if track already exists in playlist
        if (playlist.tracks.some(t => t.id === track.id)) {
          toast.info(`Track "${track.title}" is already in this playlist`);
          return playlist;
        }
        const updatedTracks = [...playlist.tracks, track];
        toast.success(`Added "${track.title}" to ${playlist.name}`);
        return { ...playlist, tracks: updatedTracks };
      }
      return playlist;
    }));
  };
  
  const removeFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId) {
        const removedTrack = playlist.tracks.find(t => t.id === trackId);
        const updatedTracks = playlist.tracks.filter(t => t.id !== trackId);
        if (removedTrack) {
          toast.success(`Removed "${removedTrack.title}" from ${playlist.name}`);
        }
        return { ...playlist, tracks: updatedTracks };
      }
      return playlist;
    }));
  };
  
  const deletePlaylist = (playlistId: string) => {
    const playlistToDelete = playlists.find(p => p.id === playlistId);
    if (playlistToDelete) {
      setPlaylists(playlists.filter(p => p.id !== playlistId));
      toast.success(`Playlist "${playlistToDelete.name}" deleted`);
      
      // If current playlist is deleted, set current playlist to null
      if (currentPlaylist && currentPlaylist.id === playlistId) {
        setCurrentPlaylist(null);
      }
    }
  };
  
  const reorderPlaylistTracks = (playlistId: string, startIndex: number, endIndex: number) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId) {
        const newTracks = [...playlist.tracks];
        const [removed] = newTracks.splice(startIndex, 1);
        newTracks.splice(endIndex, 0, removed);
        return { ...playlist, tracks: newTracks };
      }
      return playlist;
    }));
  };
  
  // Combine all the state and methods into the context value
  const contextValue: AudioContextType = {
    currentTrack,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    isShuffled,
    isRepeating,
    showPlaylist,
    playlists,
    currentPlaylist,
    queue,
    
    play,
    pause,
    togglePlay,
    setCurrentTrack,
    playTrack,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    togglePlaylistView,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist,
    setCurrentPlaylist,
    reorderPlaylistTracks
  };
  
  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

// Hook for using the audio context
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
