import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import { Button } from "../ui/button";

interface CategoryCardProps extends Partial<Category> {
  isActive?: boolean;
  onClick?: () => void;
}

const CategoryCard = ({ id, title, color, shortcutIds, isActive, onClick }: CategoryCardProps) => {
  return (
    <Button
      className={cn(
        "flex flex-row space-x-2 transition-all text-foreground",
        isActive ? "border-2 border-accent" : ""
      )}
      variant="ghost"
      onClick={onClick}
    >
      {color && <div id={id} className="size-3 shrink-0" style={{ backgroundColor: color }} />}
      <span className="text-sm font-medium">{title}</span>
      {shortcutIds && (
        <Badge variant="outline" className="ml-auto text-xs">
          {shortcutIds.length ?? 0} 
        </Badge>
      )}
    </Button>
  );
};

export default CategoryCard;
