// src/components/navbar.jsx
import { useStore } from "../store/ui";
import { RiMenu2Fill } from "react-icons/ri";

export function Navbar() {
  const { toggleSidebar } = useStore();

  return (
    <header className="h-16 bg-base/90 backdrop-blur border-b border-edge px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-ink-muted hover:text-ink-primary text-xl leading-none transition-colors px-1"
        >
          <RiMenu2Fill />
        </button>
        <span className="text-[13px] text-ink-muted hidden sm:block">
          AI Early Warning Malware Detection System
        </span>
      </div>

    </header>
  );
}
