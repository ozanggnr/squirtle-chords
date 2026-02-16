import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DropdownProps {
    trigger: ReactNode;
    children: ReactNode;
    align?: "start" | "center" | "end";
}

export function Dropdown({ trigger, children, align = "end" }: DropdownProps) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align={align}
                    sideOffset={8}
                    asChild
                    className="z-50"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="min-w-[200px] rounded-xl border border-gray-800 bg-gray-900 backdrop-blur-sm p-2 shadow-xl"
                    >
                        {children}
                    </motion.div>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}

interface DropdownItemProps {
    children: ReactNode;
    onClick?: () => void;
    destructive?: boolean;
}

export function DropdownItem({
    children,
    onClick,
    destructive = false,
}: DropdownItemProps) {
    return (
        <DropdownMenu.Item
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer outline-none transition-colors",
                destructive
                    ? "text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                    : "text-gray-300 hover:bg-gray-800 focus:bg-gray-800 hover:text-white"
            )}
        >
            {children}
        </DropdownMenu.Item>
    );
}

export function DropdownSeparator() {
    return <DropdownMenu.Separator className="my-1 h-px bg-gray-800" />;
}
