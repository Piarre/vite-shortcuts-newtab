import { Edit, Trash } from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteData, getData } from "@/lib/storage";
import type { Category } from "@/types/category";
import type { Shortcut } from "@/types/shortcut";
import { Button } from "../ui/button";
import DeleteDialog from "../delete-dialog";
import { toast } from "sonner";

const ShortcutCard = ({ id, title, url, iconUrl }: Shortcut) => {
  const color = useMemo(() => {
    if (!id) return "#FFFFFF00";

    const categories = getData<Category>("categories");

    return categories.find((category) => category.shortcutIds?.includes(id))?.color ?? "#FFFFFF00";
  }, [id]);

  return (
    <Card
      id={id}
      className="group/shortcut relative hover:scale-105 hover:shadow-accent hover:shadow-2xl w-40 h-32 cursor-pointer transition-all"
      onClick={() => window.open(url, "_blank")}
    >
      <CardHeader className="flex flex-row justify-between space-y-0 pb-2 top-0">
        {iconUrl && <img src={iconUrl} alt={title} className="size-9" />}
        <div id={id} className="size-3 group-hover/shortcut:opacity-0 transition-opacity rounded-full shrink-0" style={{ backgroundColor: color }} />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-sm truncate">{title}</CardTitle>
        <p className="text-xs text-muted-foreground truncate mt-1">{url}</p>
      </CardContent>

      {/* Buttons that appear on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover/shortcut:opacity-100 transition-opacity flex gap-1 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-background/80 backdrop-blur-sm hover:bg-background"
          disabled
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>

        <DeleteDialog
          title="Delete shortcut?"
          description="This action cannot be undone."
          onDelete={() => {
            deleteData<Shortcut>("shortcuts", `${id}`);
            toast.success("Shortcut deleted successfully!");
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="h-7 w-7 bg-background/80 text-red-500 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash className="h-3.5 w-3.5" />
          </Button>
        </DeleteDialog>
      </div>
    </Card>
  );
};

export default ShortcutCard;
