import { HTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = true, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn(
                    "rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6",
                    className
                )}
                whileHover={
                    hover
                        ? {
                            scale: 1.02,
                            boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
                        }
                        : undefined
                }
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = "Card";

export { Card };
