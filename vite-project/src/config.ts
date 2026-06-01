// API Configuration
// Change this URL when deploying to production
export const API_BASE_URL = 'http://127.0.0.1:8000';

// File upload settings
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
export const ALLOWED_AUDIO_FORMATS = [
  'audio/mpeg',      // .mp3
  'audio/wav',       // .wav
  'audio/ogg',       // .ogg
  'audio/flac',      // .flac
  'audio/x-m4a',     // .m4a
  'audio/mp4',       // .m4a alternative
];

export const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.flac', '.m4a'];
