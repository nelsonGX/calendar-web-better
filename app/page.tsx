import Calendar from "@/components/calendar"

export default function Main() {
  return (
    <div className="bg-zinc-800 min-h-screen flex flex-col">

      <main className="p-4 flex-1 w-full flex items-center justify-center">
        <div className="w-full max-w-6xl">
          <Calendar />
        </div>
      </main>

      <footer className="justify-center flex">
        <div className="h-12 w-fit px-8 flex items-center justify-center space-x-4 rounded-4xl bg-zinc-900/70">
          <p className="text-zinc-300">Nelson{"'"}s Calendar</p>
          <p>/</p>
          <a 
            href="https://github.com/nelsonGX/calendar-web-better" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-300 hover:text-orange-200 transition-all duration-200"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}