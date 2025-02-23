import { Link } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";


export const Navigation = () => {

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-background/80 border-b p-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center group">
        <span className="text-xl sm:text-2xl font-semibold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-400">
            Omni
          </span>
          <span className="text-gray-800 dark:text-gray-200">Searches</span>
        </span>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};