
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter, useLocation, useNavigate
} from 'react-router-dom';
import {
  Activity, ArrowRight, Award, BookOpen, BriefcaseBusiness,
  CalendarCheck, ChartNoAxesCombined, CheckCircle2, ChevronDown,
  ClipboardCheck, CreditCard, FileText, GraduationCap,
  LayoutDashboard, LogIn, LogOut, Menu, MessageSquare, Search,
  Settings, ShieldCheck, Users, X, Bell, Layers3, CircleHelp
} from 'lucide-react';
import './styles.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const publicPages = [
  'Home', 'About', 'Services', 'Programme Course',
  'Impact', 'Portfolio', 'Contact', 'Privacy'
];

const learnerItems = [
  'Overview', 'My Courses', 'Lessons', 'Progress', 'Attendance',
  'Assessments', 'Submissions', 'Feedback', 'Payments', 'Invoices',
  'Certificates', 'Profile'
];

const adminItems = [
  'Overview', 'Users', 'Roles', 'Applications', 'Programmes',
  'Courses', 'Cohorts', 'Attendance', 'Assessments', 'Marking',
  'Moderation', 'Finance', 'Reports', 'Notifications',
  'Audit Logs', 'Settings'
];

const moduleMap = {
  'My Courses': { endpoint: 'courses', desc: 'View your courses and learning resources.' },
  Lessons: { endpoint: 'courses', desc: 'Access lessons linked to your courses.' },
  Progress: { endpoint: 'submissions', desc: 'Track your learning and assessment progress.' },
  Attendance: { endpoint: 'attendance', desc: 'Review attendance records.' },
  Assessments: { endpoint: 'assessments', desc: 'Review assessments and due dates.' },
  Submissions: { endpoint: 'submissions', desc: 'Review your assessment submissions.' },
  Feedback: { endpoint: 'feedback', desc: 'Review feedback released to you.' },
  Payments: { endpoint: 'payments', desc: 'Review recorded payments.' },
  Invoices: { endpoint: 'invoices', desc: 'Review your invoices.' },
  Certificates: { endpoint: 'certificates', desc: 'Review issued certificates.' },
  Profile: { endpoint: 'users', desc: 'Review your account profile.' },
  Users: { endpoint: 'users', desc: 'Manage academy user accounts.' },
  Roles: { endpoint: 'users', desc: 'Review user access roles.' },
  Applications: { endpoint: 'applications', desc: 'Manage learner applications.' },
  Programmes: { endpoint: 'programmes', desc: 'Manage academy programmes.' },
  Courses: { endpoint: 'courses', desc: 'Manage courses and publication status.' },
  Cohorts: { endpoint: 'cohorts', desc: 'Manage learner groups and intakes.' },
  Marking: { endpoint: 'submissions', desc: 'Review and mark submissions.' },
  Moderation: { endpoint: 'assessments', desc: 'Review assessment moderation.' },
  Finance: { endpoint: 'invoices', desc: 'Manage finance records.' },
  Notifications: { endpoint: 'notifications', desc: 'Manage learner notifications.' },
  'Audit Logs': { endpoint: 'auditLogs', desc: 'Review recorded system activity.' }
};

const iconFor = label => ({
  Overview: LayoutDashboard,
  'My Courses': BookOpen,
  Lessons: BookOpen,
  Progress: ChartNoAxesCombined,
  Attendance: CalendarCheck,
  Assessments: ClipboardCheck,
  Submissions: FileText,
  Feedback: MessageSquare,
  Payments: CreditCard,
  Invoices: FileText,
  Certificates: Award,
  Profile: Users,
  Users,
  Roles: ShieldCheck,
  Applications: FileText,
  Programmes: Layers3,
  Courses: BookOpen,
  Cohorts: Users,
  Marking: ClipboardCheck,
  Moderation: CheckCircle2,
  Finance: CreditCard,
  Reports: ChartNoAxesCombined,
  Notifications: Bell,
  'Audit Logs': Activity,
  Settings
})[label] || CircleHelp;

const isAdminRole = role =>
  ['admin', 'administrator', 'super_admin'].includes(
    String(role || '').toLowerCase()
  );

