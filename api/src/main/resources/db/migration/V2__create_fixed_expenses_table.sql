create table public.fixed_expenses (
    id uuid primary key,
    description varchar(120) not null,
    amount_in_cents bigint not null,
    category varchar(80) not null,
    due_day integer not null,
    payment_method varchar(30) not null,
    notes varchar(255),
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);
