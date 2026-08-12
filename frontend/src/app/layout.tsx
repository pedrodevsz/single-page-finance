import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";

export const metadata: Metadata = {
  title: "Gaste pouco | Ínicio",
  description: "Single page especializada para monitorar suas finanças pessoais e controlar seus gastos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html suppressHydrationWarning lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
