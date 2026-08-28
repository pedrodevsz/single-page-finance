"use client";

import { Pencil, Settings2, Trash2 } from "lucide-react";
import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCreateFinancialOption, useDeleteFinancialOption, useFinancialOptions, useUpdateFinancialOption } from "@/hooks/use-financial-options";
import { getPaymentMethodLabel } from "@/lib/transactions/transaction-formatters";
import type { FinancialOption, FinancialOptionType } from "@/types/financial-option";

type ManagedOptionSelectProps = {
  id: string;
  label: string;
  title: string;
  type: FinancialOptionType;
  registration: UseFormRegisterReturn;
  error?: string;
  onOptionCreated: (name: string) => void;
};

export function ManagedOptionSelect({ id, label, title, type, registration, error, onOptionCreated }: ManagedOptionSelectProps) {
  const optionsQuery = useFinancialOptions(type);

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-2">
        <label className="text-sm font-medium text-foreground" htmlFor={id}>{label}</label>
        <OptionManagerModal type={type} title={title} onCreated={onOptionCreated} />
      </div>
      <Select id={id} disabled={optionsQuery.isPending || optionsQuery.isError} {...registration}>
        {optionsQuery.isPending ? <option value="">Carregando...</option> : null}
        {optionsQuery.data?.map((option) => <option key={option.id} value={option.name}>{formatOptionLabel(option, type)}</option>)}
      </Select>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {optionsQuery.isError ? <p className="text-sm text-destructive">{optionsQuery.error.message}</p> : null}
    </div>
  );
}

function formatOptionLabel(option: FinancialOption, type: FinancialOptionType) {
  return type === "PAYMENT_METHOD" || type === "RECEIPT_METHOD"
    ? getPaymentMethodLabel(option.name)
    : option.name;
}

function OptionManagerModal({ type, title, onCreated }: { type: FinancialOptionType; title: string; onCreated: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<FinancialOption | null>(null);
  const [error, setError] = useState<string | null>(null);
  const optionsQuery = useFinancialOptions(type);
  const createMutation = useCreateFinancialOption();
  const updateMutation = useUpdateFinancialOption();
  const deleteMutation = useDeleteFinancialOption();
  const options = optionsQuery.data ?? [];
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const limitReached = options.length >= 15;

  function startCreate() {
    setEditing(null);
    setName("");
    setError(null);
    setOpen(true);
  }

  function startEdit(option: FinancialOption) {
    setEditing(option);
    setName(option.name);
    setError(null);
  }

  async function save() {
    setError(null);
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload: { name } });
      } else {
        const created = await createMutation.mutateAsync({ name, type });
        onCreated(created.name);
      }
      setEditing(null);
      setName("");
      if (!editing) setOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível salvar a opção.");
    }
  }

  async function remove(option: FinancialOption) {
    setError(null);
    try {
      await deleteMutation.mutateAsync(option.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível excluir a opção.");
    }
  }

  return (
    <>
      <Button type="button" variant="ghost" size="sm" onClick={startCreate} disabled={optionsQuery.isPending}>
        <Settings2 aria-hidden="true" />
        Gerenciar
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gerenciar {title.toLowerCase()}</AlertDialogTitle>
            <AlertDialogDescription>{options.length} de 15 cadastradas. &quot;Outros&quot; é padrão e não pode ser removido.</AlertDialogDescription>
          </AlertDialogHeader>

          {!editing ? (
            <div className="mt-4 flex gap-2">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder={`Nova ${title.toLowerCase().replace(/s$/, "")}`} disabled={limitReached || isSaving} />
              <Button type="button" onClick={() => void save()} disabled={limitReached || isSaving || !name.trim()}>Adicionar</Button>
            </div>
          ) : (
            <div className="mt-4 flex gap-2">
              <Input value={name} onChange={(event) => setName(event.target.value)} disabled={isSaving} />
              <Button type="button" onClick={() => void save()} disabled={isSaving || !name.trim()}>Salvar</Button>
              <Button type="button" variant="outline" onClick={() => setEditing(null)} disabled={isSaving}>Cancelar</Button>
            </div>
          )}

          {limitReached && !editing ? <p className="mt-2 text-sm text-muted-foreground">Limite de 15 opções atingido.</p> : null}
          {error ? <p className="mt-2 text-sm text-destructive" role="alert">{error}</p> : null}
          <div className="mt-4 max-h-64 space-y-1 overflow-y-auto">
            {options.map((option) => (
              <div key={option.id} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">{option.name}</span>
                {option.defaultOption ? <span className="text-xs text-muted-foreground">Padrão</span> : null}
                {option.usageCount > 0 ? <span className="text-xs text-muted-foreground">{option.usageCount} uso(s)</span> : null}
                <Button type="button" variant="ghost" size="icon-xs" aria-label={`Editar ${option.name}`} onClick={() => startEdit(option)} disabled={option.defaultOption || option.usageCount > 0 || isSaving}>
                  <Pencil aria-hidden="true" />
                </Button>
                <Button type="button" variant="ghost" size="icon-xs" aria-label={`Excluir ${option.name}`} onClick={() => void remove(option)} disabled={option.defaultOption || option.usageCount > 0 || deleteMutation.isPending}>
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Fechar</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
