import { ThemeToggle } from "../theme/theme-toggle";

export function DesktopHeader() {
    return (
        <div className="absolute right-4 top-4">
            <ThemeToggle />
        </div>
    );
}
