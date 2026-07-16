'use client';

import React, { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import {
  BookOpen,
  MousePointerClick,
  Globe,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Play,
  Pause,
  Sparkles,
  Dna,
  OrbitIcon,
  Mountain,
  ArrowUpRight,
  Volume2,
  VolumeX,
  Video,
  Activity,
  X,
  Cpu,
  Sliders,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ChevronDown,
  FileText,
  Rocket,
  Compass,
} from "lucide-react";

// Three.js/WebGL must never render on the server.
const Lesson3D = dynamic(() => import("./Lesson3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-sm text-[var(--muted)]">
      Loading 3D scene…
    </div>
  ),
});

const translations = {
  en: {
    navFeatures: "Features",
    navDemo: "Demo",
    navCreator: "AI Creator",
    navExamples: "Examples",
    navBlog: "Blog",
    navFAQ: "FAQ",
    navJoin: "Join waitlist",
    earlyAccessBadge: "✨ Now welcoming early access members",
    heroSubtitle: "Create interactive 3D lessons in seconds with AI. Engage, explain, and inspire — all in one place.",
    emailPlaceholder: "you@school.com (or personal email)",
    btnJoin: "Join waitlist",
    btnJoining: "Joining...",
    msgSuccess: "You're on the list — welcome!",
    msgErrorEmpty: "Please enter your email address.",
    msgErrorTooLong: "Email address must be under 100 characters.",
    msgErrorInvalid: "Please enter a valid email address.",
    peopleCountText: "already on the waitlist.",
    trustTitle: "Trusted by educators from top institutions",
    tagPrompt: "AI Prompt: Create a volcano eruption scene",
    tagGenerated: "AI Generated: in 8 seconds",
    tagInteractive: "Interactive 3D: Explore in real time",

    // Features
    featGenTitle: "AI 3D Generation",
    featGenDesc: "Describe any topic and AI creates a complete 3D scene instantly.",
    featLessonsTitle: "Interactive Lessons",
    featLessonsDesc: "Explore your lessons in 3D with full interactivity and immersive animations.",
    featCustTitle: "Easy Customization",
    featCustDesc: "Edit, adjust and personalize every detail to match your teaching style.",
    featShareTitle: "Share Everywhere",
    featShareDesc: "Publish your 3D lessons and share with anyone, anywhere.",

    // How it works
    howItWorksTitle: "How it works",
    step1Title: "Write your idea",
    step1Desc: "Type any topic or paste your content. AI understands it.",
    step2Title: "AI builds 3D world",
    step2Desc: "Our AI generates a complete 3D interactive lesson.",
    step3Title: "Explore & share",
    step3Desc: "Explore in 3D, make it yours and share with the world.",

    // Carousel section
    carouselTitle: "Explore 3D lessons made with AI",
    cardSolar: "Solar System",
    cardCell: "Human Cell",
    cardRome: "Ancient Rome",
    cardDino: "Dinosaur World",
    cardSpace: "Space Station",

    // Bottom CTA
    ctaTitle: "Be a part of the future of learning",
    ctaSubtitle: "Join early and help shape the next generation of 3D learning experiences powered by AI.",

    // FAQ
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Does it require any VR headsets or special hardware?",
    faqA1: "No, Edu3D AI runs entirely in standard web browsers. Students can rotate, zoom, and explore models using a mouse, trackpad, or touch screen on any laptop, tablet, or smartphone.",
    faqQ2: "What subjects can I generate 3D models for?",
    faqA2: "You can generate 3D models for almost any topic! From biology (human cells, organs) and geography (volcanoes, tectonic plates) to physics, history (Roman Colosseum, ancient cities), and geometry.",
    faqQ3: "Is the content aligned with standard school textbooks?",
    faqA3: "Yes, our AI curriculum engine aligns generations with standard textbook systems, and each model is validated by real academic advisors to ensure scientific and historical accuracy.",

    // 3D Viewport labels
    tryTitle: "Interactive Lab Viewport",
    noteDna: "Drag the slider to spin the strand",
    noteSolar: "See how orbits align",
    noteVolcano: "A cross-section, layer by layer",
    noteMath: "Math in architecture & engineering",
    noteIelts: "Learn in 3D: Interactive listening scenes, essay builders & simulated AI examiner room.",
    viewportTitle: "Viewport",
    btnStop: "Stop",
    btnAutoPlay: "Video Tour",
    btnBack: "Back",
    btnNext: "Next",
    curvSlider: "Curvature (a coefficient):",
    heightSlider: "Central height (c coefficient):",
    tabDna: "Inside",
    tabSolar: "Solar",
    tabVolcano: "Volcano",
    tabMath: "Real-life",
    tabIelts: "IELTS",

    // Modal
    modalTitle: "Help us out! 💡",
    modalSubtitle: "Which topics would you like to see in 3D first on Edu3D Academy? Let us know your suggestions.",
    modalPlaceholder: "Topic name or brief description (e.g. Photosynthesis, Quadratic Equations)...",
    modalSubmit: "Submit Suggestion",
    modalSubmitting: "Submitting...",
    modalSuccess: "Thank you! Your suggestion has been saved successfully.",
    modalClose: "Close",
    footerText: "Made for classrooms."
  },
  uz: {
    navFeatures: "Xususiyatlar",
    navDemo: "Demo",
    navCreator: "AI Yaratuvchi",
    navExamples: "Namunalar",
    navBlog: "Blog",
    navFAQ: "FAQ",
    navJoin: "Ro'yxatga kirish",
    earlyAccessBadge: "✨ YANGI FOYDALANUVCHILARNI QABUL QILMOQDAMIZ",
    heroSubtitle: "Sun'iy intellekt yordamida soniyalar ichida interaktiv 3D darslar yarating. Bir joyda jalb qiling, tushuntiring va ilhomlantiring.",
    emailPlaceholder: "you@school.com (yoki shaxsiy e-mail)",
    btnJoin: "Ro'yxatga kirish",
    btnJoining: "Qo'shilmoqda...",
    msgSuccess: "Siz muvaffaqiyatli ro'yxatga kirdingiz — xush kelibsiz!",
    msgErrorEmpty: "Iltimos, e-mail manzilingizni kiriting.",
    msgErrorTooLong: "E-mail manzili 100 tadan kam belgidan iborat bo'lishi kerak.",
    msgErrorInvalid: "Iltimos, haqiqiy e-mail manzilini kiriting.",
    peopleCountText: "kutish ro'yxatida.",
    trustTitle: "Top muassasalar ustozlari ishonchi",
    tagPrompt: "AI Buyruq: Vulqon otilishi sahnasini yaratish",
    tagGenerated: "AI Yaratdi: 8 soniyada",
    tagInteractive: "Interaktiv 3D: Real vaqtda kezish",

    // Features
    featGenTitle: "AI 3D Yaratish",
    featGenDesc: "Har qanday mavzuni tasvirlang va AI bir zumda to'liq 3D sahnani yaratadi.",
    featLessonsTitle: "Interaktiv darslar",
    featLessonsDesc: "Darslaringizni to'liq interaktivlik va qiziqarli animatsiyalar bilan 3D formatda o'rganing.",
    featCustTitle: "Oson sozlash",
    featCustDesc: "O'qitish uslubingizga mos keladigan har bir detalni tahrirlang va shaxsiylashtiring.",
    featShareTitle: "Hamma joyda ulashing",
    featShareDesc: "3D darslaringizni nashr qiling va istalgan joyda istalgan odam bilan ulashing.",

    // How it works
    howItWorksTitle: "Qanday ishlaydi",
    step1Title: "G'oyangizni yozing",
    step1Desc: "Har qanday mavzuni yozing yoki tarkibingizni joylashtiring. AI uni tushunadi.",
    step2Title: "AI 3D dunyo yaratadi",
    step2Desc: "Bizning AI to'liq 3D interaktiv darsni yaratadi.",
    step3Title: "Kezish va ulashish",
    step3Desc: "3D formatida o'rganing, uni o'zingizniki qiling va dunyo bilan baham ko'ring.",

    // Carousel section
    carouselTitle: "AI yordamida yaratilgan 3D darslarni ko'ring",
    cardSolar: "Quyosh Tizimi",
    cardCell: "Inson Hujayrasi",
    cardRome: "Qadimgi Rim",
    cardDino: "Dinozavrlar Dunyosi",
    cardSpace: "Koinot Stansiyasi",

    // Bottom CTA
    ctaTitle: "Kelajak ta'limining bir qismi bo'ling",
    ctaSubtitle: "Erta a'zo bo'ling va AI tomonidan boshqariladigan keyingi avlod 3D ta'limini shakllantirishga yordam bering.",

    // FAQ
    faqTitle: "Tez-tez so'raladigan savollar",
    faqQ1: "VR ko'zoynaklar yoki maxsus qurilmalar kerakmi?",
    faqA1: "Yo'q, Edu3D AI to'liq veb-brauzerlarda ishlaydi. O'quvchilar noutbuk, planshet yoki smartfonda sichqoncha yoki sensorli ekran orqali modellarni aylantirib o'rganishlari mumkin.",
    faqQ2: "Qaysi fanlar bo'yicha 3D model yaratish mumkin?",
    faqA2: "Deyarli barcha mavzular bo'yicha model yaratish mumkin: Biologiya (hujayralar, a'zolar), Geografiya (vulqonlar, plitalar), Fizika, Tarix (Rim Kolizeyi, qadimiy shaharlar) va Geometriya.",
    faqQ3: "Darslar maktab darsliklariga mos keladimi?",
    faqA3: "Ha, bizning AI tizimimiz yaratiladigan modellarni maktab darsliklari standartlariga moslashtiradi va har bir model ilmiy maslahatchilar tomonidan tekshiriladi.",

    // 3D Viewport labels
    tryTitle: "Interaktiv Laboratoriya",
    noteDna: "Zanjirni aylantirish uchun slayderni torting",
    noteSolar: "Orbitalarning qanday moslashishini ko'ring",
    noteVolcano: "Qatlamma-qatlam kesma ko'rinishi",
    noteMath: "Arxitektura va muhandislikda matematika",
    noteIelts: "3D darslik: Interaktiv eshitish sahnalari, vizual insho tuzuvchi va AI imtihonchi xonasi.",
    viewportTitle: "Ko'rish burchagi",
    btnStop: "Stop",
    btnAutoPlay: "Video Sayohat",
    btnBack: "Orqaga",
    btnNext: "Keyingi",
    curvSlider: "Egrilik (a koeffitsiyenti):",
    heightSlider: "Markaziy balandlik (c koeffitsiyenti):",
    tabDna: "Inside",
    tabSolar: "Solar",
    tabVolcano: "Volcano",
    tabMath: "Real-life",
    tabIelts: "IELTS",

    // Modal
    modalTitle: "Tavsiya bildiring! 💡",
    modalSubtitle: "Edu3D Academy da qaysi mavzularni birinchi bo'lib 3D ko'rinishida ko'rishni xohlaysiz? O'z takliflaringizni yozib qoldiring.",
    modalPlaceholder: "Mavzu nomi yoki qisqacha tavsifi (masalan: Fotosintez, Kvadratik tenglamalar)...",
    modalSubmit: "Taklifni yuborish",
    modalSubmitting: "Yuborilmoqda...",
    modalSuccess: "Rahmat! Sizning taklifingiz muvaffaqiyatli saqlandi.",
    modalClose: "Yopish",
    footerText: "Sinflar uchun maxsus yaratilgan."
  },
  ru: {
    navFeatures: "Возможности",
    navDemo: "Демо",
    navCreator: "ИИ Создатель",
    navExamples: "Примеры",
    navBlog: "Блог",
    navFAQ: "FAQ",
    navJoin: "Лист ожидания",
    earlyAccessBadge: "✨ РАДЫ ПРИВЕТСТВОВАТЬ УЧАСТНИКОВ",
    heroSubtitle: "Создавайте интерактивные 3D-уроки за секунды с помощью ИИ. Вовлекайте, объясняйте и вдохновляйте — все в одном месте.",
    emailPlaceholder: "you@school.com (или личный email)",
    btnJoin: "Вступить в лист",
    btnJoining: "Добавление...",
    msgSuccess: "Вы добавлены в список — добро пожаловать!",
    msgErrorEmpty: "Пожалуйста, введите ваш email.",
    msgErrorTooLong: "Email адрес должен содержать менее 100 символов.",
    msgErrorInvalid: "Пожалуйста, введите корректный email.",
    peopleCountText: "в списке ожидания.",
    trustTitle: "Доверяют преподаватели из ведущих вузов",
    tagPrompt: "ИИ Промпт: Создать сцену извержения вулкана",
    tagGenerated: "Создано ИИ: за 8 секунд",
    tagInteractive: "Интерактивное 3D: Исследуйте в реальном времени",

    // Features
    featGenTitle: "ИИ 3D Генерация",
    featGenDesc: "Опишите любую тему, и ИИ мгновенно создаст полную 3D-сцену.",
    featLessonsTitle: "Интерактивные уроки",
    featLessonsDesc: "Изучайте свои уроки в 3D с полной интерактивностью и захватывающими анимациями.",
    featCustTitle: "Простая настройка",
    featCustDesc: "Редактируйте, настраивайте и персонализируйте каждую деталь в соответствии с вашим стилем.",
    featShareTitle: "Поделиться везде",
    featShareDesc: "Публикуйте свои 3D-уроки и делитесь ими с кем угодно и где угодно.",

    // How it works
    howItWorksTitle: "Как это работает",
    step1Title: "Напишите идею",
    step1Desc: "Введите любую тему или вставьте свой текст. ИИ поймет его.",
    step2Title: "ИИ строит 3D-мир",
    step2Desc: "Наш ИИ создает полный интерактивный 3D-урок.",
    step3Title: "Изучайте и делитесь",
    step3Desc: "Исследуйте в 3D, настраивайте под себя и делитесь с миром.",

    // Carousel section
    carouselTitle: "Изучайте 3D-уроки, созданные с помощью ИИ",
    cardSolar: "Солнечная Система",
    cardCell: "Клетка Человека",
    cardRome: "Древний Рим",
    cardDino: "Мир Динозавров",
    cardSpace: "Космическая Станция",

    // Bottom CTA
    ctaTitle: "Станьте частью будущего образования",
    ctaSubtitle: "Присоединяйтесь раньше и помогите сформировать следующее поколение 3D-обучения на базе ИИ.",

    // FAQ
    faqTitle: "Часто задаваемые вопросы",
    faqQ1: "Нужны ли VR-очки или специальное оборудование?",
    faqA1: "Нет, Edu3D AI работает полностью в стандартных веб-браузерах. Учащиеся могут вращать, приближать и исследовать модели на любом ноутбуке, планшете или смартфоне.",
    faqQ2: "По каким предметам можно генерировать 3D-модели?",
    faqA2: "Модели можно создавать практически по любой теме: биология (клетки, органы), география (вулканы, тектонические плиты), физика, история (Колизей, древние города) и геометрия.",
    faqQ3: "Соответствует ли контент школьным учебникам?",
    faqA3: "Да, наша система ИИ синхронизирует генерацию со стандартными учебными программами, и каждая модель проверяется научными консультантами.",

    // 3D Viewport labels
    tryTitle: "Интерактивная лаборатория",
    noteDna: "Перетащите слайдер, чтобы вращать спираль",
    noteSolar: "Посмотрите, как выравниваются орбиты",
    noteVolcano: "Поперечный разрез, слой за слоем",
    noteMath: "Математика в архитектуре и инженерии",
    noteIelts: "3D-урок: интерактивные сцены аудирования, конструктор эссе и комната ИИ-экзаменатора.",
    viewportTitle: "Угол обзора",
    btnStop: "Стоп",
    btnAutoPlay: "Видео-тур",
    btnBack: "Назад",
    btnNext: "Далее",
    curvSlider: "Кривизна (коэффициент a):",
    heightSlider: "Высота центра (коэффициент c):",
    tabDna: "Inside",
    tabSolar: "Solar",
    tabVolcano: "Volcano",
    tabMath: "Real-life",
    tabIelts: "IELTS",

    // Modal
    modalTitle: "Помогите нам стать лучше! 💡",
    modalSubtitle: "Какие темы вы хотите увидеть в 3D на Edu3D Academy в первую очередь? Пожалуйста, поделитесь вашими предложениями.",
    modalPlaceholder: "Название темы или краткое описание (например: Фотосинтез, Квадратные уравнения)...",
    modalSubmit: "Отправить предложение",
    modalSubmitting: "Отправка...",
    modalSuccess: "Спасибо! Ваше предложение успешно сохранено.",
    modalClose: "Закрыть",
    footerText: "Создано для школ."
  }
};

