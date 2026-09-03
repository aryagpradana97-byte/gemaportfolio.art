/*
 * DESIGN REMINDER — Dual Desktop Time Machine
 * This page must feel like a place to explore, not a generic landing page.
 * The retro mode uses deliberate Windows-era skeuomorphism; the 2026 mode uses
 * a calm desktop canvas with editorial spacing, lime data highlights, and direct
 * evidence from Gema's performance-marketing career.
 */
import { useEffect, useMemo, useRef, useState } from "react";

function useDeferVideo(delayMs = 2800) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), delayMs);
    const onFirstInteract = () => setReady(true);
    window.addEventListener("pointerdown", onFirstInteract, { once: true });
    window.addEventListener("keydown", onFirstInteract, { once: true });
    // also use idle callback if available
    const idle = (window as any).requestIdleCallback
      ? (window as any).requestIdleCallback(() => setReady(true), { timeout: 4000 })
      : null;
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
      if (idle && (window as any).cancelIdleCallback) (window as any).cancelIdleCallback(idle);
    };
  }, [delayMs]);
  return ready;
}
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BatteryCharging,
  BookOpen,
  CalendarDays,
  Camera,
  ChevronDown,
  CloudSun,
  CircleHelp,
  Clock3,
  Code2,
  Download,
  FileDown,
  FileText,
  FolderKanban,
  Gamepad2,
  Gem,
  Headphones,
  LayoutGrid,
  Library,
  Mail,
  MapPin,
  Maximize2,
  Menu,
  MessageCircle,
  Monitor,
  MousePointer2,
  Music2,
  Newspaper,
  NotebookPen,
  Palette,
  Play,
  Power,
  Move,
  Presentation,
  Rocket,
  Send,
  Settings2,
  Sparkles,
  Star,
  Terminal,
  Trophy,
  UserRound,
  Volume2,
  Wifi,
  X,
  Zap,
} from "lucide-react";

type Mode = "retro" | "modern";
type WeatherState = {
  status: "loading" | "ready" | "error";
  temperature: number | null;
  apparent: number | null;
  code: number | null;
  hourly: Array<{ time: string; temperature: number; code: number }>;
};
type BatteryState = { level: number | null; charging: boolean };
type WindowId =
  | "work"
  | "about"
  | "services"
  | "resume"
  | "runner"
  | "skill"
  | "rig"
  | "music"
  | "contact"
  | "notes"
  | "shelf"
  | "chess"
  | "synth"
  | "photos"
  | "myworks"
  | "credits"
  | "sources";

const ASSETS = {
  modernWallpaper: "/manus-storage/wallpaper.mp4",
  modernWallpaperFallback: "/manus-storage/gema-2026-vaporwave-cyberpunk_b32e8357.jpg",
  retroWallpaper: "/manus-storage/wallpaper.mp4",
  retroWallpaperFallback: "/manus-storage/gema-1995-wallpaper_165d66af.png",
  caseArt: "/manus-storage/gema-case-study-art_97230459.png",
  shelfArt: "/manus-storage/gema-shelf-art_ebe64599.png",
  mark: "/manus-storage/gema-mark_3edab5d2.png",
};

const CAREER = [
  {
    period: "JUN 2022 — PRESENT",
    role: "Digital Marketing Manager",
    company: "Orderonline.id — Bandung (Promoted from Executive)",
    detail:
      "Lead 12-person team, 250M budget (120M Google / 80M Meta / 30M Content & SEO / 20M TikTok). 3× new-user ROAS, 12× renewal. Client growth: Segerwaras 0→2B GMV/5mo, Pamokids 250M/3mo, HnH 100+ SKUs 10× ROAS, Hospitality 4× bookings.",
    metric: "250M IDR/mo · 12× ROAS",
  },
  {
    period: "OCT 2021 — JUN 2022",
    role: "Digital Marketing Staff",
    company: "KKBC Japan — Tokyo",
    detail:
      "Asia-Pacific expansion, Meta / TikTok / Google / LinkedIn / Twitter. 150% sales, 200% leads, Dentsu Global & DWA, 500% brand, SEO +200%, GTMetrix F→B.",
    metric: "150% sales · 200% leads",
  },
  {
    period: "MAR 2020 — OCT 2021",
    role: "Business Development",
    company: "Masif Digital Agency — Cibubur",
    detail:
      "Cross-platform turnaround, +50% key metrics/3mo, Media Buying Google/Meta/TikTok, reporting & client alignment.",
    metric: "+50% / 3 mo",
  },
  {
    period: "APR 2019 — FEB 2020",
    role: "Marketing Staff",
    company: "Ulemann.com — Bandung",
    detail: "Branding & content strategy, +200% awareness, SEO via Keyword Planner/Semrush/Ahrefs, +20% share of voice, brand guidelines.",
    metric: "+200% awareness",
  },
  {
    period: "MAR 2018 — MAR 2019",
    role: "Digital Marketing Staff",
    company: "Grosir Kita — Bandung",
    detail: "Market research (Analytics + offline), brand guidelines, data sync, Media Buying Meta/TikTok/Google.",
    metric: "Research & brand",
  },
  {
    period: "2015 — 2021",
    role: "Bachelor of Economy",
    company: "Universitas Padjadjaran — Bandung",
    detail: "SMA Terpadu Baiturrahman 2012-2015. BNSP Certified, RevoU/Purwadhika, 15+ certs (Google/Meta/LinkedIn/Twitter/SEMrush).",
    metric: "S.E. · GPA 3.25",
  },
];

const PROJECTS = [
  {
    id: "segerwaras",
    number: "01",
    title: "Segerwaras",
    tag: "Growth system",
    result: "0 → 2B GMV in 5 months",
    text: "A full-funnel programme balancing Google, Meta, content, renewal flows, and a 3–4× ROAS target.",
    color: "lime",
  },
  {
    id: "orderonline",
    number: "02",
    title: "Orderonline.id",
    tag: "Brand activation",
    result: "3× new-user ROAS · 12× renewals",
    text: "Performance marketing that treated acquisition and retention as two different creative problems.",
    color: "blue",
  },
  {
    id: "hnh",
    number: "03",
    title: "Ruang Digital HnH",
    tag: "Commerce",
    result: "100+ SKUs · 10× ROAS",
    text: "Campaign architecture for a broad catalogue with a focus on efficient traffic and returns under 5%.",
    color: "pink",
  },
  {
    id: "hospitality",
    number: "04",
    title: "Hospitality portfolio",
    tag: "Demand generation",
    result: "4× room bookings in 2 months",
    text: "A rapid demand programme across Sun N Sand, Bali Sunshine, and Grand Sunshine.",
    color: "violet",
  },
];

const BOOKS = [
  {
    title: "Ogilvy on Advertising",
    author: "David Ogilvy",
    note: "The bible of classic advertising",
    tag: "CLASSIC",
    cover: "/manus-storage/books/ogilvy.jpg",
    isbn: "9780394729035",
  },
  {
    title: "How to Listen",
    author: "Katie Colombus",
    note: "Listening as a creative superpower",
    tag: "CRAFT",
    cover: "/manus-storage/books/how-to-listen.jpg",
    isbn: "",
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    note: "Two systems that drive decisions",
    tag: "PSYCHOLOGY",
    cover: "/manus-storage/books/thinking-fast-and-slow.jpg",
    isbn: "9780374533557",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    note: "Tiny changes, remarkable results",
    tag: "HABITS",
    cover: "/manus-storage/books/atomic-habits.jpg",
    isbn: "9780735211292",
  },
  {
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    note: "Stoisme untuk hidup modern",
    tag: "MINDSET",
    cover: "/manus-storage/books/filosofi-teras.jpg",
    isbn: "9786025385880",
  },
  {
    title: "Building a StoryBrand",
    author: "Donald Miller",
    note: "Clarify message so customers listen",
    tag: "POSITIONING",
    cover: "/manus-storage/books/building-a-storybrand.jpg",
    isbn: "9780718033332",
  },
  {
    title: "How to Win Friends & Influence People",
    author: "Dale Carnegie",
    note: "Timeless people skills",
    tag: "PEOPLE",
    cover: "/manus-storage/books/how-to-win-friends.jpg",
    isbn: "9780671027032",
  },
  {
    title: "Il Principe",
    author: "Niccolò Machiavelli",
    note: "Power, strategy & realpolitik",
    tag: "STRATEGY",
    cover: "/manus-storage/books/il-principe.jpg",
    isbn: "9780140449150",
  },
  {
    title: "Marketing 4.0",
    author: "Philip Kotler",
    note: "Moving from Traditional to Digital",
    tag: "MARKETING",
    cover: "/manus-storage/books/marketing-4.jpg",
    isbn: "9781119341208",
  },
  {
    title: "Marketing 5.0",
    author: "Philip Kotler",
    note: "Technology for humanity",
    tag: "MARKETING",
    cover: "/manus-storage/books/marketing-5.jpg",
    isbn: "9781119668510",
  },
  {
    title: "Marketing 6.0",
    author: "Philip Kotler",
    note: "The future is immersive",
    tag: "MARKETING",
    cover: "/manus-storage/books/marketing-6.jpg",
    isbn: "9781394252456",
  },
];

const FILMS = [
  {
    title: "Wolf of Wall Street",
    year: "2013",
    note: "Sales, persuasion & excess",
    poster: "/manus-storage/films/wolf-of-wallstreet.jpg",
  },
  {
    title: "Mad Men",
    year: "2007-2015",
    note: "Advertising golden age",
    poster: "/manus-storage/films/madmen.jpg",
  },
  {
    title: "The Office",
    year: "2005-2013",
    note: "Workplace & human dynamics",
    poster: "/manus-storage/films/the-office.jpg",
  },
  {
    title: "One Piece",
    year: "1999-",
    note: "Long-game storytelling",
    poster: "/manus-storage/films/one-piece.jpg",
  },
  {
    title: "The Godfather",
    year: "1972",
    note: "Power & family business",
    poster: "/manus-storage/films/godfather.jpg",
  },
  {
    title: "Ted Lasso",
    year: "2020-",
    note: "Leadership with kindness",
    poster: "/manus-storage/films/ted-lasso.jpg",
  },
  {
    title: "The Salesman",
    year: "2016",
    note: "Persuasion & ethics",
    poster: "/manus-storage/films/the-salesman.jpg",
  },
  {
    title: "The Internship",
    year: "2013",
    note: "Scrappy growth mindset",
    poster: "/manus-storage/films/the-internship.jpg",
  },
];

const MUSIC = [
  {
    name: "Pamungkas",
    tag: "INDIE",
    poster: "/manus-storage/music/pamungkas.jpg",
  },
  {
    name: "Slipknot",
    tag: "METAL",
    poster: "/manus-storage/music/slipknot.jpg",
  },
  {
    name: "L'Arc~en~Ciel",
    tag: "J-ROCK",
    poster: "/manus-storage/music/larc-en-ciel.jpg",
  },
  {
    name: "Weda Mauve",
    tag: "INDIE",
    poster: "/manus-storage/music/weda-mauve.jpg",
  },
  {
    name: "Bring Me The Horizon",
    tag: "ROCK",
    poster: "/manus-storage/music/bring-me-the-horizon.jpg",
  },
  {
    name: "Seringai",
    tag: "METAL",
    poster: "/manus-storage/music/seringai.jpg",
  },
  {
    name: "The Strokes",
    tag: "ROCK",
    poster: "/manus-storage/music/the-strokes.jpg",
  },
  {
    name: "Arctic Monkeys",
    tag: "INDIE",
    poster: "/manus-storage/music/arctic-monkeys.jpg",
  },
  {
    name: "Radiohead",
    tag: "ALT",
    poster: "/manus-storage/music/radiohead.jpg",
  },
  { name: "BigBang", tag: "K-POP", poster: "/manus-storage/music/bigbang.jpg" },
  {
    name: "Denny Caknan",
    tag: "JAWA",
    poster: "/manus-storage/music/denny-caknan.jpg",
  },
  {
    name: "NDX AKA",
    tag: "HIP HOP JAWA",
    poster: "/manus-storage/music/ndx-aka.jpg",
  },
  {
    name: "Ndarboy Genk",
    tag: "KO PLO",
    poster: "/manus-storage/music/ndarboy-genk.jpg",
  },
];

type CaseSection = "overview" | "challenge" | "discovery" | "outcome";

const CASE_STUDY_DETAILS: Record<
  string,
  Record<
    CaseSection,
    {
      label: string;
      title: string;
      copy: string;
      signal: string;
      evidence: string[];
    }
  >
