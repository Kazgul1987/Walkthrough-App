import type { Game } from '../types/guide';

export function GameCard({ game, onSelect }: { game: Game; onSelect: () => void }) {
  return (
    <button className="game-card" onClick={onSelect}>
      {game.coverImage && (
        <img
          className="game-card__image"
          src={game.coverImage}
          alt={game.coverImageAlt ?? ''}
        />
      )}
      <span className="game-card__content">
        <span className="eyebrow">GAME GUIDE</span>
        <span className="game-card__title">{game.title}</span>
        <span className="game-card__description">{game.description}</span>
        <span>{game.sections.length} guide sections →</span>
      </span>
    </button>
  );
}
