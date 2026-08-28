create table public.financial_options (
    id uuid primary key,
    name varchar(80) not null,
    option_type varchar(30) not null,
    is_default boolean not null default false,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint ck_financial_options_type check (option_type in (
        'EXPENSE_CATEGORY', 'INCOME_CATEGORY', 'PAYMENT_METHOD', 'RECEIPT_METHOD'
    ))
);

create unique index uq_financial_options_type_name
    on public.financial_options (option_type, lower(name));

create index idx_financial_options_type_name
    on public.financial_options (option_type, lower(name));

do $$
declare
    option_type_value varchar(30);
begin
    foreach option_type_value in array array[
        'EXPENSE_CATEGORY', 'INCOME_CATEGORY', 'PAYMENT_METHOD', 'RECEIPT_METHOD'
    ] loop
        insert into public.financial_options
            (id, name, option_type, is_default, created_at, updated_at)
        values
            (gen_random_uuid(), 'Outros', option_type_value, true, now(), now());
    end loop;
end
$$;

insert into public.financial_options
    (id, name, option_type, is_default, created_at, updated_at)
select gen_random_uuid(), source.name, source.option_type, false, now(), now()
from (values
    ('Alimentação', 'EXPENSE_CATEGORY'),
    ('Moradia', 'EXPENSE_CATEGORY'),
    ('Transporte', 'EXPENSE_CATEGORY'),
    ('Saúde', 'EXPENSE_CATEGORY'),
    ('Educação', 'EXPENSE_CATEGORY'),
    ('Lazer', 'EXPENSE_CATEGORY'),
    ('Assinaturas', 'EXPENSE_CATEGORY'),
    ('Compras', 'EXPENSE_CATEGORY'),
    ('Viagem', 'EXPENSE_CATEGORY'),
    ('Impostos', 'EXPENSE_CATEGORY'),
    ('Salário', 'INCOME_CATEGORY'),
    ('Freelance', 'INCOME_CATEGORY'),
    ('Venda', 'INCOME_CATEGORY'),
    ('Investimento', 'INCOME_CATEGORY'),
    ('Presente', 'INCOME_CATEGORY'),
    ('Reembolso', 'INCOME_CATEGORY'),
    ('PIX', 'PAYMENT_METHOD'),
    ('CASH', 'PAYMENT_METHOD'),
    ('BANK_ACCOUNT', 'PAYMENT_METHOD'),
    ('CREDIT_CARD', 'PAYMENT_METHOD'),
    ('BANK_SLIP', 'PAYMENT_METHOD'),
    ('DEBIT_CARD', 'PAYMENT_METHOD'),
    ('BANK_TRANSFER', 'PAYMENT_METHOD'),
    ('CRYPTO', 'PAYMENT_METHOD'),
    ('OTHER', 'PAYMENT_METHOD'),
    ('PIX', 'RECEIPT_METHOD'),
    ('CASH', 'RECEIPT_METHOD'),
    ('BANK_ACCOUNT', 'RECEIPT_METHOD'),
    ('CREDIT_CARD', 'RECEIPT_METHOD'),
    ('BANK_SLIP', 'RECEIPT_METHOD'),
    ('DEBIT_CARD', 'RECEIPT_METHOD'),
    ('BANK_TRANSFER', 'RECEIPT_METHOD'),
    ('CRYPTO', 'RECEIPT_METHOD'),
    ('OTHER', 'RECEIPT_METHOD')
) as source(name, option_type)
where not exists (
    select 1
    from public.financial_options existing
    where existing.option_type = source.option_type
      and lower(existing.name) = lower(source.name)
);

insert into public.financial_options
    (id, name, option_type, is_default, created_at, updated_at)
select gen_random_uuid(), source.name, source.option_type, false, now(), now()
from (
    select distinct trim(category) as name, 'INCOME_CATEGORY' as option_type
    from public.transactions
    where trim(category) <> '' and type = 'INCOME'
    union
    select distinct trim(category), 'EXPENSE_CATEGORY'
    from public.transactions
    where trim(category) <> '' and type = 'EXPENSE'
    union
    select distinct trim(category), 'EXPENSE_CATEGORY'
    from public.fixed_expense_series
    where trim(category) <> ''
    union
    select distinct trim(payment_method), 'RECEIPT_METHOD'
    from public.transactions
    where trim(payment_method) <> '' and type = 'INCOME'
    union
    select distinct trim(payment_method), 'PAYMENT_METHOD'
    from public.transactions
    where trim(payment_method) <> '' and type = 'EXPENSE'
    union
    select distinct trim(payment_method), 'PAYMENT_METHOD'
    from public.fixed_expense_series
    where trim(payment_method) <> ''
) source
where not exists (
    select 1
    from public.financial_options existing
    where existing.option_type = source.option_type
      and lower(existing.name) = lower(source.name)
);
