"use client";

import { type FC } from "react";
import { useFinanceUiStore, type FinanceView } from "@/stores/finance-ui.store";

type Props = {
    type?: FinanceView;
    title?: string;
    description?: string;
};

const defaultTexts: Record<FinanceView, { title: string; description: string }> = {
    income: {
        title: "Nenhum ganho encontrado.",
        description: "Assim que você cadastrar ganhos, eles aparecerão aqui.",
    },
    expense: {
        title: "Nenhum gasto encontrado.",
        description: "Assim que você cadastrar gastos, eles aparecerão aqui.",
    },
    "fixed-expense": {
        title: "Nenhum gasto fixo encontrado.",
        description: "Assim que você cadastrar contas fixas, eles aparecerão aqui.",
    },
};

export const EmptyListState: FC<Props> = ({ type, title, description }) => {
    const active = useFinanceUiStore((s) => s.activeFinanceView);
    const key = (type ?? active) as FinanceView;
    const texts = defaultTexts[key];

    return (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
            <p className="text-sm font-medium text-foreground">{title ?? texts.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description ?? texts.description}</p>
        </div>
    );
};

export default EmptyListState;
