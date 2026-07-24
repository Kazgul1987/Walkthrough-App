import type { SpoilerLevel, WalkthroughBlock } from '../types/guide';
import { SpoilerBlock } from './SpoilerBlock';

export function WalkthroughBlocks({ blocks, mode }: { blocks: WalkthroughBlock[] | undefined; mode: SpoilerLevel }) {
  if (!blocks?.length) return null;
  return <section className="walkthrough-blocks"><h2>Detailed Walkthrough</h2>{blocks.map((block) => <SpoilerBlock key={block.id} level={block.spoilerLevel} mode={mode}><article className="walkthrough-block"><div className="walkthrough-block-heading">{block.title && <h3>{block.title}</h3>}{block.optional && <span className="pill">Optional</span>}</div><p>{block.text}</p>{block.warning && <aside className="walkthrough-warning"><strong>Warning:</strong> {block.warning}</aside>}{(block.relatedNpc?.length || block.relatedLocations?.length || block.relatedQuestIds?.length) && <p className="walkthrough-meta">{block.relatedNpc?.length ? `NPCs: ${block.relatedNpc.join(', ')}` : ''}{block.relatedLocations?.length ? `${block.relatedNpc?.length ? ' · ' : ''}Locations: ${block.relatedLocations.join(', ')}` : ''}{block.relatedQuestIds?.length ? `${block.relatedNpc?.length || block.relatedLocations?.length ? ' · ' : ''}Quests: ${block.relatedQuestIds.join(', ')}` : ''}</p>}</article></SpoilerBlock>)}</section>;
}
