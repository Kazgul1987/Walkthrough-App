import { useMemo, useState } from 'react';
import type { Game, GuideSection, Progress } from '../types/guide';
import { matchesSearch } from '../utils/search'; import { GuideFilters, defaultFilters, type Filters } from './GuideFilters'; import { SearchBar } from './SearchBar'; import { SectionCard } from './SectionCard';
import { stepKey } from '../utils/progressKeys';
import { exportGameAsPdf } from '../utils/pdfExport';
export function GuideDirectory({ game, progress, notes, onOpen }: { game: Game; progress: Progress; notes: Record<string, string>; onOpen: (section: GuideSection) => void }) {
 const [query, setQuery] = useState(''); const [filters, setFilters] = useState<Filters>(defaultFilters);
 const sections = useMemo(() => game.sections.filter((s) => (filters.type === 'All' || s.type === filters.type) && (filters.dlc === 'All' || s.dlc === filters.dlc) && (filters.faction === 'All' || s.faction === filters.faction) && (filters.place === 'All' || s.city === filters.place || s.region === filters.place) && (!filters.missable || s.missable) && (!filters.achievement || s.achievementRelevant) && (!filters.uniqueItem || s.uniqueItemRelevant) && matchesSearch(s, query)), [game, query, filters]);
 const done = (section: GuideSection) => section.steps.filter((step) => progress.steps[stepKey(game.id, section.id, step.id)]).length;
 return <section className="directory"><div className="directory-head"><div><h2>{game.title}</h2><p className="sub">{game.description}</p></div><div className="directory-actions"><SearchBar value={query} onChange={setQuery}/><button type="button" className="export" onClick={() => exportGameAsPdf(game, progress, notes)}>Export complete guide (PDF)</button></div></div><GuideFilters sections={game.sections} filters={filters} onChange={setFilters}/><div className="grid">{sections.map((section) => <SectionCard key={section.id} section={section} done={done(section)} onOpen={() => onOpen(section)}/>)}</div>{!sections.length && <p className="empty">No guides match those filters.</p>}</section>;
}
