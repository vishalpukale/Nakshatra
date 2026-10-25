const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { pool } = require("../config/database");
const HttpException = require("../utils/HttpException.utils");

const uploadDir = path.join(__dirname, "../../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const imageUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, callback) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      callback(null, `${Date.now()}-${safeName}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      callback(null, true);
      return;
    }
    callback(new Error("Upload an image file."));
  },
});

const EVENT_TYPES = ["littlestars", "intercollege"];
const PLACEMENTS = ["hero", "gallery"];

function eventCode(name) {
  const base = String(name || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 12);
  return base || `EVT${Date.now().toString().slice(-6)}`;
}

function cleanText(value, max) {
  const text = String(value || "").trim();
  if (!text) return null;
  return text.slice(0, max);
}

function cleanUrl(value) {
  const text = String(value || "").trim();
  if (!text) return null;
  if (text.length > 2000) {
    throw new HttpException(400, "Image address is too long.");
  }
  if (!/^https?:\/\//i.test(text) && !text.startsWith("/uploads/")) {
    throw new HttpException(400, "Image must be a web address or an uploaded file.");
  }
  return text;
}

function requiredDate(value, label) {
  const text = String(value || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new HttpException(400, `${label} is required.`);
  }
  return text;
}

function optionalDate(value, label) {
  const text = String(value || "").slice(0, 10);
  if (!text) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new HttpException(400, `${label} is not a valid date.`);
  }
  return text;
}

function readEventBody(body) {
  const name = cleanText(body.name, 200);
  if (!name || name.length < 2) {
    throw new HttpException(400, "Enter the event name.");
  }
  const type = String(body.type || "");
  if (!EVENT_TYPES.includes(type)) {
    throw new HttpException(400, "Choose whether this is a current event or an upcoming competition.");
  }
  const startDate = optionalDate(body.startDate, "Start date");
  const endDate = optionalDate(body.endDate, "End date");
  const registrationTillDate = requiredDate(body.registrationTillDate, "Registration last date");
  if (startDate && endDate && endDate < startDate) {
    throw new HttpException(400, "End date cannot be before the start date.");
  }
  const paymentRequired = body.paymentRequired === true || body.paymentRequired === "true";
  const price = paymentRequired ? Number(body.price) : 0;
  if (paymentRequired && (!Number.isFinite(price) || price < 0)) {
    throw new HttpException(400, "Enter a registration price.");
  }
  return {
    name,
    type,
    description: cleanText(body.description, 5000),
    imageUrl: cleanUrl(body.imageUrl),
    location: cleanText(body.location, 255),
    venue: cleanText(body.venue, 255),
    startDate,
    endDate,
    registrationTillDate,
    paymentRequired,
    price,
    isActive: body.isActive !== false && body.isActive !== "false",
  };
}

function presentEvent(row) {
  return {
    id: Number(row.id),
    name: row.name,
    code: row.code,
    type: row.type,
    description: row.description,
    imageUrl: row.image_url,
    location: row.location,
    venue: row.venue,
    startDate: row.start_date,
    endDate: row.end_date,
    registrationTillDate: row.registration_till_date,
    paymentRequired: row.payment_required,
    price: row.price,
    currency: row.currency || "INR",
    isActive: row.is_active,
    registrationCount: Number(row.registration_count || 0),
  };
}

const eventSelect = `
  SELECT events.id, events.name, events.code, events.type, events.description, events.image_url,
         events.location, events.venue, events.payment_required, events.price, events.currency,
         events.is_active,
         to_char(events.start_date, 'YYYY-MM-DD') AS start_date,
         to_char(events.end_date, 'YYYY-MM-DD') AS end_date,
         to_char(events.registration_till_date, 'YYYY-MM-DD') AS registration_till_date,
         (SELECT count(*) FROM registrations
          WHERE registrations.event_id = events.id AND registrations.is_deleted = false) AS registration_count
  FROM events
`;

async function copyRegistrationForm(client, eventId, eventName) {
  const form = await client.query(
    `INSERT INTO registration_forms (event_id, name, is_default, is_active, is_deleted)
     VALUES ($1, $2, true, true, false)
     RETURNING id`,
    [eventId, `${eventName} Registration Form`]
  );
  await client.query(
    `INSERT INTO registration_form_fields (
       form_id, field_key, label, input_type, is_required, sort_order, options
     )
     SELECT $1, field_key, label, input_type, is_required, sort_order, options
     FROM registration_form_fields
     WHERE form_id = (
       SELECT id FROM registration_forms
       WHERE is_deleted = false AND event_id <> $2
       ORDER BY id ASC
       LIMIT 1
     )
       AND is_deleted = false`,
    [form.rows[0].id, eventId]
  );
}

