import { useState } from 'react'; import type { SpoilerLevel } from '../types/guide';
const rank = { low: 0, normal: 1, full: 2 };
export function SpoilerBlock({ level, mode, children }: { level: SpoilerLevel; mode: SpoilerLevel; children: React.ReactNode }) { const [shown, setShown] = useState(false); if (rank[level] <= rank[mode] || shown) return <>{children}</>; return <button className="reveal" onClick={() => setShown(true)}>Reveal {level} spoiler</button>; }
