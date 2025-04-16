
import React from 'react';
import { AudioProvider } from '@/contexts/AudioContext';
import AppLayout from '@/components/layouts/AppLayout';
import NowPlaying from '@/components/player/NowPlaying';
import PlaylistView from '@/components/player/PlaylistView';
import AlbumGrid from '@/components/home/AlbumGrid';
import TrackList from '@/components/player/TrackList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <AudioProvider>
      <AppLayout>
        <ScrollArea className="h-full overflow-auto">
          <div className="p-6 md:p-8 pb-[100px]">
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-5">Featured Albums</h2>
              <AlbumGrid />
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-5">Recently Added</h2>
              <div className="bg-playnow-card rounded-lg p-5 shadow-md">
                <TrackList 
                  tracks={[]} // This will show a message when no tracks are available
                  showCover={true}
                  showAddToPlaylist={true}
                  emptyState={
                    <div className="flex flex-col items-center justify-center py-8 text-playnow-text-secondary">
                      <Music size={48} className="mb-4 opacity-50" />
                      <p>No tracks added yet</p>
                      <p className="text-sm mt-1">Add some tracks to get started</p>
                    </div>
                  }
                />
              </div>
            </section>
          </div>
        </ScrollArea>
        
        <NowPlaying />
        <PlaylistView />
      </AppLayout>
    </AudioProvider>
  );
};

export default Home;
