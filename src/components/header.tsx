import AddCategoryCard from "./category/add";
import AddShortcutCard from "./shortcut/add";
import { AnimatedThemeToggler } from "./theme-toggle";
import SettingsDialog from "./settings-dialogs";

interface HeaderProps {
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

const Header = ({ setRefreshKey }: HeaderProps) => {
  return (
    <header className="flex  items-center justify-center flex-row gap-4">
      <SettingsDialog />
      <AnimatedThemeToggler />
      <AddCategoryCard onSuccess={() => setRefreshKey((prev) => prev + 1)} />
      <AddShortcutCard onSuccess={() => setRefreshKey((prev) => prev + 1)} />
    </header>
  );
};

export default Header;
