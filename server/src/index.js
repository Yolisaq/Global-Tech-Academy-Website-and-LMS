
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { initStore, readStore, writeStore } from './store.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.includes('replace-this')) {
  console.warn(
    'WARNING: Set a strong JWT_SECRET in server/.env before using this beyond local development.'
  );
}

app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.CLIENT_ORIGIN
  ].filter(Boolean)
}));

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();

function createPasswordMailer() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

const seed = {
  users: [],
  programmes: [],
  courses: [],
  cohorts: [],
  applications: [],
  attendance: [],
  assessments: [],
  submissions: [],
  feedback: [],
  payments: [],
  invoices: [],
  certificates: [],
  notifications: [],
  auditLogs: [],
  settings: {
    academyName: 'Global Tech Academy',
    slogan: 'Learn · Build · Certify · Work',
    contactEmail: 'info@globaltechacademy.co.za',
    currency: 'ZAR'
  },
  contacts: []
};

initStore(seed);

let db = readStore();

async function ensureSeedUsers() {
  db = readStore();

  if (!db.users.some(u => u.role === 'admin')) {
    db.users.push({
      id: id(),
      name: process.env.ADMIN_NAME || 'Academy Administrator',
      email: (
        process.env.ADMIN_EMAIL ||
        'admin@globaltechacademy.co.za'
      ).toLowerCase(),
      passwordHash: await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'ChangeMe!2026',
        12
      ),
      role: 'admin',
      status: 'active',
      createdAt: now()
    });
  }

  if (!db.users.some(u => u.role === 'learner')) {
    db.users.push({
      id: id(),
      name: process.env.LEARNER_NAME || 'Demo Learner',
      email: (
        process.env.LEARNER_EMAIL ||
        'learner@example.com'
      ).toLowerCase(),
      passwordHash: await bcrypt.hash(
        process.env.LEARNER_PASSWORD || 'ChangeMe!2026',
        12
      ),
      role: 'learner',
      status: 'active',
      createdAt: now()
    });
  }

  if (!db.programmes.length) {
    db.programmes.push({
      id: id(),
      name: 'Cloud Administrator',
      code: 'CA-118699',
      description:
        'Cloud administration foundations and practical skills.',
      status: 'Active',
      duration: '12 months'
    });
  }

  if (!db.courses.length) {
    db.courses.push({
      id: id(),
      title: 'Cloud Fundamentals',
      code: 'CLOUD-101',
      programme: 'Cloud Administrator',
      description:
        'Introduction to cloud services, security and operations.',
      status: 'Published',
      lessons: 8
    });
  }

  writeStore(db);
}

await ensureSeedUsers();

function audit(user, action, entity, entityId = '') {
  const state = readStore();

  state.auditLogs.unshift({
    id: id(),
    actorId: user?.id || 'system',
    actor: user?.email || 'system',
    action,
    entity,
    entityId,
    timestamp: now()
  });

  state.auditLogs = state.auditLogs.slice(0, 1000);
  writeStore(state);
}

function safeUser(user) {
  const {
    passwordHash,
    passwordResetTokenHash,
    passwordResetExpiresAt,
    ...safe
  } = user;

  return safe;
}

function auth(req, res, next) {
  const token = (req.headers.authorization || '')
    .replace(/^Bearer\s+/i, '');

  if (!token) {
    return res.status(401).json({
      error: 'Please sign in to continue.'
    });
  }

  try {
    const payload = jwt.verify(
      token,
      JWT_SECRET || 'local-only-insecure-secret'
    );

    const state = readStore();

    const user = state.users.find(
      u => u.id === payload.sub && u.status !== 'disabled'
    );

    if (!user) {
      return res.status(401).json({
        error: 'Account not found or disabled.'
      });
    }

    req.user = safeUser(user);
    next();
  } catch {
    return res.status(401).json({
      error: 'Your session is invalid or expired. Please sign in again.'
    });
  }
}

function roles(...allowed) {
  return (req, res, next) => {
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        error: 'You do not have permission to perform this action.'
      });
    }

    next();
  };
}

const collections = new Set([
  'users',
  'programmes',
  'courses',
  'cohorts',
  'applications',
  'attendance',
  'assessments',
  'submissions',
  'feedback',
  'payments',
  'invoices',
  'certificates',
  'notifications'
]);

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'Global Tech Academy LMS API',
    timestamp: now()
  });
});

