/** biome-ignore-all lint/correctness/useExhaustiveDependencies: need to refresh categories on open */
import { useMemo, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import CategoryCard from "./components/category/card";
import ShortcutCard from "./components/shortcut/card";
import { getData } from "./lib/storage";
import type { Category } from "./types/category";
import type { Shortcut } from "./types/shortcut";
import Header from "./components/header";

export function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const shortcuts: Shortcut[] = useMemo(() => getData<Shortcut>("shortcuts"), [refreshKey]);
  const categories: Category[] = useMemo(() => getData<Category>("categories"), [refreshKey]);

  const filteredShortcuts = useMemo(() => {
    if (!selectedCategory) return shortcuts;

    return shortcuts.filter((shortcut) => {
      const category = categories.find((cat) => cat.shortcutIds?.includes(shortcut.id ?? ""));
      return category?.id === selectedCategory;
    });
  }, [shortcuts, categories, selectedCategory]);

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen w-screen bg-background text-foreground flex flex-col p-8">
        <Header setRefreshKey={setRefreshKey} />

        {categories.length > 0 && (
          <div className="mt-4 flex w-full max-w-3xl gap-2 overflow-x-auto">
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
            <ShortcutCard key={shortcut.id} {...shortcut} onSuccess={() => setRefreshKey((prev) => prev + 1)} />
          ))}
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
