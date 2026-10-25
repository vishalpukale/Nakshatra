const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { pool } = require("../config/database");
const HttpException = require("../utils/HttpException.utils");

const uploadDir = path.join(__dirname, "../../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, callback) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      callback(null, `${Date.now()}-${safeName}`);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype && file.mimetype.startsWith("video/")) {
      callback(null, true);
      return;
    }
    callback(new Error("Audition file must be a video."));
  },
});

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isRegistrationOpen(tillDate) {
  if (!tillDate) return true;
  const end = new Date(tillDate);
  end.setHours(23, 59, 59, 999);
  return end.getTime() >= Date.now();
}

function mapEvent(row) {
  return {
    id: Number(row.id),
    name: row.name,
    slug: slugify(row.name),
    code: row.code,
    type: row.type,
    description: row.description,
    imageUrl: row.image_url,
    paymentRequired: row.payment_required,
    price: row.price,
    currency: row.currency || "INR",
    location: row.location,
    startDate: row.start_date,
    endDate: row.end_date,
    registrationTillDate: row.registration_till_date,
    registrationOpen: isRegistrationOpen(row.registration_till_date),
  };
}

function isVisible(field, values) {
  const dependency = field.options?.dependsOn;
  if (!dependency) return true;
  const current = values[dependency.field];
  if (dependency.value != null) return String(current) === String(dependency.value);
  if (Array.isArray(dependency.values)) {
    return dependency.values.map(String).includes(String(current));
  }
  return true;
}

function choiceValues(field) {
  const choices = field.options?.options;
  return Array.isArray(choices) ? choices.map((choice) => String(choice.value)) : [];
}

async function publicEvents() {
  const { rows } = await pool.query(
    `SELECT id, name, code, type, description, image_url, payment_required, price, currency,
            location, start_date, end_date, registration_till_date
     FROM events
     WHERE is_deleted = false
       AND is_active = true
       AND name NOT ILIKE 'test%'
     ORDER BY start_date ASC, id ASC`
  );
  return rows;
}

async function resolveEvent(slugOrId) {
  const events = await publicEvents();
  if (/^\d+$/.test(String(slugOrId))) {
    return events.find((event) => Number(event.id) === Number(slugOrId)) || null;
  }
  const key = String(slugOrId || "").toLowerCase();
  if (key === "talent-hunt" || key === "little-stars") {
    return events.find((event) => event.type === "littlestars") || null;
  }
  if (key === "competitions" || key === "the-star-of-india") {
    return events.find((event) => event.type === "intercollege") || null;
  }
  return events.find((event) => slugify(event.name) === key) || null;
}

async function formForEvent(eventId) {
  const formResult = await pool.query(
    `SELECT id, name, event_id
     FROM registration_forms
     WHERE event_id = $1 AND is_deleted = false AND is_active = true
     ORDER BY is_default DESC, id ASC
     LIMIT 1`,
    [eventId]
  );
  const form = formResult.rows[0];
  if (!form) return { form: null, fields: [] };

  const fieldResult = await pool.query(
    `SELECT id, field_key, label, input_type, is_required, sort_order, options
     FROM registration_form_fields
     WHERE form_id = $1 AND is_deleted = false
     ORDER BY sort_order ASC, id ASC`,
    [form.id]
  );
  return { form, fields: fieldResult.rows };
}

const getCountries = async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, code, phone_code
       FROM country
       WHERE is_deleted = false AND is_active = true
       ORDER BY name`
    );
    res.json({ status: 200, data: rows });
  } catch (error) {
    next(error);
  }
};

const getStates = async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, code, country_id, is_participating
       FROM state
       WHERE is_deleted = false AND is_active = true
       ORDER BY name`
    );
    res.json({
      status: 200,
      data: rows.map((row) => ({
        id: Number(row.id),
        name: row.name,
        code: row.code,
        country_id: row.country_id,
        isParticipating: row.is_participating,
      })),
    });
  } catch (error) {
    next(error);
  }
};

const getCities = async (req, res, next) => {
  try {
    const stateId = Number(req.query.stateId);
    if (!stateId) {
      return next(new HttpException(400, "Select a state before loading cities."));
    }
    const { rows } = await pool.query(
      `SELECT id, name, code, state_id
       FROM city
       WHERE state_id = $1 AND is_deleted = false AND is_active = true
       ORDER BY name`,
      [stateId]
    );
    res.json({ status: 200, data: rows });
  } catch (error) {
    next(error);
  }
};