// LEARNER REGISTRATION
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (
    !name?.trim() ||
    !email?.trim() ||
    typeof password !== 'string' ||
    password.length < 10
  ) {
    return res.status(400).json({
      error:
        'Name, email and a password of at least 10 characters are required.'
    });
  }

  const state = readStore();
  const normalized = email.trim().toLowerCase();

  if (state.users.some(u => u.email === normalized)) {
    return res.status(409).json({
      error: 'An account with this email already exists.'
    });
  }

  const user = {
    id: id(),
    name: name.trim(),
    email: normalized,
    passwordHash: await bcrypt.hash(password, 12),
    role: 'learner',
    status: 'active',
    createdAt: now()
  };

  state.users.push(user);
  writeStore(state);

  audit(safeUser(user), 'REGISTER', 'users', user.id);

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    JWT_SECRET || 'local-only-insecure-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  res.status(201).json({
    token,
    user: safeUser(user)
  });
});

// SIGN IN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  const state = readStore();

  const user = state.users.find(
    u => u.email === String(email || '').trim().toLowerCase()
  );

  if (
    !user ||
    user.status === 'disabled' ||
    !(await bcrypt.compare(
      String(password || ''),
      user.passwordHash
    ))
  ) {
    return res.status(401).json({
      error: 'Email or password is incorrect.'
    });
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    JWT_SECRET || 'local-only-insecure-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  audit(safeUser(user), 'LOGIN', 'users', user.id);

  res.json({
    token,
    user: safeUser(user)
  });
});

// REQUEST A PASSWORD RESET EMAIL
app.post('/api/auth/forgot-password', async (req, res) => {
  const mailer = createPasswordMailer();

  if (!mailer) {
    return res.status(503).json({
      error: 'Password recovery email is not configured yet.'
    });
  }

  const email = String(req.body?.email || '')
    .trim()
    .toLowerCase();

  const genericMessage = {
    message:
      'If an active account exists for that email, password reset instructions will be sent.'
  };

  if (!email || email.length > 254) {
    return res.json(genericMessage);
  }

  const state = readStore();

  const user = state.users.find(
    u => u.email === email && u.status !== 'disabled'
  );

  if (!user) {
    return res.json(genericMessage);
  }

  const token = crypto.randomBytes(32).toString('hex');

  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const origin = (
    process.env.CLIENT_ORIGIN || 'http://localhost:5175'
  ).replace(/\/+$/, '');

  const resetUrl =
    `${origin}/reset-password?token=${encodeURIComponent(token)}`;

  try {
    const latest = readStore();

    const currentUser = latest.users.find(
      u => u.id === user.id && u.status !== 'disabled'
    );

    if (!currentUser) {
      return res.json(genericMessage);
    }

    // Save the hashed token and its expiry before emailing the link.
    currentUser.passwordResetTokenHash = tokenHash;
    currentUser.passwordResetExpiresAt =
      Date.now() + 30 * 60 * 1000;

    writeStore(latest);

    await mailer.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: currentUser.email,
      subject: 'Reset your Global Tech Academy password',
      text: [
        `Hello ${currentUser.name || 'learner'},`,
        '',
        'Use this link to reset your password:',
        resetUrl,
        '',
        'This link expires in 30 minutes and can only be used once.',
        'If you did not request this, ignore this email.'
      ].join('\n')
    });

    return res.json(genericMessage);
  } catch {
    console.error('Unable to complete password reset request.');

    return res.status(503).json({
      error:
        'Unable to send a password reset email right now. Please try again later.'
    });
  }
});

// SET A NEW PASSWORD USING THE RESET LINK
app.post('/api/auth/reset-password', async (req, res) => {
  const token = String(req.body?.token || '');
  const password = req.body?.password;

  if (
    token.length !== 64 ||
    typeof password !== 'string' ||
    password.length < 10
  ) {
    return res.status(400).json({
      error:
        'A valid reset link and a password of at least 10 characters are required.'
    });
  }

  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const state = readStore();

  const user = state.users.find(
    u =>
      u.passwordResetTokenHash === tokenHash &&
      Number(u.passwordResetExpiresAt) > Date.now() &&
      u.status !== 'disabled'
  );

  if (!user) {
    return res.status(400).json({
      error:
        'This reset link is invalid or expired. Please request a new one.'
    });
  }

  user.passwordHash = await bcrypt.hash(password, 12);

  delete user.passwordResetTokenHash;
  delete user.passwordResetExpiresAt;

  writeStore(state);

  audit(safeUser(user), 'PASSWORD_RESET', 'users', user.id);

  res.json({
    message:
      'Password reset successful. Please sign in with your new password.'
  });
});

// CURRENT SESSION AND SIGN OUT
app.get('/api/auth/me', auth, (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/logout', auth, (req, res) => {
  audit(req.user, 'LOGOUT', 'users', req.user.id);

  res.json({
    ok: true,
    message:
      'Signed out on this device. Remove the token from the client.'
  });
});

