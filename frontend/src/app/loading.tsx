import { Loading } from "@/components/shared/loading";

export default function GlobalLoading() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 text-foreground">
      <Loading size="lg" label="Carregando seu controle financeiro..." />
    </main>
  );
}
