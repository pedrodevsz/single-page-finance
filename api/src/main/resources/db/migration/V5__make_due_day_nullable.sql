-- Make due_day column nullable to avoid insert failures while we migrate to `due_date`-only model.
-- This migration does NOT invent dates. It merely relaxes the NOT NULL constraint
-- so newer inserts that only supply `due_date` will succeed.

ALTER TABLE fixed_expenses ALTER COLUMN due_day DROP NOT NULL;

-- After inspecting legacy rows (use GET /api/v1/fixed-expenses/missing-due-date),
-- perform a data migration/cleanup to populate `due_date` where appropriate or
-- remove/convert legacy rows as per business rules, then create another migration
-- to remove the `due_day` column and set `due_date` NOT NULL.