// PUBLIC COURSES
app.get('/api/public/courses', (_req, res) => {
  const state = readStore();

  const courses = (state.courses || []).filter(course => {
    const status = String(course.status || '').trim().toLowerCase();
    return status === 'published' || status === 'active';
  });

  res.json(courses);
});

// PUBLIC PROGRAMMES
app.get('/api/public/programmes', (_req, res) => {
  const state = readStore();

  const programmes = (state.programmes || []).filter(programme => {
    const status = String(programme.status || '').trim().toLowerCase();
    return status === 'active';
  });

  res.json(programmes);
});

// PUBLIC CONTACT FORM
app.post('/api/public/contact', (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Name, email and message are required.'
    });
  }

  const state = readStore();

  const item = {
    id: id(),
    name: String(name).slice(0, 120),
    email: String(email).slice(0, 200),
    subject: String(subject || 'Website enquiry').slice(0, 200),
    message: String(message).slice(0, 4000),
    status: 'New',
    createdAt: now()
  };

  state.contacts.unshift(item);
  writeStore(state);

  res.status(201).json({
    ok: true,
    message: 'Your enquiry has been received.'
  });
});

// LEARNER OVERVIEW
app.get('/api/learner/overview', auth, roles('learner'), (req, res) => {
  const state = readStore();

  const mine = key =>
    state[key].filter(
      x => x.learnerId === req.user.id || x.userId === req.user.id
    );

  res.json({
    user: req.user,
    courses: state.courses.filter(
      c =>
        (c.learnerIds || []).includes(req.user.id) ||
        c.status === 'Published'
    ),
    attendance: mine('attendance'),
    assessments: state.assessments.filter(
      a => a.status === 'Published'
    ),
    submissions: mine('submissions'),
    payments: mine('payments'),
    invoices: mine('invoices'),
    certificates: mine('certificates'),
    notifications: state.notifications.filter(
      n => !n.userId || n.userId === req.user.id
    )
  });
});

app.get('/api/learner/profile', auth, roles('learner'), (req, res) => {
  res.json([req.user]);
});

app.get('/api/learner/:collection', auth, roles('learner'), (req, res) => {
  const key = req.params.collection;

  if (!collections.has(key) || key === 'users') {
    return res.status(404).json({ error: 'Unknown collection.' });
  }

  const state = readStore();
  let items = state[key] || [];

  if (key === 'courses') {
    items = items.filter(
      c =>
        (c.learnerIds || []).includes(req.user.id) ||
        c.status === 'Published'
    );
  } else if (key === 'assessments') {
    items = items.filter(x => x.status === 'Published');
  } else if (key === 'notifications') {
    items = items.filter(
      x => !x.userId || x.userId === req.user.id
    );
  } else {
    items = items.filter(
      x => x.learnerId === req.user.id || x.userId === req.user.id
    );
  }

  res.json(items);
});

// ADMIN OVERVIEW
app.get(
  '/api/admin/overview',
  auth,
  roles('admin', 'super_admin', 'facilitator', 'finance'),
  (req, res) => {
    const state = readStore();

    res.json({
      counts: {
        users: state.users.length,
        learners: state.users.filter(u => u.role === 'learner').length,
        programmes: state.programmes.length,
        courses: state.courses.length,
        applications: state.applications.length,
        assessments: state.assessments.length,
        submissions: state.submissions.length,
        outstandingInvoices: state.invoices.filter(
          i => !['Paid', 'paid'].includes(i.status)
        ).length
      },
      recentAudit: state.auditLogs.slice(0, 10)
    });
  }
);

// ADMIN REPORT SUMMARY
app.get(
  '/api/admin/reports/summary',
  auth,
  roles('admin', 'super_admin', 'finance'),
  (_req, res) => {
    const state = readStore();
    const total = state.payments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    res.json({
      users: state.users.length,
      programmes: state.programmes.length,
      courses: state.courses.length,
      applications: state.applications.length,
      submissions: state.submissions.length,
      paymentTotal: total,
      auditEvents: state.auditLogs.length
    });
  }
);

// EXPORT ADMIN REPORT
app.get(
  '/api/admin/reports/export.csv',
  auth,
  roles('admin', 'super_admin', 'finance'),
  (_req, res) => {
    const state = readStore();
    const rows = [
      ['Type', 'ID', 'Name / Title', 'Status', 'Created At']
    ];

    for (const key of [
      'users',
      'programmes',
      'courses',
      'applications',
      'assessments',
      'submissions',
      'invoices',
      'payments',
      'certificates'
    ]) {
      for (const item of state[key]) {
        rows.push([
          key,
          item.id,
          item.name || item.title || item.email || item.code || '',
          item.status || '',
          item.createdAt || ''
        ]);
      }
    }

    const csv = rows
      .map(row =>
        row
          .map(value =>
            `"${String(value ?? '').replaceAll('"', '""')}"`
          )
          .join(',')
      )
      .join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="academy-report.csv"'
    );

    res.send(csv);
  }
);

