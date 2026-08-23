import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FinancialSummaryCardProps = {
    title: string;
    value: string;
    icon: LucideIcon;
};

export function FinancialSummaryCard({
    title,
    value,
    icon: Icon,
}: FinancialSummaryCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>

                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-2xl font-semibold tracking-tight">
                    {value}
                </p>
            </CardContent>
        </Card>
    );
}