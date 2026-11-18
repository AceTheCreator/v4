import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';

const ITEM_WIDTH = 400;
const GAP = 30;

const items = [
  {
    id: 1,
    color: '#f56e59',
    label: 'Night One',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    color: '#ee4f86',
    label: 'Night Two',
    image:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    color: '#8d62ff',
    label: 'Night Three',
    image:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    color: '#2f8fff',
    label: 'Night Four',
    image:
      'https://images.unsplash.com/photo-1505066836043-7bf4cb6bc5d8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    color: '#3fd6cf',
    label: 'Night Five',
    image:
      'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=1200&q=80',
  },
];

const StyledMeetupsPage = styled.main`
  .intro-section {
    min-height: 55vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
    padding: 0 0 40px;

    .subtitle {
      font-family: var(--font-mono);
      color: var(--green);
      margin: 0 0 18px;
      font-size: var(--fz-sm);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      color: var(--black);
      text-transform: uppercase;
      letter-spacing: 0.02em;
      font-size: clamp(36px, 8vw, 84px);
      line-height: 0.95;
    }
  }

  .scroll-container {
    height: 310vh;
    position: relative;
  }

  .sticky-wrapper {
    position: sticky;
    top: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    background: radial-gradient(circle at 20% 20%, rgba(245, 110, 89, 0.16), transparent 45%),
      radial-gradient(circle at 80% 80%, rgba(87, 203, 255, 0.14), transparent 50%);
  }

  .viewport {
    width: min(400px, calc(100vw - 48px));
    margin: 0 auto;
    overflow: visible;
  }

  .gallery {
    display: flex;
    gap: ${GAP}px;
    will-change: transform;
  }

  .gallery-item {
    flex-shrink: 0;
    width: ${ITEM_WIDTH}px;
    max-width: min(${ITEM_WIDTH}px, calc(100vw - 48px));
    height: 520px;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    background-image: var(--item-image);
    background-size: cover;
    background-position: center;
    border: 1px solid #e0e0e0;
    box-shadow: 0 20px 40px -20px rgba(2, 12, 27, 0.35);
  }

  .gallery-item:before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(2, 12, 27, 0.04) 35%, var(--item-color) 100%);
    mix-blend-mode: multiply;
  }

  .item-content {
    position: absolute;
    bottom: 28px;
    left: 24px;
    z-index: 1;
  }

  .item-number {
    font-size: var(--fz-xs);
    color: var(--item-color);
    font-family: var(--font-mono);
    display: block;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .gallery-item h2 {
    font-size: clamp(24px, 3vw, 32px);
    font-weight: 600;
    color: var(--pure-white);
    margin: 0;
    text-shadow: 0 2px 16px rgba(2, 12, 27, 0.45);
  }

  .outro-section {
    min-height: 70vh;
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      color: var(--black);
      margin: 0;
      font-size: clamp(56px, 13vw, 160px);
      line-height: 0.9;
    }
  }

  @media (max-width: 900px) {
    .gallery-item {
      height: 420px;
    }
  }

  @media (max-width: 600px) {
    .scroll-container {
      height: 280vh;
    }

    .viewport {
      width: calc(100vw - 32px);
    }

    .gallery {
      gap: 15px;
    }

    .gallery-item {
      width: 280px;
      max-width: calc(100vw - 32px);
      height: 350px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .scroll-container {
      height: auto;
    }

    .sticky-wrapper {
      position: relative;
      min-height: auto;
      padding: 30px 0;
      overflow-x: auto;
      overflow-y: visible;
      scroll-snap-type: x mandatory;
    }

    .viewport {
      width: 100%;
      padding: 0 16px;
    }

    .gallery {
      transform: none !important;
      width: max-content;
      gap: 16px;
    }

    .gallery-item {
      scroll-snap-align: center;
    }
  }
`;

const MeetupsPage = ({ location }) => {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);

  const totalDistance = useMemo(() => (items.length - 1) * (ITEM_WIDTH + GAP), []);

  useEffect(() => {
    const container = containerRef.current;
    const gallery = galleryRef.current;

    if (!container || !gallery) {
      return undefined;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let rafId = 0;

    const updatePosition = () => {
      if (motionQuery.matches) {
        gallery.style.transform = 'translate3d(0px, 0px, 0px)';
        return;
      }

      const rect = container.getBoundingClientRect();
      const start = window.scrollY + rect.top;
      const end = start + container.offsetHeight - window.innerHeight;
      const range = Math.max(end - start, 1);
      const progress = Math.min(Math.max((window.scrollY - start) / range, 0), 1);
      const x = -totalDistance * progress;
      gallery.style.transform = `translate3d(${x}px, 0, 0)`;
    };

    const onScrollOrResize = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [totalDistance]);

  return (
    <Layout location={location}>
      <Helmet title="Meetups" />

      <StyledMeetupsPage>
        <section className="intro-section">
          <p className="subtitle">Community</p>
          <h1>Tokyo Nights</h1>
        </section>

        <section
          ref={containerRef}
          className="scroll-container"
          aria-label="Horizontal meetup gallery">
          <div className="sticky-wrapper">
            <div className="viewport">
              <div ref={galleryRef} className="gallery">
                {items.map(item => (
                  <article
                    key={item.id}
                    className="gallery-item"
                    style={{
                      '--item-color': item.color,
                      '--item-image': `url(${item.image})`,
                    }}>
                    <div className="item-content">
                      <span className="item-number">0{item.id}</span>
                      <h2>{item.label}</h2>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="outro-section">
          <p>Fin</p>
        </section>
      </StyledMeetupsPage>
    </Layout>
  );
};

MeetupsPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default MeetupsPage;
