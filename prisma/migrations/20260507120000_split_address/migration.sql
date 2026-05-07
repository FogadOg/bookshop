-- Add new columns as nullable first so we can backfill existing rows
ALTER TABLE "Order" ADD COLUMN "streetAddress" TEXT;
ALTER TABLE "Order" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "Order" ADD COLUMN "city" TEXT;
ALTER TABLE "Order" ADD COLUMN "country" TEXT NOT NULL DEFAULT 'Norge';

-- Backfill: existing orders have free-text address. Put the whole string into streetAddress
-- and use placeholder values for postalCode and city since we can't reliably parse them.
UPDATE "Order" SET
  "streetAddress" = "address",
  "postalCode" = '0000',
  "city" = 'Ukjent'
WHERE "streetAddress" IS NULL;

-- Now make them NOT NULL
ALTER TABLE "Order" ALTER COLUMN "streetAddress" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "postalCode" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "city" SET NOT NULL;

-- Drop the old column
ALTER TABLE "Order" DROP COLUMN "address";
