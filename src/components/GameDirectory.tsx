import type { Game, Progress } from '../types/guide';
import { GameCard } from './GameCard';
export function GameDirectory({ games, progress, onSelect }: { games: Game[]; progress: Progress; onSelect: (game: Game) => void }) {
  return <section className="game-directory"><h2>Choose a game</h2><div className="game-grid">{games.map((game) => <GameCard key={game.id} game={game} progress={progress} onSelect={() => onSelect(game)} />)}</div></section>;
}
