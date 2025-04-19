
import React from 'react';
import { Home, Library, Search, Plus, Music2 } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { playlists, createPlaylist, setCurrentPlaylist } = useAudio();
  const [newPlaylistName, setNewPlaylistName] = React.useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const isMobile = useIsMobile();
  
  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreateDialogOpen(false);
    }
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {!isMobile && (
          <Sidebar className="bg-playnow-background border-r border-playnow-divider z-30">
            <SidebarHeader className="text-xl font-bold flex items-center p-4">
              <Music2 className="mr-2 text-playnow-accent" size={24} />
              <span>PlayNow</span>
            </SidebarHeader>
            <SidebarContent className="px-2">
              <SidebarGroup>
                <SidebarMenu>
                  {/* <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/" className="flex items-center py-2 px-4 rounded-md hover:bg-playnow-card transition-all duration-300">
                        <Home className="mr-3" size={20} />
                        <span>Home</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/" className="flex items-center py-2 px-4 rounded-md hover:bg-playnow-card transition-all duration-300">
                        <Search className="mr-3" size={20} />
                        <span>Search</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem> */}
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup className="mt-4">
                <div className="flex justify-between items-center px-4 py-2">
                  <div className="flex items-center">
                    <Library className="mr-3" size={20} />
                    <span className="font-medium">Your Library</span>
                  </div>
                  
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <button 
                        className="text-playnow-text-secondary hover:text-playnow-text transition-colors duration-300 p-1"
                        aria-label="Create playlist"
                      >
                        <Plus size={20} />
                      </button>
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
                        <Button onClick={handleCreatePlaylist}>
                          Create
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="mt-2 space-y-1 px-2">
                  {playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      className="w-full text-left px-4 py-2 rounded-md hover:bg-playnow-card transition-all duration-300"
                      onClick={() => setCurrentPlaylist(playlist)}
                    >
                      <p className="text-sm font-medium truncate">{playlist.name}</p>
                      <p className="text-xs text-playnow-text-secondary truncate">
                        Playlist • {playlist.tracks.length} tracks
                      </p>
                    </button>
                  ))}
                  
                  {playlists.length === 0 && (
                    <div className="px-4 py-2 text-sm text-playnow-text-secondary">
                      <p>No playlists yet</p>
                      <p>Create your first playlist to get started</p>
                    </div>
                  )}
                </div>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        )}
        
        <div className="flex-1 overflow-hidden flex flex-col h-screen">
          <header className="h-16 flex items-center px-4 border-b border-playnow-divider bg-playnow-background z-20">
            <SidebarTrigger className="mr-4 lg:hidden">
              <Menu />
            </SidebarTrigger>
            {/* <h1 className="text-xl font-bold">PlayNow</h1> */}
          </header>
          
          <main className="flex-1 overflow-hidden">
            <div className="h-full pb-[90px]">
              {children}
            </div>
          </main>
          
          {isMobile && (
            <nav className="fixed bottom-[90px] left-0 right-0 h-14 bg-playnow-card border-t border-playnow-divider flex items-center justify-around z-40">
              <a href="/" className="flex flex-col items-center justify-center text-playnow-text-secondary hover:text-playnow-accent p-2">
                <Home size={20} />
                <span className="text-xs mt-1">Home</span>
              </a>
              <a href="/" className="flex flex-col items-center justify-center text-playnow-text-secondary hover:text-playnow-accent p-2">
                <Search size={20} />
                <span className="text-xs mt-1">Search</span>
              </a>
              <a href="/" className="flex flex-col items-center justify-center text-playnow-text-secondary hover:text-playnow-accent p-2">
                <Library size={20} />
                <span className="text-xs mt-1">Library</span>
              </a>
            </nav>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

// Menu icon component for mobile
const Menu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

export default AppLayout;
