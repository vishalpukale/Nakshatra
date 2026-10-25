const bcrypt = require("bcryptjs");
const { pool } = require("../config/database");

const LITTLE_STARS_DESCRIPTION =
  "Little Stars is Nakshatra's free talent hunt. Singers, dancers, and performing artists can audition solo, as a duel, or in a group across classical and contemporary styles.";

const STAR_OF_INDIA_DESCRIPTION =
  "The Star of India is Nakshatra's intercollege showcase for music, dance, and performing arts. Registration is free. Solo, duel, and group performances are welcome.";

const SITE_DEFAULTS = {
  hero_title: "The Star of India — Where Talent Finds Its Purpose",
  hero_subtitle:
    "India's premier platform to discover, recognize, and celebrate talent across music, dance, and performing arts.",
  about_copy:
    "Nakshatra, The Star of India, is a national platform for music, dance, and performing arts. Hosted by Entertainment Cube Networks, it gives solo, duel, and group performers a place to be seen, mentored, and celebrated. Auditions cover classical and contemporary music and dance, along with theatre, folk arts, magic, stand-up comedy, storytelling, mimicry, and live painting.",
};

async function ensureRegistrationData() {
  await pool.query(`ALTER TABLE events ALTER COLUMN image_url TYPE text`);
  await pool.query(`
    ALTER TABLE state
    ADD COLUMN IF NOT EXISTS is_participating boolean NOT NULL DEFAULT false
  `);
  await pool.query(`
    UPDATE state
    SET is_participating = true
    WHERE code IN ('MH', 'TS', 'AP', 'KA', 'KL')
      AND NOT EXISTS (SELECT 1 FROM state WHERE is_participating = true)
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id bigserial PRIMARY KEY,
      image_url text NOT NULL,
      caption varchar(255),
      placement varchar(20) NOT NULL DEFAULT 'gallery',
      sort_order integer NOT NULL DEFAULT 0,
      is_active boolean NOT NULL DEFAULT true,
      is_deleted boolean NOT NULL DEFAULT false,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      key varchar(80) PRIMARY KEY,
      value text NOT NULL,
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `);
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS site_content_key_uidx ON site_content (key)
  `);
  for (const [key, value] of Object.entries(SITE_DEFAULTS)) {
    await pool.query(
      `INSERT INTO site_content (key, value)
       SELECT $1, $2
       WHERE NOT EXISTS (SELECT 1 FROM site_content WHERE key = $1)`,
      [key, value]
    );
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id bigserial PRIMARY KEY,
      intent varchar(30) NOT NULL,
      full_name varchar(255),
      email varchar(150),
      phone varchar(20),
      organization varchar(255),
      city varchar(255),
      message text,
      accepted_terms boolean NOT NULL DEFAULT false,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `);

  await pool.query(`
    INSERT INTO registration_forms (event_id, name, is_default, is_active, is_deleted)
    SELECT 3, 'Little Stars Registration Form', true, true, false
    WHERE EXISTS (SELECT 1 FROM events WHERE id = 3 AND is_deleted = false)
      AND NOT EXISTS (
        SELECT 1 FROM registration_forms
        WHERE event_id = 3 AND is_deleted = false
      )
  `);

  await pool.query(`
    INSERT INTO registration_form_fields (
      form_id, field_key, label, input_type, is_required, sort_order, options
    )
    SELECT target.id, source_field.field_key, source_field.label, source_field.input_type,
           source_field.is_required, source_field.sort_order, source_field.options
    FROM registration_forms target
    JOIN registration_forms source_form ON source_form.event_id = 1 AND source_form.is_deleted = false
    JOIN registration_form_fields source_field ON source_field.form_id = source_form.id
    WHERE target.event_id = 3
      AND target.is_deleted = false
      AND NOT EXISTS (
        SELECT 1 FROM registration_form_fields existing
        WHERE existing.form_id = target.id
          AND existing.field_key = source_field.field_key
      )
  `);

  await pool.query(`
    INSERT INTO registration_form_fields (
      form_id, field_key, label, input_type, is_required, sort_order
    )
    SELECT forms.id, 'hometown', 'Hometown', 'text', true, 7
    FROM registration_forms forms
    WHERE forms.is_deleted = false
      AND NOT EXISTS (
        SELECT 1 FROM registration_form_fields existing
        WHERE existing.form_id = forms.id AND existing.field_key = 'hometown'
      )
  `);

  await pool.query(`
    INSERT INTO registration_form_fields (
      form_id, field_key, label, input_type, is_required, sort_order
    )
    SELECT forms.id,
           'accepted_terms',
           'I accept the Terms & Conditions and agree that Nakshatra may store these details for this registration.',
           'checkbox',
           true,
           99
    FROM registration_forms forms
    WHERE forms.is_deleted = false
      AND NOT EXISTS (
        SELECT 1 FROM registration_form_fields existing
        WHERE existing.form_id = forms.id AND existing.field_key = 'accepted_terms'
      )
  `);

  await pool.query(
    `UPDATE events
     SET description = CASE
           WHEN description IS NULL OR description ILIKE 'Lorem%' THEN $1
           ELSE description END,
         image_url = CASE
           WHEN image_url IS NULL OR image_url = '' OR image_url ILIKE '%shutterstock%'
           THEN $2 ELSE image_url END,
         start_date = CASE WHEN start_date = TIMESTAMP '2026-02-26' THEN TIMESTAMP '2026-11-20' ELSE start_date END,
         end_date = CASE WHEN end_date = TIMESTAMP '2026-02-27' THEN TIMESTAMP '2026-11-22' ELSE end_date END,
         registration_till_date = CASE
           WHEN registration_till_date = TIMESTAMP '2026-02-26' THEN TIMESTAMP '2026-11-15'
           ELSE registration_till_date END,
         location = COALESCE(NULLIF(location, ''), 'Pan India')
     WHERE id = 3`,
    [
      LITTLE_STARS_DESCRIPTION,
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    ]
  );

  await pool.query(
    `UPDATE events
     SET description = CASE
           WHEN description IS NULL OR description ILIKE 'Lorem%' THEN $1
           ELSE description END,
         image_url = CASE
           WHEN image_url IS NULL OR image_url = '' OR image_url ILIKE '%shutterstock%'
           THEN $2 ELSE image_url END,
         start_date = CASE WHEN start_date = TIMESTAMP '2026-02-26' THEN TIMESTAMP '2027-01-20' ELSE start_date END,
         end_date = CASE WHEN end_date = TIMESTAMP '2026-02-27' THEN TIMESTAMP '2027-01-22' ELSE end_date END,
         registration_till_date = CASE
           WHEN registration_till_date = TIMESTAMP '2026-02-26' THEN TIMESTAMP '2027-01-10'
           ELSE registration_till_date END,
         location = COALESCE(NULLIF(location, ''), 'Pan India')
     WHERE id = 1`,
    [
      STAR_OF_INDIA_DESCRIPTION,
      "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=1200&q=80",
    ]
  );

  await ensureAdminUser();
}

async function ensureAdminUser() {
  await pool.query(`ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ADMIN'`);

  const existing = await pool.query(
    `SELECT id FROM users
     WHERE role IN ('ADMIN', 'SUPER_ADMIN') AND is_deleted = false
     LIMIT 1`
  );
  if (existing.rows[0]) return;

  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "");
  if (!email || password.length < 8) {
    console.warn("No admin user exists. Set ADMIN_EMAIL and ADMIN_PASSWORD to create the first one.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users (full_name, first_name, email, password_hash, role, email_verified)
     VALUES ('Nakshatra Admin', 'Nakshatra', $1, $2, 'SUPER_ADMIN', true)`,
    [email, passwordHash]
  );
  console.log(`Created database admin ${email}`);
}

module.exports = { ensureRegistrationData };
