import { useRef, useState, type ChangeEvent } from 'react';
import type { Game, Progress } from '../types/guide';
import { loadGameCover, prepareGameCover, removeGameCover, saveGameCover } from '../utils/gameCoverStorage';
import { stepKey } from '../utils/progressKeys';
import { ProgressBar } from './ProgressBar';

export function GameCard({ game, progress, onSelect }: { game: Game; progress: Progress; onSelect: () => void }) {
  const [customCover, setCustomCover] = useState(() => loadGameCover(game.id));
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const cover = customCover ?? game.coverImage;
  const totalSteps = game.sections.reduce((total, section) => total + section.steps.length, 0);
  const completedSteps = game.sections.reduce(
    (total, section) => total + section.steps.filter((step) => progress.steps[stepKey(game.id, section.id, step.id)]).length,
    0,
  );

  const chooseCover = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const preparedCover = await prepareGameCover(file);
      saveGameCover(game.id, preparedCover);
      setCustomCover(preparedCover);
      setError('');
    } catch (reason) {
      const message = reason instanceof DOMException && reason.name === 'QuotaExceededError'
        ? 'There is not enough browser storage for this image. Please choose a smaller file.'
        : reason instanceof Error ? reason.message : 'The image could not be saved.';
      setError(message);
    }
  };

  const resetCover = () => {
    removeGameCover(game.id);
    setCustomCover(undefined);
    setError('');
  };

  return (
    <article className="game-card">
      {cover ? (
        <img
          className="game-card__image"
          src={cover}
          alt={customCover ? `Custom cover for ${game.title}` : game.coverImageAlt ?? ''}
        />
      ) : (
        <div className="game-card__image game-card__placeholder" aria-hidden="true">No cover image</div>
      )}
      <button className="game-card__content" onClick={onSelect}>
        <span className="eyebrow">GAME GUIDE</span>
        <span className="game-card__title">{game.title}</span>
        <span className="game-card__description">{game.description}</span>
        <span>{game.sections.length} guide sections →</span>
        <span className="game-card__progress-label">Overall progress</span>
        <ProgressBar completed={completedSteps} total={totalSteps} label={`${game.title} overall progress`} />
      </button>
      <div className="game-card__image-actions">
        <input ref={inputRef} className="visually-hidden" type="file" accept="image/*" onChange={chooseCover} />
        <button className="cover-action" type="button" onClick={() => inputRef.current?.click()}>
          {customCover ? 'Change image' : 'Choose image'}
        </button>
        {customCover && <button className="cover-action cover-action--secondary" type="button" onClick={resetCover}>Remove</button>}
      </div>
      {error && <p className="game-card__error" role="alert">{error}</p>}
    </article>
  );
}