const slug = value =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function api(path, { token, ...options } = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const result = response.status === 204
    ? null
    : await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result?.error || `Request failed (${response.status})`);
  }

  return result;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState(() => {
    let user = null;

    try {
      user = JSON.parse(localStorage.getItem('gta_user') || 'null');
    } catch {
      user = null;
    }

    return {
      token: localStorage.getItem('gta_token') || '',
      user
    };
  });

  const [page, setPage] = useState('Home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');

 useEffect(() => {
  
if (location.pathname === '/learner/login') {
  setPage('Learner Login');
  return;
}

if (location.pathname === '/admin/login') {
  setPage('Admin Login');
  return;
}

if (location.pathname === '/learner/forgot-password') {
  setPage('Forgot Password');
  return;
}

if (location.pathname === '/learner/reset-password') {
  setPage('Reset Password');
  return;
}
  const path = location.pathname.split('/').filter(Boolean);
  const last = path[path.length - 1] || '';

  if (!last) {
    setPage('Home');
    return;
  }

  if (last === 'login') {
    setPage('Sign In');
    return;
  }

  if (last === 'register') {
    setPage('Register');
    return;
  }

  if (last === 'learner') {
    setPage('Learner Portal');
    return;
  }

  if (last === 'admin') {
    setPage('Admin Portal');
    return;
  }

  if (last === 'portal') {
    setPage('Portal');
    return;
  }

  // Course details route, e.g. /course/cloud-administrator
  if (path[0] === 'course' && path[1]) {
    setPage('Course Details');
    return;
  }

  // Existing public pages and portal navigation
  const found = [...publicPages, ...learnerItems, ...adminItems]
    .find(item => slug(item) === last);

  if (found) {
    setPage(found);
  }
}, [location.pathname]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const go = target => {
    setPage(target);
    setMobileOpen(false);

    const special = {
     'Learner Portal': '/learner',
  'Admin Portal': '/admin',
  'Learner Login': '/learner/login',
  'Admin Login': '/admin/login',
  'Forgot Password': '/learner/forgot-password',
  'Reset Password': '/learner/reset-password',
  'Sign In': '/login',
  'Sign Out': '/login',
  Portal: '/portal',
  Register: '/register'
    };

    if (special[target]) {
      navigate(special[target]);
    } else if (
      session.user &&
      (learnerItems.includes(target) || adminItems.includes(target))
    ) {
      const base = isAdminRole(session.user.role) ? '/admin' : '/learner';
      navigate(`${base}/${slug(target)}`);
    } else {
      navigate(target === 'Home' ? '/' : `/${slug(target)}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onLogin = result => {
    localStorage.setItem('gta_token', result.token);
    localStorage.setItem('gta_user', JSON.stringify(result.user));

    setSession(result);
    setToast(`Welcome, ${result.user.name}`);

    const admin = isAdminRole(result.user.role);
    navigate(admin ? '/admin' : '/learner');
  };

  const logout = async () => {
    try {
      if (session.token) {
        await api('/auth/logout', {
          token: session.token,
          method: 'POST'
        });
      }
    } catch (error) {
      console.warn('Server sign-out request failed:', error.message);
    }

    localStorage.removeItem('gta_token');
    localStorage.removeItem('gta_user');
    setSession({ token: '', user: null });
    setToast('You have signed out.');
    navigate('/');
  };

  const protectedPage =
    learnerItems.includes(page) ||
    adminItems.includes(page) ||
    page === 'Learner Portal' ||
    page === 'Admin Portal';

  useEffect(() => {
    if (!protectedPage) return;

    if (!session.token || !session.user) {
      navigate('/login');
      return;
    }

    const admin = isAdminRole(session.user.role);
    const allowedItems = admin ? adminItems : learnerItems;
    const correctPortal = admin ? '/admin' : '/learner';
    const path = location.pathname;

    const wrongPortal =
      (page === 'Admin Portal' && !admin) ||
      (page === 'Learner Portal' && admin);

    const wrongModule =
      !['Admin Portal', 'Learner Portal'].includes(page) &&
      !allowedItems.includes(page);

    const wrongPath =
      (path.startsWith('/admin') && !admin) ||
      (path.startsWith('/learner') && admin);

    if (wrongPortal || wrongModule || wrongPath) {
      navigate(correctPortal);
    }
  }, [
    protectedPage,
    session.token,
    session.user,
    page,
    location.pathname,
    navigate
  ]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="icon-button mobile-toggle"
          onClick={() => setMobileOpen(value => !value)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>

       
<button className="brand" onClick={() => go('Home')}>
  <img
  src="/images/global-tech-academy-logo.png"
  alt="Global Tech Academy Logo"
  className="brand-mark"
/>
  <span>
    <b>GLOBAL TECH</b>
    <small>ACADEMY</small>
  </span>
</button>


        <nav className={`main-nav ${mobileOpen ? 'nav-open' : ''}`}>
          {['Home', 'About', 'Services', 'Programme Course', 'Impact', 'Portfolio', 'Contact'].map(item => (
            <button
              key={item}
              className={page === item ? 'active' : ''}
              onClick={() => go(item)}
            >
              {item}
            </button>
          ))}

         
<div className="portal-menu">
  <button
    type="button"
    className={
      ['Portal', 'Learner Portal', 'Admin Portal'].includes(page)
        ? 'active'
        : ''
    }
    aria-haspopup="true"
  >
    Portal <ChevronDown size={15} />
  </button>

  <div className="portal-dropdown">
    <button onClick={() => go('Learner Login')}>
      Learner Portal
    </button>

    <button onClick={() => go('Admin Login')}>
      Admin Portal
    </button>
  </div>
</div>

        </nav>

        <div className="top-actions">
          {session.user ? (
            <>
              <span className="user-chip">
                <span className="avatar">
                  {session.user.name?.slice(0, 1).toUpperCase()}
                </span>
                <span>{session.user.name}</span>
              </span>
              <button className="button button-outline button-small" onClick={logout}>
                <LogOut size={15} /> Sign out
              </button>
            </>

          ) : (
            <button
              className="button button-gold button-small"
              onClick={() => go('Register')}
            >
              Apply now <ArrowRight size={15} />
            </button>
          )}

        </div>
      </header>

      <main>
       
{page === 'Learner Login' ? (
  <AuthPage
    mode="learner-login"
    onSuccess={onLogin}
    go={go}
  />
) : page === 'Admin Login' ? (
  <AuthPage
    mode="admin-login"
    onSuccess={onLogin}
    go={go}
  />
) : page === 'Forgot Password' ? (
  <AuthPage
    mode="forgot"
    go={go}
  />
) : page === 'Reset Password' ? (
  <AuthPage
    mode="reset"
    go={go}
    resetToken={new URLSearchParams(location.search).get('token') || ''}
  />
) : page === 'Register' ? (
  <AuthPage
    mode="register"
    onSuccess={onLogin}
    go={go}
  />
) : protectedPage ? (

          <PortalPage
            page={page}
            session={session}
            go={go}
            notify={setToast}
            logout={logout}
          />
        ) : (
          <PublicPage
  page={page}
  go={go}
  notify={setToast}
  courseSlug={location.pathname.split('/')[2] || ''}
/>
        )}
      </main>

     <footer className="footer">
  <div className="footer-main">
    <div className="footer-brand">
      <div className="academy-brand">
        <img
          src="/images/global-tech-academy-logo.png"
          alt="Global Tech Academy logo"
          className="academy-logo"
        />
        <div>
          <b>GLOBAL TECH ACADEMY</b>
          <p>Building skills. Creating futures.</p>
        </div>
</div>
          </div>

          <p>Practical digital skills, career pathways and technology-enabled learning.</p>

          <div className="footer-links">
            {['About', 'Services', 'Programme Course', 'Contact', 'Privacy'].map(item => (
              <button key={item} onClick={() => go(item)}>{item}</button>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Global Tech Academy. All rights reserved.</span>
          <span>Learn · Build · Certify · Work</span>
        </div>
      </footer>

      {toast && (
        <div className="toast">
          <CheckCircle2 size={18} />
          {toast}
          <button onClick={() => setToast('')} aria-label="Dismiss notification">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function PublicPage({ page, go, notify, courseSlug = '' }) {
  const [programmes, setProgrammes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [contact, setContact] = useState({
    name: '', email: '', subject: '', message: ''
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      api('/public/programmes'),
      api('/public/courses')
    ]).then(([programmesResult, coursesResult]) => {
      if (cancelled) return;

      if (programmesResult.status === 'fulfilled') {
        setProgrammes(Array.isArray(programmesResult.value) ? programmesResult.value : []);
      }

      if (coursesResult.status === 'fulfilled') {
        setCourses(Array.isArray(coursesResult.value) ? coursesResult.value : []);
      }
    });

    return () => { cancelled = true; };
  }, []);

  const submitContact = async event => {
    event.preventDefault();
    setBusy(true);

    try {
      await api('/public/contact', {
        method: 'POST',
        body: JSON.stringify(contact)
      });
      notify('Thank you. Your enquiry has been received.');
      setContact({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      notify(error.message);
    } finally {
      setBusy(false);
    }
  };

  if (page === 'Contact') {
    return (
      <section className="section contact-layout">
        <div>
          <p className="eyebrow">LET'S CONNECT</p>
          <h1>Start a conversation.</h1>
          <p className="lead">Tell us what you want to learn, build or achieve.</p>
          <div className="contact-card">
            <MessageSquare />
            <div><b>General enquiries</b><p>info@globaltechacademy.co.za</p></div>
          </div>
        </div>

        <form className="form-card" onSubmit={submitContact}>
          <h2>Send an enquiry</h2>
          <label>Full name
            <input required value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} />
          </label>
          <label>Email address
            <input required type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
          </label>
          <label>Subject
            <input value={contact.subject} onChange={e => setContact({ ...contact, subject: e.target.value })} />
          </label>
          <label>Message
            <textarea required rows="5" value={contact.message} onChange={e => setContact({ ...contact, message: e.target.value })} />
          </label>
          <button className="button button-gold" disabled={busy}>
            {busy ? 'Sending…' : 'Send message'} <ArrowRight size={16} />
          </button>
        </form>
      </section>
    );
  }

  if (page === 'Portal') {
    return (
      <section className="section portal-choice">
        <p className="eyebrow">ACADEMY PORTALS</p>
        <h1>Your learning. Your progress.</h1>
        <p className="lead">Choose the portal for your account.</p>
        <div className="portal-choice-grid">
          <article className="choice-card">
            <GraduationCap />
            <h2>Learner Portal</h2>
            <p>Access courses, assessments, attendance and certificates.</p>
            <button className="button button-gold" onClick={() => go('Learner Login')}>
              Open learner portal <ArrowRight size={16} />
            </button>
          </article>
          <article className="choice-card">
            <ShieldCheck />
            <h2>Admin Portal</h2>
            <p>Manage users, programmes, courses, reports and settings.</p>
           <button className="button button-dark" onClick={() => go('Admin Login')}>
              Open admin portal <ArrowRight size={16} />
            </button>
          </article>
        </div>
      </section>
    );
  }

  if (page === 'Programme Course' || page === 'Services') {
    const activeProgrammes = programmes.filter(
      item => !item.status || String(item.status).toLowerCase() === 'active'
    );

    return (
      <>
        <section className="page-hero">
          <p className="eyebrow">LEARNING THAT MOVES YOU FORWARD</p>
          <h1>{page === 'Services' ? 'Skills for the world of work.' : 'Find your next learning pathway.'}</h1>
          <p className="lead">Practical, technology-focused programmes designed to help learners build skills and confidence.</p>
          <button className="button button-gold" onClick={() => go('Register')}>
            Explore enrolment <ArrowRight size={17} />
          </button>
        </section>

        <section className="section">
          <div className="section-heading">
            <div><p className="eyebrow">OUR TRAINING PROGRAMMES</p><h2>Explore our programmes.</h2></div>
            <span className="muted">{activeProgrammes.length} programmes available</span>
          </div>

          <div className="course-grid">
            {activeProgrammes.map(item => (
              <article className="course-card" key={item.id}>
                <div className="course-icon"><Layers3 /></div>
                <span className="pill">{item.code || 'PROGRAMME'}</span>
                <h3>{item.name}</h3>
                <p>{item.description || 'Practical training and applied learning.'}</p>
                <div className="course-meta">
                  <span>{item.duration || 'Flexible learning'}</span>
                  <span>{item.status || 'Active'}</span>
                </div>
                <button className="text-link" onClick={() => go('Register')}>
                  Enquire / apply <ArrowRight size={15} />
                </button>
              </article>
            ))}
            {!activeProgrammes.length && <p className="muted">No active programmes are currently available.</p>}
          </div>
        </section>
      </>
    );
  }

  const content = {
    Home: {
      eyebrow: 'LEARN · BUILD · CERTIFY · WORK',
      title: 'Build skills. Create your future.',
      text: 'A practical learning environment connecting digital skills, real-world projects and pathways into work.',
      cta: 'Explore programmes'
    },
    About: {
      eyebrow: 'ABOUT THE ACADEMY',
      title: 'Learning with purpose. Skills with impact.',
      text: 'Global Tech Academy supports learners through practical digital education, applied technology and career-focused learning.',
      cta: 'Explore programmes'
    },
    Impact: {
      eyebrow: 'OUR IMPACT',
      title: 'Skills that open possibilities.',
      text: 'We aim to make technology learning accessible and relevant to community and employment needs.',
      cta: 'Explore programmes'
    },
    Portfolio: {
      eyebrow: 'PROJECTS & PORTFOLIO',
      title: 'Turn learning into real work.',
      text: 'Build practical projects, document your progress and showcase the skills you develop.',
      cta: 'Start your journey'
    },
    Privacy: {
      eyebrow: 'PRIVACY & DATA',
      title: 'Your information matters.',
      text: 'Before launch, publish a reviewed privacy notice explaining lawful purpose, retention, access, security and applicable POPIA obligations.',
      cta: 'Contact us'
    }
  };

  const item = content[page] || content.Home;

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow"><span className="eyebrow-line" />{item.eyebrow}</p>
          <h1>{item.title}</h1>
          <p className="hero-lead">{item.text}</p>
          <div className="hero-actions">
            <button className="button button-gold" onClick={() => go(page === 'Privacy' ? 'Contact' : 'Programme Course')}>
              {item.cta} <ArrowRight size={17} />
            </button>
            <button className="button button-outline" onClick={() => go('About')}>Discover our approach</button>
          </div>
          <div className="hero-proof">
            <div className="proof-avatars"><span>G</span><span>T</span><span>A</span></div>
            <p><b>Learn by doing.</b><br /><span>Skills for today and tomorrow.</span></p>
          </div>
        </div>

        <div className="hero-art">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-center"><span className="art-g">G</span><span>TECH<br />ACADEMY</span></div>
          <div className="floating-card float-top"><BookOpen /><div><b>Learn</b><small>Build your foundation</small></div></div>
          <div className="floating-card float-right"><Award /><div><b>Certify</b><small>Show what you know</small></div></div>
          <div className="floating-card float-bottom"><ChartNoAxesCombined /><div><b>Progress</b><small>Track your journey</small></div></div>
        </div>
      </section>

      <section className="stats-strip">
        <div><b>01</b><span>Practical learning</span></div>
        <div><b>02</b><span>Digital skills</span></div>
        <div><b>03</b><span>Career pathways</span></div>
        <div><b>04</b><span>Community impact</span></div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div><p className="eyebrow">WHY GLOBAL TECH ACADEMY</p><h2>Learn skills you can put to work.</h2></div>
          <p className="section-intro">A learner-centred experience combining structured learning, practical application and support.</p>
        </div>
        <div className="feature-grid">
          <Feature icon={<BookOpen />} number="01" title="Learn" text="Structured programmes and relevant learning resources." />
          <Feature icon={<BriefcaseBusiness />} number="02" title="Build" text="Hands-on activities that help learners practise their skills." />
          <Feature icon={<Award />} number="03" title="Certify" text="Track progress and manage assessment outcomes." />
          <Feature icon={<Activity />} number="04" title="Advance" text="Build a portfolio and work towards future opportunities." />
        </div>
      </section>

      <section className="cta-band">
        <div><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2>Ready to build your future?</h2><p>Explore programmes or register your interest.</p></div>
        <button className="button button-gold" onClick={() => go('Register')}>Register your interest <ArrowRight size={16} /></button>
      </section>
    </>
  );
}

function Feature({ icon, number, title, text }) {
  return (
    <article className="feature-card">
      <div className="feature-top"><span>{icon}</span><small>{number}</small></div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}


function AuthPage({ mode, onSuccess, go, resetToken = '' }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const register = mode === 'register';
  const learnerLogin = mode === 'learner-login';
  const adminLogin = mode === 'admin-login';
  const forgot = mode === 'forgot';
  const reset = mode === 'reset';
  const login = learnerLogin || adminLogin || (!register && !forgot && !reset);

  const title = register
    ? 'Create your learner account'
    : learnerLogin
      ? 'Learner sign in'
      : adminLogin
        ? 'Administrator sign in'
        : forgot
          ? 'Forgot your password?'
          : reset
            ? 'Create a new password'
            : 'Sign in to your portal';

  const submit = async event => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    try {
      if (forgot) {
        await api('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email: form.email })
        });

        setMessage(
          'If an account exists for that email, password-reset instructions will be sent.'
        );
        return;
      }

      if (reset) {
        if (!resetToken) {
          throw new Error(
            'The reset token is missing. Please open the password-reset link from your email.'
          );
        }

        if (form.newPassword.length < 10) {
          throw new Error('Your new password must contain at least 10 characters.');
        }

        if (form.newPassword !== form.confirmPassword) {
          throw new Error('The passwords do not match.');
        }

        await api('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({
            token: resetToken,
            password: form.newPassword
          })
        });

        setMessage('Your password has been reset. You can now sign in.');
        return;
      }

      const result = await api(
        register ? '/auth/register' : '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({
            ...(register ? { name: form.name } : {}),
            email: form.email,
            password: form.password
          })
        }
      );

      if (!result?.token || !result?.user) {
        throw new Error('The server did not return a valid login session.');
      }

      if (register && isAdminRole(result.user.role)) {
        throw new Error(
          'Public registration must not create administrator accounts.'
        );
      }

      if (learnerLogin && isAdminRole(result.user.role)) {
        throw new Error(
          'This is a learner login page. Please use the administrator login.'
        );
      }

      if (adminLogin && !isAdminRole(result.user.role)) {
        throw new Error(
          'This account does not have administrator access.'
        );
      }

      onSuccess(result);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-wrap">
      <div className="auth-aside">
        <img
          src="/images/global-tech-academy-logo.png"
          alt="Global Tech Academy Logo"
          className="brand-mark"
        />

        <p className="eyebrow">GLOBAL TECH ACADEMY</p>
        <h1>
          {register
            ? 'Start your learning journey.'
            : forgot
              ? 'Let’s get you back on track.'
              : reset
                ? 'Secure your account.'
                : adminLogin
                  ? 'Manage the academy securely.'
                  : 'Welcome back.'}
        </h1>

        <p>
          {register
            ? 'Create your learner account to get started.'
            : forgot
              ? 'Request a secure link to reset your password.'
              : reset
                ? 'Choose a new password for your account.'
                : adminLogin
                  ? 'Sign in with your authorised administrator account.'
                  : 'Sign in to continue your learning journey.'}
        </p>

        <div className="auth-benefits">
          <span><CheckCircle2 /> Secure account access</span>
          <span><CheckCircle2 /> Learning and progress tools</span>
          <span><CheckCircle2 /> Support for your academy journey</span>
        </div>
      </div>

      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">
          {register
            ? 'CREATE ACCOUNT'
            : forgot
              ? 'PASSWORD RECOVERY'
              : reset
                ? 'RESET PASSWORD'
                : adminLogin
                  ? 'ADMINISTRATOR ACCESS'
                  : 'LEARNER ACCOUNT ACCESS'}
        </p>

        <h2>{title}</h2>

        <p className="muted">
          {register
            ? 'Register as a learner to get started.'
            : forgot
              ? 'Enter the email address associated with your account.'
              : reset
                ? 'Choose a strong password you have not used before.'
                : 'Use your academy account details.'}
        </p>

        {register && (
          <label>
            Full name
            <input
              required
              autoComplete="name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
            />
          </label>
        )}

        {!reset && (
          <label>
            Email address
            <input
              required
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
        )}

        {login || register ? (
          <label>
            Password
            <input
              required
              type="password"
              minLength={register ? 10 : 1}
              autoComplete={register ? 'new-password' : 'current-password'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder={register ? 'At least 10 characters' : 'Your password'}
            />
          </label>
        ) : null}

        {reset && (
          <>
            <label>
              New password
              <input
                required
                type="password"
                minLength={10}
                autoComplete="new-password"
                value={form.newPassword}
                onChange={e =>
                  setForm({ ...form, newPassword: e.target.value })
                }
                placeholder="At least 10 characters"
              />
            </label>

            <label>
              Confirm new password
              <input
                required
                type="password"
                minLength={10}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={e =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="Re-enter your new password"
              />
            </label>
          </>
        )}

        {error && <div className="error-message">{error}</div>}

        {message && (
          <div className="success-message" role="status">
            {message}
          </div>
        )}

        <button
          type="submit"
          className="button button-gold full-width"
          disabled={busy}
        >
          {busy
            ? 'Please wait…'
            : register
              ? 'Create learner account'
              : forgot
                ? 'Send reset instructions'
                : reset
                  ? 'Reset password'
                  : 'Sign in'}
          <ArrowRight size={16} />
        </button>

       {learnerLogin && (
  <div className="auth-switch">
    <button type="button" onClick={() => go('Forgot Password')}>
      Forgot password?
    </button>
  </div>
)}
        <div className="auth-switch">
          {reset || forgot ? (
            <>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => go(adminLogin ? 'Admin Login' : 'Learner Login')}
              >
                Back to sign in
              </button>
            </>
          ) : register ? (
            <>
              Already registered?{' '}
              <button type="button" onClick={() => go('Learner Login')}>
                Sign in
              </button>
            </>
          ) : (
            <>
              New to the academy?{' '}
              <button type="button" onClick={() => go('Register')}>
                Create account
              </button>
            </>
          )}
        </div>

        <p className="small-note">
          Administrator accounts must be provisioned securely. Public
          registration must only create learner accounts.
        </p>
      </form>
    </section>
  );
}

function PortalPage({ page, session, go, notify, logout }) {
  const location = useLocation();
  const isAdmin = isAdminRole(session.user?.role);
  const items = isAdmin ? adminItems : learnerItems;

  const [data, setData] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({});

  const active = ['Learner Portal', 'Admin Portal'].includes(page) ? 'Overview' : page;
  const module = moduleMap[active];

  useEffect(() => {
    if (!session.token || active !== 'Overview') return;

    let cancelled = false;
    setLoading(true);
    setError('');

    api(isAdmin ? '/admin/overview' : '/learner/overview', { token: session.token })
      .then(result => {
        if (!cancelled) setOverview(result);
      })
      .catch(error => {
        if (!cancelled) setError(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [session.token, isAdmin, active]);

  useEffect(() => {
    if (!module || !session.token || active === 'Overview') {
      setData([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError('');

    const endpoint = isAdmin
      ? `/admin/${active === 'Audit Logs' ? 'auditLogs' : module.endpoint}`
      : `/learner/${module.endpoint}`;

    api(endpoint, { token: session.token })
      .then(result => {
        if (!cancelled) setData(Array.isArray(result) ? result : []);
      })
      .catch(error => {
        if (!cancelled) {
          setData([]);
          setError(error.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [session.token, active, isAdmin, module?.endpoint]);

  useEffect(() => {
    if (!isAdmin || active !== 'Settings' || !session.token) return;

    api('/admin/settings', { token: session.token })
      .then(result => setSettings(result || {}))
      .catch(error => setError(error.message));
  }, [active, session.token, isAdmin]);

  const filtered = useMemo(
    () => data.filter(item => JSON.stringify(item).toLowerCase().includes(query.toLowerCase())),
    [data, query]
  );

  const closeModal = () => {
    setModal(false);
    setEditingRecord(null);
    setForm({});
  };

  const saveRecord = async event => {
    event.preventDefault();
    if (!isAdmin || !module) return;

    try {
      const endpoint = `/admin/${module.endpoint}`;
      const editing = Boolean(editingRecord);

      await api(editing ? `${endpoint}/${editingRecord.id}` : endpoint, {
        token: session.token,
        method: editing ? 'PATCH' : 'POST',
        body: JSON.stringify(form)
      });

      notify(editing ? 'Record updated successfully.' : 'Record created successfully.');
      closeModal();

      const refreshed = await api(endpoint, { token: session.token });
      setData(Array.isArray(refreshed) ? refreshed : []);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteRecord = async item => {
    if (!isAdmin || !window.confirm('Delete this record? This cannot be undone.')) return;

    try {
      await api(`/admin/${module.endpoint}/${item.id}`, {
        token: session.token,
        method: 'DELETE'
      });

      setData(previous => previous.filter(record => record.id !== item.id));
      notify('Record deleted.');
    } catch (error) {
      setError(error.message);
    }
  };

  const changeRole = async (item, role) => {
    try {
      const updated = await api(`/admin/users/${item.id}/role`, {
        token: session.token,
        method: 'PATCH',
        body: JSON.stringify({ role })
      });

      setData(previous => previous.map(record => record.id === item.id ? updated : record));
      notify('User role updated.');
    } catch (error) {
      setError(error.message);
    }
  };

  const saveSettings = async event => {
    event.preventDefault();

    try {
      const saved = await api('/admin/settings', {
        token: session.token,
        method: 'PUT',
        body: JSON.stringify(settings)
      });

      setSettings(saved || {});
      notify('Settings saved.');
    } catch (error) {
      setError(error.message);
    }
  };

  const reportDownload = async () => {
    try {
      const response = await fetch(`${API}/admin/reports/export.csv`, {
        headers: { Authorization: `Bearer ${session.token}` }
      });

      if (!response.ok) throw new Error('Could not export report.');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'academy-report.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setError(error.message);
    }
  };

  const showAddButton =
    isAdmin &&
    module &&
    !['Reports', 'Settings', 'Audit Logs', 'Roles'].includes(active);

  return (
    <div className="portal-layout">
      <aside className="portal-sidebar">
        <div className="portal-brand">
         <img
  src="/images/global-tech-academy-logo.png"
  alt="Global Tech Academy Logo"
  className="brand-mark"
/>
          <div><b>ACADEMY</b><small>{isAdmin ? 'ADMIN WORKSPACE' : 'LEARNER SPACE'}</small></div>
        </div>

        <div className="sidebar-user">
          <span className="avatar">{session.user?.name?.slice(0, 1).toUpperCase()}</span>
          <div><b>{session.user?.name}</b><small>{session.user?.role?.replace('_', ' ')}</small></div>
        </div>

        <div className="sidebar-label">{isAdmin ? 'MANAGEMENT' : 'MY LEARNING'}</div>

        <nav className="sidebar-nav">
          {items.map(label => {
            const Icon = iconFor(label);

            return (
              <button
                key={label}
                className={active === label ? 'selected' : ''}
                onClick={() => go(label)}
              >
                <Icon size={17} />
                <span>{label}</span>
                {label === 'Notifications' && <i />}
              </button>
            );
          })}
        </nav>

        <button className="sidebar-back" onClick={() => go('Home')}>← Back to website</button>
      </aside>

      <section className="portal-main">
        <div className="portal-topline">
          <div>
            <span className="breadcrumb">{isAdmin ? 'Administration' : 'Learner workspace'} /</span>{' '}
            <b>{active}</b>
          </div>

          <div className="portal-top-actions">
            <span className="status-dot">Online</span>
            <button className="icon-button" title="Notifications" onClick={() => go(isAdmin ? 'Notifications' : 'Feedback')}>
              <Bell size={18} />
            </button>
            <button className="button button-outline button-small" onClick={logout}>
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>

        <div className="portal-content">
          <div className="portal-page-title">
            <div>
              <p className="eyebrow">{isAdmin ? 'ACADEMY MANAGEMENT' : 'LEARNING DASHBOARD'}</p>
              <h1>{active === 'Overview' ? (isAdmin ? 'Admin overview' : 'Your learning overview') : active}</h1>
              <p>{active === 'Overview'
                ? (isAdmin ? 'Monitor activity and manage academy operations.' : 'Welcome back. Review your learning activity.')
                : module?.desc || 'Manage and review academy information.'}</p>
            </div>

            {showAddButton && (
              <button className="button button-gold" onClick={() => {
                setEditingRecord(null);
                setForm({ status: active === 'Programmes' ? 'Active' : '' });
                setModal(true);
              }}>
                + Add record
              </button>
            )}
          </div>

          {error && (
            <div className="error-banner">
              {error} <button onClick={() => setError('')}>Dismiss</button>
            </div>
          )}

          {loading && <div className="loading-line"><span /> Loading your workspace…</div>}

          {active === 'Overview' && (
            isAdmin
              ? <AdminOverview overview={overview} go={go} reportDownload={reportDownload} />
              : <LearnerOverview overview={overview} go={go} />
          )}

          {active === 'Reports' && isAdmin && (
            <>
              <div className="stat-grid">
                <Stat label="Total users" value={overview?.counts?.users ?? '—'} icon={<Users />} />
                <Stat label="Courses" value={overview?.counts?.courses ?? '—'} icon={<BookOpen />} />
                <Stat label="Applications" value={overview?.counts?.applications ?? '—'} icon={<FileText />} />
                <Stat label="Outstanding invoices" value={overview?.counts?.outstandingInvoices ?? '—'} icon={<CreditCard />} />
              </div>
              <div className="panel">
                <div className="panel-head"><h3>Academy report</h3><button className="button button-dark button-small" onClick={reportDownload}>Export CSV</button></div>
                <p className="muted">Review exported data before using it for official reporting.</p>
              </div>
            </>
          )}

          {active === 'Settings' && isAdmin && (
            <form className="panel settings-form" onSubmit={saveSettings}>
              <h3>Academy settings</h3>
              {Object.entries(settings).map(([key, value]) => (
                <label key={key}>
                  {pretty(key)}
                  <input
                    value={String(value ?? '')}
                    onChange={event => setSettings(previous => ({ ...previous, [key]: event.target.value }))}
                  />
                </label>
              ))}
              <button className="button button-gold">Save settings</button>
            </form>
          )}

          {module && !['Overview', 'Reports', 'Settings'].includes(active) && (
            <div className="panel">
              <div className="panel-head">
                <h3>{active} Records</h3>
                <input type="search" placeholder="Search records..." value={query} onChange={event => setQuery(event.target.value)} />
              </div>

              <p>{filtered.length} record(s) found</p>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {getColumns(data).map(column => <th key={column}>{pretty(column)}</th>)}
                      {isAdmin && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(item => (
                      <tr key={item.id}>
                        {getColumns(data).map(column => (
                          <td key={column}>
                            {active === 'Roles' && column === 'role' && isAdmin ? (
                              <select value={item.role || 'learner'} onChange={event => changeRole(item, event.target.value)}>
                                <option value="learner">Learner</option>
                                <option value="facilitator">Facilitator</option>
                                <option value="admin">Admin</option>
                              </select>
                            ) : (
                              String(item[column] ?? '')
                            )}
                          </td>
                        ))}
                        {isAdmin && (
                          <td>
                            {active === 'Programmes' && (
                              <button type="button" className="text-link" onClick={() => {
                                setEditingRecord(item);
                                setForm({
                                  name: item.name || '',
                                  code: item.code || '',
                                  description: item.description || '',
                                  duration: item.duration || '',
                                  status: item.status || 'Active'
                                });
                                setModal(true);
                              }}>Edit</button>
                            )}
                            <button type="button" className="danger-link" onClick={() => deleteRecord(item)}>Delete</button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={Math.max(1, getColumns(data).length + (isAdmin ? 1 : 0))}>No records found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {modal && isAdmin && module && (
            <div className="modal-backdrop" onClick={closeModal}>
              <form className="modal-card" onClick={event => event.stopPropagation()} onSubmit={saveRecord}>
                <div className="panel-head">
                  <h3>{editingRecord ? 'Edit' : 'Add'} {active.toLowerCase()} record</h3>
                  <button type="button" className="icon-button" onClick={closeModal} aria-label="Close form"><X /></button>
                </div>

                {fieldsFor(active).map(field => (
                  <label key={field.key}>
                    {field.label}
                    {field.key === 'status' && active === 'Programmes' ? (
                      <select required value={form.status || 'Active'} onChange={event => setForm({ ...form, status: event.target.value })}>
                        <option value="Active">Active</option>
                        <option value="Not Active">Not Active</option>
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        required={field.required !== false}
                        rows={3}
                        value={form[field.key] || ''}
                        onChange={event => setForm({ ...form, [field.key]: event.target.value })}
                        placeholder={field.placeholder || ''}
                      />
                    ) : (
                      <input
                        required={field.required !== false}
                        type={field.type || 'text'}
                        value={form[field.key] || ''}
                        onChange={event => setForm({ ...form, [field.key]: event.target.value })}
                        placeholder={field.placeholder || ''}
                      />
                    )}
                  </label>
                ))}

                <div className="modal-actions">
                  <button type="button" className="button button-outline" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="button button-gold">{editingRecord ? 'Update record' : 'Save record'}</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function getColumns(items) {
  const preferred = [
    'name', 'title', 'code', 'programme', 'learnerName', 'learnerId',
    'course', 'amount', 'dueDate', 'status', 'role', 'email', 'createdAt'
  ];

  const excluded = [
    'id', 'passwordHash', 'updatedAt', 'description',
    'message', 'settings', 'learnerIds', 'userId'
  ];

  const all = [...new Set(items.flatMap(item => Object.keys(item)))]
    .filter(key => !excluded.includes(key));

  return preferred.filter(key => all.includes(key))
    .concat(all.filter(key => !preferred.includes(key)).slice(0, 3))
    .slice(0, 6);
}

function pretty(value) {
  return value.replace(/([A-Z])/g, ' $1')
    .replace(/^./, character => character.toUpperCase());
}

function fieldsFor(page) {
  const map = {
    Programmes: [
      { key: 'name', label: 'Programme name' },
      { key: 'code', label: 'Programme code' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'duration', label: 'Duration' },
      { key: 'status', label: 'Status' }
    ],
    Courses: [
      { key: 'title', label: 'Course title' },
      { key: 'code', label: 'Course code' },
      { key: 'programme', label: 'Programme' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'status', label: 'Status', placeholder: 'Draft or Published' }
    ],
    Applications: [
      { key: 'name', label: 'Applicant name' },
      { key: 'email', label: 'Applicant email', type: 'email' },
      { key: 'programme', label: 'Programme' },
      { key: 'status', label: 'Status' }
    ],
    Cohorts: [
      { key: 'name', label: 'Cohort name' },
      { key: 'programme', label: 'Programme' },
      { key: 'startDate', label: 'Start date', type: 'date' },
      { key: 'endDate', label: 'End date', type: 'date' },
      { key: 'status', label: 'Status' }
    ],
    Attendance: [
      { key: 'learnerName', label: 'Learner name' },
      { key: 'course', label: 'Course' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'status', label: 'Attendance status' }
    ],
    Assessments: [
      { key: 'title', label: 'Assessment title' },
      { key: 'course', label: 'Course' },
      { key: 'dueDate', label: 'Due date', type: 'date' },
      { key: 'status', label: 'Status' }
    ],
    Submissions: [
      { key: 'title', label: 'Submission title' },
      { key: 'learnerName', label: 'Learner name' },
      { key: 'assessment', label: 'Assessment' },
      { key: 'mark', label: 'Mark', type: 'number', required: false },
      { key: 'feedback', label: 'Feedback', type: 'textarea', required: false },
      { key: 'status', label: 'Status' }
    ],
    Feedback: [
      { key: 'title', label: 'Feedback title' },
      { key: 'learnerName', label: 'Learner name' },
      { key: 'message', label: 'Feedback', type: 'textarea' },
      { key: 'status', label: 'Status' }
    ],
    Payments: [
      { key: 'learnerName', label: 'Learner name' },
      { key: 'reference', label: 'Payment reference' },
      { key: 'amount', label: 'Amount (ZAR)', type: 'number' },
      { key: 'date', label: 'Payment date', type: 'date' },
      { key: 'status', label: 'Status' }
    ],
    Invoices: [
      { key: 'invoiceNumber', label: 'Invoice number' },
      { key: 'learnerName', label: 'Learner name' },
      { key: 'amount', label: 'Amount (ZAR)', type: 'number' },
      { key: 'dueDate', label: 'Due date', type: 'date' },
      { key: 'status', label: 'Status' }
    ],
    Certificates: [
      { key: 'learnerName', label: 'Learner name' },
      { key: 'course', label: 'Course' },
      { key: 'certificateNumber', label: 'Certificate number' },
      { key: 'issueDate', label: 'Issue date', type: 'date' },
      { key: 'status', label: 'Status' }
    ],
    Notifications: [
      { key: 'title', label: 'Notification title' },
      { key: 'message', label: 'Message', type: 'textarea' },
      { key: 'userId', label: 'Recipient user ID (optional)', required: false },
      { key: 'status', label: 'Status' }
    ],
    Users: [
      { key: 'name', label: 'Full name' },
      { key: 'email', label: 'Email address', type: 'email' },
      { key: 'role', label: 'Role', placeholder: 'learner' }
    ]
  };

  return map[page] || [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description', type: 'textarea', required: false },
    { key: 'status', label: 'Status' }
  ];
}

function Stat({ label, value, icon }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span className="stat-label">{label}</span>
      <b>{value}</b>
      <small>Current records</small>
    </div>
  );
}

function AdminOverview({ overview, go, reportDownload }) {
  const counts = overview?.counts || {};

  return (
    <>
      <div className="welcome-banner">
        <div>
          <span className="eyebrow">CONTROL CENTRE</span>
          <h2>Good work starts with clear visibility.</h2>
          <p>Review academy activity and open a management area.</p>
        </div>
        <div className="welcome-symbol"><ChartNoAxesCombined size={42} /></div>
      </div>

      <div className="stat-grid">
        <Stat label="Total users" value={counts.users ?? '—'} icon={<Users />} />
        <Stat label="Active learners" value={counts.learners ?? '—'} icon={<GraduationCap />} />
        <Stat label="Programmes" value={counts.programmes ?? '—'} icon={<Layers3 />} />
        <Stat label="Courses" value={counts.courses ?? '—'} icon={<BookOpen />} />
      </div>

      <div className="dashboard-grid">
        <div className="panel quick-panel">
          <div className="panel-head"><h3>Management shortcuts</h3><span className="pill">Quick access</span></div>
          <div className="quick-grid">
            {['Users', 'Applications', 'Programmes', 'Courses', 'Cohorts', 'Attendance', 'Assessments', 'Marking', 'Finance', 'Reports', 'Notifications', 'Settings'].map(item => {
              const Icon = iconFor(item);
              return (
                <button key={item} onClick={() => go(item)} className="quick-link">
                  <span><Icon size={19} /></span><b>{item}</b><ArrowRight size={15} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel activity-panel">
          <div className="panel-head"><h3>Recent audit activity</h3><button className="text-link" onClick={() => go('Audit Logs')}>View all <ArrowRight size={14} /></button></div>
          {overview?.recentAudit?.length ? overview.recentAudit.slice(0, 6).map(item => (
            <div className="activity-row" key={item.id}>
              <span className="activity-dot" />
              <div><b>{item.action}</b><p>{item.actor} · {item.entity}</p><small>{new Date(item.timestamp).toLocaleString()}</small></div>
            </div>
          )) : (
            <div className="empty-mini"><Activity /><p>Activity appears here as users work in the system.</p></div>
          )}
          <button className="button button-dark full-width" onClick={reportDownload}>Export report CSV</button>
        </div>
      </div>
    </>
  );
}

function LearnerOverview({ overview, go }) {
  const courses = overview?.courses || [];

  return (
    <>
      <div className="welcome-banner learner-welcome">
        <div>
          <span className="eyebrow">YOUR LEARNING JOURNEY</span>
          <h2>Small steps. Real progress.</h2>
          <p>Access your learning tools and keep moving forward.</p>
        </div>
        <div className="welcome-symbol"><GraduationCap size={45} /></div>
      </div>

      <div className="stat-grid">
        <Stat label="Available courses" value={courses.length} icon={<BookOpen />} />
        <Stat label="Assessments" value={overview?.assessments?.length ?? 0} icon={<ClipboardCheck />} />
        <Stat label="Submissions" value={overview?.submissions?.length ?? 0} icon={<FileText />} />
        <Stat label="Certificates" value={overview?.certificates?.length ?? 0} icon={<Award />} />
      </div>

      <div className="dashboard-grid learner-grid">
        <div className="panel">
          <div className="panel-head"><h3>My courses</h3><button className="text-link" onClick={() => go('My Courses')}>View courses <ArrowRight size={14} /></button></div>
          {courses.length ? courses.slice(0, 4).map(course => (
            <div className="course-row" key={course.id}>
              <span className="course-row-icon"><BookOpen /></span>
              <div><b>{course.title || course.name}</b><p>{course.code || 'Programme learning'}</p></div>
              <span className="pill">{course.status || 'Available'}</span>
            </div>
          )) : (
            <div className="empty-state"><BookOpen /><h3>No courses assigned yet</h3><p>Your courses will appear here once your enrolment is confirmed.</p></div>
          )}
        </div>

        <div className="panel">
          <div className="panel-head"><h3>Quick links</h3></div>
          <div className="learner-shortcuts">
            {['Lessons', 'Progress', 'Attendance', 'Assessments', 'Submissions', 'Feedback', 'Payments', 'Invoices', 'Certificates', 'Profile'].map(item => {
              const Icon = iconFor(item);
              return <button key={item} onClick={() => go(item)}><Icon size={17} />{item}<ArrowRight size={14} /></button>;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
