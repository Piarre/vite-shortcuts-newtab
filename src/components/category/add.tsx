import { useForm } from "@tanstack/react-form";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { saveData } from "@/lib/storage";
import type { Category } from "@/types/category";

const formSchema = z.object({
  title: z.string().min(1, "Name is required"),
  color: z.string("Invalid or missing color"),
});

const COLOR_PALETTE: string[] = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#64748b",
  "#6b7280",
  "#78716c",
];

const AddCategoryCard = () => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      title: "",
      color: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      saveData<Category>("categories", {
        title: value.title,
        color: value.color,
      });

      setOpen(false);
      toast.success("Category added successfully!", {
        description: value.title,
        closeButton: true
      });

      form.reset();
    },
  });
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" disabled>
          <FolderPlus />
        </Button>
      </DialogTrigger>
      <DialogContent
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            form.handleSubmit();
          }
        }}
        className="sm:max-w-106.25"
      >
        <DialogHeader>
          <DialogTitle>New category</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <form.Field
            name="title"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Category name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Coding 🍪"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="color"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Color</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_PALETTE.map((color) => (
                      <Button
                        key={color}
                        type="button"
                        aria-checked={field.state.value === color}
                        className="size-8 p-0 border-2 border-transparent hover:border-accent shrink-0 aria-checked:border-foreground"
                        style={{ backgroundColor: color }}
                        onClick={() => field.handleChange(color)}
                      >
                        {field.state.value === color && <span className="sr-only">Selected</span>}
                      </Button>
                    ))}
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
        <DialogFooter className="flex justify-between sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={() => form.handleSubmit()}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryCard;
