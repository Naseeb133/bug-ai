export interface Sighting {
  id: string;
  imageUrl: string;
  species: string;
  scientificName: string;
  confidence: number;
  safety: 'harmless' | 'beneficial' | 'pest' | 'venomous' | 'dangerous';
  biteRisk: string;
  ecologicalRole: string;
  funFacts: string[];
  removalTips: string;
  quizAnswers: QuizAnswers;
  date: number;
}

export interface QuizAnswers {
  color: string;
  size: string;
  features: string;
  location: string;
}

const SIGHTINGS_KEY = 'bugai_sightings';
const USAGE_KEY = 'bugai_usage';
const THEME_KEY = 'bugai_theme';
const PRO_KEY = 'bugai_pro';

export function getSightings(): Sighting[] {
  try {
    return JSON.parse(localStorage.getItem(SIGHTINGS_KEY) || '[]');
  } catch { return []; }
}

export function saveSighting(sighting: Sighting) {
  const sightings = getSightings();
  localStorage.setItem(SIGHTINGS_KEY, JSON.stringify([sighting, ...sightings]));
}

export function clearSightings() {
  localStorage.removeItem(SIGHTINGS_KEY);
}

export function getDailyUsage(): number {
  try {
    const data = JSON.parse(localStorage.getItem(USAGE_KEY) || '{}');
    const today = new Date().toDateString();
    return data.date === today ? data.count : 0;
  } catch { return 0; }
}

export function incrementUsage() {
  const today = new Date().toDateString();
  const current = getDailyUsage();
  localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count: current + 1 }));
}

export function getTheme(): 'dark' | 'light' {
  return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark';
}

export function setTheme(theme: 'dark' | 'light') {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function isPro(): boolean {
  return localStorage.getItem(PRO_KEY) === 'true';
}

export function setPro(value: boolean) {
  localStorage.setItem(PRO_KEY, value ? 'true' : 'false');
}

export const FREE_DAILY_LIMIT = 5;

export function generateId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// Simulated bug identification database
const BUG_DATABASE: Omit<Sighting, 'id' | 'imageUrl' | 'quizAnswers' | 'date'>[] = [
  {
    species: 'Ladybug',
    scientificName: 'Coccinella septempunctata',
    confidence: 94,
    safety: 'beneficial',
    biteRisk: 'No bite risk. Ladybugs are completely harmless to humans.',
    ecologicalRole: 'Voracious aphid predators — a single ladybug can eat up to 5,000 aphids in its lifetime. Essential for natural pest control in gardens.',
    funFacts: [
      'A ladybug can eat up to 75 aphids per day',
      'They play dead when threatened',
      'Their bright colors warn predators they taste bad',
    ],
    removalTips: 'No removal needed! Ladybugs are garden heroes. If indoors, gently place on a plant outside.',
  },
  {
    species: 'House Spider',
    scientificName: 'Parasteatoda tepidariorum',
    confidence: 87,
    safety: 'harmless',
    biteRisk: 'Very rare bites, medically insignificant. May cause minor irritation similar to a mosquito bite.',
    ecologicalRole: 'Controls indoor insect populations including mosquitoes, flies, and moths. A beneficial household predator.',
    funFacts: [
      'House spiders can survive months without food',
      'They build new webs every day',
      'Most house spiders have lived indoors for thousands of generations',
    ],
    removalTips: 'Use a glass and paper to gently relocate outside. Seal entry points to prevent return.',
  },
  {
    species: 'Monarch Butterfly',
    scientificName: 'Danaus plexippus',
    confidence: 96,
    safety: 'harmless',
    biteRisk: 'No bite or sting risk whatsoever.',
    ecologicalRole: 'Important pollinator. Their migration patterns serve as indicators of ecosystem health.',
    funFacts: [
      'Monarchs migrate up to 3,000 miles each year',
      'They are toxic to predators from eating milkweed',
      'A monarch can flap its wings up to 12 times per second',
    ],
    removalTips: 'No removal needed. Plant milkweed to support their population!',
  },
  {
    species: 'Fire Ant',
    scientificName: 'Solenopsis invicta',
    confidence: 91,
    safety: 'dangerous',
    biteRisk: 'Painful stings that cause burning, itching, and pustules. Can cause severe allergic reactions in some people.',
    ecologicalRole: 'Invasive species in many regions. Aerates soil but displaces native ant species.',
    funFacts: [
      'Fire ants can form living rafts during floods',
      'A colony can have over 200,000 workers',
      'They were accidentally imported from South America',
    ],
    removalTips: 'Use boiling water on mounds carefully. Professional pest control recommended for large infestations. Avoid disturbing mounds.',
  },
  {
    species: 'Praying Mantis',
    scientificName: 'Mantis religiosa',
    confidence: 93,
    safety: 'beneficial',
    biteRisk: 'Can pinch with forelegs if handled roughly, but not venomous. No medical concern.',
    ecologicalRole: 'Top insect predator that controls pest populations including moths, beetles, and crickets.',
    funFacts: [
      'They can turn their heads 180 degrees',
      'Females sometimes eat males after mating',
      'They are the only insect that can look over their shoulder',
    ],
    removalTips: 'No removal needed — mantises are excellent garden guardians! Relocate gently if indoors.',
  },
];

export function identifyBug(quizAnswers: QuizAnswers): Omit<Sighting, 'id' | 'imageUrl' | 'quizAnswers' | 'date'> {
  // Simple selection based on quiz answers for demo
  const idx = Math.floor(Math.random() * BUG_DATABASE.length);
  return { ...BUG_DATABASE[idx] };
}
