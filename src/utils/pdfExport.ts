import type { Game, GuideSection, Progress } from '../types/guide';
import { lootKey, sectionKey, stepKey } from './progressKeys';

const escapeHtml = (value: string | undefined) => (value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const list = (items: string[]) => items.length
  ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
  : '<p class="muted">None</p>';

const renderSection = (game: Game, section: GuideSection, progress: Progress, note: string) => {
  const metadata = [section.type, section.area, section.region, section.city, section.faction, section.dlc, `Recommended level ${section.recommendedLevel}`].filter(Boolean).map((item) => escapeHtml(item)).join(' · ');
  const walkthrough = (section.walkthroughBlocks ?? []).map((block) => `<div class="block"><h3>${escapeHtml(block.title || 'Walkthrough detail')}${block.optional ? ' <small>Optional</small>' : ''}</h3><p>${escapeHtml(block.text)}</p>${block.warning ? `<p class="warning"><strong>Warning:</strong> ${escapeHtml(block.warning)}</p>` : ''}</div>`).join('');
  const steps = section.steps.map((step) => `<li class="check">${progress.steps[stepKey(game.id, section.id, step.id)] ? '☑' : '☐'} <span>${escapeHtml(step.text)}${step.optional ? ' <small>Optional</small>' : ''}${step.reward ? `<br><small>Reward: ${escapeHtml(step.reward)}</small>` : ''}</span></li>`).join('');
  const loot = section.loot.map((item) => `<li class="check">${progress.loot[lootKey(game.id, section.id, item.id)] ? '☑' : '☐'} <span><strong>${escapeHtml(item.name)}</strong> — ${escapeHtml(item.location)}${item.missable ? ' <small>Missable</small>' : ''}${item.notes ? `<br><small>${escapeHtml(item.notes)}</small>` : ''}</span></li>`).join('');
  const boss = section.boss ? `<h2>Boss guide: ${escapeHtml(section.boss.name)}</h2><p><strong>Weak:</strong> ${escapeHtml(section.boss.weaknesses.join(', '))} · <strong>Resists:</strong> ${escapeHtml(section.boss.resistances.join(', '))}</p>${list(section.boss.phases)}<p>${escapeHtml(section.boss.recommendedStrategy)}</p>` : '';

  return `<section class="section"><div class="section-title"><span>${progress.sections[sectionKey(game.id, section.id)] ? '✓' : ''}</span><div><p class="meta">${metadata}</p><h1>${escapeHtml(section.title)}</h1></div></div><p>${escapeHtml(section.objective)}</p><p class="callout"><strong>Prepare:</strong> ${escapeHtml(section.preparation)}</p>${walkthrough ? `<h2>Detailed walkthrough</h2>${walkthrough}` : ''}<h2>Walkthrough checklist</h2><ol>${steps}</ol><h2>Loot</h2>${loot ? `<ul>${loot}</ul>` : '<p class="muted">None</p>'}${boss}${section.missableContent.length ? `<h2>Before you advance</h2>${list(section.missableContent)}` : ''}${section.secrets.length || section.commonMistakes.length ? `<h2>Secrets &amp; pitfalls</h2>${list([...section.secrets, ...section.commonMistakes])}` : ''}${note ? `<h2>Personal notes</h2><p class="notes">${escapeHtml(note)}</p>` : ''}</section>`;
};

export const createGamePrintDocument = (game: Game, progress: Progress, notes: Record<string, string>) => `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(game.title)} – Complete Guide</title><style>
  @page{margin:18mm 16mm}*{box-sizing:border-box}body{max-width:850px;margin:auto;color:#20222a;font:11pt/1.5 system-ui,sans-serif}h1{font-size:22pt;line-height:1.15;margin:.15rem 0 1rem}h2{font-size:14pt;margin:1.4rem 0 .45rem}h3{font-size:11.5pt;margin:0 0 .35rem}.cover{min-height:80vh;display:grid;place-content:center;text-align:center;break-after:page}.cover h1{font-size:34pt}.cover p{color:#5c6170}.section{break-before:page}.section-title{display:flex;gap:.7rem;align-items:start}.section-title>span{font-size:18pt;color:#216b3e}.meta,.muted,small{color:#626979}.callout,.warning,.notes{padding:.7rem .9rem;border-left:3px solid #536398;background:#f2f4f9}.warning{border-color:#b75834;background:#fff3ee}.block{break-inside:avoid;margin:.7rem 0;padding:.75rem;border:1px solid #d8dce6;border-radius:6px}.block p,.notes{white-space:pre-line}ol,ul{padding-left:1.4rem}.check{display:flex;gap:.45rem;margin:.35rem 0;break-inside:avoid}.check::marker{content:''}li,p{orphans:3;widows:3}@media screen{body{padding:2rem}.cover{min-height:70vh}}
</style></head><body><section class="cover"><div><p>WALKTHROUGH COMPANION</p><h1>${escapeHtml(game.title)}</h1><h2>Complete Guide</h2><p>${game.sections.length} sections · ${escapeHtml(game.versionNotes)}</p><p>All spoiler levels are included.</p></div></section>${game.sections.map((section) => renderSection(game, section, progress, notes[sectionKey(game.id, section.id)] ?? '')).join('')}</body></html>`;

export const exportGameAsPdf = (game: Game, progress: Progress, notes: Record<string, string>) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.alert('The print view was blocked. Allow pop-ups for this site and try again.');
    return;
  }
  printWindow.opener = null;
  printWindow.document.open();
  printWindow.document.write(createGamePrintDocument(game, progress, notes));
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => printWindow.print(), 250);
};
