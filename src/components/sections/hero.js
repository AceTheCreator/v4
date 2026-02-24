import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
import videos from '../../data/videos.json';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

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

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVideosOpen, setIsVideosOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isVideosOpen) {
      return undefined;
    }

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setIsVideosOpen(false);
      }
    };

    document.body.classList.add('hidden');
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('hidden');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVideosOpen]);

  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Azeez Elegbede.</h2>;
  const three = <h3 className="big-heading">I create software and content.</h3>;
  const four = (
    <>
      <p>
        I’m an Artisanal Developer Advocate and Software Engineer specializing in building (and
        occasionally writing) exceptional digital experiences. Currently, I’m focused on turning
        contributors to life-long maintainers through opensource mentorships, and creating
        exceptional educational content at{' '}
        <a href="https://asyncapi.com/" target="_blank" rel="noreferrer">
          AsyncAPI
        </a>
        .
      </p>
    </>
  );
  const five = (
    <button className="email-link" type="button" onClick={() => setIsVideosOpen(true)}>
      Check out my videos!
    </button>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}

      <CSSTransition
        in={isVideosOpen}
        timeout={prefersReducedMotion ? 0 : 260}
        classNames="video-modal"
        unmountOnExit>
        <StyledVideoModal
          role="dialog"
          aria-modal="true"
          aria-labelledby="videos-title"
          onClick={event => {
            if (event.target === event.currentTarget) {
              setIsVideosOpen(false);
            }
          }}>
          <div className="modal-card">
            <div className="modal-header">
              <h4 id="videos-title">Featured Videos</h4>
              <button className="close-button" type="button" onClick={() => setIsVideosOpen(false)}>
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
      </CSSTransition>
    </StyledHeroSection>
  );
};

export default Hero;
