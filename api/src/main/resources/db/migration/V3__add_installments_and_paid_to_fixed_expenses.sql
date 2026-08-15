-- Add installments (nullable) and paid flag to fixed_expenses
ALTER TABLE fixed_expenses
    ADD COLUMN installments integer NULL;

ALTER TABLE fixed_expenses
    ADD COLUMN paid boolean NOT NULL DEFAULT false;
