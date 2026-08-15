"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    expanded: boolean;
    onToggle: () => void;
    hiddenCount?: number;
};

export function ShowMoreToggle({ expanded, onToggle, hiddenCount }: Props) {
    return (
        <div className="flex justify-center mt-2">
            <Button variant="ghost" size="sm" onClick={onToggle} className="inline-flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{expanded ? "Mostrar menos" : `Mostrar mais${hiddenCount ? ` (${hiddenCount})` : ""}`}</span>
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
        </div>
    );
}
