export function ProgressBar({ completed, total, label = 'Completion' }: { completed: number; total: number; label?: string }) {
 const value = total ? Math.round(completed / total * 100) : 0;

 return <div className="progress">
  <span className="progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
   <span className="progress-fill" style={{ width: `${value}%` }} />
  </span>
  <b>{value}%</b>
 </div>;
}
