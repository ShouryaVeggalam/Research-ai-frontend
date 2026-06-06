import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-white/5 text-muted",
        indigo: "border-indigo/30 bg-indigo/10 text-indigo",
        purple: "border-purple/30 bg-purple/10 text-purple",
        blue: "border-blue/30 bg-blue/10 text-blue",
        emerald: "border-emerald/30 bg-emerald/10 text-emerald",
        amber: "border-amber/30 bg-amber/10 text-amber",
        rose: "border-rose/30 bg-rose/10 text-rose",
        outline: "border-border-strong text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