> = {
  segerwaras: {
    overview: {
      label: "01 · OVERVIEW",
      title: "From zero signal to a repeatable commerce engine.",
      copy: "Segerwaras needed a growth system that could turn a new offer into a measurable, repeatable business. The work connected paid acquisition, creative testing, landing-page clarity, and renewal decisions.",
      signal: "0 → 2B GMV / 5 MONTHS",
      evidence: [
        "Google + Meta acquisition",
        "Creative and landing-page testing",
        "Renewal loop separated from new users",
      ],
    },
    challenge: {
      label: "02 · THE CHALLENGE",
      title: "Growth had to arrive before the playbook existed.",
      copy: "The problem was not a lack of channels. It was deciding which message, audience, and offer deserved the next rupiah while the business was still learning who its best customers could be.",
      signal: "NEXT DECISION > MORE TRAFFIC",
      evidence: [
        "Offer-market fit under pressure",
        "Multiple audiences in motion",
        "Performance and brand signals in one view",
      ],
    },
    discovery: {
      label: "03 · DISCOVERY",
      title: "Make the funnel legible before making it larger.",
      copy: "I mapped the acquisition path from first impression to repeat behaviour, then used channel and creative signals to prioritise the next test instead of treating every metric as equally important.",
      signal: "FULL-FUNNEL SIGNAL MAP",
      evidence: [
        "Audience and offer hypotheses",
        "Weekly creative test rhythm",
        "ROAS read by user cohort",
      ],
    },
    outcome: {
      label: "04 · OUTCOME",
      title: "A commercial story the team could keep operating.",
      copy: "The result was a stronger operating cadence: the business could see what was working, why it was working, and which decision should happen next as the GMV curve moved.",
      signal: "2B GMV MILESTONE",
      evidence: [
        "5-month scale-up",
        "3–4× ROAS target",
        "Team-ready reporting rhythm",
      ],
    },
  },
  orderonline: {
    overview: {
      label: "01 · OVERVIEW",
      title: "Acquisition and retention need different stories.",
      copy: "At Orderonline.id, I worked across a significant monthly media budget while keeping the work grounded in creative relevance, measurement, SEO, and commercial outcomes.",
      signal: "250M IDR / MONTH",
      evidence: [
        "Google, Meta, SEO, TikTok",
        "New-user and renewal journeys",
        "Brand activation with performance proof",
      ],
    },
    challenge: {
      label: "02 · THE CHALLENGE",
      title: "The same dashboard cannot answer every customer question.",
      copy: "New users needed a clear reason to try the product. Returning users needed a reason to continue. Separating those jobs made the creative and bidding decisions more useful.",
      signal: "12× RENEWAL ROAS",
      evidence: [
        "Acquisition creative",
        "Retention creative",
        "Budget decisions by intent",
      ],
    },
    discovery: {
      label: "03 · DISCOVERY",
      title: "Build the measurement layer around decisions.",
      copy: "The strongest reporting did not add more charts. It linked channel behaviour to the next creative, audience, or budget decision so the team could move with less noise.",
      signal: "DECISION-LED REPORTING",
      evidence: [
        "GA4 + channel signals",
        "Creative test matrix",
        "Quality and volume read together",
      ],
    },
    outcome: {
      label: "04 · OUTCOME",
      title: "A performance system that could scale with the brief.",
      copy: "The work balanced a 250M IDR monthly operating environment with concrete growth outcomes, including 3× new-user ROAS and 12× renewal ROAS.",
      signal: "3× NEW · 12× RENEWAL",
      evidence: [
        "250M IDR monthly budget",
        "Cross-channel fluency",
        "Team leadership across growth work",
      ],
    },
  },
  hnh: {
    overview: {
      label: "01 · OVERVIEW",
      title: "Commerce clarity across a wide catalogue.",
      copy: "Ruang Digital HnH needed campaign architecture that could make a broad catalogue easier to buy from while protecting efficiency and return quality.",
      signal: "100+ SKUS / 10× ROAS",
      evidence: [
        "Catalogue campaign structure",
        "Traffic quality under 5% returns",
        "Offer and product grouping",
      ],
    },
    challenge: {
      label: "02 · THE CHALLENGE",
      title: "More products can create less clarity.",
      copy: "The hard part was not finding another SKU to promote. It was giving the right product, proof, and reason-to-believe to the right audience at the right moment.",
      signal: "CATALOG > CLUTTER",
      evidence: [
        "100+ SKU decisions",
        "Offer hierarchy",
        "Audience-to-product matching",
      ],
    },
    discovery: {
      label: "03 · DISCOVERY",
      title: "Organise the catalogue around intent.",
      copy: "I used campaign structure, creative variation, and product grouping to turn a large catalogue into a set of clearer commercial paths.",
      signal: "INTENT-LED COMMERCE",
      evidence: [
        "Product clusters",
        "Creative variation",
        "Efficiency guardrails",
      ],
    },
    outcome: {
      label: "04 · OUTCOME",
      title: "A more legible path from click to cart.",
      copy: "The campaign system gave the team a clearer way to scale what worked without losing sight of product fit, margin, and return quality.",
      signal: "10× ROAS",
      evidence: [
        "Efficient traffic",
        "Catalogue discipline",
        "Repeatable campaign logic",
      ],
    },
  },
  hospitality: {
    overview: {
      label: "01 · OVERVIEW",
      title: "Demand generation for hospitality brands.",
      copy: "Across Sun N Sand, Bali Sunshine, and Grand Sunshine, the work focused on turning paid and organic attention into a more consistent room-booking pipeline.",
      signal: "4× ROOM BOOKINGS / 2 MONTHS",
      evidence: [
        "Multi-property campaigns",
        "Demand capture",
        "Creative for booking intent",
      ],
    },
    challenge: {
      label: "02 · THE CHALLENGE",
      title: "Make a stay feel close enough to book.",
      copy: "Hospitality demand is emotional and practical at once. The campaign had to create desire while answering the small questions that stop a traveler from committing.",
      signal: "DESIRE + DECISION",
      evidence: [
        "Destination storytelling",
        "Booking-oriented landing paths",
        "Cross-market collaboration",
      ],
    },
    discovery: {
      label: "03 · DISCOVERY",
      title: "Pair attention with a clear next step.",
      copy: "The work connected visual storytelling, audience signals, and booking pathways so interest did not disappear between the first impression and the reservation action.",
      signal: "ATTENTION → BOOKING",
      evidence: [
        "Creative testing",
        "Audience segmentation",
        "Booking funnel clarity",
      ],
    },
    outcome: {
      label: "04 · OUTCOME",
      title: "A rapid demand programme with visible movement.",
      copy: "The programme produced a 4× increase in room bookings in two months while creating a stronger bridge between hospitality storytelling and measurable demand.",
      signal: "4× BOOKING LIFT",
      evidence: [
        "2-month acceleration",
        "Multi-brand learning",
        "Demand-generation playbook",
      ],
    },
  },
};

const STATS = [
  { value: "12×", label: "renewal ROAS" },
  { value: "2B", label: "GMV milestone" },
  { value: "250M", label: "IDR monthly budget" },
  { value: "6–12", label: "team members led" },
];

type Lang = "en";
const DICT: Record<Lang, any> = {
  en: {
    heroKicker: "DIGITAL MARKETING / PERFORMANCE SYSTEM",
    heroDesc: "Decoding the consumer mind through Branding & Digital Marketing. Specialist in turning basic features into high-impact benefits.",
    heroDesc2: "Growth's paper trail — 250M IDR/mo → 12× renewal ROAS. 0→2B GMV in 5 months. Systems, not slogans.",
    statRenewal: "renewal ROAS",
    statGmv: "GMV milestone",
    statBudget: "IDR / month",
    modernClockSub: "GEMA'S DESKTOP · PERFORMANCE / CREATIVE / GROWTH",
    lockCaption: "A portfolio desktop for performance, process, and proof.",
    workKicker: "SELECTED WORK / 2022—NOW",
    workLead: "Case studies, not claims.",
    workLeadP: "Growth is a trail of decisions, creative tests, and numbers that move in the right direction. Select a project, then move through the evidence.",
    aboutKicker: "PROFILE / GEMA PRADANA",
    aboutTitle: "Performance marketer with a soft spot for strange interfaces.",
    aboutP1: "I sit between media, creative, and commercial teams. My favourite brief starts with an ambiguous problem and ends with a dashboard that tells the truth.",
    contactH3a: "Have a growth problem",
    contactH3b: "worth exploring?",
    contactP: "Send the context, not the polished version. I'm most useful when the question is still a little messy.",
    contactKicker: "OPEN CHANNEL / 2026",
    servicesKicker: "WHAT I DO / THE TOOLKIT",
    switchTo95: "switch to ’96",
    switchTo2026: "Update to Gema 2026",
    didYouKnow: "DID YOU KNOW?",
  },
};
const DOCK_ITEMS: { icon: any; label: string; labelId: string; target: WindowId }[] = [
  { icon: Presentation, label: "Work — case studies", labelId: "Kerja — studi kasus", target: "work" },
  { icon: Code2, label: "Skill — stack & tools", labelId: "Skill — tumpukan alat", target: "skill" },
  { icon: Rocket, label: "My Works — live sites", labelId: "Karya — situs live", target: "myworks" },
  { icon: MessageCircle, label: "Contact — open channel", labelId: "Kontak — jalur terbuka", target: "contact" },
  { icon: Gem, label: "Shelf — books & music", labelId: "Rak — buku & musik", target: "shelf" },
  { icon: Settings2, label: "Rig — my setup", labelId: "Setup — perangkat", target: "rig" },
  { icon: Sparkles, label: "About — profile", labelId: "Tentang — profil", target: "about" },
  { icon: Headphones, label: "Music — RainAmp", labelId: "Musik — RainAmp", target: "music" },
];

const RETRO_ICONS = [
  {
    id: "work" as WindowId,
    label: "My Work",
    hint: "Case files",
    icon: FolderKanban,
    tone: "blue",
  },
  {
    id: "myworks" as WindowId,
    label: "My Works",
    hint: "Live sites",
    icon: Presentation,
    tone: "blue",
  },
  {
    id: "about" as WindowId,
    label: "About Gema",
    hint: "Profile",
    icon: UserRound,
    tone: "lime",
  },
  {
    id: "services" as WindowId,
    label: "What I Do",
    hint: "Capabilities",
    icon: BarChart3,
    tone: "pink",
  },
  {
    id: "resume" as WindowId,
    label: "Resume",
    hint: "CV / PDF",
    icon: FileText,
    tone: "paper",
  },
  {
    id: "skill" as WindowId,
    label: "Skill",
    hint: "Stack & tools",
    icon: Code2,
    tone: "purple",
  },
  {
    id: "contact" as WindowId,
    label: "Contact",
    hint: "Open channel",
    icon: Mail,
    tone: "red",
  },
  {
    id: "notes" as WindowId,
    label: "Notes",
    hint: "Field notes",
    icon: NotebookPen,
    tone: "yellow",
  },
  {
    id: "shelf" as WindowId,
    label: "My Shelf",
    hint: "Books·Films·Music",
    icon: Library,
    tone: "blue",
  },
  {
    id: "rig" as WindowId,
    label: "My Rig",
    hint: "Setup",
    icon: Monitor,
    tone: "lime",
  },
  {
    id: "credits" as WindowId,
    label: "Credits",
    hint: "anshry.dev",
    icon: Star,
    tone: "yellow",
  },
  {
    id: "sources" as WindowId,
    label: "Sources",
    hint: "Referensi",
    icon: BookOpen,
    tone: "paper",
  },
  {
    id: "photos" as WindowId,
    label: "Photos",
    hint: "Archive",
    icon: Camera,
    tone: "paper",
  },
];

const MODERN_ICONS = [
  {
    id: "work" as WindowId,
    label: "case studies",
    sub: "selected work",
    icon: FolderKanban,
    color: "lime",
    pos: { x: 4, y: 76 },
  },
  {
    id: "myworks" as WindowId,
    label: "my works",
    sub: "livingstone · hempel · etc",
    icon: Presentation,
    color: "blue",
    pos: { x: 14, y: 76 },
  },
  {
    id: "notes" as WindowId,
    label: "stickies",
    sub: "ideas & notes",
    icon: NotebookPen,
    color: "yellow",
    pos: { x: 24, y: 76 },
  },
  {
    id: "shelf" as WindowId,
    label: "my shelf",
    sub: "books · films · music",
    icon: Library,
    color: "blue",
    pos: { x: 34, y: 76 },
  },
  {
    id: "resume" as WindowId,
    label: "resume",
    sub: "pdf · 2026",
    icon: FileDown,
    color: "paper",
    pos: { x: 4, y: 86 },
  },
  {
    id: "synth" as WindowId,
    label: "synthesizer",
    sub: "move the signal",
    icon: Zap,
    color: "violet",
    pos: { x: 14, y: 86 },
  },
  {
    id: "photos" as WindowId,
    label: "photographs",
    sub: "personal archive",
    icon: Camera,
    color: "blue",
    pos: { x: 34, y: 86 },
  },
  {
    id: "about" as WindowId,
    label: "meet gema",
    sub: "profile",
    icon: UserRound,
    color: "lime",
    pos: { x: 44, y: 76 },
  },
  {
    id: "skill" as WindowId,
    label: "skill",
    sub: "stack & tools",
    icon: Code2,
    color: "violet",
    pos: { x: 44, y: 86 },
  },
  {
    id: "rig" as WindowId,
    label: "my rig",
    sub: "personal setup",
    icon: Monitor,
    color: "blue",
    pos: { x: 24, y: 92 },
  },
  {
    id: "credits" as WindowId,
    label: "credits",
    sub: "anshry.dev",
    icon: Star,
    color: "yellow",
    pos: { x: 4, y: 92 },
  },
  {
    id: "sources" as WindowId,
    label: "sources",
    sub: "referensi",
    icon: BookOpen,
    color: "paper",
    pos: { x: 14, y: 92 },
  },
];

