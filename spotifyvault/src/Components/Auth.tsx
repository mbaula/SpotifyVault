import React, { useState, useEffect } from 'react';
import { Text, Code, Loader } from '@mantine/core';
import queryString from 'query-string';
import { CLIENT_ID, REDIRECT_URI } from '../config';
import './Auth.css';
import musicVaultImage from '../assets/music-vault.png';

const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input: ArrayBuffer) => {
  const uint8Array = new Uint8Array(input);
  let binary = '';
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const Auth: React.FC = () => {
  const [codeChallenge, setCodeChallenge] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const codeVerifier = generateRandomString(64);
    localStorage.setItem('code_verifier', codeVerifier);

    const getChallenge = async () => {
      const hashed = await sha256(codeVerifier);
      setCodeChallenge(base64encode(hashed));
    };

    getChallenge();

    const params = queryString.parse(window.location.search);
    if (params.code) {
      fetchToken(params.code as string);
    }
  }, []);

  const handleLogin = () => {
    if (!codeChallenge) return;

    const scope = 'user-read-private user-read-email';
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    const params = {
      response_type: 'code',
      client_id: CLIENT_ID,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  };

  const fetchToken = async (code: string) => {
    setLoading(true);
    const codeVerifier = localStorage.getItem('code_verifier') || '';

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    };

    const response = await fetch('https://accounts.spotify.com/api/token', payload);
    const data = await response.json();
    setLoading(false);
    if (data.access_token) {
      setAccessToken(data.access_token);
    }
  };

  return (
    <div className="app-container">
      <h1 className="hero_h1-white">Spotify</h1>
      <h1 className="hero_h1-green">Vault</h1>
      <p className="app-slogan">Save your playlists in a secure vault</p>
      <button className="app-button" onClick={handleLogin} disabled={loading}>
        {loading ? <Loader size="sm" className="app-loader" /> : 'Login with Spotify'}
      </button>
      {accessToken && (
        <Text>
          Access Token: <Code>{accessToken}</Code>
        </Text>
      )}
        <div className="footer-image-container">
            <img src={musicVaultImage} alt="Music Vault" className="footer-image" />
        </div>
    </div>
  );
};

export default Auth;
