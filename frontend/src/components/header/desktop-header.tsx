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

                <DrawerContent>
                    <FinancialDashboard />
                </DrawerContent>
            </Drawer>
        </div>
    );
}
