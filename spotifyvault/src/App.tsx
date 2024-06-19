import React from 'react';
import { MantineProvider } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';
import Auth from './Components/Auth';
import BackupPlaylistPage from './Components/BackupPlaylistPage';

const App: React.FC = () => {
  return (
    <MantineProvider>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/backup-playlists" element={<BackupPlaylistPage />} />
      </Routes>
    </MantineProvider>
  );
};

export default App;
