import { Clock3, Sparkles } from "lucide-react";
import Image from "next/image";
import SleepWidget from "../components/SleepWidget";
import StudyChat from "../components/StudyChat";
import TodayTimeline from "../components/TodayTimeline";

export default function Home() {
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="min-h-screen bg-gray-50 text-zinc-900">
      <main className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)] lg:gap-10 lg:px-10 lg:py-8">
        <section className="flex flex-col">
          <header className="border-b border-zinc-200/80 pb-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Image
                  src="https://stories.freepiklabs.com/storage/28383/Learning-01.svg"
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-lg bg-white object-contain p-1"
                />
                <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase">
                  Study / Dashboard
                </p>
              </div>
              <span className="hidden text-sm text-zinc-500 sm:block">{today}</span>
            </div>
            <div className="mt-10 flex items-end justify-between gap-6">
              <div>
                <p className="mb-3 text-sm font-medium text-zinc-500 sm:hidden">{today}</p>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Good morning, Alex
                </h1>
                <p className="mt-3 max-w-lg text-base leading-7 text-zinc-500">
                  A clear mind starts with a clear next step. Here&apos;s what deserves your attention today.
                </p>
              </div>
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white sm:flex">
                AL
              </div>
            </div>
          </header>

          <div className="flex flex-1 flex-col py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">{today}</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">Your tasks</h2>
              </div>
            </div>

            <TodayTimeline />

            <div className="mt-auto grid gap-3 pt-8 sm:grid-cols-2">
              <div className="flex items-center gap-3 border-t border-zinc-200 pt-4">
                <Clock3 size={17} className="text-zinc-400" />
                <div>
                  <p className="text-sm font-medium">2 classes today</p>
                  <p className="text-xs text-zinc-500">Stay present for each one</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t border-zinc-200 pt-4">
                <Sparkles size={17} className="text-zinc-400" />
                <div>
                  <p className="text-sm font-medium">AI guide ready</p>
                  <p className="text-xs text-zinc-500">Ask for a plan when you need one</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <SleepWidget />
          <StudyChat />
        </aside>
      </main>
    </div>
  );
}
