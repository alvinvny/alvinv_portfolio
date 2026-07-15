import { useState, useEffect, useRef } from 'react'
import selfImg from './logos/self.jpg'
import farmingdaleLogo from './logos/farmingdale.png'
import nassauLogo from './logos/nassau.png'
import northwellLogo from './logos/northwell.png'
import parkerLogo from './logos/parker-jewish.png'
import sreyoLogo from './logos/sreyo.png'
import walgreensLogo from './logos/walgreens.png'
import mb1Before from './restorations/macbook1-after-booted.jpg'
import mb1After from './restorations/macbook1-before-cracked.png'
import mb1Working from './restorations/macbook1-after-working.png'
import mb2Error from './restorations/macbook2-error-nobootdevice.png'
import mb2Logo from './restorations/macbook2-boot-apple-logo.png'
import mb2Setup from './restorations/macbook2-setup-screen.png'
import soleSwapImg from './projects/sole-swap.png'
import resumePng from './resume/Alvin_Varughese_Resume.png'
import './App.css'

const roles = [
  "Open to Entry-Level IT & Healthcare IT Roles",
  "B.S. in Computer Programming & Information Systems",
  "Administrative Support Assistant @ Northwell Health",
]

function RoleMonitor() {
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % roles.length)
        setFading(false)
      }, 300)
    }, 3800)
    return () => clearInterval(interval)
  }, [])

  return (
    <p className="tag monitor-readout">
      <span className="monitor-blip" />
      <span className={`monitor-text ${fading ? 'fading' : ''}`}>
        {roles[index]}
      </span>
    </p>
  )
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="scroll-progress-track">
      <div className="scroll-progress-fill" style={{ width: `${progress}%` }} />
    </div>
  )
}

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${visible ? 'reveal-visible' : ''}`}>
      {children}
    </div>
  )
}

function SessionUptime() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const format = (total: number) => {
    const h = Math.floor(total / 3600).toString().padStart(2, '0')
    const m = Math.floor((total % 3600) / 60).toString().padStart(2, '0')
    const s = Math.floor(total % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  return (
    <p className="session-uptime">
      <span className="monitor-blip" />
      SESSION UPTIME: {format(seconds)}
    </p>
  )
}

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  )
}

type RestorationSlide = { src: string; alt: string; tag: string; tagClass: 'before' | 'after' }
type RestorationBullet = { label: string; text: string }
type RestorationProject = {
  id: string
  title: string
  summary: string
  slides: RestorationSlide[]
  bullets: RestorationBullet[]
  tags: string[]
}

function ResumeLightbox({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div className="lightbox-content resume-lightbox" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <img className="resume-preview-img" src={resumePng} alt="Alvin Varughese resume" />
      </div>
    </div>
  )
}

function RestorationLightbox({
  project,
  onClose,
}: {
  project: RestorationProject
  onClose: () => void
}) {
  const slides = project.slides
  const [index, setIndex] = useState(0)

  const next = () => setIndex((i) => (i + 1) % slides.length)
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="carousel">
          <button className="carousel-arrow prev" onClick={prev} aria-label="Previous image">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div className="carousel-image-wrap">
            <img src={slides[index].src} alt={slides[index].alt} />
            <span className={`restoration-tag ${slides[index].tagClass}`}>{slides[index].tag}</span>
          </div>

          <button className="carousel-arrow next" onClick={next} aria-label="Next image">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="carousel-dots">
          {slides.map((s, i) => (
            <button
              key={s.tag}
              className={`carousel-dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Show ${s.tag} image`}
            />
          ))}
        </div>

        <div className="restoration-details">
          <h3>{project.title}</h3>
          <ul>
            {project.bullets.map((b) => (
              <li key={b.label}><strong>{b.label}:</strong> {b.text}</li>
            ))}
          </ul>
          <div className="pills">
            {project.tags.map((t) => (
              <span className="pill" key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function RestorationCard({
  project,
  onClick,
}: {
  project: RestorationProject
  onClick: () => void
}) {
  return (
    <div className="restoration-card" onClick={onClick} role="button" tabIndex={0}>

      <div className="restoration-images">
        {project.slides.map((s, i) => (
          <div className="restoration-image-block" key={s.tag}>
            <img src={s.src} alt={s.alt} />
            {i === 0 && project.slides[1] && (
              <img
                className="restoration-crossfade"
                src={project.slides[1].src}
                alt={project.slides[1].alt}
              />
            )}
            <span className={`restoration-tag ${s.tagClass}`}>{s.tag}</span>
            {i === 0 && project.slides[1] && (
              <span className="restoration-tag after crossfade-tag">{project.slides[1].tag}</span>
            )}
          </div>
        ))}
      </div>

      <div className="restoration-details">
        <div className="restoration-heading-row">
          <h3>{project.title}</h3>
          <span className="expand-hint">Click to expand ↗</span>
        </div>
        <p className="restoration-preview">{project.summary}</p>
      </div>

    </div>
  )
}

function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [active, setActive] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setActive(!!target.closest('a, button, .card, .pill, .social-btn, .entry-card, .cert-card, .back-to-top, .restoration-card, .lightbox-close, .carousel-arrow, .carousel-dot, .skill-group, .theme-toggle, .hamburger-btn'))
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [])

  return (
    <div
      className={`custom-cursor ${active ? 'active' : ''}`}
      style={{ left: pos.x, top: pos.y }}
    />
  )
}

const restorationProjects: RestorationProject[] = [
  {
    id: 'mb1',
    title: 'MacBook Air — Cracked Display Replacement',
    summary: 'Purchased damaged with a fully cracked display, repaired with a full assembly replacement, and returned to a clean, working boot.',
    slides: [
      { src: mb1Before, alt: 'MacBook Air before repair, showing display damage', tag: 'Before', tagClass: 'before' },
      { src: mb1After, alt: 'MacBook Air after repair, display and body restored', tag: 'Repaired', tagClass: 'after' },
      { src: mb1Working, alt: 'MacBook Air powered on and running with no defects', tag: 'No Defects', tagClass: 'after' },
    ],
    bullets: [
      { label: 'Issue', text: 'Purchased as damaged — display had severe cracking with visible discoloration and distorted lines across the panel, unusable as-is.' },
      { label: 'Diagnosis', text: 'Inspected the panel and confirmed the damage was isolated to the display assembly, with the logic board and other internals unaffected.' },
      { label: 'Repair', text: 'Replaced the full display assembly, reseated internal cabling, and tested the unit through a full boot cycle to confirm stability.' },
      { label: 'Outcome', text: 'Fully functional MacBook Air, clean boot with no display artifacts, resold after a full diagnostic and cleaning pass.' },
    ],
    tags: ['Display Replacement', 'Hardware Diagnostics', 'macOS Setup'],
  },
  {
    id: 'mb2',
    title: 'MacBook Air — Startup Error Device / Clean OS Reinstall',
    summary: 'Bought after it powered on to a startup error, then brought back to life with a clean macOS reinstall through Recovery Mode.',
    slides: [
      { src: mb2Error, alt: 'MacBook Air showing a folder with question mark and startup error on startup', tag: 'Before', tagClass: 'before' },
      { src: mb2Logo, alt: 'MacBook Air booting into macOS Recovery to reinstall the operating system', tag: 'Reinstalling', tagClass: 'after' },
      { src: mb2Setup, alt: 'MacBook Air at the macOS setup screen after a clean reinstall', tag: 'Set Up', tagClass: 'after' },
    ],
    bullets: [
      { label: 'Issue', text: 'Powered on to a flashing folder-with-question-mark icon and a startup error message — meaning macOS couldn\'t be found or loaded from the internal drive.' },
      { label: 'Diagnosis', text: 'Confirmed the SSD itself was present and healthy; the operating system installation was missing or corrupted rather than a hardware failure.' },
      { label: 'Repair', text: 'Booted into macOS Recovery Mode and performed a clean reinstall of macOS directly over the internet.' },
      { label: 'Outcome', text: 'Laptop booted cleanly to the macOS setup screen, fully functional and ready to configure for a new owner.' },
    ],
    tags: ['macOS Recovery Mode', 'Clean OS Install', 'Boot Diagnostics'],
  },
]

function BootSequence({ onDone }: { onDone: () => void }) {
  const lines = [
    'Loading profile...',
    'Verifying credentials...',
    'Checking systems...',
    'Systems nominal.',
  ]
  const [shown, setShown] = useState<number>(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (shown < lines.length) {
      const t = setTimeout(() => setShown((s) => s + 1), 320)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setFadeOut(true), 350)
      const t2 = setTimeout(onDone, 750)
      return () => {
        clearTimeout(t)
        clearTimeout(t2)
      }
    }
  }, [shown])

  return (
    <div className={`boot-sequence ${fadeOut ? 'fade-out' : ''}`}>
      <div className="boot-lines">
        {lines.slice(0, shown).map((line, i) => (
          <p key={i} className="boot-line">
            <span className="boot-prompt">$</span> {line}
          </p>
        ))}
      </div>
    </div>
  )
}

function ThemeToggle({
  theme,
  setTheme,
}: {
  theme: 'dark' | 'light'
  setTheme: (t: 'dark' | 'light') => void
}) {
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <svg
        className={`theme-icon sun ${theme === 'dark' ? 'visible' : ''}`}
        viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <svg
        className={`theme-icon moon ${theme === 'light' ? 'visible' : ''}`}
        viewBox="0 0 24 24" width="16" height="16" fill="currentColor"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  )
}

function App() {
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const [selectedSkillGroup, setSelectedSkillGroup] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark'
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
    return prefersLight ? 'light' : 'dark'
  })
  const [booting, setBooting] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <main>

      {booting && <BootSequence onDone={() => setBooting(false)} />}

      <CustomCursor />
      <ScrollProgress />
      <BackToTop />

      {/* NAV */}
      <nav className="top-nav">
        <div className={`nav-inner ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>About Me</a>
          <a href="#education" onClick={() => setMobileMenuOpen(false)}>Education</a>
          <a href="#experience" onClick={() => setMobileMenuOpen(false)}>Experience</a>
          <a href="#certificates" onClick={() => setMobileMenuOpen(false)}>Certificates</a>
          <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
          <a href="#restorations" onClick={() => setMobileMenuOpen(false)}>Restorations</a>
          <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </div>
        <div className="nav-controls">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section" id="about">

        <div className="photo-ring">
          <img
            className="profile-photo"
            src={selfImg}
            alt="Alvin Varughese"
          />
        </div>

        <h1>Alvin Varughese</h1>

        <RoleMonitor />

        <p className="intro">
          My interest in tech started at home, long before it became a
          career. Growing up, I was always the person friends and family
          called when something broke such as phones, laptops, TVs, home
          cameras, you name it. Setting up new devices, keeping old PCs
          running smoothly, and giving honest advice on what's worth buying
          (and what to avoid) came naturally, and it grew into a real
          passion for troubleshooting and systems support. That same drive
          now shapes my professional focus: pairing hands-on healthcare
          experience with technical skills in IT support and
          infrastructure to help organizations run more smoothly.
        </p>

        <div className="buttons">
          <button
            className="primary"
            onClick={() => setResumeOpen(true)}
          >
            View Resume
          </button>
          <a
            className="secondary"
            href={resumePng}
            download="Alvin_Varughese_Resume.png"
          >
            Download Resume
          </a>
        </div>

        <div className="vitals-strip">
          <div className="vital">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span className="vital-value">4+ yrs</span>
            <span className="vital-label">Hands-on IT & Healthcare</span>
          </div>
          <div className="vital">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4.5 8-11.8V5l-8-3-8 3v5.2C4 17.5 12 22 12 22z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span className="vital-value">HIPAA</span>
            <span className="vital-label">Compliant Systems</span>
          </div>
          <div className="vital">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M9 9h6v6H9z" />
              <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
            </svg>
            <span className="vital-value">3</span>
            <span className="vital-label">IT Certificates Earned</span>
          </div>
        </div>

        <SessionUptime />

      </section>

      {/* EDUCATION */}
      <Reveal>
      <section id="education">

        <p className="eyebrow">Education</p>

        <div className="entry-card">
          <div className="entry-header">
            <img className="entry-logo" src={farmingdaleLogo} alt="Farmingdale State College logo" />
            <div className="entry-titles">
              <h3>Farmingdale State College</h3>
              <p className="role">B.S. Computer Programming & Information Systems</p>
            </div>
            <div className="entry-date">
              <span>Aug 2021 – May 2024</span>
              <span className="entry-sub">President's List · Dean's List</span>
            </div>
          </div>
          <div className="coursework">
            <span className="coursework-label">Coursework</span>
            <div className="pills">
              <span className="pill">AWS</span>
              <span className="pill">Computer Programming 1 & 2</span>
              <span className="pill">Data Structures & Algorithms I</span>
              <span className="pill">Information Security</span>
              <span className="pill">Management Information Systems</span>
              <span className="pill">Software Engineering</span>
              <span className="pill">Systems Analysis & Design</span>
              <span className="pill">Unix Operating Systems</span>
              <span className="pill">Virtualization & Cloud Computing</span>
              <span className="pill">Web Database Development</span>
            </div>
          </div>
        </div>

        <div className="entry-card">
          <div className="entry-header">
            <img className="entry-logo" src={nassauLogo} alt="Nassau Community College logo" />
            <div className="entry-titles">
              <h3>Nassau Community College</h3>
              <p className="role">Associate of Arts — Liberal Arts and Sciences</p>
            </div>
          </div>
        </div>

      </section>
      </Reveal>

      {/* EXPERIENCE */}
      <Reveal>
      <section id="experience">

        <p className="eyebrow">Experience</p>

        <div className="numbered-timeline">

        <div className="timeline-entry">
          <div className="timeline-marker">
            <img className="timeline-logo" src={northwellLogo} alt="Northwell Health logo" />
          </div>
          <div className="timeline-body">
            <span className="timeline-date">Dec 2025 – Present</span>
            <h3>Administrative Support Assistant</h3>
            <p className="timeline-company">Northwell Health</p>
            <ul>
              <li>Support daily operations of a busy outpatient urology clinic, working closely with physicians, nurses, and clinical staff.</li>
              <li>Manage patient-facing workflows: check-in/check-out, phone communications, scheduling, and insurance verification in compliance with HIPAA.</li>
              <li>Maintain and organize electronic patient records and confidential documentation using Northwell systems.</li>
              <li>Prepare correspondence, take meeting minutes, and support providers and leadership with day-to-day operations.</li>
            </ul>
          </div>
        </div>

        <div className="timeline-entry">
          <div className="timeline-marker">
            <img className="timeline-logo" src={parkerLogo} alt="Parker Jewish Institute logo" />
          </div>
          <div className="timeline-body">
            <span className="timeline-date">Dec 2024 – Dec 2025</span>
            <h3>Recreation Leader</h3>
            <p className="timeline-company">Parker Jewish Institute for Health Care and Rehabilitation</p>
            <ul>
              <li>Led daily recreational and therapeutic activities, promoting engagement and well-being among residents.</li>
              <li>Planned and facilitated group programs such as games, arts, and exercises tailored to residents' abilities.</li>
              <li>Regularly helped residents troubleshoot TVs, tablets, phones, and Wi-Fi, escalating complex issues to the IS department.</li>
              <li>Documented attendance and progress notes while collaborating with nursing and administrative staff.</li>
            </ul>
          </div>
        </div>

        <div className="timeline-entry">
          <div className="timeline-marker">
            <img className="timeline-logo" src={sreyoLogo} alt="Sreyo logo" />
          </div>
          <div className="timeline-body">
            <span className="timeline-date">May 2024 – Aug 2024</span>
            <h3>IT Consultant Intern</h3>
            <p className="timeline-company">Sreyo</p>
            <ul>
              <li>Automated AWS infrastructure and deployments using Terraform and GitHub Actions, cutting deployment time by 30%.</li>
              <li>Configured CI/CD pipelines and resolved infrastructure issues, maintaining 99% uptime.</li>
              <li>Troubleshot network configurations and optimized cloud-based solutions.</li>
              <li>Collaborated with cross-functional teams through Scrum meetings and documented setup procedures for onboarding.</li>
            </ul>
          </div>
        </div>

        <div className="timeline-entry">
          <div className="timeline-marker">
          </div>
          <div className="timeline-body">
            <span className="timeline-date">Jan 2018 – Present</span>
            <h3>Freelance IT Support & MacBook Refurbishing</h3>
            <p className="timeline-company">Self-Employed</p>
            <ul>
              <li>Provide on-site and remote IT support for desktops, laptops, mobile devices, and peripherals, improving system reliability and performance.</li>
              <li>Install, configure, and secure Wi-Fi networks, printers, and connected devices; perform hardware upgrades (RAM, SSDs, component replacements).</li>
              <li>Advise clients on system security, maintenance, and best practices, and help them choose and set up new PCs, phones, and laptops.</li>
              <li>Source used MacBooks, diagnose and repair issues (OS reinstalls, screen/keyboard replacements, SSD upgrades, battery swaps), then resell on eBay and locally.</li>
            </ul>
          </div>
        </div>

        <div className="timeline-entry">
          <div className="timeline-marker">
            <img className="timeline-logo" src={walgreensLogo} alt="Walgreens logo" />
          </div>
          <div className="timeline-body">
            <span className="timeline-date">May 2021 – Dec 2024</span>
            <h3>Pharmacy Technician</h3>
            <p className="timeline-company">Walgreens</p>
            <ul>
              <li>Maintained prescription and EMR data accuracy while ensuring HIPAA compliance.</li>
              <li>Assisted pharmacy staff with technical issues in POS and prescription software, minimizing downtime.</li>
              <li>Developed documentation and workflow guides to improve staff training and operational efficiency.</li>
              <li>Trained new staff on technical systems and standard operating procedures.</li>
            </ul>
          </div>
        </div>

        </div>

      </section>
      </Reveal>

      {/* CERTIFICATES */}
      <Reveal>
      <section id="certificates">

        <p className="eyebrow">Certificates</p>

        <div className="cert-grid">
          <div className="cert-card">
            <h3>AWS Cloud Practitioner Essentials</h3>
            <p>Amazon Web Services · Coursera</p>
          </div>
          <div className="cert-card">
            <h3>Healthcare IT Support Specialization</h3>
            <p>Johns Hopkins University · Coursera</p>
          </div>
          <div className="cert-card">
            <h3>Google IT Support Professional Certificate</h3>
            <p>Google · Coursera</p>
          </div>
        </div>

      </section>
      </Reveal>

      {/* PROJECTS */}
      <Reveal>
      <section id="projects">

        <p className="eyebrow">Projects</p>

        <div className="cards">

          <div className="card project-card">
            <img className="project-image" src={soleSwapImg} alt="Sole Swap capstone project presentation poster and team" />
            <h3>Sole Swap</h3>
            <p>
              My senior capstone project — a sneaker trading platform built
              to make swapping sneakers more accessible and trustworthy for
              enthusiasts. Built with ReactJS, JavaScript, HTML/CSS, and
              Firebase, with core features including account creation,
              a sneaker carousel, search, liked shoes, and account
              customization. Developed collaboratively with a team from
              concept through a full project presentation.
            </p>
            <a
              className="project-link"
              href="https://github.com/ShaniaB417/Sole-Swap"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/>
              </svg>
              View on GitHub
            </a>
          </div>

        </div>

      </section>
      </Reveal>

      {/* RESTORATIONS */}
      <Reveal>
      <section id="restorations">

        <p className="eyebrow">Laptop Restorations</p>

        <p className="section-intro">
          Outside of my day-to-day work, I buy damaged MacBooks, diagnose
          the issue, repair them, and resell them. Here's a look at a few
          projects from start to finish.
        </p>

        <div className="restoration-list">
          {restorationProjects.map((project, i) => (
            <RestorationCard
              key={project.id}
              project={project}
              onClick={() => setActiveProject(i)}
            />
          ))}
        </div>

      </section>
      </Reveal>

      {/* SKILLS */}
      <Reveal>
