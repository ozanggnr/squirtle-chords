import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary:
                    "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/50",
                secondary:
                    "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700",
                ghost:
                    "bg-transparent text-gray-300 hover:bg-gray-900 hover:text-white",
                danger:
                    "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-500/50",
            },
            size: {
                sm: "px-3 py-2 text-sm",
                md: "px-4 py-3 text-base",
                lg: "px-6 py-4 text-lg",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                className={cn(buttonVariants({ variant, size, className }))}
                disabled={disabled || loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                {...(props as any)}
            >
                {loading && <Loader className="animate-spin" size={18} />}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
