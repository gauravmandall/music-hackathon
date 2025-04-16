
import React, { useState } from 'react';
import { useAudio, Playlist } from '@/contexts/AudioContext';
import TrackList from './TrackList';
import { formatTotalDuration } from '@/utils/formatTime';
import { PlusCircle, X, MoreHorizontal, Music, SearchIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const PlaylistView: React.FC = () => {
  const { 
    showPlaylist, 
    togglePlaylistView,
    playlists,
    createPlaylist,
    deletePlaylist,
    currentPlaylist,
    setCurrentPlaylist,
  } = useAudio();
  
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreateDialogOpen(false);
    }
  };
  
  const handleDeletePlaylist = (playlistId: string) => {
    deletePlaylist(playlistId);
  };
  
  const handleSetPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
  };
  
  if (!showPlaylist) return null;
  
  // Get all unique tracks from playlists
  const allTracks = playlists.flatMap(p => p.tracks)
    .filter((track, index, self) => 
      index === self.findIndex(t => t.id === track.id)
    )
    .sort((a, b) => a.title.localeCompare(b.title));
  
  // Filter tracks by search query if present
  const filteredTracks = searchQuery.trim() ? 
    allTracks.filter(track => 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    ) : 
    allTracks;
  
  return (
    <div 
      className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex justify-end" 
      onClick={togglePlaylistView}
    >
      <div 
        className="bg-playnow-background w-full md:w-[400px] lg:w-[450px] max-w-full shadow-xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-playnow-divider">
            <h2 className="text-xl font-semibold">Your Music</h2>
            <button 
              className="player-control touch-target text-playnow-text-secondary hover:text-playnow-text"
              onClick={togglePlaylistView}
              aria-label="Close playlist view"
            >
              <X size={24} />
            </button>
          </div>
          
          <Tabs defaultValue="current" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid grid-cols-3 mx-4 mt-4 bg-playnow-card">
              <TabsTrigger value="current" className="data-[state=active]:bg-playnow-accent data-[state=active]:text-black">Current</TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-playnow-accent data-[state=active]:text-black">All Playlists</TabsTrigger>
              <TabsTrigger value="tracks" className="data-[state=active]:bg-playnow-accent data-[state=active]:text-black">All Tracks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="flex-1 flex flex-col overflow-hidden p-4">
              {currentPlaylist ? (
                <>
                  <div className="mb-4 p-3 bg-playnow-card rounded-lg">
                    <h3 className="text-lg font-medium">{currentPlaylist.name}</h3>
                    <p className="text-sm text-playnow-text-secondary">
                      {currentPlaylist.tracks.length} tracks • {formatTotalDuration(currentPlaylist.tracks.map(t => t.duration))}
                    </p>
                  </div>
                  
                  <ScrollArea className="flex-1 pr-4">
                    {currentPlaylist.tracks.length > 0 ? (
                      <TrackList 
                        tracks={currentPlaylist.tracks} 
                        playlistId={currentPlaylist.id}
                        allowRemove={true}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[200px] text-playnow-text-secondary">
                        <Music size={48} className="mb-4 opacity-50" />
                        <p>This playlist is empty</p>
                        <p className="text-sm mt-1">Add tracks from the All Tracks tab</p>
                      </div>
                    )}
                  </ScrollArea>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <Music size={48} className="text-playnow-text-secondary mb-4" />
                  <p className="text-playnow-text-secondary">No playlist selected</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      if (playlists.length > 0) {
                        setCurrentPlaylist(playlists[0]);
                      } else {
                        setIsCreateDialogOpen(true);
                      }
                    }}
                  >
                    {playlists.length > 0 ? 'Select a playlist' : 'Create a playlist'}
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="all" className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Your Playlists</h3>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-playnow-accent hover:bg-playnow-accent-hover text-black">
                      <PlusCircle size={18} className="mr-2" />
                      New Playlist
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create new playlist</DialogTitle>
                      <DialogDescription>
                        Give your playlist a name to get started.
                      </DialogDescription>
                    </DialogHeader>
                    <Input
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      placeholder="My awesome playlist"
                      className="mt-4"
                    />
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePlaylist} className="bg-playnow-accent hover:bg-playnow-accent-hover text-black">
                        Create
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <ScrollArea className="flex-1 pr-4">
                {playlists.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[200px] text-playnow-text-secondary">
                    <Music size={48} className="mb-4 opacity-50" />
                    <p>No playlists yet</p>
                    <p className="text-sm mt-2">Create a playlist to get started</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {playlists.map((playlist) => (
                      <div 
                        key={playlist.id}
                        className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-playnow-card transition-colors duration-300 ${
                          currentPlaylist && currentPlaylist.id === playlist.id ? 'bg-playnow-card border-l-4 border-playnow-accent' : ''
                        }`}
                        onClick={() => handleSetPlaylist(playlist)}
                      >
                        <div>
                          <p className="font-medium">{playlist.name}</p>
                          <p className="text-sm text-playnow-text-secondary">
                            {playlist.tracks.length} tracks
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button 
                              className="touch-target text-playnow-text-secondary hover:text-playnow-text p-2"
                              onClick={(e) => e.stopPropagation()}
                              aria-label="Playlist options"
                            >
                              <MoreHorizontal size={20} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePlaylist(playlist.id);
                              }}
                              className="text-red-500 focus:text-red-500"
                            >
                              Delete Playlist
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="tracks" className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-playnow-text-secondary" size={18} />
                <Input 
                  placeholder="Search tracks or artists" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-playnow-card border-none"
                />
              </div>
              <ScrollArea className="flex-1 pr-4">
                {filteredTracks.length > 0 ? (
                  <TrackList 
                    tracks={filteredTracks} 
                    showCover={true}
                    showAddToPlaylist={true}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-playnow-text-secondary">
                    <SearchIcon size={48} className="mb-4 opacity-50" />
                    <p>No tracks found</p>
                    {searchQuery && <p className="text-sm mt-1">Try a different search term</p>}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;
