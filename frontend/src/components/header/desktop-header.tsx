import { ArrowBigUpIcon } from "lucide-react";
import { ThemeToggle } from "../theme/theme-toggle";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { FinancialDashboard } from "../dashbord/financial-dashboard";

export function DesktopHeader() {
    return (
        <div className="absolute right-4 top-4">
            <ThemeToggle />

            <Drawer>
                <DrawerTrigger render={<Button variant="ghost" />}>
                    <ArrowBigUpIcon />
                </DrawerTrigger>

                <DrawerContent className="h-[90dvh] max-h-[90dvh]">
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                        <FinancialDashboard />
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