type FloatingLayout = { x: number; y: number; w: number; h: number };

const MODERN_WIDGET_LAYOUTS: Record<string, FloatingLayout> = {
  calendar: { x: 70, y: 6, w: 14, h: 17 },
  battery: { x: 85, y: 6, w: 13, h: 17 },
  weather: { x: 70, y: 24, w: 14, h: 17 },
  analog: { x: 85, y: 24, w: 13, h: 17 },
  news: { x: 70, y: 42, w: 28, h: 18 },
};

const MOBILE_WIDGET_LAYOUTS: Record<string, FloatingLayout> = {
  calendar: { x: 2, y: 14, w: 46, h: 19 },
  battery: { x: 52, y: 14, w: 46, h: 19 },
  news: { x: 2, y: 36, w: 96, h: 20 },
  analog: { x: 2, y: 72, w: 46, h: 22 },
  weather: { x: 52, y: 72, w: 46, h: 22 },
};

const NEWS_ITEMS = [
  {
    source: "CV / VERIFIED",
    title:
      "Orderonline.id — managing IDR 250M/month across Google, Meta, SEO, and TikTok.",
  },
  {
    source: "CV / VERIFIED",
    title: "Segerwaras — scaled from 0 to IDR 2B GMV in five months.",
  },
  {
    source: "CV / VERIFIED",
    title: "KKBC Japan — 150% sales growth and 200% more leads in six months.",
  },
];

