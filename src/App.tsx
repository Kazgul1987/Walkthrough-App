import { useState } from 'react';
import { loadGames } from './data/guideLoader';
import type { Game, GuideSection, Progress, SpoilerLevel } from './types/guide';
import { loadNotes, loadProgress, loadSpoiler, saveNotes, saveProgress, saveSpoiler } from './utils/storage';
import { GameDirectory } from './components/GameDirectory'; import { GuideDetail } from './components/GuideDetail'; import { GuideDirectory } from './components/GuideDirectory';
const games = loadGames(); const labels = { low: 'Spoiler-light', normal: 'Normal', full: 'Full walkthrough' };
export default function App() {
 const [game, setGame] = useState<Game | null>(null); const [selected, setSelected] = useState<GuideSection | null>(null); const [progress, setProgress] = useState<Progress>(loadProgress); const [notes, setNotes] = useState(loadNotes); const [mode, setMode] = useState<SpoilerLevel>(loadSpoiler);
 const setSpoiler = (value: SpoilerLevel) => { setMode(value); saveSpoiler(value); }; const updateProgress = (value: Progress) => { setProgress(value); saveProgress(value); }; const updateNotes = (id: string, value: string) => { const next = { ...notes, [id]: value }; setNotes(next); saveNotes(next); };
 if (game && selected) return <GuideDetail game={game} section={selected} progress={progress} notes={notes} mode={mode} onBack={() => setSelected(null)} onProgress={updateProgress} onNotes={updateNotes} onNext={setSelected} onModeChange={setSpoiler}/>;
 return <main><header><div><span className="eyebrow">WALKTHROUGH COMPANION</span><h1>Your journey, organized.</h1><p>Original local guides with spoilers and checklists under your control.</p></div><label className="spoil">Spoiler mode<select value={mode} onChange={(event) => setSpoiler(event.target.value as SpoilerLevel)}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></header>{game ? <><button className="back" onClick={() => setGame(null)}>← All games</button><GuideDirectory game={game} progress={progress} notes={notes} onOpen={setSelected}/></> : <GameDirectory games={games} progress={progress} onSelect={setGame}/>}</main>;
}
