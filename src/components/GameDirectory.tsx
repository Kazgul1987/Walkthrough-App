import type { Game } from '../types/guide';
import { GameCard } from './GameCard';
export function GameDirectory({ games, onSelect }: { games: Game[]; onSelect: (game: Game) => void }) {
  return <section className="game-directory"><h2>Choose a game</h2><div className="game-grid">{games.map((game) => <GameCard key={game.id} game={game} onSelect={() => onSelect(game)} />)}</div></section>;
}
