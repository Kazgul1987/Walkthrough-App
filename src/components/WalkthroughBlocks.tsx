import type { SpoilerLevel, Step, WalkthroughBlock } from '../types/guide';
import { stepDomId } from '../utils/stepDomId';
import { SpoilerBlock } from './SpoilerBlock';

const spoilerRank = { low: 0, normal: 1, full: 2 };

export function WalkthroughBlocks({ blocks, steps, sectionId, mode }: { blocks: WalkthroughBlock[] | undefined; steps: Step[]; sectionId: string; mode: SpoilerLevel }) {
  if (!blocks?.length) return null;
  const stepsById = new Map(steps.map((step) => [step.id, step]));
  const scrollToStep = (stepId: string) => {
    const target = document.getElementById(stepDomId(sectionId, stepId));
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target?.focus({ preventScroll: true });
  };
  return <section className="walkthrough-blocks"><h2>Detailed Walkthrough</h2>{blocks.map((block) => {
    const relatedSteps = (block.checklistRefs ?? []).flatMap((id) => {
      const step = stepsById.get(id);
      return step ? [step] : [];
    }).filter((step, index, values) => spoilerRank[step.spoilerLevel] <= spoilerRank[mode] && values.findIndex(({ id }) => id === step.id) === index);
    return <SpoilerBlock key={block.id} level={block.spoilerLevel} mode={mode}><article className="walkthrough-block"><div className="walkthrough-block-heading">{block.title && <h3>{block.title}</h3>}{block.optional && <span className="pill">Optional</span>}</div><p className="walkthrough-block__text">{block.text}</p>{block.warning && <aside className="walkthrough-warning"><strong>Warning:</strong> {block.warning}</aside>}{(block.relatedNpc?.length || block.relatedLocations?.length || block.relatedQuestIds?.length) && <p className="walkthrough-meta">{block.relatedNpc?.length ? `NPCs: ${block.relatedNpc.join(', ')}` : ''}{block.relatedLocations?.length ? `${block.relatedNpc?.length ? ' · ' : ''}Locations: ${block.relatedLocations.join(', ')}` : ''}{block.relatedQuestIds?.length ? `${block.relatedNpc?.length || block.relatedLocations?.length ? ' · ' : ''}Quests: ${block.relatedQuestIds.join(', ')}` : ''}</p>}{relatedSteps.length > 0 && <section className="walkthrough-related-steps" aria-label="Related steps"><strong>Related steps</strong><ul>{relatedSteps.map((step) => <li key={step.id}><button type="button" onClick={() => scrollToStep(step.id)}>{step.text}{step.optional && <em>Optional</em>}</button></li>)}</ul></section>}</article></SpoilerBlock>;
  })}</section>;
}
