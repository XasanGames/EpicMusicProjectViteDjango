import { useState, useRef, useEffect } from 'react';
import Modal from './Modal';

interface PlayerProps {
  active: boolean;
  setActive: (active: boolean) => void;
  songId: number;
}

const NewgroundsModalPlayer = ({ active, setActive, songId }: PlayerProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const streamUrl = `newgrounds.com{songId}`;

  // Эффект отвечает ТОЛЬКО за синхронизацию с внешним API (HTML5 Audio)
  useEffect(() => {
    if (!audioRef.current) return;

    if (!active) {
      // Просто останавливаем аудио. Стейт исправится сам через событие onPause.
      audioRef.current.pause();
    } else {
      // При открытии или смене ID сбрасываем поток
      audioRef.current.load();
    }
  }, [active, songId]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .catch(err => console.error("Ошибка онлайн-стриминга:", err));
    }
  };

  return (
    <Modal active={active} setActive={setActive}>
      <div style={{ textAlign: 'center', padding: '10px', color: '#000' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Онлайн-плеер</h3>
        <p style={{ fontSize: '14px', color: '#666' }}>ID трека: {songId}</p>

        {/* Нативные события тега <audio> безопасно управляют стейтом React */}
        <audio 
          ref={audioRef} 
          src={streamUrl} 
          preload="auto" 
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={togglePlay} 
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', borderRadius: '4px' }}
          >
            {isPlaying ? '⏸ Пауза' : '▶ Слушать онлайн'}
          </button>
          
          <button 
            onClick={() => setActive(false)} 
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', borderRadius: '4px' }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NewgroundsModalPlayer;
