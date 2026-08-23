-- Compatibility roll-forward for environments where the former V7 was
-- already recorded. The guarded migration is safe when V7 already created the
-- new model and also migrates a remaining legacy fixed_expenses table.
create table if not exists public.fixed_expense_series (
    id uuid primary key,
    description varchar(120) not null,
    amount_in_cents bigint not null,
    category varchar(80) not null,
    payment_method varchar(30) not null,
    notes varchar(255),
    installments integer,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint ck_fixed_expense_series_installments_positive
        check (installments is null or installments > 0)
);

create table if not exists public.fixed_expense_installments (
    id uuid primary key,
    series_id uuid not null references public.fixed_expense_series(id) on delete cascade,
    installment_number integer,
    amount_in_cents bigint not null,
    due_date date not null,
    paid boolean not null default false,
    paid_at timestamp with time zone,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint ck_fixed_expense_installments_number_positive
        check (installment_number is null or installment_number > 0),
    constraint uq_fixed_expense_installments_series_due_date
        unique (series_id, due_date)
);

do $$
begin
    if to_regclass('public.fixed_expenses') is not null
       and not exists (select 1 from public.fixed_expense_series) then
        execute $migration$
            insert into public.fixed_expense_series
                (id, description, amount_in_cents, category, payment_method,
                 notes, installments, created_at, updated_at)
            select id, description, amount_in_cents, category, payment_method,
                   notes, installments, created_at, updated_at
            from public.fixed_expenses
        $migration$;

        execute $migration$
            insert into public.fixed_expense_installments
                (id, series_id, installment_number, amount_in_cents, due_date,
                 paid, paid_at, created_at, updated_at)
            select
                case when generated.installment_number = 1 then f.id
                     else md5(f.id::text || ':' || generated.installment_number::text)::uuid
                end,
                f.id,
                case when f.installments is null then null else generated.installment_number end,
                f.amount_in_cents,
                (f.due_date + ((generated.installment_number - 1) * interval '1 month'))::date,
                (generated.installment_number = 1 and f.paid),
                null,
                f.created_at,
                f.updated_at
            from public.fixed_expenses f
            cross join lateral generate_series(
                1, case when f.installments is null then 1 else f.installments end
            ) as generated(installment_number)
        $migration$;

        if to_regclass('public.fixed_expense_occurrences') is not null then
            execute 'drop table public.fixed_expense_occurrences';
        end if;
        execute 'drop table public.fixed_expenses';
    end if;
end
$$;

create index if not exists idx_fixed_expense_installments_due_date
    on public.fixed_expense_installments (due_date);
create index if not exists idx_fixed_expense_installments_series_due_date
    on public.fixed_expense_installments (series_id, due_date);
