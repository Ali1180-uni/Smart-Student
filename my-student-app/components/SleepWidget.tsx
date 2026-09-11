import { Moon, ShieldAlert } from "lucide-react";

type SleepWidgetProps = {
  hoursToWakeTime?: number;
  estimatedWorkloadHours?: number;
};

export default function SleepWidget({
  hoursToWakeTime = 14,
  estimatedWorkloadHours = 8,
}: SleepWidgetProps) {
  const estimatedSleep = hoursToWakeTime - estimatedWorkloadHours;
  const sleepStatus = estimatedSleep >= 8 ? "healthy" : estimatedSleep >= 6 ? "watch" : "alert";
  const statusStyles = {
    healthy: {
      label: "Sleep target on track",
      text: "text-emerald-700",
      track: "bg-emerald-100",
      fill: "bg-emerald-400",
    },
    watch: {
      label: "A little less than ideal",
      text: "text-amber-700",
      track: "bg-amber-100",
      fill: "bg-amber-400",
    },
    alert: {
      label: "Workload needs attention",
      text: "text-rose-700",
      track: "bg-rose-100",
      fill: "bg-rose-400",
    },
  }[sleepStatus];
  const sleepProgress = Math.min(Math.max((estimatedSleep / 8) * 100, 0), 100);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7" aria-labelledby="sleep-widget-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-zinc-500 uppercase">Smart sleep engine</p>
          <h2 id="sleep-widget-title" className="mt-2 text-lg font-semibold tracking-tight text-zinc-900">
            Tonight&apos;s outlook
          </h2>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
          <Moon size={18} />
        </div>
      </div>

      <div className="mt-6 flex items-end gap-2">
        <span className="text-5xl font-semibold tracking-tight text-zinc-900">{estimatedSleep}</span>
        <span className="mb-1 text-sm font-medium text-zinc-500">hours estimated sleep</span>
      </div>
      <p className={`mt-2 text-sm font-medium ${statusStyles.text}`}>{statusStyles.label}</p>

      <div className={`mt-5 h-2 overflow-hidden rounded-full ${statusStyles.track}`}>
        <div
          className={`h-full rounded-full transition-all ${statusStyles.fill}`}
          style={{ width: `${sleepProgress}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-zinc-400">
        <span>0 hours</span>
        <span>8 hour target</span>
      </div>

      {estimatedSleep < 6 && (
        <div className="mt-5 flex gap-2 rounded-lg bg-rose-50 p-3 text-sm leading-5 text-rose-800">
          <ShieldAlert size={18} className="mt-0.5 shrink-0" />
          <p>High workload detected. Consider deferring non-urgent tasks.</p>
        </div>
      )}
    </section>
  );
}
