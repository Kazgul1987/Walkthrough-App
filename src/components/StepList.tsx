import type { Step, SpoilerLevel } from '../types/guide';
import { stepDomId } from '../utils/stepDomId';
import { SpoilerBlock } from './SpoilerBlock';

export function StepList({ steps, sectionId, isChecked, mode, toggle }: { steps: Step[]; sectionId: string; isChecked: (id: string) => boolean; mode: SpoilerLevel; toggle: (id: string) => void }) {
  return <ol className="steps">{steps.map((step) => <li id={stepDomId(sectionId, step.id)} key={step.id} tabIndex={-1}><SpoilerBlock level={step.spoilerLevel} mode={mode}><label><input type="checkbox" checked={isChecked(step.id)} onChange={() => toggle(step.id)} /><span>{step.text} {step.optional && <em>Optional</em>}{step.reward && <small>Reward: {step.reward}</small>}</span></label></SpoilerBlock></li>)}</ol>;
}
