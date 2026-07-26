export function ProgressBar({ completed, total }: { completed: number; total: number }) {
 const value = total ? Math.round(completed / total * 100) : 0;

 return <div className="progress">
  <span className="progress-track" role="progressbar" aria-label="Completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
   <span className="progress-fill" style={{ width: `${value}%` }} />
  </span>
  <b>{value}%</b>
 </div>;
}
