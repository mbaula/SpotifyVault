import React, { useState } from 'react';
import { fetchPlaylist, fetchTrackDetails } from '../api/spotify';
import './BackupPlaylistPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import CustomTooltip from './CustomTooltip';

const BackupPlaylistPage: React.FC = () => {
  const [playlistId, setPlaylistId] = useState<string>('');
  const [trackDetails, setTrackDetails] = useState<any>(null);
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

  const handleTrackClick = async (trackId: string) => {
    if (!accessToken) {
      console.error('Access token is missing');
      return;
    }
    try {
      const data = await fetchTrackDetails(trackId, accessToken);
      setTrackDetails(data);
    } catch (error) {
      console.error('Error fetching track details:', error);
    }
  };

  return (
    <div className="backup-playlist-page">
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
        {trackDetails && (
          <div className="track-details">
            <h2>{trackDetails.name}</h2>
            <p><strong>Artist:</strong> {trackDetails.artists.map((artist: any) => artist.name).join(', ')}</p>
            <p><strong>Album:</strong> {trackDetails.album.name}</p>
            <p><strong>Release Date:</strong> {trackDetails.album.release_date}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupPlaylistPage;
