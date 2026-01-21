import { Search, Settings } from "lucide-react";
import { useMemo, useState } from "react";
import AddShortcutCard from "@/components/shortcut/add";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Toaster } from "@/components/ui/sonner";
import AddCategoryCard from "./components/category/add";
import CategoryCard from "./components/category/card";
import ShortcutCard from "./components/shortcut/card";
import { getData } from "./lib/storage";
import type { Category } from "./types/category";
import type { Shortcut } from "./types/shortcut";

export function App() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    document.title = e.target.value ? `${e.target.value} - New Tab` : "New Tab";
  };

  const shortcuts: Shortcut[] = useMemo(() => getData<Shortcut>("shortcuts"), []);
  const categories: Category[] = useMemo(() => getData<Category>("categories"), []);

  const filteredShortcuts = useMemo(() => {
    if (!selectedCategory) return shortcuts;

    return shortcuts.filter((shortcut) => {
      const category = categories.find((cat) => cat.shortcutIds?.includes(shortcut.id ?? ""));
      return category?.id === selectedCategory;
    });
  }, [shortcuts, categories, selectedCategory]);

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

        {categories.length > 0 && (
          <div className="mt-6 flex w-full max-w-3xl gap-2 overflow-x-auto px-2">
            <CategoryCard
              key={"all"}
              title="All"
              onClick={() => setSelectedCategory(null)}
              isActive={selectedCategory === null}
            />
            {categories.map((category) => (
              <CategoryCard
                {...category}
                key={category.id}
                onClick={() => setSelectedCategory(category.id ?? "")}
                isActive={selectedCategory === category.id}
              />
            ))}
          </div>
        )}

        <main className="mt-10 grid grid-cols-3 gap-5">
          {filteredShortcuts.map((shortcut) => (
            <ShortcutCard key={shortcut.id} {...shortcut} />
          ))}
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
