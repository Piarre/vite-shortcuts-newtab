import { Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Shortcut } from "@/types/shortcut";
import { Button } from "../ui/button";
import { deleteData } from "@/lib/storage";

const ShortcutCard = ({ id, title, url, iconUrl }: Shortcut) => {
  return (
    <Card
      id={id}
      className="group/shortcut relative hover:scale-105 hover:shadow-accent hover:shadow-2xl w-40 h-32 cursor-pointer transition-all"
      onClick={() => window.open(url, "_blank")}
    >
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        {iconUrl && <img src={iconUrl} alt={title} className="w-8 h-8 rounded" />}
      </CardHeader>
      <CardContent>
        <CardTitle className="text-sm truncate">{title}</CardTitle>
        <p className="text-xs text-muted-foreground truncate mt-1">{url}</p>
      </CardContent>

      {/* Buttons that appear on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover/shortcut:opacity-100 transition-opacity flex gap-1">
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
        <Button
          variant="ghost"
          size="icon"
          disabled
          className="h-7 w-7 bg-background/80 text-red-500 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
          onClick={(e) => {
            e.stopPropagation();
            deleteData<Shortcut>("shortcuts", `${id}`);
          }}
        >
          <Trash className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
};

export default ShortcutCard;