const getGallery = async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, image_url, caption, placement, sort_order
       FROM gallery_images
       WHERE is_deleted = false AND is_active = true
       ORDER BY sort_order ASC, id ASC`
    );
    res.json({
      status: 200,
      data: rows.map((row) => ({
        id: Number(row.id),
        imageUrl: row.image_url,
        caption: row.caption,
        placement: row.placement,
        sortOrder: row.sort_order,
      })),
    });
  } catch (error) {
    next(error);
  }
};

const getSiteContent = async (_req, res, next) => {
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

const getEvents = async (_req, res, next) => {
  try {
    const rows = await publicEvents();
    res.json({ status: 200, data: rows.map(mapEvent) });
  } catch (error) {
    next(error);
  }
};

const getEventBySlug = async (req, res, next) => {
  try {
    const event = await resolveEvent(req.params.slug);
    if (!event) return next(new HttpException(404, "Event not found."));
    res.json({ status: 200, data: mapEvent(event) });
  } catch (error) {
    next(error);
  }
};

const getForm = async (req, res, next) => {
  try {
    const event = await resolveEvent(req.params.slug);
    if (!event) return next(new HttpException(404, "Event not found."));
    const { form, fields } = await formForEvent(event.id);
    if (!form) return next(new HttpException(404, "Registration form is not ready for this event."));
    res.json({
      status: 200,
      data: {
        event: mapEvent(event),
        form: { id: Number(form.id), name: form.name },
        fields: fields.map((field) => ({
          id: Number(field.id),
          fieldKey: field.field_key,
          label: field.label,
          inputType: field.input_type,
          isRequired: field.is_required,
          sortOrder: field.sort_order,
          options: field.options,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

function readAnswers(body) {
  if (!body.answers) return {};
  if (typeof body.answers === "object") return body.answers;
  try {
    return JSON.parse(body.answers);
  } catch {
    throw new HttpException(400, "Registration answers could not be read.");
  }
}

function asText(value) {
  if (Array.isArray(value)) return JSON.stringify(value);
  if (value == null) return "";
  return String(value).trim();
}

const createRegistration = async (req, res, next) => {
  let client;
  let started = false;
  try {
    client = await pool.connect();
    const answers = readAnswers(req.body);
    const event = await resolveEvent(req.body.eventId || req.body.eventSlug);
    if (!event) throw new HttpException(404, "Event not found.");
    if (!isRegistrationOpen(event.registration_till_date)) {
      throw new HttpException(400, "Registration for this event is closed.");
    }

    const { form, fields } = await formForEvent(event.id);
    if (!form) throw new HttpException(404, "Registration form is not ready for this event.");

    const errors = {};
    for (const field of fields) {
      if (!isVisible(field, answers)) continue;
      const value = answers[field.field_key];
      const empty = value == null || value === "" || (Array.isArray(value) && value.length === 0);
      if (field.field_key === "audition_video") continue;
      if (field.is_required && empty) {
        errors[field.field_key] = `${field.label} is required.`;
        continue;
      }
      if (empty) continue;

      const allowed = choiceValues(field);
      if (allowed.length && field.input_type !== "checkbox") {
        if (!allowed.includes(String(value))) {
          errors[field.field_key] = `Choose a valid option for ${field.label}.`;
        }
      }
      if (field.input_type === "checkbox" && allowed.length) {
        const selected = Array.isArray(value) ? value.map(String) : [String(value)];
        if (selected.some((item) => !allowed.includes(item))) {
          errors[field.field_key] = `Choose a valid option for ${field.label}.`;
        }
      }
    }

    if (answers.main_category === "other" && !asText(answers.other_category)) {
      errors.other_category = "Tell us the other category.";
    }
    if (answers.accepted_terms !== "yes" && answers.accepted_terms !== true) {
      errors.accepted_terms = "Accept the Terms & Conditions to continue.";
    }

    const fullName = asText(answers.full_name);
    const email = asText(answers.email).toLowerCase();
    const phone = asText(answers.mobile);
    if (fullName && fullName.length < 2) errors.full_name = "Enter your full name.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address.";
    }
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      errors.mobile = "Enter a 10-digit mobile number.";
    }

    const stateId = Number(answers.state_id);
    const cityId = Number(answers.city_id);
    if (answers.state_id && !stateId) errors.state_id = "Select your state.";
    if (answers.city_id && !cityId) errors.city_id = "Select your current city.";

    const videoField = fields.find((field) => field.field_key === "audition_video");
    if (videoField?.is_required && !req.file) {
      errors.audition_video = "Upload your audition video.";
    }

    if (Object.keys(errors).length) {
      throw new HttpException(400, "Check the highlighted fields.", errors);
    }

    await client.query("BEGIN");
    started = true;

    if (stateId) {
      const stateResult = await client.query(
        "SELECT id FROM state WHERE id = $1 AND is_deleted = false",
        [stateId]
      );
      if (!stateResult.rows[0]) throw new HttpException(400, "Select a valid state.");
    }
    if (cityId) {
      const cityResult = await client.query(
        "SELECT id FROM city WHERE id = $1 AND state_id = $2 AND is_deleted = false",
        [cityId, stateId]
      );
      if (!cityResult.rows[0]) {
        throw new HttpException(400, "Select a city from the chosen state.");
      }
    }

    const duplicate = await client.query(
      `SELECT registrations.id
       FROM registrations
       JOIN users ON users.id = registrations.user_id
       WHERE lower(users.email) = $1
         AND registrations.event_id = $2
         AND registrations.is_deleted = false
       LIMIT 1`,
      [email, event.id]
    );
    if (duplicate.rows[0]) {
      throw new HttpException(409, "This email is already registered for this event.");
    }

    const existingUser = await client.query(
      `SELECT id FROM users WHERE lower(email) = $1 AND is_deleted = false ORDER BY id ASC LIMIT 1`,
      [email]
    );
    let userId = existingUser.rows[0]?.id;
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ");
    if (!userId) {
      const created = await client.query(
        `INSERT INTO users (full_name, first_name, last_name, email, phone, role)
         VALUES ($1, $2, $3, $4, $5, 'USER')
         RETURNING id`,
        [fullName, firstName || fullName, lastName, email, phone]
      );
      userId = created.rows[0].id;
    } else {
      await client.query(
        `UPDATE users
         SET full_name = $1, first_name = $2, last_name = $3, phone = $4, updated_at = now()
         WHERE id = $5`,
        [fullName, firstName || fullName, lastName, phone, userId]
      );
    }

    const paymentStatus = event.payment_required ? "pending" : "free";
    const registration = await client.query(
      `INSERT INTO registrations (
         user_id, event_id, state_id, form_id, audition_video_path, file_name, file_size, file_type,
         total_amount, payment_status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        userId,
        event.id,
        stateId || null,
        form.id,
        req.file ? `/uploads/${req.file.filename}` : null,
        req.file ? req.file.originalname : null,
        req.file ? req.file.size : null,
        req.file ? req.file.mimetype : null,
        event.price || 0,
        paymentStatus,
      ]
    );
    const registrationId = registration.rows[0].id;

    for (const field of fields) {
      if (!isVisible(field, answers)) continue;
      if (field.field_key === "audition_video") {
        if (!req.file) continue;
        await client.query(
          `INSERT INTO registration_answers (registration_id, field_id, value)
           VALUES ($1, $2, $3)`,
          [
            registrationId,
            field.id,
            JSON.stringify({
              name: req.file.originalname,
              type: req.file.mimetype,
              size: req.file.size,
              path: `/uploads/${req.file.filename}`,
            }),
          ]
        );
        continue;
      }
      const value = asText(answers[field.field_key]);
      if (!value) continue;
      await client.query(
        `INSERT INTO registration_answers (registration_id, field_id, value)
         VALUES ($1, $2, $3)`,
        [registrationId, field.id, value]
      );
    }

    await client.query("COMMIT");
    started = false;
    res.status(201).json({
      status: 201,
      message: "Registration successful. We will contact you on the details you shared.",
      data: { id: Number(registrationId) },
    });
  } catch (error) {
    if (client && started) {
      await client.query("ROLLBACK");
    }
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    next(error);
  } finally {
    if (client) client.release();
  }
};

