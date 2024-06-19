import React, { useState } from 'react';
import { fetchPlaylist, fetchUserPlaylists } from '../api/spotify';
import './BackupPlaylistPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import CustomTooltip from './CustomTooltip';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BackupPlaylistPage: React.FC = () => {
  const [playlistId, setPlaylistId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const accessToken = localStorage.getItem('access_token');

  const handleFetchPlaylist = async () => {
    if (!accessToken) {
      console.error('Access token is missing');
      return;
    }
    try {
      await fetchPlaylist(playlistId, accessToken);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };

  const handleExportPlaylist = async () => {
    if (!accessToken) {
      console.error('Access token is missing');
      return;
    }
    setLoading(true);
    try {
      const playlist = await fetchPlaylist(playlistId, accessToken);
      const csvContent = generateCSV(playlist.tracks.items);
      
      if (csvContent.length > 1000000) { 
        const zip = new JSZip();
        zip.file(`${playlist.name}.csv`, csvContent);
        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, `${playlist.name}.zip`);
      } else {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${playlist.name}.csv`);
      }
      toast.success('File has been exported and backed up!');
    } catch (error) {
      console.error('Error exporting playlist:', error);
      toast.error('Failed to export playlist.');
    }
    setLoading(false);
  };

  const handleExportAllPlaylists = async () => {
    if (!accessToken) {
      console.error('Access token is missing');
      return;
    }
    setLoading(true);
    try {
      const userPlaylists = await fetchUserPlaylists(accessToken);
      const zip = new JSZip();
      for (const playlist of userPlaylists.items) {
        const playlistData = await fetchPlaylist(playlist.id, accessToken);
        const csvContent = generateCSV(playlistData.tracks.items);
        zip.file(`${playlist.name}.csv`, csvContent);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `All_Playlists.zip`);
      toast.success('All playlists have been exported and backed up!');
    } catch (error) {
      console.error('Error exporting all playlists:', error);
      toast.error('Failed to export all playlists.');
    }
    setLoading(false);
  };

  const generateCSV = (tracks: any[]) => {
    const headers = ['Track Name', 'Artist', 'Album'];
    const rows = tracks.map(track => {
      const trackName = track?.track?.name || 'Unknown Track';
      const artists = track?.track?.artists?.map((artist: any) => artist.name).join(', ') || 'Unknown Artist';
      const albumName = track?.track?.album?.name || 'Unknown Album';
      return [trackName, artists, albumName];
    });
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  return (
    <div className="backup-playlist-page">
      <ToastContainer position="bottom-center"/>
      <div className="input-container">
        <h1 className="hero_h1-white-backup">Backup your</h1>
        <h1 className="hero_h1-green-backup">Playlists</h1>
        <div className="input-with-tooltip">
          <input
            type="text"
            value={playlistId}
            onChange={(e) => setPlaylistId(e.target.value)}
            placeholder="Enter Playlist ID"
            className="playlist-input"
          />
          <CustomTooltip
            content={
              <div>
                <p>To find the Spotify playlist id enter the playlist page, click the (...) button near the play button, and click "Copy Playlist Link" under the Share menu.</p>
                <p>This will get you a full playlist link that looks like the following:</p>
                <p>https://open.spotify.com/playlist/<span className="highlight">37i9dQZF1E37B6QOAIOQpC</span></p>
                <p>The playlist id is the string right after playlist/ as marked above.</p>
              </div>
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
          </CustomTooltip>
        </div>
        <button onClick={handleFetchPlaylist} className="fetch-button">Show Playlist Details</button>
        <button onClick={handleExportPlaylist} className="export-button">Export as CSV</button>
        <button onClick={handleExportAllPlaylists} className="fetch-all-button">Export All Playlists</button>
      </div>
      <div className="content">
        {playlistId ? (
          <iframe
            src={`https://open.spotify.com/embed/playlist/${playlistId}`}
            width="300"
            height="380"
            frameBorder="0"
            allow="encrypted-media"
            className="playlist-embed"
          ></iframe>
        ) : (
          <div className="placeholder">
            <p>Please enter a playlist ID to see the embed and track details.</p>
          </div>
        )}
      </div>
      {loading && (
        <>
          <div className="loader-overlay"></div>
          <div className="loader-container"><div className="loader"></div></div>
        </>
      )}
    </div>
  );
};

export default BackupPlaylistPage;
