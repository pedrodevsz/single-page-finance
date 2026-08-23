import { ArrowBigUpIcon } from "lucide-react";
import { ThemeToggle } from "../theme/theme-toggle";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { FinancialDashboard } from "../dashbord/financial-dashboard";
import { FixedExpenseHistoryDrawer } from "../finance/fixed-expense-history/fixed-expense-history-drawer";

export function DesktopHeader() {
    return (
        <div className="absolute right-4 top-4 flex items-center gap-1">
            <ThemeToggle />
            <FixedExpenseHistoryDrawer />

            <Drawer>
                <DrawerTrigger render={<Button variant="ghost" />}>
                    <ArrowBigUpIcon />
                </DrawerTrigger>

                <DrawerContent className="h-[90dvh] max-h-[90dvh] overflow-hidden">
                    <div className="flex min-h-0 flex-1 flex-col">
                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                            <FinancialDashboard />
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
