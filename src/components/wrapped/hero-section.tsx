"use client";

export default function HeroSection() {
  return (
    <div className="w-full h-full flex justify-center items-center relative">
      <div className="relative w-full group">
        <p className="capitalize absolute text-[180px] font-bold tracking-tighter top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center opacity-0 group-hover:opacity-100 group-hover:top-[-200px] transition-all duration-700 bg-gradient-to-b dark:from-neutral-400 dark:via-neutral-800 dark:to-black from-black via-neutral-300 to-white text-transparent bg-clip-text z-[-2]">
          GitHub Wrapped
        </p>
        <p className="capitalize absolute text-[180px] font-bold tracking-tighter top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center opacity-0 group-hover:opacity-100 group-hover:top-[-100px] transition-all duration-700 bg-gradient-to-b dark:from-neutral-200 dark:via-neutral-600 dark:to-black from-black via-neutral-400 to-white text-transparent bg-clip-text z-[-1]">
          GitHub Wrapped
        </p>
        <p className="capitalize absolute text-[180px] font-bold tracking-tighter top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
          GitHub Wrapped
        </p>
        <p className="absolute text-[180px] font-bold tracking-tighter top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center opacity-0 group-hover:opacity-50 group-hover:top-[160px] transition-all duration-700 text-muted-foreground z-[-1]">
          2024
        </p>
        <p className="absolute text-lg tracking-tighter top-[140px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center opacity-100 group-hover:opacity-0 transition-all duration-700 text-muted-foreground">
          See what you have accomplished this year...
        </p>
      </div>
    </div>
  );
}
