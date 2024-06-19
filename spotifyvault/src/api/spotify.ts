export const fetchPlaylist = async (playlistId: string, accessToken: string) => {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch playlist');
    }
    const data = await response.json();
    return data;
};

export const fetchUserPlaylists = async (accessToken: string) => {
  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user playlists');
  }
  const data = await response.json();
  return data;
};
  