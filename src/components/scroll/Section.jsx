import { RevealText } from './RevealText';

export function Section({ act }) {
  const align = act.align ?? 'center';
  return (
    <section
      className={`scroll-section scroll-section--${align}`}
      data-act={act.i}
      data-key={act.key}
      id={`scroll-act-${act.i}`}
    >
      <div className="scroll-section__inner">
        <div className="scroll-section__copy">
          <RevealText>{act.copy}</RevealText>
          {act.small && (
            <div className="scroll-section__copy--small">
              <RevealText delay={0.45}>{act.small}</RevealText>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
