-- Clear any event images that were previously seeded/added.
-- Event images are no longer rendered in the UI, so this keeps the DB clean.
UPDATE events
SET image_url = NULL
WHERE image_url IS NOT NULL;
