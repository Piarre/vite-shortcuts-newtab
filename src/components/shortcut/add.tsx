import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
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
import type { Shortcut } from "@/types/shortcut";

const formSchema = z.object({
  title: z.string().min(1, "Name is required"),
  url: z.url("Invalid or missing URL"),
});

const AddShortcutCard = () => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      title: "",
      url: "",
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

      saveData<Shortcut>("shortcuts", {
        title: value.title,
        url: value.url,
        iconUrl: iconUrl(),
      });

      setOpen(false);
      toast.success("Shortcut added successfully!");

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
      <DialogContent className="sm:max-w-106.25">
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
                  <FieldLabel htmlFor={field.name}>Shortcut name</FieldLabel>
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

export default AddShortcutCard;
