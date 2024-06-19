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
  return data.items;
};

export const fetchAllTracks = async (playlistId: string, accessToken: string) => {
  let allTracks: any[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch playlist tracks');
    }
    const data = await response.json();
    allTracks = allTracks.concat(data.items);
    if (data.items.length < limit) {
      break;
    }
    offset += limit;
  }

  return allTracks;
};