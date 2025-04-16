
import React from 'react';
import { useAudio, Track } from '@/contexts/AudioContext';
import { Play, Pause } from 'lucide-react';

// Group tracks by album
const groupByAlbum = (tracks: Track[]) => {
  const albums = new Map<string, { 
    title: string, 
    artist: string, 
    cover: string, 
    tracks: Track[] 
  }>();
  
  tracks.forEach(track => {
    if (!albums.has(track.album)) {
      albums.set(track.album, {
        title: track.album,
        artist: track.artist,
        cover: track.cover,
        tracks: [track]
      });
    } else {
      const album = albums.get(track.album);
      if (album) {
        album.tracks.push(track);
      }
    }
  });
  
  return Array.from(albums.values());
};

const AlbumGrid: React.FC = () => {
  const { 
    playlists, 
    currentTrack, 
    isPlaying, 
    playTrack,
    togglePlay 
  } = useAudio();
  
  // Get all unique tracks from all playlists
  const allTracks = playlists.flatMap(p => p.tracks);
  
  // Remove duplicates
  const uniqueTracks = allTracks.filter((track, index, self) => 
    index === self.findIndex(t => t.id === track.id)
  );
  
  // Group tracks by album
  const albums = groupByAlbum(uniqueTracks);
  
  const handleAlbumPlay = (tracks: Track[]) => {
    if (tracks.length === 0) return;
    
    const firstTrack = tracks[0];
    if (currentTrack && currentTrack.id === firstTrack.id && isPlaying) {
      togglePlay();
    } else {
      playTrack(firstTrack);
    }
  };
  
  if (albums.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-medium mb-4">No albums available</h2>
        <p className="text-playnow-text-secondary">
          Add tracks to your playlists to see albums here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {albums.map((album) => {
        const isCurrentAlbum = currentTrack && album.tracks.some(t => t.id === currentTrack.id);
        const isCurrentPlaying = isCurrentAlbum && isPlaying;
        
        return (
          <div 
            key={album.title}
            className="bg-playnow-card rounded-md p-4 hover:bg-opacity-80 transition-all duration-300 group"
          >
            <div className="relative mb-4">
              <img 
                src={album.cover} 
                alt={`${album.title} cover`} 
                className="w-full aspect-square object-cover rounded-md"
              />
              <button
                className={`absolute bottom-2 right-2 bg-playnow-accent hover:bg-playnow-accent-hover text-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform transition-all duration-300 ${
                  isCurrentAlbum ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                }`}
                onClick={() => handleAlbumPlay(album.tracks)}
                aria-label={isCurrentPlaying ? 'Pause album' : 'Play album'}
              >
                {isCurrentPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
            </div>
            <h3 className="font-semibold truncate">{album.title}</h3>
            <p className="text-sm text-playnow-text-secondary truncate">{album.artist}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AlbumGrid;
