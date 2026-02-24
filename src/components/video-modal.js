import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import videos from '../data/videos.json';

const StyledVideoModal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  background: rgba(10, 25, 47, 0.6);
  backdrop-filter: blur(8px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 220ms var(--easing);

  &.video-modal-enter,
  &.video-modal-exit-done {
    opacity: 0;
    pointer-events: none;
  }

  &.video-modal-enter-active,
  &.video-modal-enter-done {
    opacity: 1;
    pointer-events: auto;
  }

  &.video-modal-exit-active {
    opacity: 0;
    pointer-events: none;
  }

  @media (max-width: 600px) {
    padding: 60px 16px;
  }

  .modal-card {
    ${({ theme }) => theme.mixins.boxShadow};
    background: var(--pure-white);
    border: 1px solid #e0e0e0;
    border-radius: var(--border-radius);
    width: min(1100px, 100%);
    max-height: 85vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transform: translateY(20px) scale(0.98);
    opacity: 0;
    transition: transform 260ms var(--easing), opacity 220ms var(--easing);
  }

  &.video-modal-enter-active .modal-card,
  &.video-modal-enter-done .modal-card {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  &.video-modal-exit-active .modal-card {
    transform: translateY(10px) scale(0.985);
    opacity: 0;
  }

  .modal-header {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 24px 28px;
    border-bottom: 1px solid #e0e0e0;
    background: linear-gradient(120deg, rgba(245, 110, 89, 0.08), rgba(87, 203, 255, 0.08));

    h4 {
      margin: 0;
      color: var(--black);
      font-size: clamp(18px, 2.5vw, 24px);
    }
  }

  .close-button {
    ${({ theme }) => theme.mixins.smallButton};
  }

  .modal-body {
    padding: 24px 28px 30px;
    overflow: auto;
  }
`;

const VideosGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const VideoCard = styled.li`
  ${({ theme }) => theme.mixins.boxShadow};
  border: 1px solid #e0e0e0;
  border-radius: var(--border-radius);
  background-color: var(--pure-white);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  a {
    color: inherit;
  }

  .thumb {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: var(--lightest-navy);
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .meta {
    padding: 14px 16px 16px;

    h5 {
      margin: 0 0 6px 0;
      color: var(--black);
      font-size: var(--fz-lg);
    }

    p {
      margin: 0;
      color: var(--dark-slate);
      font-size: var(--fz-sm);
    }
  }
`;

const VideoModal = ({ isOpen, onClose, prefersReducedMotion = false }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !isClient) {
      return undefined;
    }

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.classList.add('hidden');
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('hidden');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isClient, onClose]);

  if (!isClient) {
    return null;
  }

  return createPortal(
    <CSSTransition
      in={isOpen}
      timeout={prefersReducedMotion ? 0 : 260}
      classNames="video-modal"
      unmountOnExit>
      <StyledVideoModal
        role="dialog"
        aria-modal="true"
        aria-labelledby="videos-title"
        onClick={event => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}>
        <div className="modal-card">
          <div className="modal-header">
            <h4 id="videos-title">Featured Videos</h4>
            <button className="close-button" type="button" onClick={onClose}>
              Close
            </button>
          </div>
          <div className="modal-body">
            <VideosGrid>
              {videos.map(video => (
                <VideoCard key={video.id}>
                  <a href={video.url} target="_blank" rel="noreferrer">
                    <div className="thumb">
                      <img src={video.thumbnail} alt={video.title} loading="lazy" />
                    </div>
                    <div className="meta">
                      <h5>{video.title}</h5>
                      <p>{video.subtitle}</p>
                    </div>
                  </a>
                </VideoCard>
              ))}
            </VideosGrid>
          </div>
        </div>
      </StyledVideoModal>
    </CSSTransition>,
    document.body,
  );
};

export default VideoModal;
