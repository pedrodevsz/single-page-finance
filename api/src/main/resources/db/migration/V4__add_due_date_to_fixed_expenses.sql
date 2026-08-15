-- Add due_date column to fixed_expenses (nullable to avoid breaking existing data)
ALTER TABLE fixed_expenses
    ADD COLUMN due_date date NULL;

-- Note: existing rows with only day-of-month cannot be safely migrated to a full date.
-- We intentionally leave due_date NULL for existing rows to avoid guessing year/month.
