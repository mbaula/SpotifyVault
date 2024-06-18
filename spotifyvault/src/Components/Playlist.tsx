import React from 'react';

interface PlaylistProps {
  playlist: any;
}

const Playlist: React.FC<PlaylistProps> = ({ playlist }) => {
  return (
    <div>
      <h2>{playlist.name}</h2>
      <ul>
        {playlist.tracks.items.map((item: any) => (
          <li key={item.track.id}>
            <p>Track: {item.track.name}</p>
            <p>Artist: {item.track.artists.map((artist: any) => artist.name).join(', ')}</p>
            <p>Album: {item.track.album.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