const DID_YOU_KNOW_FACTS = [
  {
    fact: "Meta Ads Learning Phase resets when you edit budget, audience, or creative by >20%.",
    source: "Meta Business Help",
  },
  {
    fact: "TikTok Spark Ads use your organic post as creative — same post, paid reach.",
    source: "TikTok For Business",
  },
  {
    fact: "Google Ads Quality Score: expected CTR + ad relevance + landing experience.",
    source: "Google Ads Help",
  },
  {
    fact: "GA4 engagement rate = engaged sessions / total sessions — not time on tab.",
    source: "Google Analytics Help",
  },
  {
    fact: "Search Console: clicks, impressions, CTR & avg position for every query.",
    source: "Search Console Help",
  },
  {
    fact: "The best campaign is the one that makes the next decision clearer.",
    source: "Gema field note",
  },
  {
    fact: "Retention deserves its own creative — renewal ≠ acquisition story.",
    source: "Gema field note",
  },
  {
    fact: "TikTok Creative Centre shows top ads by country — free swipe file.",
    source: "TikTok Creative Centre",
  },
  {
    fact: "Meta Advantage+ auto-places across Feed, Reels, Stories — test manual vs auto.",
    source: "Meta Help Centre",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatClock(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function weatherLabel(code: number | null) {
  if (code === null) return "Waiting for signal";
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Misty";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Storm";
  return "Variable";
}

function calendarCells(now: Date) {
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  return Array.from({ length: 42 }, (_, index) => {
    const number = index - firstDay + 1;
    const date = new Date(now.getFullYear(), now.getMonth(), number);
    return {
      number: date.getDate(),
      inMonth: number > 0 && number <= daysInMonth,
      today: date.toDateString() === now.toDateString(),
    };
  });
}

function WindowFrame({
  title,
  eyebrow,
  children,
  onClose,
  variant = "modern",
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  onClose: () => void;
  variant?: Mode;
}) {
  return (
    <div
      className={`portfolio-window window-${variant}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="window-chrome">
        <div className="window-chrome-left">
          <span className="window-signal" />
          <span className="window-eyebrow">
            {eyebrow ?? "GEMA / PORTFOLIO"}
          </span>
        </div>
        <button
          className="window-close"
          onClick={onClose}
          aria-label={`Close ${title}`}
        >
          <X size={16} />
        </button>
      </div>
      <div className="window-body">
        <div className="window-heading-row">
          <h2>{title}</h2>
          <span className="window-counter">
            {variant === "retro" ? "FILE_OPEN" : "LIVE FILE"}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function RetroBoot({ progress }: { progress: number }) {
  return (
    <main
      className="retro-boot"
      style={{ backgroundImage: `url(${ASSETS.retroWallpaper})` }}
    >
      <div className="boot-scanlines" />
      <div className="boot-card">
        <div className="boot-brand">
          <img src={ASSETS.mark} alt="Gema mark"  loading="lazy" decoding="async" />
          <div>
            <span>GEMAOS</span>
            <strong>’95</strong>
          </div>
        </div>
        <div className="boot-copy">
          <span>GEMA PRADANA PERSONAL COMPUTER</span>
          <b>Starting portfolio system…</b>
        </div>
        <div className="boot-loader">
          <i style={{ width: `${progress}%` }} />
        </div>
        <div className="boot-status">
          <span>MEMORY CHECK: 640K OK</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
      <div className="boot-footer">
        © 1995 GEMA PRADANA · DIGITAL MARKETING / PERFORMANCE SYSTEMS
      </div>
    </main>
  );
}

function ModernLockScreen({
  now,
  onUnlock,
  onRetro,
}: {
  now: Date;
  onUnlock: () => void;
  onRetro: () => void;
}) {
  const videoReady = useDeferVideo(3000);
  return (
    <main className="modern-lock" style={{ backgroundImage: `url(${ASSETS.modernWallpaperFallback})` }}>
      {videoReady && <video className="modern-video-bg" autoPlay loop muted playsInline preload="none" poster={ASSETS.modernWallpaperFallback} src={ASSETS.modernWallpaper} />}
      <div className="lock-grain" />
      <div className="lock-topline">
        <span>GEMA PRADANA / PRODUCT MARKETING</span>
        <span>2026.08.14</span>
      </div>
      <div className="lock-brand-mark">
        <img src={ASSETS.mark} alt="Gema mark"  loading="lazy" decoding="async" />
        <span>GEMA / 2026</span>
      </div>
      <div className="lock-centre">
        <div className="lock-clock">{formatClock(now)}</div>
        <div className="lock-date">
          {now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
        <button className="unlock-button" onClick={onUnlock}>
          <MousePointer2 size={15} /> CLICK TO UNLOCK
        </button>
        <p className="lock-caption">
          A portfolio desktop for performance, process, and proof.
        </p>
      </div>
      <div className="lock-bottom">
        <span>Gema Pradana</span>
        <span>PRODUCT DESIGNER OF GROWTH · JAKARTA</span>
        <button onClick={onRetro}>↶ BACK TO ’95</button>
      </div>
    </main>
  );
}

function RetroStartMenu({
  onOpen,
  onModern,
  onPower,
  onClose,
}: {
  onOpen: (id: WindowId) => void;
  onModern: () => void;
  onPower: () => void;
  onClose: () => void;
}) {
  const launch = (id: WindowId) => {
    onOpen(id);
    onClose();
  };
  return (
    <div
      className="retro-start-menu"
      role="menu"
      aria-label="GemaOS start menu"
    >
      <div className="retro-start-brand">
        <img src={ASSETS.mark} alt=""  loading="lazy" decoding="async" />
        <strong>
          GEMAOS
          <br />
          <em>’95</em>
        </strong>
      </div>
      <div className="retro-start-items">
        <button onClick={() => launch("work")}>
          <FolderKanban size={16} />{" "}
          <span>
            <b>My Work</b>
            <small>Case files and proof</small>
          </span>
          <ChevronDown size={12} />
        </button>
        <button onClick={() => launch("services")}>
          <BarChart3 size={16} />{" "}
          <span>
            <b>Programs</b>
            <small>Marketing toolkit</small>
          </span>
          <ChevronDown size={12} />
        </button>
        <button onClick={() => launch("resume")}>
          <FileText size={16} />{" "}
          <span>
            <b>Documents</b>
            <small>Gema’s CV / resume</small>
          </span>
          <ChevronDown size={12} />
        </button>
        <button onClick={() => launch("notes")}>
          <NotebookPen size={16} />{" "}
          <span>
            <b>Field Notes</b>
            <small>Shortcuts and observations</small>
          </span>
        </button>
        <button onClick={() => launch("music")}>
          <Music2 size={16} />{" "}
          <span>
            <b>RainAmp</b>
            <small>Now playing</small>
          </span>
        </button>
      </div>
      <div className="retro-start-divider" />
      <button
        className="retro-start-action"
        onClick={() => {
          onModern();
          onClose();
        }}
      >
        <ArrowRight size={16} /> Update to Gema 2026
      </button>
      <button
        className="retro-start-action power"
        onClick={() => {
          onPower();
          onClose();
        }}
      >
        <Power size={16} /> Shut down portfolio
      </button>
    </div>
  );
}

function FloatingWidget({
  id,
  layout,
  onDragStart,
  onResizeStart,
  children,
}: {
  id: string;
  layout: FloatingLayout;
  onDragStart: (id: string, event: ReactPointerEvent<HTMLDivElement>) => void;
  onResizeStart: (
    id: string,
    event: ReactPointerEvent<HTMLButtonElement>
  ) => void;
  children: ReactNode;
}) {
  return (
    <div
      className="modern-widget-shell"
      style={{
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        width: `${layout.w}%`,
        height: `${layout.h}%`,
      }}
      onPointerDown={event => onDragStart(id, event)}
    >
      {children}
      <button
        className="floating-resize-handle"
        aria-label={`Resize ${id} widget`}
        onPointerDown={event => {
          event.stopPropagation();
          onResizeStart(id, event);
        }}
      >
        <Maximize2 size={11} />
      </button>
    </div>
  );
}

function ModernWidgets({
  now,
  onOpen,
  weather,
  battery,
  layouts,
  onDragStart,
  onResizeStart,
}: {
  now: Date;
  onOpen: (id: WindowId) => void;
  weather: WeatherState;
  battery: BatteryState;
  layouts: Record<string, FloatingLayout>;
  onDragStart: (id: string, event: ReactPointerEvent<HTMLDivElement>) => void;
  onResizeStart: (
    id: string,
    event: ReactPointerEvent<HTMLButtonElement>
  ) => void;
}) {
  const month = now.toLocaleDateString("en-US", { month: "long" });
  const weekday = now.toLocaleDateString("en-US", { weekday: "short" });
  const cells = calendarCells(now);
  const batteryLevel = battery.level === null ? "—" : `${battery.level}%`;
  const weatherTemp =
    weather.temperature === null ? "—" : `${Math.round(weather.temperature)}°`;
  const apparent =
    weather.apparent === null ? "—" : `${Math.round(weather.apparent)}°`;
  const forecast = weather.hourly.length
    ? weather.hourly.slice(0, 6)
    : Array.from({ length: 6 }, (_, index) => ({
        time: `+${index + 1}h`,
        temperature: 0,
        code: -1,
      }));

  return (
    <div className="modern-widgets" aria-label="Gema desktop widgets">
      <FloatingWidget
        id="calendar"
        layout={layouts.calendar ?? MODERN_WIDGET_LAYOUTS.calendar}
        onDragStart={onDragStart}
        onResizeStart={onResizeStart}
      >
        <button
          className="modern-widget calendar-widget"
          onClick={() => onOpen("notes")}
        >
          <div className="widget-topline">
            <span>
              {month.toUpperCase()} {now.getFullYear()}
            </span>
            <small>
              {weekday} / {now.getDate()}
            </small>
          </div>
          <div className="calendar-week">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>
          <div className="calendar-days">
            {cells.map((cell, index) => (
              <span
                key={`${cell.number}-${index}`}
                className={`${cell.inMonth ? "" : "calendar-outside"} ${cell.today ? "calendar-today" : ""}`}
              >
                {cell.inMonth ? cell.number : ""}
              </span>
            ))}
          </div>
        </button>
      </FloatingWidget>
      <FloatingWidget
        id="battery"
        layout={layouts.battery ?? MODERN_WIDGET_LAYOUTS.battery}
        onDragStart={onDragStart}
        onResizeStart={onResizeStart}
      >
        <button
          className="modern-widget battery-widget"
          onClick={() => onOpen("resume")}
        >
          <div className="widget-topline">
            <span>
              <Wifi size={12} /> DEVICE STATUS
            </span>
            <b>{batteryLevel}</b>
          </div>
          <div className="battery-hero">
            <BatteryCharging size={31} strokeWidth={1.4} />
            <strong>
              {batteryLevel === "—"
                ? "Checking"
                : battery.charging
                  ? "Charging"
                  : "Ready"}
              <br />
              for the next brief
            </strong>
          </div>
          <div className="battery-meter">
            <i
              style={{
                width: battery.level === null ? "42%" : `${battery.level}%`,
              }}
            />
          </div>
          <small>
            {battery.charging ? "power connected" : "local device signal"} ·
            media · data · team
          </small>
        </button>
      </FloatingWidget>
      <FloatingWidget
        id="news"
        layout={layouts.news ?? MODERN_WIDGET_LAYOUTS.news}
        onDragStart={onDragStart}
        onResizeStart={onResizeStart}
      >
        <button
          className="modern-widget news-widget"
          onClick={() => onOpen("work")}
        >
          <div className="widget-topline">
            <span>
              <Newspaper size={12} /> SIGNAL / CV
            </span>
            <b>VERIFIED</b>
          </div>
          {NEWS_ITEMS.map(item => (
            <div className="news-item" key={item.title}>
              <small>{item.source}</small>
              <strong>{item.title}</strong>
            </div>
          ))}
        </button>
      </FloatingWidget>
      <FloatingWidget
        id="analog"
        layout={layouts.analog ?? MODERN_WIDGET_LAYOUTS.analog}
        onDragStart={onDragStart}
        onResizeStart={onResizeStart}
      >
        <button
          className="modern-widget analog-widget"
          onClick={() => onOpen("about")}
        >
          <div className="analog-face">
            <i
              className="analog-hand analog-hour"
              style={{
                transform: `translate(-50%, -100%) rotate(${(now.getHours() % 12) * 30 + now.getMinutes() / 2}deg)`,
              }}
            />
            <i
              className="analog-hand analog-minute"
              style={{
                transform: `translate(-50%, -100%) rotate(${now.getMinutes() * 6}deg)`,
              }}
            />
            <i className="analog-pin" />
            {Array.from({ length: 12 }, (_, index) => (
              <b key={index} style={{ transform: `rotate(${index * 30}deg)` }}>
                <span style={{ transform: `rotate(-${index * 30}deg)` }}>
                  {index === 0 ? 12 : index}
                </span>
              </b>
            ))}
          </div>
          <small>JAKARTA / {formatClock(now)}</small>
        </button>
      </FloatingWidget>
      <FloatingWidget
        id="weather"
        layout={layouts.weather ?? MODERN_WIDGET_LAYOUTS.weather}
        onDragStart={onDragStart}
        onResizeStart={onResizeStart}
      >
        <button
          className="modern-widget weather-widget"
          onClick={() => onOpen("shelf")}
        >
          <div className="weather-location">
            Jakarta Utara <span>↗</span>
          </div>
          <div className="weather-main">
            <strong>{weatherTemp}</strong>
            <span>
              <CloudSun size={27} />{" "}
              {weather.status === "loading"
                ? "Loading"
                : weather.status === "error"
                  ? "Offline"
                  : weatherLabel(weather.code)}
            </span>
          </div>
          <div className="weather-meta">
            Feels like {apparent} · Open-Meteo live signal
          </div>
          <div className="weather-forecast">
            {forecast.map((hour, index) => (
              <span key={`${hour.time}-${index}`}>
                <small>{hour.time}</small>
                <CloudSun size={13} />
                <b>
                  {weather.status === "ready"
                    ? `${Math.round(hour.temperature)}°`
                    : "—"}
                </b>
              </span>
            ))}
          </div>
        </button>
      </FloatingWidget>
    </div>
  );
}

function RetroDesktop({
  onOpen,
  onModern,
  onPower,
  clock,
  fact,
  lang,
  onLang,
}: {
  onOpen: (id: WindowId) => void;
  onModern: () => void;
  onPower: () => void;
  clock: Date;
  fact: (typeof DID_YOU_KNOW_FACTS)[number];
  lang: Lang;
  onLang: (l: Lang) => void;
}) {
  const t = DICT[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const videoReady = useDeferVideo(3200);
  return (
    <main className="retro-desktop" style={{ backgroundImage: `url(${ASSETS.retroWallpaperFallback})` }}>
      {videoReady && <video className="retro-video-bg" autoPlay loop muted playsInline preload="none" poster={ASSETS.retroWallpaperFallback} src={ASSETS.retroWallpaper} />}
      <div className="retro-stars" />
      <header className="retro-topbar">
        <span>
          <img src={ASSETS.mark} alt=""  loading="lazy" decoding="async" /> GEMAOS ’95
        </span>
        <nav className="retro-menu-links" aria-label="Portfolio menu">
          <button onClick={() => onOpen("about")}>About</button>
          <button onClick={() => onOpen("work")}>Work</button>
          <button onClick={() => onOpen("chess")}>Games</button>
          <button onClick={() => onOpen("music")}>Music</button>
          <button onClick={() => onOpen("contact")}>Contact</button>
        </nav>
        <span className="retro-top-message">
          Gema Pradana / performance marketing desktop
        </span>
      </header>
      <div className="retro-desktop-icons">
        {RETRO_ICONS.map(item => (
          <button
            key={item.id}
            className="retro-icon"
            onDoubleClick={() => onOpen(item.id)}
            onClick={() => onOpen(item.id)}
          >
            <span className={`retro-icon-art ${item.tone}`}>
              <item.icon size={24} />
            </span>
            <b>{item.label}</b>
            <small>{item.hint}</small>
          </button>
        ))}
      </div>
      <div className="retro-hero-copy">
        <span className="retro-kicker">
          {t.heroKicker}
        </span>
        <h1>
          Gema
          <br />
          <em>Pradana</em>
        </h1>
        <p>{t.heroDesc}</p>
        <small style={{display:'block', marginTop:8, font:'12px "Space Grotesk", sans-serif', color:'#c8ff3d'}}>{t.heroDesc2}</small>
        <div className="retro-stat-strip">
          <span>
            <b>12×</b> {t.statRenewal}
          </span>
          <span>
            <b>2B</b> {t.statGmv}
          </span>
          <span>
            <b>250M</b> {t.statBudget}
          </span>
        </div>
      </div>
      <div className="retro-tip">
        <CircleHelp size={16} />
        <div>
          <b>{t.didYouKnow}</b>
          <p>{fact.fact}</p>
          <small
            style={{
              display: "block",
              marginTop: 6,
              font: '10px "VT323", monospace',
              color: "#1a7a85",
            }}
          >
            {fact.source}
          </small>
        </div>
      </div>
      {menuOpen && (
        <>
          <button
            className="retro-menu-backdrop"
            aria-label="Close Start menu"
            onClick={() => setMenuOpen(false)}
          />
          <RetroStartMenu
            onOpen={onOpen}
            onModern={onModern}
            onPower={onPower}
            onClose={() => setMenuOpen(false)}
          />
        </>
      )}
      <div className="retro-quick-panels" aria-label="Quick portfolio panels">
        <button className="retro-mini-window" onClick={() => onOpen("skill")}>
          <b>
            <FileText size={12} /> Sertifikasi
          </b>
          <strong>BNSP · RevoU · Google Ads · Meta 15+ Certified</strong>
          <span>Open certificates →</span>
        </button>
        <button className="retro-mini-window" onClick={() => onOpen("myworks")}>
          <b>
            <Presentation size={12} /> My Works
          </b>
          <strong>livingstone.id · hempel.id · ilovescent.id</strong>
          <span>Open live sites →</span>
        </button>
        <button className="retro-mini-window" onClick={() => onOpen("runner")}>
          <b>
            <Gamepad2 size={12} /> Games
          </b>
          <strong>Slot Machine · Tic Tac Toe · Pinball</strong>
          <span>Play games →</span>
        </button>
      </div>
      <div className="retro-taskbar">
        <button
          className={`retro-start ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(value => !value)}
        >
          <Power size={14} /> Start
        </button>
        <div className="retro-task-item">
          <img src={ASSETS.mark} alt=""  loading="lazy" decoding="async" /> GEMAOS ’95 — Portfolio
        </div>
        <div className="retro-clock">
          <Clock3 size={13} /> {formatClock(clock)}
        </div>
      </div>
    </main>
  );
}

function ModernIcon({
  item,
  position,
  scale,
  onOpen,
  onDragStart,
  onResizeStart,
}: {
  item: (typeof MODERN_ICONS)[number];
  position: { x: number; y: number };
  scale: number;
  onOpen: () => void;
  onDragStart: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onResizeStart: (event: ReactPointerEvent<HTMLButtonElement>) => void;
}) {
  const Icon = item.icon;
  return (
    <div
      className="modern-icon-wrap"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
      onPointerDown={onDragStart}
      onDoubleClick={onOpen}
      onClick={onOpen}
    >
      <button
        className={`modern-icon ${item.color}`}
        aria-label={`Open ${item.label}`}
      >
        <Icon size={22} strokeWidth={1.6} />
      </button>
      <span>{item.label}</span>
      <small>{item.sub}</small>
      <button
        className="floating-resize-handle icon-resize-handle"
        aria-label={`Resize ${item.label}`}
        onPointerDown={event => {
          event.stopPropagation();
          onResizeStart(event);
        }}
      >
        <Maximize2 size={10} />
      </button>
    </div>
  );
}

function ModernDesktop({
  now,
  positions,
  iconSizes,
  widgetLayouts,
  onOpen,
  onRetro,
  onDragStart,
  onResizeStart,
  theme,
  onTheme,
  musicPlaying,
  onMusicToggle,
  volume,
  onVolumeChange,
  weather,
  battery,
  lang,
  onLang,
}: {
  now: Date;
  positions: Record<string, { x: number; y: number }>;
  iconSizes: Record<string, number>;
  widgetLayouts: Record<string, FloatingLayout>;
  onOpen: (id: WindowId) => void;
  onRetro: () => void;
  onDragStart: (
    id: string,
    event: ReactPointerEvent<HTMLDivElement>,
    kind?: "icon" | "widget"
  ) => void;
  onResizeStart: (
    id: string,
    event: ReactPointerEvent<HTMLButtonElement>,
    kind?: "icon" | "widget"
  ) => void;
  theme: string;
  onTheme: (theme: string) => void;
  musicPlaying: boolean;
  onMusicToggle: () => void;
  volume: number;
  onVolumeChange: (v: number) => void;
  weather: WeatherState;
  battery: BatteryState;
  lang: Lang;
  onLang: (l: Lang) => void;
}) {
  const t = DICT[lang];
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState(0);
  const videoReady = useDeferVideo(2800);
  const playlist = [
    "Berapa Kali Kita Akan Saling Memaafkan",
    "Late-night measurement notes",
    "Jakarta / 02:14 field recording",
  ];
  return (
    <main className={`modern-desktop theme-${theme}`} style={{ backgroundImage: `url(${ASSETS.modernWallpaperFallback})` }}>
      {videoReady && <video className="modern-video-bg" autoPlay loop muted playsInline preload="none" poster={ASSETS.modernWallpaperFallback} src={ASSETS.modernWallpaper} />}
      <div className="modern-grain" />
      <header className="modern-menubar">
        <div className="modern-brand">
          <img src={ASSETS.mark} alt="Gema mark"  loading="lazy" decoding="async" />
          <strong>Gema Pradana</strong>
          <button className="modern-menu-link" onClick={() => onOpen("work")}>
            Work
          </button>
          <button className="modern-menu-link" onClick={() => onOpen("about")}>
            About
          </button>
          <button className="modern-menu-link" onClick={() => onOpen("notes")}>
            Help
          </button>
        </div>
        <div className="modern-menu-right">
          <span className="menu-hide-mobile">
            {now.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span>{formatClock(now)}</span>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            in
          </a>
          <a href="mailto:gemapradanaa@gmail.com">@</a>
          <div
            className="customise-button"
            aria-label="Desktop colour customisation"
          >
            <Palette size={14} /> <span>Customisation</span>
            <div className="theme-popover">
              <b>desktop colour</b>
              <div>
                {["blue", "lime", "plum", "mono"].map(color => (
                  <button
                    key={color}
                    className={`theme-dot ${color} ${theme === color ? "selected" : ""}`}
                    onClick={event => {
                      event.stopPropagation();
                      onTheme(color);
                    }}
                    aria-label={`Use ${color} colour theme`}
                  />
                ))}
              </div>
            </div>
          </div>
          <button className="mode-switch-modern" onClick={onRetro}>
            ’95
          </button>
        </div>
      </header>
      <section className="modern-stage" aria-label="Gema 2026 desktop">
        <aside className="modern-side-rail" aria-label="Desktop navigation">
          <span className="side-rail-title">GEMA / INDEX</span>
          <button onClick={() => onOpen("work")}>
            <span>01</span> Work
          </button>
          <button onClick={() => onOpen("about")}>
            <span>02</span> About
          </button>
          <button onClick={() => onOpen("resume")}>
            <span>03</span> CV
          </button>
          <button onClick={() => onOpen("contact")}>
            <span>04</span> Contact
          </button>
          <i />
        </aside>
        <div className="modern-clock">
          <span>{formatClock(now)}</span>
          <small>{t.modernClockSub}</small>
        </div>
        <div
          className="modern-proof-strip"
          aria-label="Verified performance proof"
        >
          <span>
            <b>12×</b>
            <small>RENEWAL ROAS</small>
          </span>
          <span>
            <b>2B</b>
            <small>GMV / 5 MONTHS</small>
          </span>
          <span>
            <b>250M</b>
            <small>IDR / MONTH</small>
          </span>
          <span className="proof-channel">
            <small>CHANNELS</small>
            <em>GOOGLE · META · SEO · TIKTOK</em>
          </span>
        </div>
        <ModernWidgets
          now={now}
          onOpen={onOpen}
          weather={weather}
          battery={battery}
          layouts={widgetLayouts}
          onDragStart={(id, event) => onDragStart(id, event, "widget")}
          onResizeStart={(id, event) => onResizeStart(id, event, "widget")}
        />
        <div className="modern-icon-grid">
          {MODERN_ICONS.map(item => (
            <ModernIcon
              key={item.id}
              item={item}
              position={positions[item.id] ?? item.pos}
              scale={iconSizes[item.id] ?? 1}
              onOpen={() => onOpen(item.id)}
              onDragStart={event => onDragStart(item.id, event)}
              onResizeStart={event => onResizeStart(item.id, event)}
            />
          ))}
        </div>
        <div className="modern-signature">
          <span className="modern-identity">
            <img src={ASSETS.mark} alt=""  loading="lazy" decoding="async" /> GEMA / 2026 · LIVE CASE DESK
          </span>
          <strong>
            Growth has a<br />
            <em>paper trail.</em>
          </strong>
          <span>Gema Pradana</span>
          <small>DIGITAL MARKETING / PERFORMANCE STRATEGY</small>
          <div className="modern-metrics">
            <b>
              12×<small>ROAS</small>
            </b>
            <b>
              2B<small>GMV</small>
            </b>
            <b>
              250M<small>IDR / MO</small>
            </b>
          </div>
          <i />
        </div>
        <aside className={`soundcheck ${playlistOpen ? "playlist-open" : ""}`}>
          <div className="sound-head">
            <button
              className="sound-title-button"
              onClick={() => setPlaylistOpen(value => !value)}
            >
              soundcheck · ☆ gema ☆
            </button>
            <button onClick={onMusicToggle} aria-label="Play or pause music">
              {musicPlaying ? "Ⅱ" : "▶"}
            </button>
          </div>
          <div className="sound-cover">
            <img src={ASSETS.shelfArt} alt="A cassette player on a dark desk"  loading="lazy" decoding="async" />
            <div>
              <small>NOW PLAYING · 0{activeTrack + 1}</small>
              <b>{playlist[activeTrack]}</b>
              <span>RainAmp / Gema’s shelf</span>
            </div>
          </div>
          <div className={`winamp-spectrum ${musicPlaying ? "" : "paused"}`}>
            {Array.from({ length: 12 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${i * 0.07}s`, height: `${8 + ((i * 7) % 20)}px` }} />
            ))}
          </div>
          <div className="sound-volume">
            <Volume2 size={12} />
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={event => onVolumeChange(Number((event.target as HTMLInputElement).value))} aria-label="Volume" />
            <span>{Math.round(volume * 100)}%</span>
            <button onClick={onMusicToggle} aria-label={musicPlaying ? "Pause" : "Play"}>{musicPlaying ? "Ⅱ" : "▶"}</button>
          </div>
          <div className="sound-controls">
            <button
              onClick={() =>
                setActiveTrack(
                  track => (track + playlist.length - 1) % playlist.length
                )
              }
            >
              <ArrowLeft size={14} />
            </button>
            <button onClick={onMusicToggle} className="sound-play">
              {musicPlaying ? "Ⅱ" : <Play size={14} fill="currentColor" />}
            </button>
            <button
              onClick={() =>
                setActiveTrack(track => (track + 1) % playlist.length)
              }
            >
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="sound-track">
            <span style={{ width: `${37 + activeTrack * 21}%` }} />
            <i />
          </div>
          <a
            href="https://music.youtube.com/watch?v=US8TFTvB0b0"
            target="_blank"
            rel="noreferrer"
          >
            open in youtube music ↗
          </a>
          {playlistOpen && (
            <div className="sound-playlist">
              {playlist.map((track, index) => (
                <button
                  key={track}
                  className={activeTrack === index ? "active" : ""}
                  onClick={() => {
                    setActiveTrack(index);
                    setPlaylistOpen(false);
                  }}
                >
                  {`0${index + 1}`} <span>{track}</span>
                </button>
              ))}
            </div>
          )}
        </aside>
        <nav className="modern-dock" aria-label="Tools">
          <span className="dock-label">drag me around</span>
          {DOCK_ITEMS.map((item, index) => (
            <button
              key={index}
              className={`dock-icon dock-${index}`}
              onClick={() => onOpen(item.target)}
              aria-label={item.label}
              title={item.label}
            >
              <item.icon size={18} />
            </button>
          ))}
        </nav>
        <button className="modern-meet" onClick={() => onOpen("about")}>
          <span>Meet Gema</span>
          <ArrowDownRight size={17} />
        </button>
      </section>
      <footer className="modern-footer">
        <span>© 2026 GEMA PRADANA</span>
        <span>Selected for clarity, built for movement.</span>
        <button onClick={onRetro}>
          <LayoutGrid size={14} /> {t.switchTo95}
        </button>
      </footer>
    </main>
  );
}

function WorkContent({ onOpen, lang }: { onOpen: (id: WindowId) => void; lang: Lang }) {
  const t = DICT[lang];
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  const [section, setSection] = useState<CaseSection>("overview");
  const selected =
    PROJECTS.find(project => project.id === selectedId) ?? PROJECTS[0];
  const detail = CASE_STUDY_DETAILS[selected.id][section];

  return (
    <div className="work-content">
      <div className="work-lead">
        <div>
          <span className="section-kicker">{t.workKicker}</span>
          <h3>{t.workLead}</h3>
          <p>
            {t.workLeadP}
          </p>
        </div>
        <img src={ASSETS.caseArt} alt="Abstract campaign charts and arrows"  loading="lazy" decoding="async" />
      </div>
      <div className="case-workspace">
        <aside className="case-project-rail">
          <span className="case-rail-label">PROJECT INDEX</span>
          {PROJECTS.map(project => (
            <button
              key={project.id}
              className={`case-project-tab ${project.color} ${selected.id === project.id ? "selected" : ""}`}
              onClick={() => {
                setSelectedId(project.id);
                setSection("overview");
              }}
            >
              <span>{project.number}</span>
              <b>{project.title}</b>
              <small>{project.tag}</small>
            </button>
          ))}
          <button
            className="case-contact-link"
            onClick={() => onOpen("contact")}
          >
            Start a conversation <ArrowRight size={14} />
          </button>
        </aside>
        <div className="case-study-panel">
          <div className="case-study-topline">
            <span>{selected.tag} / GEMA PORTFOLIO</span>
            <strong>{selected.result}</strong>
          </div>
          <div className="case-section-tabs">
            {(
              ["overview", "challenge", "discovery", "outcome"] as CaseSection[]
            ).map(item => (
              <button
                key={item}
                className={section === item ? "active" : ""}
                onClick={() => setSection(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="case-study-body">
            <span className="section-kicker">{detail.label}</span>
            <h3>{detail.title}</h3>
            <p>{detail.copy}</p>
            <div className="case-signal">
              <span>PRIMARY SIGNAL</span>
              <strong>{detail.signal}</strong>
            </div>
            <div className="case-evidence">
              {detail.evidence.map((item, index) => (
                <div key={item}>
                  <b>0{index + 1}</b>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="case-study-footer">
            <span>GEMA / PERFORMANCE MARKETING</span>
            <button onClick={() => onOpen("resume")}>
              See the full CV <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RetroAbout({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <div className="retro-content">
      <div className="retro-profile-card">
        <div className="pixel-avatar">GP</div>
        <div>
          <h3>Gema Pradana</h3>
          <p>Digital marketer / growth operator / curious human.</p>
          <span>JAKARTA, ID · ONLINE</span>
        </div>
      </div>
      <p className="retro-large-copy">
        I build performance systems that make ambitious products easier to find, easier to trust, and easier to grow.
      </p>
      <div className="retro-two-col">
        <div>
          <b>FOCUS</b>
          <p>
            Paid acquisition
            <br />
            Retention loops
            <br />
            Creative testing
            <br />
            Team direction
          </p>
        </div>
        <div>
          <b>STATUS</b>
          <p>
            <span className="status-dot" /> Available for the right brief
            <br />
            Open to remote collaboration
          </p>
        </div>
      </div>
    </div>
  );
}

function WindowContent({
  id,
  mode,
  onOpen,
  onRunnerStep,
  runnerStep,
  musicPlaying,
  onMusicToggle,
  lang,
}: {
  id: WindowId;
  mode: Mode;
  onOpen: (id: WindowId) => void;
  onRunnerStep: () => void;
  runnerStep: number;
  musicPlaying: boolean;
  onMusicToggle: () => void;
  lang: Lang;
}) {
  const t = DICT[lang];
  if (id === "work") return <WorkContent onOpen={onOpen} lang={lang} />;
  if (id === "about")
    return mode === "retro" ? (
      <RetroAbout lang={lang} />
    ) : (
      <div className="about-modern">
        <span className="section-kicker">{t.aboutKicker}</span>
        <h3>{t.aboutTitle}</h3>
        <p>
          {t.aboutP1}
        </p>
        <p style={{marginTop:16, color:"#2a4a4a", fontSize:"15px", lineHeight:"1.6", maxWidth:580}}>Throughout my career, I have developed a comprehensive understanding of what it takes to build and scale successful digital marketing operations. My expertise spans the full spectrum of performance marketing, from strategic planning and budget allocation to tactical execution and continuous optimisation. I have consistently demonstrated the ability to identify market opportunities, develop innovative solutions, and implement strategies that drive meaningful business impact. My approach is fundamentally rooted in data-driven decision making — building strategies on rigorous analysis of performance metrics, consumer behaviour, and market dynamics.</p>
        <div className="about-proof">
          <span>
            <b>14+</b>
            <small>chapters of experience</small>
          </span>
          <span>
            <b>2B</b>
            <small>GMV built from zero</small>
          </span>
          <span>
            <b>12×</b>
            <small>renewal ROAS</small>
          </span>
        </div>
        <a href="mailto:gemapradanaa@gmail.com" className="text-link">
          Start a conversation <ArrowRight size={14} />
        </a>
      </div>
    );
  if (id === "services")
    return (
      <div className="services-content">
        <span className="section-kicker">{t.servicesKicker}</span>
        <div className="service-grid">
          {[
            {
              title: "Performance systems",
              body: "Google, Meta, TikTok, X, LinkedIn Ads · GA4 · SEO",
              icon: BarChart3,
            },
            {
              title: "Growth narratives",
              body: "Positioning, landing pages, creative testing, UGC",
              icon: Presentation,
            },
            {
              title: "Team direction",
              body: "Built and led teams of 6–12 across internal and client work",
              icon: UserRound,
            },
            {
              title: "Commercial clarity",
              body: "Budgets, ROAS, GMV, lead quality, and the next decision",
              icon: Terminal,
            },
          ].map(({ title, body, icon: Icon }) => (
            <div className="service-card" key={title}>
              <Icon size={20} />
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  if (id === "resume")
    return (
      <div className="resume-content">
        <div className="resume-header">
          <div>
            <span className="section-kicker">GEMA PRADANA / CV 2026</span>
            <h3>
              Digital Marketing &<br />
              <em>Performance Strategy</em>
            </h3>
          </div>
          <FileText size={42} strokeWidth={1} />
        </div>
        <div className="career-list">
          {CAREER.map(item => (
            <div className="career-row" key={item.period}>
              <span>{item.period}</span>
              <div>
                <b>{item.role}</b>
                <strong>{item.company}</strong>
                <p>{item.detail}</p>
              </div>
              <em>{item.metric}</em>
            </div>
          ))}
        </div>
        <div className="resume-actions">
          <a
            className="solid-action"
            href="mailto:gemapradanaa@gmail.com?subject=Portfolio%20conversation"
          >
            <Send size={14} /> Request full CV
          </a>
          <a
            className="outline-action"
            href="/files/Gema-Pradana-CV.pdf"
            download="Gema-Pradana-CV.pdf"
          >
            <Download size={14} /> Download CV PDF
          </a>
        </div>
      </div>
    );
  if (id === "skill") return <SkillContent />;
  if (id === "rig") return <RigContent />;
  if (id === "runner") return <GamesContent />;
  if (id === "music")
    return (
      <div className="music-content">
        <div className="music-art">
          <img src={ASSETS.shelfArt} alt="Cassette player and notebook"  loading="lazy" decoding="async" />
          <div>
            <span>RAINAMP / 01</span>
            <h3>Berapa Kali Kita Akan Saling Memaafkan</h3>
            <p>
              Soundtrack for the parts of the job that happen after the
              dashboard closes.
            </p>
          </div>
        </div>
        <button className="solid-action" onClick={onMusicToggle}>
          {musicPlaying ? "Pause soundcheck" : "Play soundcheck"}{" "}
          <Play size={14} />
        </button>
        <a
          className="text-link"
          href="https://music.youtube.com/watch?v=US8TFTvB0b0"
          target="_blank"
          rel="noreferrer"
        >
          Open in YouTube Music <ArrowRight size={14} />
        </a>
      </div>
    );
  if (id === "contact")
    return (
      <div className="contact-content">
        <span className="section-kicker">{t.contactKicker}</span>
        <h3>
          {t.contactH3a}
          <br />
          <em>{t.contactH3b}</em>
        </h3>
        <p>
          {t.contactP}
        </p>
        <a className="contact-line" href="mailto:gemapradanaa@gmail.com">
          <Mail size={16} /> gemapradanaa@gmail.com
        </a>
        <a className="contact-line" href="tel:+6289662980426">
          <MessageCircle size={16} /> +62 896 6298 0426
        </a>
        <span className="contact-location">
          <MapPin size={15} /> Jakarta, Indonesia · remote-friendly
        </span>
      </div>
    );
  if (id === "notes")
    return (
      <div className="notes-content">
        <span className="section-kicker">STICKIES / FIELD NOTES</span>
        <div className="sticky-grid">
          <div className="sticky sticky-yellow">
            A good creative test changes what you believe, not only what you
            see.
          </div>
          <div className="sticky sticky-blue">
            Measure the renewal loop separately. New users and existing users do
            not need the same story.
          </div>
          <div className="sticky sticky-lime">
            The next decision is part of the result.
          </div>
        </div>
      </div>
    );
  if (id === "shelf")
    return (
      <div className="shelf-content">
        <img src={ASSETS.shelfArt} alt="Personal archive still life"  loading="lazy" decoding="async" />
        <div>
          <span className="section-kicker">MY SHELF / OFF THE CLOCK</span>
          <h3>Sound, objects, and small systems.</h3>
          <p>
            When the campaign tabs are closed: a little music, a few films, and
            the habit of collecting references from anywhere.
          </p>
          <div className="shelf-tags">
            <span>indie rock</span>
            <span>slow cinema</span>
            <span>field notes</span>
            <span>old software</span>
          </div>
        </div>
        <div className="book-list">
          <span className="section-kicker" style={{ marginTop: 22 }}>
            READING LIST / 11 BOOKS
          </span>
          <div className="book-grid">
            {BOOKS.map(b => (
              <div key={b.title} className="book-card">
                <img src={b.cover} alt={b.title} loading="lazy" />
                <div>
                  <span>{b.tag}</span>
                  <strong>{b.title}</strong>
                  <small>{b.author}</small>
                  <p>{b.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="book-list" style={{ marginTop: 18 }}>
          <span className="section-kicker">FILMS / 8 TITLES</span>
          <div className="book-grid">
            {FILMS.map(f => (
              <div key={f.title} className="book-card">
                <img
                  src={f.poster}
                  alt={f.title}
                  loading="lazy"
                  style={{ height: 96 }}
                />
                <div>
                  <span>FILM · {f.year}</span>
                  <strong>{f.title}</strong>
                  <p>{f.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="book-list" style={{ marginTop: 18 }}>
          <span className="section-kicker">MUSIC / 13 ARTISTS</span>
          <div className="book-grid">
            {MUSIC.map(m => (
              <div key={m.name} className="book-card">
                <img
                  src={m.poster}
                  alt={m.name}
                  loading="lazy"
                  style={{ height: 68, borderRadius: 34 }}
                />
                <div>
                  <span>{m.tag}</span>
                  <strong>{m.name}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  if (id === "chess")
    return (
      <div className="strategy-content">
        <span className="section-kicker">STRATEGY BOARD / MAKE A MOVE</span>
        <h3>What moves first?</h3>
        <p>Choose the lever you would test before touching the budget.</p>
        <div className="strategy-options">
          <button onClick={() => onOpen("services")}>
            <BarChart3 size={16} /> Offer
          </button>
          <button onClick={() => onOpen("work")}>
            <Sparkles size={16} /> Creative
          </button>
          <button onClick={() => onOpen("resume")}>
            <Trophy size={16} /> Measurement
          </button>
        </div>
        <div className="strategy-board">
          {Array.from({ length: 16 }).map((_, i) => (
            <i key={i} className={i % 3 === 0 ? "filled" : ""} />
          ))}
        </div>
      </div>
    );
  if (id === "synth") return <SynthContent />;
  if (id === "myworks") return <MyWorksContent />;
  if (id === "credits") return <CreditsContent />;
  if (id === "sources") return <SourcesContent />;
  return (
    <div className="photos-content">
      <span className="section-kicker">PHOTOGRAPHS / REFERENCE ARCHIVE</span>
      <div className="photo-grid">
        <img src={ASSETS.caseArt} alt="Campaign chart collage"  loading="lazy" decoding="async" />
        <img src={ASSETS.shelfArt} alt="Creative desk objects"  loading="lazy" decoding="async" />
        <div className="photo-placeholder">
          Jakarta
          <br />
          <b>02:14</b>
        </div>
      </div>
    </div>
  );
}

function SkillContent() {
  const favouriteTools = [
    "Opencode",
    "Google Flow",
    "Manus",
    "Figma",
    "WordPress",
    "Elementor",
    "Capcut",
    "Google Analytics",
    "Google Tag Manager",
    "SEO",
    "Google Search Console",
    "Qontak Mekari",
    "Sleekflow",
    "Mailchimp",
    "Meta Ads",
    "Google Ads",
    "LinkedIn Ads",
    "TikTok Ads",
    "Shopee Ads",
    "E-Commerce Ads",
  ];
  return (
    <div className="myworks-content">
      <span className="section-kicker">FAVORITE TOOLS / STACK & CODES</span>
      <h3>
        Tools favorit
        <br />
        <em>yang dipakai harian.</em>
      </h3>
      <p>Stack Gema Pradana — dari AI workflow sampai paid ads.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        {favouriteTools.map(tool => (
          <span key={tool} style={{ padding: "8px 12px", background: "#eef4f0", border: "1px solid #d0d8d0", borderRadius: 99, font: "13px Space Grotesk", color: "#0f2e2e", fontWeight: 600 }}>
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}

function RigContent() {
  const rigs = [
    { name: "MacBook Pro M1", spec: "8GB / 256GB", tag: "MAC" },
    { name: "Ryzen 5 5600 + RTX 4060", spec: "32GB RAM · 2TB SSD", tag: "PC" },
    { name: "Skyworth 27″ 144Hz", spec: "144Hz · 27 inch", tag: "DISPLAY" },
    { name: "Xiaomi 27″ 280Hz", spec: "280Hz · 27 inch", tag: "DISPLAY" },
    { name: "Ducky Year Of The Ox", spec: "Mechanical Keyboard", tag: "KEYBOARD" },
    { name: "Glorious Model O", spec: "Wireless Mouse", tag: "MOUSE" },
  ];
  return (
    <div className="myworks-content">
      <span className="section-kicker">MY RIG / PERSONAL SETUP</span>
      <h3>
        Setup harian
        <br />
        <em>untuk kerja & main.</em>
      </h3>
      <p>Mesin yang dipakai Gema Pradana untuk ngulik ads, ngedit, dan gaming.</p>
      <div className="myworks-grid">
        {rigs.map(r => (
          <div key={r.name} className="myworks-card">
            <span>{r.tag}</span>
            <strong>{r.name}</strong>
            <p>{r.spec}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GamesContent() {
  const [slot, setSlot] = useState(["🍒", "🍋", "🍒"]);
  const [ticBoard, setTicBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const spin = () => setSlot([["🍒", "🍋", "⭐", "🔔", "💎"][Math.floor(Math.random() * 5)], ["🍒", "🍋", "⭐", "🔔", "💎"][Math.floor(Math.random() * 5)], ["🍒", "🍋", "⭐", "🔔", "💎"][Math.floor(Math.random() * 5)]]);
  const calcWinner = (b: Array<string | null>) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(const [a,b1,c] of lines) if(b[a] && b[a]===b[b1] && b[a]===b[c]) return b[a];
    return null;
  };
  const winner = calcWinner(ticBoard);
  const isDraw = !winner && ticBoard.every(Boolean);
  const handleTic = (i: number) => {
    if (ticBoard[i] || winner) return;
    const next = [...ticBoard];
    next[i] = "X";
    let w = calcWinner(next);
    if(w || next.every(Boolean)) { setTicBoard(next); setXIsNext(false); return; }
    // bot O random
    const empties = next.map((v,idx)=> v?null:idx).filter(v=>v!==null) as number[];
    if(empties.length){ const r = empties[Math.floor(Math.random()*empties.length)]; next[r]="O"; }
    setTicBoard(next);
    setXIsNext(true);
  };
  const resetTic = () => { setTicBoard(Array(9).fill(null)); setXIsNext(true); };
  const win = slot[0] === slot[1] && slot[1] === slot[2] ? "JACKPOT!" : slot[0] === slot[1] || slot[1] === slot[2] ? "Nice!" : "Spin again";
  return (
    <div className="myworks-content">
      <span className="section-kicker">GAMES / PLAYGROUND</span>
      <h3>
        Slot · Tic Tac Toe · Pinball
        <br />
        <em>main sebentar.</em>
      </h3>
      <div className="myworks-grid">
        <div className="myworks-card">
          <span>SLOT MACHINE</span>
          <div style={{ display: "flex", gap: 8, fontSize: 32, justifyContent: "center", margin: "12px 0" }}>
            {slot.map((s, i) => (
              <span key={i} style={{ width: 48, height: 48, display: "grid", placeItems: "center", background: "#0f2e2e", color: "#c8ff3d", borderRadius: 8 }}>
                {s}
              </span>
            ))}
          </div>
          <small>{win}</small>
          <button className="solid-action" onClick={spin} style={{ marginTop: 10 }}>
            Spin
          </button>
        </div>
        <div className="myworks-card">
          <span>TIC TAC TOE — vs Bot</span>
          <small style={{ color: winner ? "#0e6b75" : "#5a6d6a", font: "12px Space Grotesk", marginTop: 6, display: "block" }}>
            {winner ? `${winner} wins! 3 in a row` : isDraw ? "Draw!" : "You are X — tap to play"}
          </small>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, margin: "12px 0", maxWidth: 180 }}>
            {ticBoard.map((v, i) => (
              <button key={i} onClick={() => handleTic(i)} disabled={!!winner} style={{ width: 54, height: 54, background: v ? "#dbe6e3" : "#eef4f0", border: "1px solid #d0d8d0", borderRadius: 8, font: "20px Space Grotesk", color: "#0f2e2e", opacity: winner && !v ? 0.5 : 1 }}>
                {v}
              </button>
            ))}
          </div>
          <button className="outline-action" onClick={resetTic}>
            Reset
          </button>
        </div>
        <div className="myworks-card">
          <span>PINBALL</span>
          <div style={{ height: 120, background: "linear-gradient(180deg, #0f2e2e, #1a4a4a)", borderRadius: 8, display: "grid", placeItems: "center", color: "#c8ff3d", font: "14px VT323", margin: "12px 0" }}>
            ● — ○ — ●<br />
            Pinball coming soon
          </div>
          <small>Use flipper → score!</small>
        </div>
      </div>
    </div>
  );
}

function CreditsContent() {
  return (
    <div className="myworks-content">
      <span className="section-kicker">CREDITS / TERIMA KASIH</span>
      <h3>
        Dibuat dengan
        <br />
        <em>referensi terbuka.</em>
      </h3>
      <p>Portfolio ini terinspirasi dari sistem operasi klasik dan desktop modern.</p>
      <div className="myworks-grid">
        <a href="https://anshry.dev" target="_blank" rel="noreferrer" className="myworks-card">
          <span>CREATOR</span>
          <strong>anshry.dev</strong>
          <p>Inspirasi struktur & interaksi desktop</p>
          <small>open ↗</small>
        </a>
        <a href="https://id.pinterest.com/pin/69735494225962758/" target="_blank" rel="noreferrer" className="myworks-card">
          <span>PINTEREST</span>
          <strong>Pinterest Pin</strong>
          <p>Moodboard & visual direction</p>
          <small>open ↗</small>
        </a>
      </div>
    </div>
  );
}

function SourcesContent() {
  const refs = [
    { name: "robbyyeager.com", desc: "Retro layout, navigation, motion", url: "https://robbyyeager.com" },
    { name: "parinazkassemi.com", desc: "Modern editorial, typography", url: "https://www.parinazkassemi.com" },
    { name: "macOS Tahoe Liquid Glass", desc: "Translucent dock & menu bar", url: "https://www.apple.com/macos" },
    { name: "Vaporwave / Cyberpunk", desc: "Wallpaper & grain", url: "https://www.figma.com" },
    { name: "Open Meteo", desc: "Live Jakarta weather", url: "https://open-meteo.com" },
    { name: "Google Fonts", desc: "DM Sans, Space Grotesk, VT323", url: "https://fonts.google.com" },
  ];
  return (
    <div className="myworks-content">
      <span className="section-kicker">SOURCES / REFERENSI</span>
      <h3>
        Semua ide
        <br />
        <em>ada sumbernya.</em>
      </h3>
      <p>Referensi yang dipakai untuk membangun dual-desktop ini.</p>
      <div className="myworks-grid">
        {refs.map(r => (
          <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="myworks-card">
            <span>REF</span>
            <strong>{r.name}</strong>
            <p>{r.desc}</p>
            <small>open ↗</small>
          </a>
        ))}
      </div>
    </div>
  );
}

function MyWorksContent() {
  const works = [
    { name: "Segerwaras", url: "https://shopee.co.id/segerwarasindonesia", tiktok: "https://www.tiktok.com/@segerwarasindonesia", instagram: "https://www.instagram.com/_segerwaras_/", desc: "Seger Waras Wellness — seger waras indonesia", tag: "HERBAL" },
    { name: "Ruang Digital HnH", url: "https://ruangdigitalhnh.com", desc: "Digital agency — 100+ SKUs, 10× ROAS", tag: "AGENCY" },
    { name: "Pamokids", url: "https://shopee.co.id/pamokids", tiktok: "https://www.tiktok.com/@pamokids.official", instagram: "https://www.instagram.com/pamokids.id/", desc: "Kids fashion — 250M GMV/3mo", tag: "KIDS" },
    { name: "Okinawa Sushi — Bandung Riau", url: "https://okinawasushibandung.com", instagram: "https://www.instagram.com/okinawasushi_bandungriau/", desc: "F&B — Jl. Riau Bandung, robot server", tag: "F&B" },
    { name: "Okinawa Sushi — Transmart Makassar", url: "https://okinawatsm.com", instagram: "https://www.instagram.com/okinawasushi_tsmmakassar/", desc: "F&B — TSM Makassar, robot server", tag: "F&B" },
    { name: "Promobile", url: "https://promobile.id", instagram: "https://www.instagram.com/promobile_ind/", tiktok: "https://www.tiktok.com/tag/promobile", desc: "Promobile Malang — body repair since 2002", tag: "MOBILE" },
    { name: "Proscoot", url: "https://proscoot.id", instagram: "https://www.instagram.com/proscoot_ind/", tiktok: "https://www.tiktok.com/tag/proscootmalang", desc: "Proscoot Malang — vespa paint & body 3.3K", tag: "AUTOMOTIVE" },
    { name: "Shendara", url: "https://shopee.co.id/shendara", tiktok: "https://www.tiktok.com/@shendara.officialstore", instagram: "https://www.instagram.com/shendara.official/", desc: "Shendara original store — rendam kaki herbal", tag: "FASHION" },
    { name: "H+ Automotive", url: "https://shopee.co.id/hplusautomotif", tiktok: "https://www.tiktok.com/@hplusautomotif", desc: "Automotive — cek akun resmi H+", tag: "AUTOMOTIVE" },
    { name: "Sun N Sand", url: "https://bali-sunshine.com/sun-n-sand-beachfront/", instagram: "https://www.instagram.com/grandsunshineresort/", desc: "Sun N Sand Beachfront Tanjung Benoa — Bali Sunshine", tag: "HOSPITALITY" },
    { name: "Bali Sunshine", url: "https://bali-sunshine.com", instagram: "https://www.instagram.com/grandsunshineresort/", desc: "Bali Sunshine Hotel Nusa Dua — 33 rooms", tag: "HOSPITALITY" },
    { name: "Grand Sunshine", url: "https://www.grand-sunshine.com", instagram: "https://www.instagram.com/grandsunshineresort/", desc: "Grand Sunshine Resort Soreang 4★ 27K", tag: "HOSPITALITY" },
    { name: "Protecars", url: "https://shopee.co.id/protecars.id", instagram: "https://www.instagram.com/protecars.id/", desc: "Protecars Autocare 68 followers — bukan sulap cuma bersih", tag: "AUTOMOTIVE" },
    { name: "Lokaherbal", url: "https://shopee.co.id/lokaherbal", instagram: "https://www.instagram.com/lokaherbal.official/", tiktok: "https://www.tiktok.com/@lokaherbal", desc: "Loka Herbal Official 14 followers — herbal keluarga", tag: "HERBAL" },
  ];
  return (
    <div className="myworks-content">
      <span className="section-kicker">MY WORKS / LIVE PROPERTIES</span>
      <h3>
        Web yang sudah jalan,
        <br />
        <em>bukan mockup.</em>
      </h3>
      <p>Spin-off dari kerja performance. Klik buka tab baru.</p>
      <div className="myworks-grid">
        {works.map(w => (
          <div key={w.name} className="myworks-card">
            <span>{w.tag}</span>
            <strong>{w.name}</strong>
            <p>{w.desc}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
              <a href={w.url} target="_blank" rel="noreferrer" className="myworks-link">
                {(w as any).tiktok ? "Shopee ↗" : "open ↗"}
              </a>
              {(w as any).instagram && (
                <a href={(w as any).instagram} target="_blank" rel="noreferrer" className="myworks-link" style={{ background: "#E1306C" }}>
                  IG ↗
                </a>
              )}
              {(w as any).tiktok && (
                <a href={(w as any).tiktok} target="_blank" rel="noreferrer" className="myworks-link tiktok">
                  TikTok ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SynthContent() {
  const [levels, setLevels] = useState([62, 30, 76, 46]);
  return (
    <div className="synth-content">
      <span className="section-kicker">SYNTHESIZER / MOVE THE SIGNAL</span>
      <h3>Make the dashboard breathe.</h3>
      <div className="synth-wave">
        {levels.map((level, i) => (
          <i key={i} style={{ height: `${level}%` }} />
        ))}
      </div>
      <div className="synth-sliders">
        {levels.map((level, i) => (
          <label key={i}>
            <span>{["MEDIA", "CREATIVE", "DATA", "TEAM"][i]}</span>
            <input
              type="range"
              min="8"
              max="95"
              value={level}
              onChange={e =>
                setLevels(current =>
                  current.map((value, index) =>
                    index === i ? Number(e.target.value) : value
                  )
                )
              }
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function ScreenSaver({ onWake }: { onWake: () => void }) {
  return (
    <div
      className="screensaver"
      onClick={onWake}
      onKeyDown={onWake}
      role="button"
      tabIndex={0}
      aria-label="Wake screensaver"
    >
      <div className="screensaver-stars">
        {Array.from({ length: 28 }, (_, index) => (
          <i
            key={index}
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 61) % 100}%`,
              animationDelay: `${(index % 7) * -0.4}s`,
            }}
          />
        ))}
      </div>
      <div className="screensaver-logo">
        <img src={ASSETS.mark} alt="Gema mark"  loading="lazy" decoding="async" />
        <span>GEMA</span>
      </div>
      <div className="screensaver-status">
        <strong>GEMAOS ’95 / screensaver</strong>
        <span>Move mouse or click to wake</span>
      </div>
      <div className="screensaver-corner">portfolio paused · 5:00 idle</div>
    </div>
  );
}

function TriviaTicker({
  item,
  onOpen,
  pos,
  onPointerDown,
}: {
  item: (typeof DID_YOU_KNOW_FACTS)[number];
  onOpen: (id: WindowId) => void;
  pos: { x: number; y: number };
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const internal = false;
  return (
    <aside
      className="trivia-ticker"
      role="status"
      aria-live="polite"
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={onPointerDown}
    >
      <div className="trivia-ticker-drag-hint">
        <Move size={10} /> drag me
      </div>
      <span className="trivia-label">
        <Sparkles size={12} /> MARKETING TRIVIA
      </span>
      <p>{item.fact}</p>
      {internal ? (
        <button onClick={() => onOpen("work")}>{item.source} ↗</button>
      ) : (
        <span>{item.source}</span>
      )}
    </aside>
  );
}

function EraTransition({
  target,
  progress,
}: {
  target: Mode;
  progress: number;
}) {
  const isModern = target === "modern";
  return (
    <div
      className={`era-transition ${isModern ? "to-modern" : "to-retro"}`}
      role="status"
      aria-live="assertive"
    >
      <div className="transition-noise" />
      <div className="transition-card">
        <div className="transition-brand">
          <img src={ASSETS.mark} alt="Gema mark"  loading="lazy" decoding="async" />
          <span>{isModern ? "GEMA / 2026" : "GEMAOS ’95"}</span>
        </div>
        <h2>
          {isModern
            ? "Installing a new desktop"
            : "Restoring the classic desktop"}
        </h2>
        <p>
          {isModern
            ? "Moving from scanlines to live signals…"
            : "Rebuilding windows, menus, and the taskbar…"}
        </p>
        <div className="transition-progress">
          <i style={{ width: `${progress}%` }} />
        </div>
        <div className="transition-status">
          <span>{isModern ? "MIGRATION" : "BOOT SEQUENCE"}</span>
          <b>{Math.round(progress)}%</b>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [mode, setMode] = useState<Mode>("retro");
  const [bootProgress, setBootProgress] = useState(0);
  const [bootDone, setBootDone] = useState(false);
  const [modernUnlocked] = useState(false);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [theme, setTheme] = useState("blue");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.13);
  const [runnerStep, setRunnerStep] = useState(0);
  const [screenSaverActive, setScreenSaverActive] = useState(false);
  const [weather, setWeather] = useState<WeatherState>({
    status: "loading",
    temperature: null,
    apparent: null,
    code: null,
    hourly: [],
  });
  const [battery, setBattery] = useState<BatteryState>({
    level: null,
    charging: false,
  });
  const [didYouKnowIndex, setDidYouKnowIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<Mode>(
    mode === "retro" ? "modern" : "retro"
  );
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number }>
  >(() => Object.fromEntries(MODERN_ICONS.map(item => [item.id, item.pos])));
  const [iconSizes, setIconSizes] = useState<Record<string, number>>(() =>
    Object.fromEntries(MODERN_ICONS.map(item => [item.id, 1]))
  );
  const [widgetLayouts, setWidgetLayouts] = useState<
    Record<string, FloatingLayout>
  >(MODERN_WIDGET_LAYOUTS);
  const [mobileWidgetLayouts, setMobileWidgetLayouts] = useState<
    Record<string, FloatingLayout>
  >(MOBILE_WIDGET_LAYOUTS);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const dragRef = useRef<{
    id: string;
    kind: "icon" | "widget";
    resizing: boolean;
    compact: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    originW: number;
    originH: number;
    moved: boolean;
  } | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const clockTimer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(clockTimer);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop = true;
    const tryPlay = () => audio.play().catch(() => {});
    tryPlay();
    const onFirstInteract = () => {
      tryPlay();
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    };
    window.addEventListener("pointerdown", onFirstInteract, { once: true });
    window.addEventListener("keydown", onFirstInteract, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    };
  }, [bootDone, modernUnlocked, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    if (musicPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [musicPlaying, volume]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 850px)");
    const sync = () => setIsCompactViewport(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadWeather = async () => {
      try {
        const params = new URLSearchParams({
          latitude: "-6.1751",
          longitude: "106.8650",
          current: "temperature_2m,apparent_temperature,weather_code",
          hourly: "temperature_2m,weather_code",
          timezone: "Asia/Jakarta",
          forecast_days: "1",
        });
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params.toString()}`
        );
        if (!response.ok) throw new Error("Weather request failed");
        const data = await response.json();
        const hourly = (data.hourly?.time ?? [])
          .map((time: string, index: number) => ({
            time: new Date(time).toLocaleTimeString("en-US", {
              hour: "2-digit",
              hour12: false,
              timeZone: "Asia/Jakarta",
            }),
            temperature: Number(data.hourly.temperature_2m?.[index] ?? 0),
            code: Number(data.hourly.weather_code?.[index] ?? -1),
          }))
          .slice(
            Math.max(0, new Date().getHours()),
            Math.max(0, new Date().getHours()) + 6
          );
        if (mounted)
          setWeather({
            status: "ready",
            temperature: Number(data.current?.temperature_2m ?? 0),
            apparent: Number(data.current?.apparent_temperature ?? 0),
            code: Number(data.current?.weather_code ?? 0),
            hourly,
          });
      } catch {
        if (mounted) setWeather(current => ({ ...current, status: "error" }));
      }
    };
    loadWeather();
    const refresh = window.setInterval(loadWeather, 15 * 60 * 1000);
    return () => {
      mounted = false;
      window.clearInterval(refresh);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    let manager: {
      level: number;
      charging: boolean;
      addEventListener?: (event: string, listener: () => void) => void;
      removeEventListener?: (event: string, listener: () => void) => void;
    } | null = null;
    let sync: (() => void) | null = null;
    const getBattery = (
      navigator as Navigator & { getBattery?: () => Promise<typeof manager> }
    ).getBattery;
    if (!getBattery)
      return () => {
        mounted = false;
      };
    getBattery
      .call(navigator)
      .then(result => {
        if (!mounted || !result) return;
        manager = result;
        sync = () =>
          setBattery({
            level: Math.round(result.level * 100),
            charging: result.charging,
          });
        sync();
        result.addEventListener?.("levelchange", sync);
        result.addEventListener?.("chargingchange", sync);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
      if (manager && sync) {
        manager.removeEventListener?.("levelchange", sync);
        manager.removeEventListener?.("chargingchange", sync);
      }
    };
  }, []);

  useEffect(() => {
    const triviaTimer = window.setInterval(
      () =>
        setDidYouKnowIndex(index => (index + 1) % DID_YOU_KNOW_FACTS.length),
      7000
    );
    return () => window.clearInterval(triviaTimer);
  }, []);

  useEffect(() => {
    if (mode !== "retro" || bootDone) return;
    const bootTimer = window.setInterval(
      () =>
        setBootProgress(value => {
          if (value >= 100) {
            window.clearInterval(bootTimer);
            setBootDone(true);
            return 100;
          }
          return Math.min(100, value + 4);
        }),
      55
    );
    return () => window.clearInterval(bootTimer);
  }, [mode, bootDone]);

  useEffect(() => {
    localStorage.setItem("gema-mode", mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.lang = "en";
    document.title = "Gema Pradana — Performance Marketing | 0→2B GMV · 12× ROAS";
  }, [lang]);

  useEffect(() => {
    if (
      (mode === "retro" && !bootDone) ||
      (mode === "modern" && !modernUnlocked)
    )
      return;
    let idleTimer = window.setTimeout(
      () => setScreenSaverActive(true),
      5 * 60 * 1000
    );
    const resetIdle = () => {
      if (screenSaverActive) setScreenSaverActive(false);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(
        () => setScreenSaverActive(true),
        5 * 60 * 1000
      );
    };
    const events = [
      "pointerdown",
      "pointermove",
      "keydown",
      "touchstart",
      "wheel",
    ];
    events.forEach(event =>
      window.addEventListener(event, resetIdle, { passive: true })
    );
    return () => {
      window.clearTimeout(idleTimer);
      events.forEach(event => window.removeEventListener(event, resetIdle));
    };
  }, [mode, bootDone, modernUnlocked, screenSaverActive]);

  const switchMode = (next: Mode) => {
    if (transitioning || next === mode) return;
    if (transitionTimerRef.current)
      window.clearInterval(transitionTimerRef.current);
    setTransitionTarget(next);
    setTransitionProgress(0);
    setTransitioning(true);
    const startedAt = performance.now();
    transitionTimerRef.current = window.setInterval(() => {
      const progress = Math.min(
        100,
        ((performance.now() - startedAt) / 1800) * 100
      );
      setTransitionProgress(progress);
      if (progress >= 100) {
        if (transitionTimerRef.current)
          window.clearInterval(transitionTimerRef.current);
        transitionTimerRef.current = null;
        setMode(next);
        setActiveWindow(null);
        setScreenSaverActive(false);
        if (next === "retro") {
          setBootDone(true);
          setBootProgress(100);
        }
        window.setTimeout(() => setTransitioning(false), 120);
      }
    }, 50);
  };

  useEffect(
    () => () => {
      if (transitionTimerRef.current)
        window.clearInterval(transitionTimerRef.current);
    },
    []
  );

  const startDrag = (
    id: string,
    event: ReactPointerEvent<HTMLDivElement>,
    kind: "icon" | "widget" = "icon"
  ) => {
    const currentIcon = positions[id] ??
      MODERN_ICONS.find(item => item.id === id)?.pos ?? { x: 10, y: 20 };
    const currentWidget = (isCompactViewport
      ? mobileWidgetLayouts
      : widgetLayouts)[id] ??
      MODERN_WIDGET_LAYOUTS[id] ?? { x: 10, y: 20, w: 20, h: 20 };
    const current =
      kind === "widget"
        ? currentWidget
        : {
            x: currentIcon.x,
            y: currentIcon.y,
            w: iconSizes[id] ?? 1,
            h: iconSizes[id] ?? 1,
          };
    dragRef.current = {
      id,
      kind,
      resizing: false,
      compact: isCompactViewport,
      startX: event.clientX,
      startY: event.clientY,
      originX: current.x,
      originY: current.y,
      originW: current.w,
      originH: current.h,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const startResize = (
    id: string,
    event: ReactPointerEvent<HTMLButtonElement>,
    kind: "icon" | "widget" = "icon"
  ) => {
    const currentIcon = positions[id] ??
      MODERN_ICONS.find(item => item.id === id)?.pos ?? { x: 10, y: 20 };
    const currentWidget = (isCompactViewport
      ? mobileWidgetLayouts
      : widgetLayouts)[id] ??
      MODERN_WIDGET_LAYOUTS[id] ?? { x: 10, y: 20, w: 20, h: 20 };
    const current =
      kind === "widget"
        ? currentWidget
        : {
            x: currentIcon.x,
            y: currentIcon.y,
            w: iconSizes[id] ?? 1,
            h: iconSizes[id] ?? 1,
          };
    dragRef.current = {
      id,
      kind,
      resizing: true,
      compact: isCompactViewport,
      startX: event.clientX,
      startY: event.clientY,
      originX: current.x,
      originY: current.y,
      originW: current.w,
      originH: current.h,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const stage =
      (event.currentTarget.closest(".modern-stage") as HTMLElement | null) ??
      document.querySelector(".modern-stage");
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const deltaX =
      ((event.clientX - dragRef.current.startX) / rect.width) * 100;
    const deltaY =
      ((event.clientY - dragRef.current.startY) / rect.height) * 100;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 1) dragRef.current.moved = true;
    if (dragRef.current.resizing && dragRef.current.kind === "widget") {
      const update = (current: Record<string, FloatingLayout>) => ({
        ...current,
        [dragRef.current!.id]: {
          x: dragRef.current!.originX,
          y: dragRef.current!.originY,
          w: clamp(
            dragRef.current!.originW + deltaX,
            10,
            dragRef.current!.compact ? 96 : 58
          ),
          h: clamp(
            dragRef.current!.originH + deltaY,
            14,
            dragRef.current!.compact ? 58 : 64
          ),
        },
      });
      if (dragRef.current.compact) setMobileWidgetLayouts(update);
      else setWidgetLayouts(update);
    } else if (dragRef.current.resizing && dragRef.current.kind === "icon") {
      setIconSizes(current => ({
        ...current,
        [dragRef.current!.id]: clamp(
          dragRef.current!.originW + deltaX / 8,
          0.72,
          1.45
        ),
      }));
    } else if (dragRef.current.kind === "widget") {
      const update = (current: Record<string, FloatingLayout>) => ({
        ...current,
        [dragRef.current!.id]: {
          ...current[dragRef.current!.id],
          x: clamp(
            dragRef.current!.originX + deltaX,
            1,
            dragRef.current!.compact ? 96 : 86
          ),
          y: clamp(
            dragRef.current!.originY + deltaY,
            7,
            dragRef.current!.compact ? 84 : 78
          ),
        },
      });
      if (dragRef.current.compact) setMobileWidgetLayouts(update);
      else setWidgetLayouts(update);
    } else {
      setPositions(current => ({
        ...current,
        [dragRef.current!.id]: {
          x: clamp(dragRef.current!.originX + deltaX, 2, 78),
          y: clamp(dragRef.current!.originY + deltaY, 12, 86),
        },
      }));
    }
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragged = dragRef.current;
    if (dragged && dragged.kind === "icon" && !dragged.moved)
      setActiveWindow(dragged.id as WindowId);
    dragRef.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* pointer was already released */
    }
  };

  const openWindow = (id: WindowId) => setActiveWindow(id);
  const windowTitle = useMemo(
    () =>
      ({
        work: "Selected work",
        about: "Meet Gema",
        services: "What I do",
        resume: "Resume",
        runner: "Games",
        skill: "Skill",
        rig: "My Rig",
        music: "RainAmp",
        contact: "Open channel",
        notes: "Field notes",
        shelf: "My shelf",
        chess: "Strategy board",
        synth: "Synthesizer",
        photos: "Photographs",
        myworks: "My Works",
        credits: "Credits",
        sources: "Sources",
      })[activeWindow ?? "work"],
    [activeWindow]
  );

  if (mode === "retro" && !bootDone)
    return (
      <>
        <RetroBoot progress={bootProgress} />
        {transitioning && (
          <EraTransition
            target={transitionTarget}
            progress={transitionProgress}
          />
        )}
      </>
    );


  return (
    <div className="portfolio-shell">
      <audio
        ref={audioRef}
        src="/song.mp3"
        preload="none"
        loop
        playsInline
      />
      {mode === "retro" ? (
        <RetroDesktop
          clock={now}
          onOpen={openWindow}
          onModern={() => switchMode("modern")}
          onPower={() => {
            setBootDone(false);
            setBootProgress(0);
          }}
          fact={DID_YOU_KNOW_FACTS[didYouKnowIndex]}
          lang={lang}
          onLang={setLang}
        />
      ) : (
        <ModernDesktop
          now={now}
          positions={positions}
          iconSizes={iconSizes}
          widgetLayouts={isCompactViewport ? mobileWidgetLayouts : widgetLayouts}
          onOpen={openWindow}
          onRetro={() => switchMode("retro")}
          onDragStart={startDrag}
          onResizeStart={startResize}
          theme={theme}
          onTheme={setTheme}
          musicPlaying={musicPlaying}
          onMusicToggle={() => setMusicPlaying(v => !v)}
          volume={volume}
          onVolumeChange={setVolume}
          weather={weather}
          battery={battery}
          lang={lang}
          onLang={setLang}
        />
      )}
      {/* hidden overlay to capture drag for modern desktop */}
      {dragRef.current && <div className="drag-capture" onPointerMove={moveDrag} onPointerUp={endDrag} />}

      {activeWindow && (
        <div
          className="window-overlay"
          onClick={event => {
            if (event.target === event.currentTarget) setActiveWindow(null);
          }}
        >
          <WindowFrame
            title={windowTitle}
            onClose={() => setActiveWindow(null)}
            variant={mode}
          >
            <WindowContent
              id={activeWindow}
              mode={mode}
              onOpen={openWindow}
              runnerStep={runnerStep}
              onRunnerStep={() =>
                setRunnerStep(step =>
                  step >= CAREER.length - 1 ? 0 : step + 1
                )
              }
              musicPlaying={musicPlaying}
              onMusicToggle={() => setMusicPlaying(value => !value)}
              lang={lang}
            />
          </WindowFrame>
        </div>
      )}
      {screenSaverActive && (
        <ScreenSaver onWake={() => setScreenSaverActive(false)} />
      )}
      {transitioning && (
        <EraTransition
          target={transitionTarget}
          progress={transitionProgress}
        />
      )}
    </div>
  );
}
