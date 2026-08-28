alter table public.transactions
    alter column payment_method type varchar(80);

alter table public.fixed_expense_series
    alter column payment_method type varchar(80);
