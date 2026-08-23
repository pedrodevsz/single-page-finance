import Link from "next/link";
import { ArrowLeft, CircleDollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-10 flex items-center justify-center gap-2 text-[clamp(6rem,24vw,14rem)] font-semibold leading-none tracking-[-0.1em] text-foreground/90 sm:gap-4">
          <span>4</span>
          <span className="relative inline-flex items-center justify-center">
            <span className="finance-404-coin absolute -top-7 left-1/2 z-10 inline-flex -translate-x-1/2 items-center justify-center rounded-full border border-border bg-muted px-2 py-1 text-xs font-semibold tracking-normal text-muted-foreground sm:-top-9">
              R$
            </span>
            <span>0</span>
          </span>
          <span>4</span>
        </div>

        <div className="mx-auto max-w-md">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <CircleDollarSign className="size-3.5" aria-hidden="true" />
            Movimento não encontrado
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Página não encontrada
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Não encontramos a página que você está procurando no Finance Control.
          </p>
          <Button className="mt-8" render={<Link href="/" />}>
            <ArrowLeft aria-hidden="true" />
            Voltar ao início
          </Button>
        </div>
      </div>
    </main>
  );
}
