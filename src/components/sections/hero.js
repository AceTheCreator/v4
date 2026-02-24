import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
import VideoModal from '@components/video-modal';

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

const Hero = () => {
  const [isVideosOpen, setIsVideosOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

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
  const shouldAnimate = !prefersReducedMotion;

  return (
    <StyledHeroSection>
      <TransitionGroup component={null}>
        {items.map((item, i) => (
          <CSSTransition
            key={i}
            classNames="fadeup"
            timeout={shouldAnimate ? loaderDelay : 0}
            enter={shouldAnimate}
            exit={false}>
            <div
              style={{ transitionDelay: shouldAnimate ? `${navDelay + (i + 1) * 100}ms` : '0ms' }}>
              {item}
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>

      <VideoModal
        isOpen={isVideosOpen}
        onClose={() => setIsVideosOpen(false)}
        prefersReducedMotion={prefersReducedMotion}
      />
    </StyledHeroSection>
  );
};

export default Hero;