export default function Home() {
  const [lang, setLang] = useState<"en" | "uz" | "ru">("en");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const t = translations[lang];

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dbCount, setDbCount] = useState(0);

  // Suggestions Modal state
  const [showModal, setShowModal] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [modalStatus, setModalStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [activeTab, setActiveTab] = useState<"dna" | "solar" | "volcano" | "math" | "ielts">("volcano"); // volcano is default as in mockup image
  const [rotation, setRotation] = useState(45);
  const [isPlaying, setIsPlaying] = useState(true);

  // Math Lesson / Tour States
  const [mathStep, setMathStep] = useState(1);
  const [mathCoefA, setMathCoefA] = useState(0.15);
  const [mathCoefC, setMathCoefC] = useState(0.5);
  const [isPlayingTour, setIsPlayingTour] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // FAQ Accordion State
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Carousel Slider State
  const [carouselIndex, setCarouselIndex] = useState(0);

  const carouselItems = useMemo(() => [
    { name: t.cardSolar, img: "/solar_system.png" },
    { name: t.cardCell, img: "/human_cell.png" },
    { name: t.cardRome, img: "/ancient_rome.png" },
    { name: t.cardDino, img: "/dinosaur_world.png" },
    { name: t.cardSpace, img: "/space_station.png" },
  ], [t]);

  // Fetch waitlist count from Supabase on load
  const fetchWaitlistCount = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANNON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    fetch(`${supabaseUrl}/rest/v1/waitlist?select=id`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDbCount(data.length);
        }
      })
      .catch((err) => console.log("Failed to fetch count from Supabase:", err));
  };

  useEffect(() => {
    fetchWaitlistCount();
  }, []);

  const tourSteps = useMemo(() => [
    {
      step: 1,
      title: {
        en: "Real Life (Intro)",
        uz: "Real hayot (Kirish)",
        ru: "Реальная жизнь (Введение)"
      },
      subtitle: {
        en: "Suspension bridge weight capacity",
        uz: "Osma ko'priklar og'irlik ko'tarishi",
        ru: "Как висячие мосты держат вес"
      },
      narration: {
        en: "How do bridges support thousands of tons? Suspension bridges use an amazing geometric shape - a parabola - to distribute weight evenly and safely.",
        uz: "Ko'priklar qanday qilib tonnalab og'irlikni ko'tara oladi? Osma ko'priklar og'irlikni teng va xavfsiz taqsimlash uchun ajoyib geometrik shakl - paraboladan foydalanadi.",
        ru: "Как мосты выдерживают тысячи тонн веса? Висячие мосты используют удивительную геометрическую форму — параболу, чтобы равномерно распределять нагрузку."
      }
    },
    {
      step: 2,
      title: {
        en: "Coordinate Grid",
        uz: "Koordinatalar to'ri",
        ru: "Сетка координат"
      },
      subtitle: {
        en: "Placing mathematical axes",
        uz: "Matematik o'qlarni joylashtirish",
        ru: "Размещение осей"
      },
      narration: {
        en: "If we place the bridge on a coordinate plane, we can map the cable's curve precisely using mathematical coordinate axes.",
        uz: "Agar biz ko'prikni koordinatalar tekisligiga joylashtirsak, kabellar hosil qilgan egri chiziqni matematik o'qlar yordamida aniq tasvirlay olamiz.",
        ru: "Если поместить мост на координатную плоскость, мы сможем точно описать изгиб кабелей с помощью математических осей."
      }
    },
    {
      step: 3,
      title: {
        en: "Quadratic Equation",
        uz: "Kvadratik tenglama",
        ru: "Квадратное уравнение"
      },
      subtitle: {
        en: "Parabola formula: y = ax² + c",
        uz: "Parabola formulasi: y = ax² + c",
        ru: "Формула параболы: y = ax² + c"
      },
      narration: {
        en: "The cable follows the quadratic equation y = ax² + c. Here, 'a' controls the curvature, and 'c' sets the height of the lowest point.",
        uz: "Kabel y = ax² + c kvadratik tenglamasiga bo'ysunadi. Bu yerda 'a' - egrilik darajasi, 'c' esa ko'prikning eng pastki nuqtasi balandligini belgilaydi.",
        ru: "Трос принимает форму, описываемую уравнением y = ax² + c. Здесь 'a' — коэффициент кривизны, а 'c' — высота нижней точки моста."
      }
    },
    {
      step: 4,
      title: {
        en: "Forces Distribution",
        uz: "Kuchlar taqsimoti",
        ru: "Распределение сил"
      },
      subtitle: {
        en: "Tension and Gravity loads",
        uz: "Tension va Gravitatsiya",
        ru: "Натяжение и гравитация"
      },
      narration: {
        en: "The mathematical parabola redirects load to the towers. The red arrows show the tension force along the cable, while yellow arrows show gravity.",
        uz: "Matematik parabola yukni tirgaklarga mukammal yo'naltiradi. Qizil strelkalar tortilish (tension) kuchini, sariq strelkalar esa gravitatsiyani bildiradi.",
        ru: "Математическая парабола идеально перераспределяет нагрузку. Красные стрелки показывают силы натяжения троса, а желтые — силу тяжести."
      }
    },
    {
      step: 5,
      title: {
        en: "Interactive Lab",
        uz: "Interaktiv labaratoriya",
        ru: "Интерактивная лаб."
      },
      subtitle: {
        en: "Modify parameters",
        uz: "Parametrlarni o'zgartiring",
        ru: "Изменение параметров"
      },
      narration: {
        en: "Now, experiment yourself! Modify 'a' and 'c' using the sliders to see how the bridge shape and structural tension adapt in real-time.",
        uz: "Endi parametrlar bilan o'ynab ko'ring! 'a' va 'c' qiymatlarini o'zgartirish orqali ko'prik shakli va uning mustahkamligi qanday o'zgarishini ko'ring.",
        ru: "Теперь попробуйте сами! Меняйте значения 'a' и 'c', чтобы увидеть, как в реальном времени меняются форма моста и силы натяжения."
      }
    }
  ], []);

  // Speech helper
  const speakNarration = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    if (lang === "uz") {
      const uzVoice = voices.find(v => v.lang.startsWith("uz") || v.lang.includes("UZ"));
      if (uzVoice) {
        utterance.voice = uzVoice;
        utterance.lang = "uz-UZ";
      } else {
        const trVoice = voices.find(v => v.lang.startsWith("tr") || v.lang.includes("TR"));
        if (trVoice) {
          utterance.voice = trVoice;
          utterance.lang = "tr-TR";
        } else {
          utterance.lang = "en-US";
        }
      }
    } else if (lang === "ru") {
      const ruVoice = voices.find(v => v.lang.startsWith("ru") || v.lang.includes("RU"));
      if (ruVoice) {
        utterance.voice = ruVoice;
        utterance.lang = "ru-RU";
      } else {
        utterance.lang = "en-US";
      }
    } else {
      const enVoice = voices.find(v => v.lang.startsWith("en") || v.lang.includes("EN"));
      if (enVoice) {
        utterance.voice = enVoice;
        utterance.lang = "en-US";
      }
    }

    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  // Play audio when step changes or when voice gets turned on
  useEffect(() => {
    if (activeTab === "math" && voiceEnabled) {
      speakNarration(tourSteps[mathStep - 1].narration[lang]);
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [mathStep, activeTab, voiceEnabled, lang, tourSteps]);

  // Turn off tour features when tab changes
  useEffect(() => {
    if (activeTab !== "math") {
      setIsPlayingTour(false);
      setVoiceEnabled(false);
    }
  }, [activeTab]);

  // Tour Auto Play timeline
  useEffect(() => {
    if (!isPlayingTour || activeTab !== "math") return;
    const interval = setInterval(() => {
      setMathStep((prev) => {
        if (prev < 5) {
          return prev + 1;
        } else {
          setIsPlayingTour(false);
          return prev;
        }
      });
    }, 7500);
    return () => clearInterval(interval);
  }, [isPlayingTour, activeTab]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 45);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setStatus("error");
      setErrorMessage(t.msgErrorEmpty);
      return;
    }
    if (trimmedEmail.length > 100) {
      setStatus("error");
      setErrorMessage(t.msgErrorTooLong);
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setStatus("error");
      setErrorMessage(t.msgErrorInvalid);
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANNON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      setStatus("error");
      setErrorMessage("Supabase credentials not configured in environment.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
        method: "POST",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      if (!response.ok) {
        const errData = await response.json();
        if (response.status === 409 || (errData && errData.code === "23505")) {
          throw new Error("This email is already registered on the waitlist!");
        }
        throw new Error(errData.message || "Failed to join waitlist");
      }
      const data = await response.json();
      const insertedRow = data[0];
      setSubmittedId(insertedRow.id);
      setSubmittedEmail(trimmedEmail);
      setStatus("success");
      setEmail("");

      // Open the suggestions modal
      setShowModal(true);

      // Update count
      fetchWaitlistCount();
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Could not connect to Supabase.");
    }
  };

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim() || !submittedId) return;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANNON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    setModalStatus("loading");
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/waitlist?id=eq.${submittedId}`, {
        method: "PATCH",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ suggestion: suggestion.trim() }),
      });
      if (!response.ok) {
        throw new Error("Failed to save suggestion");
      }
      setModalStatus("success");
      setSuggestion("");
      setTimeout(() => {
        setShowModal(false);
        setModalStatus("idle");
      }, 2500);
    } catch (err) {
      setModalStatus("error");
    }
  };

  const handleScrollToWaitlist = () => {
    const element = document.getElementById("waitlist-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      const inputElement = document.getElementById("waitlist-email");
      if (inputElement) setTimeout(() => (inputElement as HTMLInputElement).focus(), 800);
    }
  };

  const tabMeta = useMemo(() => ({
    volcano: { label: t.tabVolcano, icon: Mountain, note: t.noteVolcano },
    dna: { label: t.tabDna, icon: Dna, note: t.noteDna },
    solar: { label: t.tabSolar, icon: OrbitIcon, note: t.noteSolar },
    math: { label: t.tabMath, icon: Activity, note: t.noteMath },
    ielts: { label: t.tabIelts, icon: BookOpen, note: t.noteIelts },
  }), [t]);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        html {
          scroll-behavior: smooth;
        }
        :root {
          --bg: #FFFCF6;
          --surface: #FFFFFF;
          --ink: #241F2E;
          --muted: #6E6B7A;
          --coral: #FF6B4A;
          --coral-dark: #E8532F;
          --teal: #14B8A6;
          --violet: #8B7CF6;
          --yellow: #FFC94A;
          --blob-pink: #FFE4D9;
          --blob-mint: #D9F5EE;
          --blob-lav: #EAE5FF;
          --ring: rgba(255,107,74,0.35);
        }
        .font-display { font-family: 'Baloo 2', 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .btn-primary {
          background: linear-gradient(135deg, var(--coral), #FF8A65);
          box-shadow: 0 10px 24px -8px rgba(255,107,74,0.55);
        }
        .btn-primary:hover { box-shadow: 0 14px 30px -8px rgba(255,107,74,0.65); }
        .sticker {
          background: var(--surface);
          box-shadow: 0 14px 30px -12px rgba(36,31,46,0.18);
        }
        @keyframes float-slow { 0%,100% { transform: translateY(0) rotate(var(--rot,0deg)); } 50% { transform: translateY(-10px) rotate(var(--rot,0deg)); } }
        .floaty { animation: float-slow 5.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .floaty { animation: none; } }
      `}</style>

      {/* Soft background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-70" style={{ background: "var(--blob-pink)" }} />
        <div className="absolute top-40 -right-32 w-[460px] h-[460px] rounded-full blur-3xl opacity-70" style={{ background: "var(--blob-mint)" }} />
        <div className="absolute bottom-0 left-1/3 w-[380px] h-[380px] rounded-full blur-3xl opacity-60" style={{ background: "var(--blob-lav)" }} />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg)]/80 border-b border-black/[0.04] transition-all">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg font-display font-bold" style={{ background: "linear-gradient(135deg, var(--coral), var(--yellow))" }}>
              3D
            </div>
            <span className="text-xl font-display font-bold tracking-tight">
              Edu3D <span style={{ color: "var(--coral)" }}>AI</span>
            </span>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-7">
            <a href="#features" className="text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)] transition-colors">{t.navFeatures}</a>
            <a href="#demo" className="text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)] transition-colors">{t.navDemo}</a>
            <a href="#how-it-works" className="text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)] transition-colors">{t.navCreator}</a>
            <a href="#examples" className="text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)] transition-colors">{t.navExamples}</a>
            <a href="#faq" className="text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)] transition-colors">{t.navFAQ}</a>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3.5">
            {/* Custom Dropdown language selector */}
            <div className="relative inline-block text-left">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 bg-white border border-black/10 text-[var(--ink)] text-xs font-bold px-3.5 py-2.5 rounded-xl outline-none focus:border-[var(--coral)] focus:ring-2 focus:ring-[var(--ring)] transition-all cursor-pointer shadow-sm hover:bg-black/[0.02] font-body"
                aria-haspopup="true"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="w-3.5 h-3.5 text-[var(--muted)]" />
                <span className="flex items-center gap-1 uppercase">
                  {lang}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[var(--muted)] transition-transform duration-200 ${langDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {langDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-28 rounded-xl bg-white border border-black/[0.06] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] p-1.5 z-20 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => { setLang("en"); setLangDropdownOpen(false); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${lang === "en" ? "bg-[var(--coral)]/10 text-[var(--coral-dark)]" : "text-[var(--ink)] hover:bg-black/[0.03]"
                        }`}
                    >
                      <span className="text-sm">🇺🇸</span> EN
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLang("uz"); setLangDropdownOpen(false); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${lang === "uz" ? "bg-[var(--coral)]/10 text-[var(--coral-dark)]" : "text-[var(--ink)] hover:bg-black/[0.03]"
                        }`}
                    >
                      <span className="text-sm">🇺🇿</span> UZ
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLang("ru"); setLangDropdownOpen(false); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${lang === "ru" ? "bg-[var(--coral)]/10 text-[var(--coral-dark)]" : "text-[var(--ink)] hover:bg-black/[0.03]"
                        }`}
                    >
                      <span className="text-sm">🇷🇺</span> RU
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleScrollToWaitlist}
              className="btn-primary text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              {t.navJoin}
            </button>
          </div>
        </div>
      </header>

      {/* Main Section container */}
      <main className="max-w-6xl mx-auto px-6 pt-10 pb-24 relative z-10 space-y-32">

        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-8" id="demo">
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] font-bold tracking-wide text-emerald-700 uppercase">
                {t.earlyAccessBadge}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-[52px] leading-[1.12] text-[var(--ink)]">
              {lang === "uz" ? (
                <>
                  Istalgan darsni bolalar{" "}
                  <span className="relative inline-block text-[var(--coral)]">
                    kezishi
                    <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
                      <path d="M0,6 Q50,1 100,5 T200,4" fill="none" stroke="var(--yellow)" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                  </span>{" "}
                  mumkin bo'lgan 3D dunyoga aylantiring.
                </>
              ) : lang === "ru" ? (
                <>
                  Превратите любой урок в{" "}
                  <span className="relative inline-block text-[var(--coral)]">
                    3D-мир
                    <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
                      <path d="M0,6 Q50,1 100,5 T200,4" fill="none" stroke="var(--yellow)" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                  </span>{" "}
                  в котором дети могут гулять.
                </>
              ) : (
                <>
                  Turn any lesson into a{" "}
                  <span className="relative inline-block text-[var(--coral)]">
                    3D world
                    <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
                      <path d="M0,6 Q50,1 100,5 T200,4" fill="none" stroke="var(--yellow)" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                  </span>{" "}
                  kids can walk through.
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed font-body">
              {t.heroSubtitle}
            </p>

            {/* Waitlist form inline */}
            <div id="waitlist-section" className="w-full max-w-lg scroll-mt-28">
              <form
                onSubmit={handleWaitlistSubmit}
                className="flex flex-col sm:flex-row gap-2 p-1.5 rounded-2xl bg-white shadow-[0_15px_35px_-12px_rgba(255,107,74,0.25)] border border-black/10 focus-within:border-[var(--coral)] focus-within:ring-4 focus-within:ring-[var(--ring)] transition-all duration-300"
              >
                <input
                  type="email"
                  id="waitlist-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  maxLength={100}
                  disabled={status === "loading" || status === "success"}
                  className="flex-grow px-4 py-3 bg-transparent outline-none text-sm placeholder-slate-400 font-body font-semibold"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="btn-primary text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  {status === "loading" ? t.btnJoining : t.btnJoin} <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Status messages */}
              <div className="mt-3 min-h-[20px] text-xs">
                {status === "success" && (
                  <div className="flex items-center gap-2 py-2 px-3 rounded-xl font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{t.msgSuccess}</span>
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-center gap-2 py-2 px-3 rounded-xl font-bold bg-rose-50 text-rose-700 border border-rose-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Overlapping Avatars waitlist count */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold font-body shadow-sm">JS</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold font-body shadow-sm">MT</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-violet-100 text-violet-700 flex items-center justify-center text-[10px] font-bold font-body shadow-sm">OX</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold font-body shadow-sm">HV</div>
              </div>
              <p className="text-xs text-[var(--muted)] font-body font-bold">
                {lang === "uz" ? (
                  <>Ro'yxatga kirgan <span className="text-[var(--ink)] font-extrabold">{dbCount} kishiga</span> qo'shiling</>
                ) : lang === "ru" ? (
                  <>Присоединяйтесь к <span className="text-[var(--ink)] font-extrabold">{dbCount} людям</span> в списке</>
                ) : (
                  <>Join <span className="text-[var(--ink)] font-extrabold">{dbCount} people</span> already on the waitlist</>
                )}
              </p>
            </div>
          </div>

          {/* Right Column (3D Viewer platform + floating tags) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-lg aspect-square bg-white rounded-3xl p-3 sm:p-4 shadow-[0_30px_70px_-15px_rgba(255,107,74,0.22)] border border-black/[0.03]">

              {/* Floating Prompt Tag */}
              <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md border border-black/5 rounded-xl px-3 py-2 text-[9px] sm:text-[10px] font-bold text-slate-800 shadow-md flex items-center gap-1.5 pointer-events-none select-none">
                <span>✍️</span> {t.tagPrompt}
              </div>

              {/* Floating Generated Tag */}
              <div className="absolute top-4 right-4 z-20 bg-emerald-50/95 backdrop-blur-md border border-emerald-100 rounded-xl px-3 py-2 text-[9px] sm:text-[10px] font-bold text-emerald-700 shadow-md flex items-center gap-1.5 pointer-events-none select-none">
                <span>✓</span> {t.tagGenerated}
              </div>

              {/* Floating Interactive Tag */}
              <div className="absolute bottom-16 right-4 z-20 bg-rose-50/95 backdrop-blur-md border border-rose-100 rounded-xl px-3 py-2 text-[9px] sm:text-[10px] font-bold text-rose-700 shadow-md flex items-center gap-1.5 pointer-events-none select-none">
                <span>📦</span> {t.tagInteractive}
              </div>

              {/* Interactive 3D Canvas Viewport */}
              <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] to-[var(--blob-lav)]">
                <Lesson3D
                  activeTab={activeTab}
                  rotation={rotation}
                  isPlaying={isPlaying}
                  mathStep={mathStep}
                  mathCoefA={mathCoefA}
                  mathCoefC={mathCoefC}
                  lang={lang}
                />
              </div>

              {/* Tab Switcher overlaid at the bottom inside card */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-black/5 p-1.5 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] flex items-center gap-1.5 max-w-[95%] overflow-x-auto scrollbar-none z-20">
                {(Object.keys(tabMeta) as Array<keyof typeof tabMeta>).map((key) => {
                  const meta = tabMeta[key];
                  const Icon = meta.icon;
                  const active = activeTab === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setActiveTab(key); setRotation(45); }}
                      className={`flex items-center justify-center gap-1.5 text-[11px] sm:text-xs px-3.5 py-2.5 rounded-xl font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                        active 
                          ? "bg-gradient-to-r from-[var(--coral)] to-[#FF8A65] text-white shadow-md shadow-[var(--coral)]/20 scale-105" 
                          : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-black/[0.03]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subtitle/Interactive prompt indicators below viewport */}
            <div className="w-full max-w-lg mt-3 flex justify-between items-center text-[10px] font-semibold text-[var(--muted)] px-2">
              <span className="bg-white px-2 py-1 rounded shadow-sm border border-black/[0.02]">{tabMeta[activeTab].note.slice(0, 50)}...</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-5 h-5 rounded bg-white hover:bg-black/[0.04] text-[var(--ink)] shadow-sm flex items-center justify-center cursor-pointer border border-black/[0.02]"
                >
                  {isPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                </button>
                <span>{rotation}°</span>
              </div>
            </div>

            {/* Slider dashboard ONLY visible if activeTab === "math" or "ielts" for interactive walkthrough control */}
            {activeTab === "math" && (
              <div className="w-full max-w-lg mt-4 p-4 rounded-2xl bg-white border border-black/5 shadow-sm space-y-3 font-body animate-float-fast">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="bg-[var(--coral)]/10 text-[var(--coral-dark)] px-2 py-0.5 rounded text-[10px] uppercase">
                    {tourSteps[mathStep - 1].title[lang]}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Step {mathStep} / 5</span>
                </div>
                <p className="text-xs font-semibold leading-relaxed text-[var(--ink)]">
                  {tourSteps[mathStep - 1].narration[lang]}
                </p>

                <div className="flex items-center gap-1.5 justify-end">
                  {/* Voice */}
                  <button
                    type="button"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`p-1.5 rounded-lg border text-xs cursor-pointer ${voiceEnabled ? "bg-amber-100 border-amber-300 text-amber-600" : "bg-white border-black/10 text-slate-400"}`}
                  >
                    {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMathStep(p => Math.max(1, p - 1))}
                    disabled={mathStep === 1}
                    className="px-2.5 py-1.5 bg-white border border-black/10 rounded-lg text-[10px] font-bold disabled:opacity-40"
                  >
                    {t.btnBack}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlayingTour(!isPlayingTour)}
                    className="px-3 py-1.5 bg-[var(--coral)] text-white rounded-lg text-[10px] font-bold"
                  >
                    {isPlayingTour ? t.btnStop : t.btnAutoPlay}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMathStep(p => Math.min(5, p + 1))}
                    disabled={mathStep === 5}
                    className="px-2.5 py-1.5 bg-white border border-black/10 rounded-lg text-[10px] font-bold disabled:opacity-40"
                  >
                    {t.btnNext}
                  </button>
                </div>

                {mathStep === 5 && (
                  <div className="pt-2 border-t border-black/5 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>Curvature a = {mathCoefA.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.04"
                        max="0.28"
                        step="0.01"
                        value={mathCoefA}
                        onChange={(e) => setMathCoefA(parseFloat(e.target.value))}
                        className="w-24 accent-[var(--teal)] h-1"
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>Height c = {mathCoefC.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.20"
                        max="1.10"
                        step="0.05"
                        value={mathCoefC}
                        onChange={(e) => setMathCoefC(parseFloat(e.target.value))}
                        className="w-24 accent-[var(--teal)] h-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section className="space-y-12" id="features">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Card 1: AI 3D Generation */}
            <div className="bg-white rounded-3xl p-7 border border-black/[0.03] shadow-[0_12px_24px_-10px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-orange-100/70 text-[var(--coral)] flex items-center justify-center mb-6 shadow-sm">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-lg mb-2 text-[var(--ink)]">
                {t.featGenTitle}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed font-body font-medium">
                {t.featGenDesc}
              </p>
            </div>

            {/* Card 2: Interactive Lessons */}
            <div className="bg-white rounded-3xl p-7 border border-black/[0.03] shadow-[0_12px_24px_-10px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-lg mb-2 text-[var(--ink)]">
                {t.featLessonsTitle}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed font-body font-medium">
                {t.featLessonsDesc}
              </p>
            </div>

            {/* Card 3: Easy Customization */}
            <div className="bg-white rounded-3xl p-7 border border-black/[0.03] shadow-[0_12px_24px_-10px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-600 flex items-center justify-center mb-6 shadow-sm">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-lg mb-2 text-[var(--ink)]">
                {t.featCustTitle}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed font-body font-medium">
                {t.featCustDesc}
              </p>
            </div>

            {/* Card 4: Share Everywhere */}
            <div className="bg-white rounded-3xl p-7 border border-black/[0.03] shadow-[0_12px_24px_-10px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-violet-100/70 text-[var(--violet)] flex items-center justify-center mb-6 shadow-sm">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-lg mb-2 text-[var(--ink)]">
                {t.featShareTitle}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed font-body font-medium">
                {t.featShareDesc}
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="text-center space-y-16 py-8" id="how-it-works">
          <div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--ink)]">
              {t.howItWorksTitle}
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto font-body">

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 relative">
              <div className="absolute -top-4 w-7 h-7 rounded-full bg-[var(--coral)] text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-md">
                1
              </div>
              <div className="w-20 h-20 rounded-3xl bg-orange-50 border border-orange-100/50 shadow-sm flex items-center justify-center text-[var(--coral)]">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--ink)]">{t.step1Title}</h3>
              <p className="text-xs text-[var(--muted)] max-w-[200px] leading-relaxed font-medium">
                {t.step1Desc}
              </p>
            </div>

            {/* Dotted curve divider 1 -> 2 (visible on md+) */}
            <div className="hidden md:block absolute left-[26%] top-10 w-[18%] h-0.5 border-t-2 border-dashed border-slate-200" />

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 relative">
              <div className="absolute -top-4 w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-md">
                2
              </div>
              <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-100/50 shadow-sm flex items-center justify-center text-amber-500">
                <Cpu className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--ink)]">{t.step2Title}</h3>
              <p className="text-xs text-[var(--muted)] max-w-[200px] leading-relaxed font-medium">
                {t.step2Desc}
              </p>
            </div>

            {/* Dotted curve divider 2 -> 3 (visible on md+) */}
            <div className="hidden md:block absolute right-[26%] top-10 w-[18%] h-0.5 border-t-2 border-dashed border-slate-200" />

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 relative">
              <div className="absolute -top-4 w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-md">
                3
              </div>
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100/50 shadow-sm flex items-center justify-center text-emerald-500">
                <Rocket className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--ink)]">{t.step3Title}</h3>
              <p className="text-xs text-[var(--muted)] max-w-[200px] leading-relaxed font-medium">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </section>

        {/* EXPLORE 3D LESSONS MADE WITH AI (CAROUSEL) */}
        <section className="text-center space-y-12" id="examples">
          <div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--ink)]">
              {t.carouselTitle}
            </h2>
          </div>

          {/* Carousel component block */}
          <div className="relative max-w-4xl mx-auto flex items-center justify-between gap-2 px-2 sm:px-6">

            {/* Left navigation arrow button */}
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-black/5 shadow-md flex items-center justify-center shrink-0 cursor-pointer text-slate-500 hover:text-[var(--ink)] transition-all"
              aria-label="Previous example"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Carousel Items viewport */}
            <div className="flex-grow overflow-hidden py-4">
              <div
                className="flex gap-6 transition-transform duration-500 ease-out justify-center"
                style={{ transform: `translateX(0px)` }}
              >
                {/* We render 3 visible cards centered on the active index */}
                {[-1, 0, 1].map((offset) => {
                  const idx = (carouselIndex + offset + carouselItems.length) % carouselItems.length;
                  const item = carouselItems[idx];
                  const isCenter = offset === 0;
                  return (
                    <div
                      key={idx}
                      className={`w-[260px] sm:w-[280px] shrink-0 rounded-3xl bg-white border border-black/[0.04] p-3 shadow-md transition-all duration-500 ${isCenter ? "scale-105 border-[var(--coral)]/40 ring-4 ring-[var(--ring)]/5 z-10" : "opacity-60 scale-95 blur-[1px] hidden sm:block"}`}
                    >
                      {/* Image container */}
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative bg-slate-100">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover select-none"
                        />
                      </div>
                      <div className="py-3 px-1 text-left flex justify-between items-center">
                        <span className="font-display font-extrabold text-sm text-[var(--ink)]">{item.name}</span>
                        <button
                          onClick={handleScrollToWaitlist}
                          className="w-7 h-7 rounded-lg bg-[var(--coral)]/10 text-[var(--coral)] hover:bg-[var(--coral)] hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right navigation arrow button */}
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 border border-black/5 shadow-md flex items-center justify-center shrink-0 cursor-pointer text-slate-500 hover:text-[var(--ink)] transition-all"
              aria-label="Next example"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Pagination dots indicator */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {carouselItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${i === carouselIndex ? "w-6 bg-[var(--coral)]" : "w-2 bg-slate-200"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <section className="max-w-3xl mx-auto space-y-12 py-6" id="faq">
          <div className="text-center">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--ink)]">
              {t.faqTitle}
            </h2>
          </div>

          <div className="space-y-4 font-body">
            {/* FAQ 1 */}
            <div className="bg-white border border-black/[0.03] rounded-2xl shadow-[0_4px_12px_-5px_rgba(0,0,0,0.04)] overflow-hidden">
              <button
                type="button"
                onClick={() => setFaqOpen(faqOpen === 1 ? null : 1)}
                className="w-full flex items-center justify-between p-5 text-left font-extrabold text-sm sm:text-base text-[var(--ink)] cursor-pointer hover:bg-slate-50/55 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[var(--coral)] shrink-0" />
                  {t.faqQ1}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${faqOpen === 1 ? "rotate-180" : ""}`} />
              </button>
              <div className={`transition-all duration-300 ${faqOpen === 1 ? "max-h-48 border-t border-black/[0.02]" : "max-h-0"} overflow-hidden`}>
                <p className="p-5 text-xs sm:text-sm text-[var(--muted)] leading-relaxed font-semibold">
                  {t.faqA1}
                </p>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="bg-white border border-black/[0.03] rounded-2xl shadow-[0_4px_12px_-5px_rgba(0,0,0,0.04)] overflow-hidden">
              <button
                type="button"
                onClick={() => setFaqOpen(faqOpen === 2 ? null : 2)}
                className="w-full flex items-center justify-between p-5 text-left font-extrabold text-sm sm:text-base text-[var(--ink)] cursor-pointer hover:bg-slate-50/55 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[var(--coral)] shrink-0" />
                  {t.faqQ2}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${faqOpen === 2 ? "rotate-180" : ""}`} />
              </button>
              <div className={`transition-all duration-300 ${faqOpen === 2 ? "max-h-48 border-t border-black/[0.02]" : "max-h-0"} overflow-hidden`}>
                <p className="p-5 text-xs sm:text-sm text-[var(--muted)] leading-relaxed font-semibold">
                  {t.faqA2}
                </p>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className="bg-white border border-black/[0.03] rounded-2xl shadow-[0_4px_12px_-5px_rgba(0,0,0,0.04)] overflow-hidden">
              <button
                type="button"
                onClick={() => setFaqOpen(faqOpen === 3 ? null : 3)}
                className="w-full flex items-center justify-between p-5 text-left font-extrabold text-sm sm:text-base text-[var(--ink)] cursor-pointer hover:bg-slate-50/55 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[var(--coral)] shrink-0" />
                  {t.faqQ3}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${faqOpen === 3 ? "rotate-180" : ""}`} />
              </button>
              <div className={`transition-all duration-300 ${faqOpen === 3 ? "max-h-48 border-t border-black/[0.02]" : "max-h-0"} overflow-hidden`}>
                <p className="p-5 text-xs sm:text-sm text-[var(--muted)] leading-relaxed font-semibold">
                  {t.faqA3}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA GRADIENT SECTION CARD */}
        <section className="py-6">
          <div className="w-full rounded-[36px] p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_30px_70px_-15px_rgba(255,107,74,0.18)] border border-[var(--coral)]/10" style={{ background: "linear-gradient(135deg, #FFE4D9 0%, #FFF4F0 100%)" }}>

            {/* Small decorative blobs */}
            <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-[var(--coral)]/40 animate-pulse" />
            <div className="absolute bottom-6 right-8 w-4 h-4 rounded-full bg-[var(--yellow)]/60 animate-bounce" style={{ animationDuration: "4s" }} />

            <div className="max-w-2xl mx-auto space-y-6 relative z-10 flex flex-col items-center">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--ink)]">
                {t.ctaTitle}
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted)] max-w-lg font-body font-semibold">
                {t.ctaSubtitle}
              </p>

              {/* Form inside CTA card */}
              <div className="w-full max-w-md">
                <form
                  onSubmit={handleWaitlistSubmit}
                  className="flex flex-col sm:flex-row gap-2 p-1.5 rounded-2xl bg-white shadow-sm border border-black/10 focus-within:border-[var(--coral)] focus-within:ring-4 focus-within:ring-[var(--ring)] transition-all"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    maxLength={100}
                    disabled={status === "loading" || status === "success"}
                    className="flex-grow px-4 py-2.5 bg-transparent outline-none text-sm placeholder-slate-400 font-body font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="btn-primary text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    {status === "loading" ? t.btnJoining : t.btnJoin} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Avatars */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-orange-100 text-orange-700 flex items-center justify-center text-[9px] font-bold shadow-sm">JS</div>
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-teal-100 text-teal-700 flex items-center justify-center text-[9px] font-bold shadow-sm">MT</div>
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-violet-100 text-violet-700 flex items-center justify-center text-[9px] font-bold shadow-sm">OX</div>
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-amber-100 text-amber-700 flex items-center justify-center text-[9px] font-bold shadow-sm">HV</div>
                </div>
                <p className="text-xs text-[var(--muted)] font-body font-bold">
                  {dbCount} {lang === "uz" ? "kishi allaqachon kutish ro'yxatida." : lang === "ru" ? "человек уже в списке ожидания." : "people already on the waitlist."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.04] py-10 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <span className="text-xs text-[var(--muted)] font-body">&copy; 2026 Edu3D AI. {t.footerText}</span>
          <div className="flex gap-6">
            <a href="#demo" className="text-xs text-[var(--muted)] hover:text-[var(--coral-dark)] transition-colors flex items-center gap-0.5 font-body">
              Twitter <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a href="#demo" className="text-xs text-[var(--muted)] hover:text-[var(--coral-dark)] transition-colors flex items-center gap-0.5 font-body">
              LinkedIn <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>

      {/* Suggestions Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-[0_30px_70px_rgba(255,107,74,0.15)] border-2 border-[var(--coral)]/20 relative z-10 transform scale-100 transition-all duration-300 font-body">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {modalStatus === "success" ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-display font-extrabold text-xl mb-2 text-[var(--ink)]">
                  {t.modalSuccess.split("! ")[0]}!
                </h4>
                <p className="text-sm text-[var(--muted)]">
                  {t.modalSuccess.split("! ")[1] || t.modalSuccess}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSuggestionSubmit}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[var(--coral)] flex items-center justify-center">
                    <Sparkles className="w-5.5 h-5.5" />
                  </div>
                  <h4 className="font-display font-extrabold text-xl text-[var(--ink)]">
                    {t.modalTitle}
                  </h4>
                </div>

                <p className="text-sm text-[var(--muted)] mb-5 leading-relaxed">
                  {t.modalSubtitle}
                </p>

                <div className="mb-5">
                  <textarea
                    rows={4}
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder={t.modalPlaceholder}
                    maxLength={500}
                    required
                    disabled={modalStatus === "loading"}
                    className="w-full rounded-2xl border border-black/10 p-4 text-sm placeholder-slate-400 focus:border-[var(--coral)] focus:ring-4 focus:ring-[var(--ring)] transition-all outline-none resize-none font-medium text-slate-800"
                  />
                  <div className="flex justify-between items-center mt-1 text-[10px] font-semibold text-[var(--muted)]">
                    <span>{t.modalPlaceholder.split(" (")[0]}</span>
                    <span>{suggestion.length}/500</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={modalStatus === "loading"}
                    className="px-5 py-2.5 rounded-xl border border-black/10 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                  >
                    {t.modalClose}
                  </button>
                  <button
                    type="submit"
                    disabled={modalStatus === "loading" || !suggestion.trim()}
                    className="btn-primary text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {modalStatus === "loading" ? t.modalSubmitting : t.modalSubmit}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}