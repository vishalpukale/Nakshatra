const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");
const HttpException = require("../utils/HttpException.utils");
const { ADMIN_ROLES } = require("../middleware/admin.middleware");

function presentAnswer(value) {
  if (value == null) return "";
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.join(", ");
    if (parsed && typeof parsed === "object" && parsed.path) return parsed.path;
  } catch {
    return value;
  }
  return value;
}

const login = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) {
      return next(new HttpException(400, "Enter your email and password."));
    }
    if (!process.env.SECRET_JWT) {
      return next(new HttpException(500, "Admin sign-in is not configured."));
    }

    const result = await pool.query(
      `SELECT id, full_name, email, password_hash, role, is_active
       FROM users
       WHERE lower(email) = $1 AND is_deleted = false
       LIMIT 1`,
      [email]
    );
    const user = result.rows[0];
    const passwordMatches = user?.password_hash
      ? await bcrypt.compare(password, user.password_hash)
      : false;
    if (!user || !passwordMatches || !user.is_active || !ADMIN_ROLES.includes(user.role)) {
      return next(new HttpException(401, "Email or password is incorrect."));
    }

    const token = jwt.sign(
      { userId: Number(user.id), email: user.email, role: user.role },
      process.env.SECRET_JWT,
      { expiresIn: "12h" }
    );
    res.json({
      status: 200,
      data: {
        token,
        admin: {
          id: Number(user.id),
          fullName: user.full_name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const listRegistrations = async (_req, res, next) => {
  try {
    const registrations = await pool.query(
      `SELECT registrations.id, registrations.created_at, registrations.payment_status,
              registrations.total_amount, registrations.audition_video_path,
              events.name AS event_name, events.type AS event_type,
              users.full_name, users.email, users.phone,
              state.name AS state_name
       FROM registrations
       JOIN users ON users.id = registrations.user_id
       JOIN events ON events.id = registrations.event_id
       LEFT JOIN state ON state.id = registrations.state_id
       WHERE registrations.is_deleted = false
       ORDER BY registrations.created_at DESC`
    );
    const ids = registrations.rows.map((row) => row.id);
    const answers = ids.length
      ? await pool.query(
          `SELECT registration_answers.registration_id, registration_form_fields.field_key,
                  registration_form_fields.label, registration_answers.value
           FROM registration_answers
           JOIN registration_form_fields ON registration_form_fields.id = registration_answers.field_id
           WHERE registration_answers.registration_id = ANY($1::bigint[])
           ORDER BY registration_form_fields.sort_order ASC`,
          [ids]
        )
      : { rows: [] };

    const grouped = new Map();
    answers.rows.forEach((answer) => {
      const list = grouped.get(Number(answer.registration_id)) || [];
      list.push({
        fieldKey: answer.field_key,
        label: answer.label,
        value: presentAnswer(answer.value),
      });
      grouped.set(Number(answer.registration_id), list);
    });

    res.json({
      status: 200,
      data: registrations.rows.map((row) => ({
        id: Number(row.id),
        createdAt: row.created_at,
        paymentStatus: row.payment_status,
        totalAmount: row.total_amount,
        videoPath: row.audition_video_path,
        eventName: row.event_name,
        eventType: row.event_type,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        stateName: row.state_name,
        answers: grouped.get(Number(row.id)) || [],
      })),
    });
  } catch (error) {
    next(error);
  }
};

const listInquiries = async (_req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, intent, full_name, email, phone, organization, city, message, accepted_terms, created_at
       FROM inquiries
       ORDER BY created_at DESC`
    );
    res.json({
      status: 200,
      data: result.rows.map((row) => ({
        id: Number(row.id),
        intent: row.intent,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        organization: row.organization,
        city: row.city,
        message: row.message,
        acceptedTerms: row.accepted_terms,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};

const listAdmins = async (_req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, role, is_active, created_at
       FROM users
       WHERE role IN ('ADMIN', 'SUPER_ADMIN') AND is_deleted = false
       ORDER BY created_at ASC`
    );
    res.json({
      status: 200,
      data: result.rows.map((row) => ({
        id: Number(row.id),
        fullName: row.full_name,
        email: row.email,
        role: row.role,
        isActive: row.is_active,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    if (req.admin.role !== "SUPER_ADMIN") {
      return next(new HttpException(403, "Only a super admin can add another admin."));
    }
    const fullName = String(req.body.fullName || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (fullName.length < 2) return next(new HttpException(400, "Enter the admin's name."));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return next(new HttpException(400, "Enter a valid email address."));
    }
    if (password.length < 8) {
      return next(new HttpException(400, "Password must be at least 8 characters."));
    }

    const existing = await pool.query(
      `SELECT id FROM users WHERE lower(email) = $1 AND is_deleted = false LIMIT 1`,
      [email]
    );
    if (existing.rows[0]) {
      return next(new HttpException(409, "That email is already in use."));
    }

    const [firstName, ...rest] = fullName.split(" ");
    const passwordHash = await bcrypt.hash(password, 10);
    const created = await pool.query(
      `INSERT INTO users (full_name, first_name, last_name, email, password_hash, role, email_verified)
       VALUES ($1, $2, $3, $4, $5, 'ADMIN', true)
       RETURNING id, full_name, email, role, is_active, created_at`,
      [fullName, firstName, rest.join(" "), email, passwordHash]
    );
    const admin = created.rows[0];
    res.status(201).json({
      status: 201,
      message: "Admin saved.",
      data: {
        id: Number(admin.id),
        fullName: admin.full_name,
        email: admin.email,
        role: admin.role,
        isActive: admin.is_active,
        createdAt: admin.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAdminStatus = async (req, res, next) => {
  try {
    if (req.admin.role !== "SUPER_ADMIN") {
      return next(new HttpException(403, "Only a super admin can change admin access."));
    }
    const adminId = Number(req.params.id);
    if (!adminId) return next(new HttpException(400, "Choose an admin."));
    if (adminId === req.admin.userId) {
      return next(new HttpException(400, "You cannot change your own access."));
    }
    const isActive = req.body.isActive === true || req.body.isActive === "true";
    const updated = await pool.query(
      `UPDATE users
       SET is_active = $1, updated_at = now()
       WHERE id = $2 AND role IN ('ADMIN', 'SUPER_ADMIN') AND is_deleted = false
       RETURNING id, is_active`,
      [isActive, adminId]
    );
    if (!updated.rows[0]) return next(new HttpException(404, "Admin not found."));
    res.json({
      status: 200,
      data: { id: Number(updated.rows[0].id), isActive: updated.rows[0].is_active },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  listRegistrations,
  listInquiries,
  listAdmins,
  createAdmin,
  updateAdminStatus,
};
