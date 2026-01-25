import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
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
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getData, saveData, updateData } from "@/lib/storage";
import type { Shortcut } from "@/types/shortcut";
import type { Category } from "@/types/category";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  title: z.string().min(1, "Name is required"),
  url: z.url("Invalid or missing URL"),
  category: z.string().optional(),
});

interface AddShortcutCardProps {
  onSuccess?: () => void;
}

const AddShortcutCard = ({ onSuccess }: AddShortcutCardProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const existingCategories = useMemo(() => getData<Category>("categories"), []);

  const form = useForm({
    defaultValues: {
      title: "",
      url: "",
      category: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const iconUrl = () => {
        const url = new URL(value.url);
        const domain = url.hostname.split(".").slice(-2).join(".");

        return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
      };

      const newShortcut: Shortcut = {
        title: value.title,
        url: value.url,
        iconUrl: iconUrl(),
      };

      saveData<Shortcut>("shortcuts", newShortcut);

      if (value.category) {
        const categories = getData<Category>("categories");
        const selectedCategory = categories.find((cat) => cat.id === value.category);

        if (selectedCategory) {
          const updatedCategory = {
            ...selectedCategory,
            shortcutIds: [...(selectedCategory.shortcutIds || []), newShortcut.id!],
          };
          updateData<Category>("categories", updatedCategory);
        }
      }

      setOpen(false);
      toast.success("Shortcut added successfully!");
      onSuccess?.();

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
        <Button variant="outline" size="icon">
          <Plus />
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
          <DialogTitle>New shortcut</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <form.Field
            name="title"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Shortcut name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="FlavorTown"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="url"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Shortcut URL</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="https://flavortown.com"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="category"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Category (optional)</FieldLabel>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </FieldContent>
                  <Select name={field.name} value={field.state.value} onValueChange={field.handleChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectSeparator />
                        {existingCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id ?? ""}>
                            {category.title}
                          </SelectItem>
                        ))}
                        <SelectSeparator />
                        <SelectItem value=" ">None</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              );
            }}
          />
        </FieldGroup>
        <DialogFooter className="flex justify-between sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              form.handleSubmit();
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddShortcutCard;