<section id="skills" className="skills-section">

  <p className="eyebrow">Technical Skills</p>

  <svg className="network-graph" viewBox="0 0 400 200" preserveAspectRatio="none">
    <line x1="30" y1="40" x2="120" y2="90" stroke="currentColor" strokeWidth="1" />
    <line x1="120" y1="90" x2="220" y2="30" stroke="currentColor" strokeWidth="1" />
    <line x1="220" y1="30" x2="320" y2="80" stroke="currentColor" strokeWidth="1" />
    <line x1="120" y1="90" x2="180" y2="160" stroke="currentColor" strokeWidth="1" />
    <line x1="180" y1="160" x2="300" y2="150" stroke="currentColor" strokeWidth="1" />
    <line x1="300" y1="150" x2="320" y2="80" stroke="currentColor" strokeWidth="1" />
    <line x1="30" y1="40" x2="60" y2="150" stroke="currentColor" strokeWidth="1" />
    <circle cx="30" cy="40" r="3" fill="currentColor" />
    <circle cx="120" cy="90" r="3" fill="currentColor" />
    <circle cx="220" cy="30" r="3" fill="currentColor" />
    <circle cx="320" cy="80" r="3" fill="currentColor" />
    <circle cx="180" cy="160" r="3" fill="currentColor" />
    <circle cx="300" cy="150" r="3" fill="currentColor" />
    <circle cx="60" cy="150" r="3" fill="currentColor" />
  </svg>

  <div className="skill-groups">

    <div
      className={`skill-group ${selectedSkillGroup && selectedSkillGroup !== 'Programming & Development' ? 'dimmed' : ''} ${selectedSkillGroup === 'Programming & Development' ? 'spotlighted' : ''}`}
      onClick={() => setSelectedSkillGroup((g) => (g === 'Programming & Development' ? null : 'Programming & Development'))}
    >
      <h3>Programming & Development</h3>
      <div className="pills">
        <span className="pill">Java</span>
        <span className="pill">Python</span>
        <span className="pill">JavaScript</span>
        <span className="pill">TypeScript</span>
        <span className="pill">SQL</span>
        <span className="pill">PowerShell</span>
        <span className="pill">Bash</span>
        <span className="pill">HTML/CSS</span>
        <span className="pill">React</span>
        <span className="pill">Firebase</span>
      </div>
    </div>


    <div
      className={`skill-group ${selectedSkillGroup && selectedSkillGroup !== 'IT Support & Troubleshooting' ? 'dimmed' : ''} ${selectedSkillGroup === 'IT Support & Troubleshooting' ? 'spotlighted' : ''}`}
      onClick={() => setSelectedSkillGroup((g) => (g === 'IT Support & Troubleshooting' ? null : 'IT Support & Troubleshooting'))}
    >
      <h3>IT Support & Troubleshooting</h3>
      <div className="pills">
        <span className="pill">Help Desk Support</span>
        <span className="pill">Desktop Support</span>
        <span className="pill">Hardware Repair</span>
        <span className="pill">PC Building</span>
        <span className="pill">Laptop Repair</span>
        <span className="pill">OS Installation</span>
        <span className="pill">System Troubleshooting</span>
        <span className="pill">Remote Support</span>
        <span className="pill">Ticket Management</span>
      </div>
    </div>


    <div
      className={`skill-group ${selectedSkillGroup && selectedSkillGroup !== 'Operating Systems & Platforms' ? 'dimmed' : ''} ${selectedSkillGroup === 'Operating Systems & Platforms' ? 'spotlighted' : ''}`}
      onClick={() => setSelectedSkillGroup((g) => (g === 'Operating Systems & Platforms' ? null : 'Operating Systems & Platforms'))}
    >
      <h3>Operating Systems & Platforms</h3>
      <div className="pills">
        <span className="pill">Windows</span>
        <span className="pill">macOS</span>
        <span className="pill">Linux</span>
        <span className="pill">Ubuntu</span>
        <span className="pill">Microsoft 365</span>
        <span className="pill">Azure</span>
        <span className="pill">Active Directory</span>
        <span className="pill">Group Policy</span>
      </div>
    </div>


    <div
      className={`skill-group ${selectedSkillGroup && selectedSkillGroup !== 'Cloud & Infrastructure' ? 'dimmed' : ''} ${selectedSkillGroup === 'Cloud & Infrastructure' ? 'spotlighted' : ''}`}
      onClick={() => setSelectedSkillGroup((g) => (g === 'Cloud & Infrastructure' ? null : 'Cloud & Infrastructure'))}
    >
      <h3>Cloud & Infrastructure</h3>
      <div className="pills">
        <span className="pill">AWS</span>
        <span className="pill">Terraform</span>
        <span className="pill">GitHub Actions</span>
        <span className="pill">CI/CD</span>
        <span className="pill">VMware</span>
        <span className="pill">Virtualization</span>
        <span className="pill">Cloud Computing</span>
        <span className="pill">Infrastructure Automation</span>
      </div>
    </div>


    <div
      className={`skill-group ${selectedSkillGroup && selectedSkillGroup !== 'Networking' ? 'dimmed' : ''} ${selectedSkillGroup === 'Networking' ? 'spotlighted' : ''}`}
      onClick={() => setSelectedSkillGroup((g) => (g === 'Networking' ? null : 'Networking'))}
    >
      <h3>Networking</h3>
      <div className="pills">
        <span className="pill">TCP/IP</span>
        <span className="pill">DNS</span>
        <span className="pill">DHCP</span>
        <span className="pill">Wi-Fi Setup</span>
        <span className="pill">Router Configuration</span>
        <span className="pill">Network Troubleshooting</span>
        <span className="pill">VPN</span>
        <span className="pill">Ethernet</span>
      </div>
    </div>


    <div
      className={`skill-group ${selectedSkillGroup && selectedSkillGroup !== 'Healthcare IT & Enterprise Tools' ? 'dimmed' : ''} ${selectedSkillGroup === 'Healthcare IT & Enterprise Tools' ? 'spotlighted' : ''}`}
      onClick={() => setSelectedSkillGroup((g) => (g === 'Healthcare IT & Enterprise Tools' ? null : 'Healthcare IT & Enterprise Tools'))}
    >
      <h3>Healthcare IT & Enterprise Tools</h3>
      <div className="pills">
        <span className="pill">Epic EMR</span>
        <span className="pill">HIPAA Compliance</span>
        <span className="pill">Patient Data Systems</span>
        <span className="pill">Healthcare Workflows</span>
        <span className="pill">ServiceNow</span>
        <span className="pill">TeamViewer</span>
        <span className="pill">Microsoft Office</span>
        <span className="pill">Google Workspace</span>
      </div>
    </div>


  </div>

</section>
      </Reveal>

      {/* CONTACT */}
      <Reveal>
      <section id="contact">

        <h2 className="contact-heading">Get In Touch</h2>

        <p>
          Open to healthcare IT, help desk, and technical support
          opportunities — also happy to help if you need a hand
          with anything IT related.
        </p>

        <div className="contact-buttons">
          <a
            className="social-btn linkedin"
            href="https://www.linkedin.com/in/alvin-varughese/"
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
            LinkedIn
          </a>
          <a className="social-btn email" href="mailto:alvinvny@gmail.com">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            Email
          </a>
          <a className="social-btn phone" href="tel:+15163050876">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            (516) 305-0876
          </a>
        </div>

      </section>
      </Reveal>

      {activeProject !== null && (
        <RestorationLightbox
          project={restorationProjects[activeProject]}
          onClose={() => setActiveProject(null)}
        />
      )}

      {resumeOpen && <ResumeLightbox onClose={() => setResumeOpen(false)} />}

      <footer className="site-footer">
        <span className="boot-prompt">&gt;</span> awaiting_connection<span className="cursor">...</span>
      </footer>

    </main>
  )
}

export default App