const listEvents = async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `${eventSelect}
       WHERE events.is_deleted = false
       ORDER BY events.start_date NULLS LAST, events.id ASC`
    );
    res.json({ status: 200, data: rows.map(presentEvent) });
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const event = readEventBody(req.body);
    await client.query("BEGIN");
    const inserted = await client.query(
      `INSERT INTO events (
         name, code, type, description, image_url, location, venue,
         start_date, end_date, registration_till_date,
         payment_required, price, currency, is_active, created_by, updated_by
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'INR', $13, $14, $14)
       RETURNING id`,
      [
        event.name,
        eventCode(event.name),
        event.type,
        event.description,
        event.imageUrl,
        event.location,
        event.venue,
        event.startDate,
        event.endDate,
        event.registrationTillDate,
        event.paymentRequired,
        event.price,
        event.isActive,
        req.admin.email,
      ]
    );
    await copyRegistrationForm(client, inserted.rows[0].id, event.name);
    await client.query("COMMIT");
    const saved = await pool.query(`${eventSelect} WHERE events.id = $1`, [inserted.rows[0].id]);
    res.status(201).json({ status: 201, message: "Event saved.", data: presentEvent(saved.rows[0]) });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);
    if (!eventId) return next(new HttpException(400, "Choose an event."));
    const event = readEventBody(req.body);
    const updated = await pool.query(
      `UPDATE events
       SET name = $1, type = $2, description = $3, image_url = $4, location = $5, venue = $6,
           start_date = $7, end_date = $8, registration_till_date = $9,
           payment_required = $10, price = $11, is_active = $12, updated_by = $13, updated_at = now()
       WHERE id = $14 AND is_deleted = false
       RETURNING id`,
      [
        event.name,
        event.type,
        event.description,
        event.imageUrl,
        event.location,
        event.venue,
        event.startDate,
        event.endDate,
        event.registrationTillDate,
        event.paymentRequired,
        event.price,
        event.isActive,
        req.admin.email,
        eventId,
      ]
    );
    if (!updated.rows[0]) return next(new HttpException(404, "Event not found."));
    const saved = await pool.query(`${eventSelect} WHERE events.id = $1`, [eventId]);
    res.json({ status: 200, message: "Event updated.", data: presentEvent(saved.rows[0]) });
  } catch (error) {
    next(error);
  }
};

const removeEvent = async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);
    if (!eventId) return next(new HttpException(400, "Choose an event."));
    const removed = await pool.query(
      `UPDATE events
       SET is_deleted = true, is_active = false, updated_by = $1, updated_at = now()
       WHERE id = $2 AND is_deleted = false
       RETURNING id`,
      [req.admin.email, eventId]
    );
    if (!removed.rows[0]) return next(new HttpException(404, "Event not found."));
    res.json({ status: 200, message: "Event removed from the public site.", data: { id: eventId } });
  } catch (error) {
    next(error);
  }
};

