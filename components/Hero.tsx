export default function Hero() {
  return (
    <section className="relative flex mt-10 sm:mt-6 items-center justify-center min-h-[60vh] w-full bg-white dark:bg-black overflow-hidden">
      {/* Grid lines overlay */}
      <div className="hero-grid-lines" />

      {/* Subtle glow behind the text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[600px] h-[200px] bg-gradient-to-r from-teal-400/30 via-black/10 to-indigo-600/30 dark:via-white/10 blur-2xl rounded-full opacity-60" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4">
        <div className="mb-4 flex justify-center">
          <span className="animated-border inline-block">
            <span className="block px-4 py-1 rounded-full bg-black dark:bg-white text-xs font-medium text-white/80 dark:text-black/80 tracking-wide shadow">
              Talent Trek LMS – Smarter Learning Starts Here
            </span>
          </span>
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-black dark:text-white"
          style={{ fontFamily: "'Inter', Arial, Helvetica, sans-serif" }}
        >
          Transform Education with Talent Trek
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8">
          A powerful Learning Management System to manage, track, and elevate your training programs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#"
            className="px-6 py-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-semibold transition shadow-lg"
          >
            Get Started with Talent Trek
          </a>
          <a
            href="#"
            className="px-6 py-3 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-black dark:text-white font-semibold border border-black/20 dark:border-white/20 transition"
          >
            View All Features
          </a>
        </div>
      </div>
    </section>
  );
}
