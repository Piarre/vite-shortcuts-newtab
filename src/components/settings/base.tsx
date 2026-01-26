import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface SettingsBaseComponentProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  title?: string;
  className?: string;
  wrapperOnly?: boolean;
}

export interface ChildrenBaseProps {
  title: string;
}

const SettingsBaseComponent = ({ title, wrapperOnly, className, children, ...props }: SettingsBaseComponentProps) => {
  return (
    <div className={cn("flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0", className)} {...props}>
      {!wrapperOnly && title && <h2 className="text-2xl font-semibold">{title}</h2>}
      {children}
    </div>
  );
};

export default SettingsBaseComponent;
