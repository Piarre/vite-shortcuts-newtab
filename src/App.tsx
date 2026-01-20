import { Search, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import AddShortcutCard from "@/components/shortcut/add";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Toaster } from "@/components/ui/sonner";
import AddCategoryCard from "./components/category/add";
import ShortcutCard from "./components/shortcut/card";
import { getData } from "./lib/storage";
import type { Shortcut } from "./types/shortcut";

export function App() {
  const [query, setQuery] = useState("");
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    document.title = e.target.value ? `${e.target.value} - New Tab` : "New Tab";
  };

  useEffect(() => {
    const fetchedShortcuts = () => getData<Shortcut>("shortcuts");

    setShortcuts(fetchedShortcuts());
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim() === "") {
      return;
    }

    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="h-screen w-screen bg-background text-foreground flex flex-col items-center justify-center">
        <header className="flex flex-row gap-4 items-center">
          <Button variant="outline" size="icon" disabled>
            <Settings />
          </Button>

          <form onSubmit={handleSearch}>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                id="search-input"
                className="transition-all duration-300 delay-0 ease-in-out focus:w-72 w-96"
                value={query}
                onChange={handleInput}
                placeholder="Search..."
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                autoFocus
                aria-autocomplete="none"
              />
            </InputGroup>
          </form>

          <AddCategoryCard />
          <AddShortcutCard />
        </header>

        <main className="mt-10 grid grid-cols-3 gap-5">{shortcuts.map((shortcut) => ShortcutCard(shortcut))}</main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
