import "./App.css";
import Modal from './Modal';
import Toast from './Toast';
import { useEffect, useState, useRef } from 'react';
import { API_BASE_URL, MAX_FILE_SIZE, ALLOWED_AUDIO_FORMATS, ALLOWED_EXTENSIONS } from './config';

interface ItemData {
  id: number;
  name: string;
  file?: string;
  description?: string;
}

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

function Navigation({ onUploadClick, onRegisterClick, showToast }: { 
  onUploadClick: () => void; 
  onRegisterClick: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch(`${API_BASE_URL}/api/auth/user/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.username) {
            setUser(data);
          } else {
            localStorage.removeItem('authToken');
          }
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        });
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Please enter email and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setEmail('');
        setPassword('');
        showToast(`Welcome back, ${data.user.username}!`, 'success');
      } else {
        showToast(data.error || 'Login failed', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to connect to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <nav className="nav-container">
      <div className="logo">
        <a href="/">Media Portal | Demo</a>
      </div>

      <div className="links">
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="#" onClick={(e) => { e.preventDefault(); onUploadClick(); }}>Upload</a>
        {!user && <a href="#" onClick={(e) => { e.preventDefault(); onRegisterClick(); }}>Register</a>}
      </div>

      {user ? (
        <div className="login">
          <span style={{ color: '#4a90e2', marginRight: '10px' }}>
            Welcome, {user.username}!
          </span>
          <button className="log_btn" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="login">
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button 
            className="log_btn" 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </div>
      )}
    </nav>
  );
}

function Featured() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/featured/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load data');
        return res.json();
      })
      .then(json => {
        setItems(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to connect to server');
        setLoading(false);
      });
  }, []);

  return (
    <div className="featured-section card-box">
      <h1>Featured</h1>
      {loading ? (
        <p className="status-message">Loading...</p>
      ) : error ? (
        <p className="status-message">{error}</p>
      ) : items.length === 0 ? (
        <p className="status-message">No featured items</p>
      ) : (
        <div className="featured-grid">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setLoading(true);
    fetch(`${API_BASE_URL}/api/search/?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(json => {
        setResults(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="search-section card-box">
      <h1>Search</h1>
      <div className="search-box">
        <input 
          type="search" 
          placeholder="Enter name..." 
          className="search_input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="search-btn" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {results.length > 0 && (
        <div className="featured-grid" style={{ marginTop: '15px' }}>
          {results.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function ItemCard({ item }: { item: ItemData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!modalOpen && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [modalOpen]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const audioUrl = item.file?.startsWith('http') 
    ? item.file 
    : `${API_BASE_URL}${item.file}`;

  return (
    <>
      <div className="item-card" onClick={() => setModalOpen(true)}>
        <div className="item-card-preview">
          🎵 {item.name}
        </div>
      </div>

      <Modal active={modalOpen} setActive={setModalOpen}>
        <div className="track-modal-content">
          <div className="track-modal-header">
            <div className="track-modal-icon">♫</div>
            <div className="track-modal-info">
              <h2>{item.name}</h2>
              {item.description && <p>{item.description}</p>}
            </div>
          </div>

          {item.file && (
            <div className="custom-audio-player">
              <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />
              
              <div className="player-controls">
                <button className="play-btn" onClick={togglePlay}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
                
                <div className="time-display">{formatTime(currentTime)}</div>
                
                <input
                  type="range"
                  className="seek-slider"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                />
                
                <div className="time-display">{formatTime(duration)}</div>
                
                <div className="volume-control">
                  <span className="volume-icon" style={{ fontSize: '14px' }}>
                    {volume > 0.5 ? '🔊' : volume > 0 ? '🔉' : '🔇'}
                  </span>
                  <input
                    type="range"
                    className="volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                  />
                </div>
              </div>
            </div>
          )}

          <button className="track-modal-close" onClick={() => setModalOpen(false)}>
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}

function Recommended() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/recommended/`)
      .then(res => res.json())
      .then(json => {
        setItems(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="recommended-section card-box">
      <h1>Recommended</h1>
      {loading ? (
        <p className="status-message">Loading...</p>
      ) : items.length === 0 ? (
        <div className="recommended-placeholder">
          <p>Recommendations will appear here...</p>
        </div>
      ) : (
        <div className="featured-grid">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function Explore() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/recent/`)
      .then(res => res.json())
      .then(json => {
        setItems(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="explore-section card-box">
      <h1>Explore</h1>
      {loading ? (
        <p className="status-message">Loading...</p>
      ) : items.length === 0 ? (
        <p className="status-message">No recent tracks yet...</p>
      ) : (
        <div className="featured-grid">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [modalActive, setModalActive] = useState(false);
  const [registerModalActive, setRegisterModalActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Registration form state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const toastIdRef = useRef(0);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const id = toastIdRef.current++;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleUpload = async () => {
    if (!fileName.trim() || !file) {
      showToast('Please fill in the name and select a file', 'warning');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      showToast(`File is too large! Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`, 'error');
      return;
    }

    // Validate file format
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_AUDIO_FORMATS.includes(file.type) && !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      showToast(`Invalid file format! Allowed formats: ${ALLOWED_EXTENSIONS.join(', ')}`, 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', fileName);
    formData.append('file', file);
    if (description) formData.append('description', description);

    setUploading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        showToast('File uploaded successfully!', 'success');
        setUploadSuccess(true);
        setFileName('');
        setFile(null);
        setDescription('');
        setTimeout(() => {
          setModalActive(false);
          setUploadSuccess(false);
          window.location.reload();
        }, 1500);
      } else {
        showToast('Error uploading file', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to connect to server', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRegister = async () => {
    if (!regUsername.trim() || !regEmail.trim() || !regPassword.trim()) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    setRegistering(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: regUsername,
          email: regEmail,
          password: regPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        showToast('Account created successfully!', 'success');
        setRegisterSuccess(true);
        setRegUsername('');
        setRegEmail('');
        setRegPassword('');
        setTimeout(() => {
          setRegisterModalActive(false);
          setRegisterSuccess(false);
          window.location.reload();
        }, 1500);
      } else {
        showToast(data.error || 'Registration failed', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to connect to server', 'error');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="app-wrapper">
      <title> MediaPortal </title>
      <Navigation 
        onUploadClick={() => setModalActive(true)} 
        onRegisterClick={() => setRegisterModalActive(true)}
        showToast={showToast}
      />

      <main className="content">
        <div className="top-row">
          <Featured />
          <Search />
        </div>
        <Recommended />
        <Explore />
      </main>

      {/* Toast notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <Modal active={modalActive} setActive={setModalActive}>
        <div className="upload-form">
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            {uploadSuccess ? '✓ Successfully uploaded!' : 'Upload Media'}
          </h2>

          <input
            type="text"
            placeholder="File name..."
            className="search_input"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            disabled={uploading || uploadSuccess}
            style={{ width: '100%', marginBottom: '15px', background: '#222', border: '1px solid #444', color: 'white', padding: '10px', borderRadius: '5px' }}
          />

          <textarea
            placeholder="Description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={uploading || uploadSuccess}
            style={{ width: '100%', marginBottom: '15px', background: '#222', border: '1px solid #444', color: 'white', padding: '10px', borderRadius: '5px', minHeight: '60px', fontFamily: 'inherit' }}
          />

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="file-input" style={{ color: '#ccc', display: 'block', marginBottom: '10px', cursor: 'pointer' }}>
              📥 {file ? `Selected: ${file.name}` : 'Choose file (max 30 MB)'}
            </label>
            <input 
              id="file-input"
              type="file" 
              accept="audio/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={uploading || uploadSuccess}
              style={{ color: 'white', display: 'none' }} 
            />
          </div>

          <button 
            className="log_btn" 
            style={{ width: '100%', padding: '10px' }}
            onClick={handleUpload}
            disabled={uploading || uploadSuccess}
          >
            {uploading ? 'Uploading...' : uploadSuccess ? 'Done!' : 'Submit to Server'}
          </button>
        </div>
      </Modal>

      <Modal active={registerModalActive} setActive={setRegisterModalActive}>
        <div className="upload-form">
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            {registerSuccess ? '✓ Successfully registered!' : 'Create Account'}
          </h2>

          <input
            type="text"
            name="username"
            placeholder="Username..."
            className="search_input"
            autoComplete="username"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
            disabled={registering || registerSuccess}
            style={{ width: '100%', marginBottom: '15px', background: '#222', border: '1px solid #444', color: 'white', padding: '10px', borderRadius: '5px' }}
          />

          <input
            type="email"
            name="email"
            placeholder="Email..."
            className="search_input"
            autoComplete="email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            disabled={registering || registerSuccess}
            style={{ width: '100%', marginBottom: '15px', background: '#222', border: '1px solid #444', color: 'white', padding: '10px', borderRadius: '5px' }}
          />

          <input
            type="password"
            name="new-password"
            placeholder="Password..."
            className="search_input"
            autoComplete="new-password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            disabled={registering || registerSuccess}
            style={{ width: '100%', marginBottom: '20px', background: '#222', border: '1px solid #444', color: 'white', padding: '10px', borderRadius: '5px' }}
          />

          <button 
            className="log_btn" 
            style={{ width: '100%', padding: '10px' }}
            onClick={handleRegister}
            disabled={registering || registerSuccess}
          >
            {registering ? 'Creating account...' : registerSuccess ? 'Done!' : 'Register'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
