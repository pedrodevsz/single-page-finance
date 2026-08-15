-- Remove legacy due_day and enforce due_date as the single source of truth
-- Precondition: ensure there are no rows with due_date IS NULL (inspect with
-- GET /api/v1/fixed-expenses/missing-due-date) or have handled them.

ALTER TABLE fixed_expenses DROP COLUMN IF EXISTS due_day;

ALTER TABLE fixed_expenses
    ALTER COLUMN due_date SET NOT NULL;