// ADMIN CONTACTS
app.get('/api/admin/contacts', auth, roles('admin', 'super_admin'), (_req, res) => {
  res.json(readStore().contacts);
});

// ADMIN COLLECTIONS
app.get(
  '/api/admin/:collection',
  auth,
  roles('admin', 'super_admin', 'facilitator', 'finance', 'moderator'),
  (req, res) => {
    const key = req.params.collection;
    const state = readStore();

    if (key === 'settings') {
      if (!['admin', 'super_admin'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Not permitted.' });
      }

      return res.json(state.settings);
    }

    if (key === 'auditLogs') {
      return res.json(state.auditLogs);
    }

    if (!collections.has(key)) {
      return res.status(404).json({ error: 'Unknown collection.' });
    }

    const items = state[key] || [];

    res.json(
      key === 'users' ? items.map(safeUser) : items
    );
  }
);

app.post(
  '/api/admin/:collection',
  auth,
  roles('admin', 'super_admin', 'facilitator', 'finance', 'moderator'),
  (req, res) => {
    const key = req.params.collection;

    if (!collections.has(key) || key === 'users') {
      return res.status(404).json({
        error: 'Unknown or restricted collection.'
      });
    }

    const state = readStore();

    const item = {
      id: id(),
      ...req.body,
      createdAt: now(),
      updatedAt: now()
    };

    delete item.passwordHash;
    delete item.passwordResetTokenHash;
    delete item.passwordResetExpiresAt;

    state[key].unshift(item);
    writeStore(state);

    audit(req.user, 'CREATE', key, item.id);

    res.status(201).json(item);
  }
);

app.patch(
  '/api/admin/:collection/:itemId',
  auth,
  roles('admin', 'super_admin', 'facilitator', 'finance', 'moderator'),
  (req, res) => {
    const key = req.params.collection;

    if (!collections.has(key)) {
      return res.status(404).json({ error: 'Unknown collection.' });
    }

    if (
      key === 'users' &&
      !['admin', 'super_admin'].includes(req.user.role)
    ) {
      return res.status(403).json({
        error: 'Only administrators can update users.'
      });
    }

    const state = readStore();
    const item = state[key].find(x => x.id === req.params.itemId);

    if (!item) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    const allowed = { ...req.body };

    delete allowed.id;
    delete allowed.passwordHash;
    delete allowed.passwordResetTokenHash;
    delete allowed.passwordResetExpiresAt;

    Object.assign(item, allowed, { updatedAt: now() });

    writeStore(state);
    audit(req.user, 'UPDATE', key, item.id);

    res.json(key === 'users' ? safeUser(item) : item);
  }
);

app.delete(
  '/api/admin/:collection/:itemId',
  auth,
  roles('admin', 'super_admin'),
  (req, res) => {
    const key = req.params.collection;

    if (!collections.has(key)) {
      return res.status(404).json({ error: 'Unknown collection.' });
    }

    const state = readStore();
    const before = state[key].length;

    state[key] = state[key].filter(
      x => x.id !== req.params.itemId
    );

    if (state[key].length === before) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    writeStore(state);
    audit(req.user, 'DELETE', key, req.params.itemId);

    res.json({ ok: true });
  }
);

// CHANGE A USER'S ROLE
app.patch(
  '/api/admin/users/:userId/role',
  auth,
  roles('admin', 'super_admin'),
  (req, res) => {
    const state = readStore();
    const user = state.users.find(u => u.id === req.params.userId);

    const valid = [
      'learner',
      'admin',
      'super_admin',
      'facilitator',
      'finance',
      'moderator'
    ];

    if (!user || !valid.includes(req.body.role)) {
      return res.status(400).json({
        error: 'User or role is invalid.'
      });
    }

    user.role = req.body.role;
    user.updatedAt = now();

    writeStore(state);
    audit(req.user, 'CHANGE_ROLE', 'users', user.id);

    res.json(safeUser(user));
  }
);

// ADMIN SETTINGS
app.get('/api/admin/settings', auth, roles('admin', 'super_admin'), (_req, res) => {
  res.json(readStore().settings);
});

app.put('/api/admin/settings', auth, roles('admin', 'super_admin'), (req, res) => {
  const state = readStore();

  state.settings = {
    ...state.settings,
    ...req.body
  };

  writeStore(state);
  audit(req.user, 'UPDATE_SETTINGS', 'settings');

  res.json(state.settings);
});

// ERROR HANDLER
app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(500).json({
    error: 'Unexpected server error.'
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Global Tech Academy API running at http://localhost:${PORT}`);
});