function presentImage(row) {
  return {
    id: Number(row.id),
    imageUrl: row.image_url,
    caption: row.caption,
    placement: row.placement,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

const listGallery = async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, image_url, caption, placement, sort_order, is_active
       FROM gallery_images
       WHERE is_deleted = false
       ORDER BY placement ASC, sort_order ASC, id ASC`
    );
    res.json({ status: 200, data: rows.map(presentImage) });
  } catch (error) {
    next(error);
  }
};

const createGalleryImage = async (req, res, next) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : cleanUrl(req.body.imageUrl);
    if (!imageUrl) return next(new HttpException(400, "Add an image file or a web address."));
    const placement = PLACEMENTS.includes(req.body.placement) ? req.body.placement : "gallery";
    const caption = cleanText(req.body.caption, 255);
    const sortOrder = Number(req.body.sortOrder || 0);
    const created = await pool.query(
      `INSERT INTO gallery_images (image_url, caption, placement, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING id, image_url, caption, placement, sort_order, is_active`,
      [imageUrl, caption, placement, Number.isFinite(sortOrder) ? sortOrder : 0]
    );
    res.status(201).json({ status: 201, message: "Image saved.", data: presentImage(created.rows[0]) });
  } catch (error) {
    next(error);
  }
};

const updateGalleryImage = async (req, res, next) => {
  try {
    const imageId = Number(req.params.id);
    if (!imageId) return next(new HttpException(400, "Choose an image."));
    const placement = PLACEMENTS.includes(req.body.placement) ? req.body.placement : "gallery";
    const updated = await pool.query(
      `UPDATE gallery_images
       SET caption = $1, placement = $2, sort_order = $3, is_active = $4
       WHERE id = $5 AND is_deleted = false
       RETURNING id, image_url, caption, placement, sort_order, is_active`,
      [
        cleanText(req.body.caption, 255),
        placement,
        Number(req.body.sortOrder || 0),
        req.body.isActive !== false && req.body.isActive !== "false",
        imageId,
      ]
    );
    if (!updated.rows[0]) return next(new HttpException(404, "Image not found."));
    res.json({ status: 200, data: presentImage(updated.rows[0]) });
  } catch (error) {
    next(error);
  }
};

const removeGalleryImage = async (req, res, next) => {
  try {
    const imageId = Number(req.params.id);
    const removed = await pool.query(
      `UPDATE gallery_images SET is_deleted = true, is_active = false
       WHERE id = $1 AND is_deleted = false
       RETURNING id`,
      [imageId]
    );
    if (!removed.rows[0]) return next(new HttpException(404, "Image not found."));
    res.json({ status: 200, message: "Image removed.", data: { id: imageId } });
  } catch (error) {
    next(error);
  }
};

const listStates = async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, code, is_participating
       FROM state
       WHERE is_deleted = false AND is_active = true
       ORDER BY is_participating DESC, name ASC`
    );
    res.json({
      status: 200,
      data: rows.map((row) => ({
        id: Number(row.id),
        name: row.name,
        code: row.code,
        isParticipating: row.is_participating,
      })),
    });
  } catch (error) {
    next(error);
  }
};

const updateState = async (req, res, next) => {
  try {
    const stateId = Number(req.params.id);
    if (!stateId) return next(new HttpException(400, "Choose a state."));
    const isParticipating = req.body.isParticipating === true || req.body.isParticipating === "true";
    const updated = await pool.query(
      `UPDATE state SET is_participating = $1, updated_date = now()
       WHERE id = $2 AND is_deleted = false
       RETURNING id, is_participating`,
      [isParticipating, stateId]
    );
    if (!updated.rows[0]) return next(new HttpException(404, "State not found."));
    res.json({
      status: 200,
      data: { id: Number(updated.rows[0].id), isParticipating: updated.rows[0].is_participating },
    });
  } catch (error) {
    next(error);
  }
};

const getSite = async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`SELECT key, value FROM site_content`);
    const content = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    res.json({
      status: 200,
      data: {
        heroTitle: content.hero_title || "",
        heroSubtitle: content.hero_subtitle || "",
        aboutCopy: content.about_copy || "",
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateSite = async (req, res, next) => {
  try {
    const heroTitle = cleanText(req.body.heroTitle, 300);
    const heroSubtitle = cleanText(req.body.heroSubtitle, 500);
    const aboutCopy = cleanText(req.body.aboutCopy, 5000);
    if (!heroTitle) return next(new HttpException(400, "Enter the home page heading."));
    if (!heroSubtitle) return next(new HttpException(400, "Enter the home page line under the heading."));
    if (!aboutCopy) return next(new HttpException(400, "Enter the about text."));
    const entries = [
      ["hero_title", heroTitle],
      ["hero_subtitle", heroSubtitle],
      ["about_copy", aboutCopy],
    ];
    for (const [key, value] of entries) {
      await pool.query(
        `INSERT INTO site_content (key, value, updated_at)
         VALUES ($1, $2, now())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [key, value]
      );
    }
    res.json({
      status: 200,
      message: "Site text saved.",
      data: { heroTitle, heroSubtitle, aboutCopy },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  imageUpload,
  listEvents,
  createEvent,
  updateEvent,
  removeEvent,
  listGallery,
  createGalleryImage,
  updateGalleryImage,
  removeGalleryImage,
  listStates,
  updateState,
  getSite,
  updateSite,
};
