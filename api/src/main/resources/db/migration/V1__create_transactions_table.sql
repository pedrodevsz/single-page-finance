create table public.transactions (
    id uuid primary key,
    type varchar(20) not null,
    description varchar(120) not null,
    amount_in_cents bigint not null,
    category varchar(80) not null,
    transaction_date date not null,
    payment_method varchar(30) not null,
    notes varchar(255),
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);