const createInquiry = async (req, res, next) => {
  try {
    const intent = String(req.body.intent || "");
    const allowed = ["partner", "mission", "query"];
    if (!allowed.includes(intent)) {
      return next(new HttpException(400, "Choose what you want to send."));
    }
    const fullName = String(req.body.fullName || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const phone = String(req.body.phone || "").trim();
    const organization = String(req.body.organization || "").trim();
    const city = String(req.body.city || "").trim();
    const message = String(req.body.message || "").trim();
    const acceptedTerms = req.body.acceptedTerms === true || req.body.acceptedTerms === "yes";

    if (fullName.length < 2) return next(new HttpException(400, "Enter your full name."));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return next(new HttpException(400, "Enter a valid email address."));
    }
    if ((intent === "partner" || intent === "mission") && !/^[0-9]{10}$/.test(phone)) {
      return next(new HttpException(400, "Enter a 10-digit mobile number."));
    }
    if (intent === "partner" && organization.length < 2) {
      return next(new HttpException(400, "Enter your organisation name."));
    }
    if (message.length < 10) {
      return next(new HttpException(400, "Tell us a little more, at least a sentence."));
    }
    if (!acceptedTerms) {
      return next(new HttpException(400, "Accept the Terms & Conditions to continue."));
    }

    const result = await pool.query(
      `INSERT INTO inquiries (intent, full_name, email, phone, organization, city, message, accepted_terms)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       RETURNING id`,
      [intent, fullName, email, phone || null, organization || null, city || null, message]
    );
    res.status(201).json({
      status: 201,
      message: "Thanks, we have received your message.",
      data: { id: Number(result.rows[0].id) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  getCountries,
  getStates,
  getCities,
  getEvents,
  getGallery,
  getSiteContent,
  getEventBySlug,
  getForm,
  createRegistration,
  createInquiry,
};
