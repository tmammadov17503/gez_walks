export type GezLocale = 'az' | 'en' | 'ru';
export type DogSize = 'small' | 'medium' | 'large';
export type Energy = 'calm' | 'moderate' | 'active';
export type District = 'Yasamal' | 'Sabail' | 'Nasimi' | 'Narimanov' | 'Khatai' | 'Binagadi';

export type GezWalker = {
  id: string;
  name: string;
  district: District;
  rating: number;
  walks: number;
  price45: number;
  portrait: string;
  about: string;
  languages: string[];
  specialties: string[];
  trustTags: string[];
  acceptedSizes: DogSize[];
  availability: string;
  dogOwned?: string;
};

export type GezDog = {
  name: string;
  breed: string;
  age: number;
  sex: 'male' | 'female';
  weight: number;
  size: DogSize;
  energy: Energy;
  friendlyDogs: boolean;
  friendlyStrangers: boolean;
  pulls: boolean;
  reactive: boolean;
  treats: boolean;
  medical: string;
  emergency: string;
  vet: string;
  instructions: string;
};

export const defaultDog: GezDog = {
  name: 'Milo',
  breed: 'Golden Retriever',
  age: 3,
  sex: 'male',
  weight: 28,
  size: 'large',
  energy: 'active',
  friendlyDogs: true,
  friendlyStrangers: true,
  pulls: false,
  reactive: false,
  treats: true,
  medical: 'No current medication',
  emergency: '+994 50 555 14 18',
  vet: 'Central Vet Clinic',
  instructions: 'Offer water after active play. Milo knows “wait” and “yanımda”.',
};

type PersistedDog = Omit<GezDog, 'medical' | 'emergency' | 'vet' | 'instructions'>;

export function toPersistedDog(dog: GezDog): PersistedDog {
  const { medical: _medical, emergency: _emergency, vet: _vet, instructions: _instructions, ...safeDog } = dog;
  return safeDog;
}

export function sanitizeStoredDog(value: unknown): GezDog {
  const stored = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const text = (key: string, fallback: string, maxLength: number) =>
    typeof stored[key] === 'string' && stored[key].trim()
      ? stored[key].trim().slice(0, maxLength)
      : fallback;
  const number = (key: string, fallback: number, min: number, max: number) => {
    const candidate = typeof stored[key] === 'number' && Number.isFinite(stored[key]) ? stored[key] : fallback;
    return Math.min(max, Math.max(min, candidate));
  };
  const bool = (key: string, fallback: boolean) => typeof stored[key] === 'boolean' ? stored[key] : fallback;
  const size = stored.size === 'small' || stored.size === 'medium' || stored.size === 'large' ? stored.size : defaultDog.size;
  const energy = stored.energy === 'calm' || stored.energy === 'moderate' || stored.energy === 'active' ? stored.energy : defaultDog.energy;
  const sex = stored.sex === 'female' || stored.sex === 'male' ? stored.sex : defaultDog.sex;

  return {
    ...defaultDog,
    name: text('name', defaultDog.name, 40),
    breed: text('breed', defaultDog.breed, 60),
    age: number('age', defaultDog.age, 0, 30),
    weight: number('weight', defaultDog.weight, 1, 100),
    size,
    energy,
    sex,
    friendlyDogs: bool('friendlyDogs', defaultDog.friendlyDogs),
    friendlyStrangers: bool('friendlyStrangers', defaultDog.friendlyStrangers),
    pulls: bool('pulls', defaultDog.pulls),
    reactive: bool('reactive', defaultDog.reactive),
    treats: bool('treats', defaultDog.treats),
  };
}

export const gezWalkers: readonly GezWalker[] = [
  {
    id: 'nigar',
    name: 'Nigar M.',
    district: 'Yasamal',
    rating: 4.9,
    walks: 57,
    price45: 15,
    portrait: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=82',
    about: "I've lived with dogs since childhood. I have a Labrador called Leo and usually walk around Yasamal and Central Park.",
    languages: ['AZ', 'EN', 'RU'],
    specialties: ['Large dogs', 'High-energy dogs', 'Basic training'],
    trustTags: ['ID verified', 'Repeat clients', 'Dog first aid'],
    acceptedSizes: ['medium', 'large'],
    availability: 'Today · 18:30–21:00',
    dogOwned: 'Leo · Labrador',
  },
  {
    id: 'leyla',
    name: 'Leyla A.',
    district: 'Sabail',
    rating: 4.8,
    walks: 31,
    price45: 17,
    portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=82',
    about: 'A calm walker who prefers one dog at a time and knows the quieter routes around the Boulevard and İçərişəhər.',
    languages: ['AZ', 'RU'],
    specialties: ['Senior dogs', 'Small dogs', 'Slow walks'],
    trustTags: ['ID verified', 'One dog at a time'],
    acceptedSizes: ['small'],
    availability: 'Tomorrow · 08:00–12:00',
  },
  {
    id: 'murad',
    name: 'Murad R.',
    district: 'Nasimi',
    rating: 4.7,
    walks: 22,
    price45: 13,
    portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=82',
    about: 'Weekend runner and rescue-dog volunteer. Best suited to active dogs who enjoy a faster pace.',
    languages: ['AZ', 'EN'],
    specialties: ['Running', 'High-energy dogs', 'Rescue dogs'],
    trustTags: ['ID verified', 'Weekend favorite'],
    acceptedSizes: ['medium', 'large'],
    availability: 'Today · 19:00–22:00',
  },
  {
    id: 'aysel',
    name: 'Aysel H.',
    district: 'Narimanov',
    rating: 4.9,
    walks: 84,
    price45: 16,
    portrait: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=82',
    about: 'Patient and observant, with experience supporting shy dogs and maintaining simple medication routines.',
    languages: ['AZ', 'EN', 'RU'],
    specialties: ['Shy dogs', 'Medication experience', 'Senior dogs'],
    trustTags: ['ID verified', 'Dog first aid', 'Repeat clients'],
    acceptedSizes: ['small', 'medium'],
    availability: 'Tomorrow · 10:00–18:00',
  },
  {
    id: 'elvin',
    name: 'Elvin S.',
    district: 'Khatai',
    rating: 4.6,
    walks: 18,
    price45: 12,
    portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=82',
    about: 'Newer to GƏZ but experienced with his own shepherd mix. Comfortable with strong dogs and structured walks.',
    languages: ['AZ', 'RU'],
    specialties: ['Large dogs', 'Leash practice', 'Structured walks'],
    trustTags: ['ID verified', 'Trial walks complete'],
    acceptedSizes: ['large'],
    availability: 'Today · 20:00–22:30',
    dogOwned: 'Zara · Shepherd mix',
  },
  {
    id: 'sabinah',
    name: 'Sabina K.',
    district: 'Binagadi',
    rating: 4.8,
    walks: 46,
    price45: 14,
    portrait: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=900&q=82',
    about: 'A design student with a gentle pace and years of experience caring for family dogs and puppies.',
    languages: ['AZ', 'EN'],
    specialties: ['Puppies', 'Small dogs', 'Basic training'],
    trustTags: ['ID verified', 'Puppy experience'],
    acceptedSizes: ['small', 'medium'],
    availability: 'Tomorrow · 15:00–20:00',
  },
];

export function filterGezWalkers(
  walkers: readonly GezWalker[],
  criteria: { district: District | 'All'; size: DogSize },
): GezWalker[] {
  return walkers
    .filter((walker) => criteria.district === 'All' || walker.district === criteria.district)
    .filter((walker) => walker.acceptedSizes.includes(criteria.size))
    .toSorted((left, right) => right.rating - left.rating || right.walks - left.walks);
}

export const walkStatuses = ['requested', 'accepted', 'arriving', 'walking', 'completed'] as const;
export type WalkStatus = (typeof walkStatuses)[number];

export function advanceWalkStatus(status: WalkStatus): WalkStatus {
  const index = walkStatuses.indexOf(status);
  return walkStatuses[Math.min(index + 1, walkStatuses.length - 1)];
}

export function priceForDuration(price45: number, duration: number): number {
  const ratios: Record<number, number> = { 30: 0.75, 45: 1, 60: 1.3, 90: 1.85 };
  return Math.round(price45 * (ratios[duration] ?? 1));
}

export function getWalkConditions(temperature: number) {
  if (temperature >= 32) {
    return {
      level: 'hot' as const,
      temperature,
      message: {
        az: 'İsti səth riski. Daha qısa gəzinti və ya axşam vaxtı seç.',
        en: 'Hot pavement risk. Consider a shorter walk or an evening time.',
        ru: 'Риск горячего асфальта. Выберите короткую прогулку или вечернее время.',
      },
    };
  }

  return {
    level: 'comfortable' as const,
    temperature,
    message: {
      az: 'Gəzinti üçün rahat hava.',
      en: 'Comfortable walking weather.',
      ru: 'Комфортная погода для прогулки.',
    },
  };
}

export type GezCopy = {
  navFind: string;
  navHow: string;
  navBecome: string;
  navSignIn: string;
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  findWalker: string;
  becomeWalker: string;
  promise: string;
  howTitle: string;
  howBody: string;
  trustEyebrow: string;
  trustTitle: string;
  trustBody: string;
  walkerTitle: string;
  walkerBody: string;
  appHome: string;
  appWalk: string;
  appActivity: string;
  appDog: string;
  appProfile: string;
  continuePhone: string;
  phoneLabel: string;
  sendCode: string;
  enterCode: string;
  verifyCode: string;
  whoWalking: string;
  saveDog: string;
  whenWalk: string;
  nearby: string;
  meetFirst: string;
  chooseWalker: string;
  requestWalk: string;
  nextStatus: string;
  liveTitle: string;
  reportTitle: string;
  bookAgain: string;
};

const gezCopy: Record<GezLocale, GezCopy> = {
  en: {
    navFind: 'Find a walker', navHow: 'How it works', navBecome: 'Become a walker', navSignIn: 'Sign in',
    heroEyebrow: 'Azerbaijani-first dog care · Baku', heroTitle: 'Good walks. Happy dogs.',
    heroBody: 'Trusted dog walkers around Baku, whenever you need one.', findWalker: 'Find a walker',
    becomeWalker: 'Become a walker', promise: 'A good walk. Someone you trust.', howTitle: 'Care you can follow.',
    howBody: 'Create your dog, choose the right person, and stay close to every part of the walk.',
    trustEyebrow: 'Trust & safety', trustTitle: 'Not everyone gets the leash.',
    trustBody: 'People earn trust step by step—before they ever meet your dog.',
    walkerTitle: 'Love dogs? Walk with GƏZ.', walkerBody: 'Choose your schedule, walk dogs nearby, and earn per walk.',
    appHome: 'Home', appWalk: 'Walk', appActivity: 'Activity', appDog: 'Milo', appProfile: 'Profile',
    continuePhone: 'Continue with phone', phoneLabel: 'Phone number', sendCode: 'Send code', enterCode: 'Enter the 4-digit code', verifyCode: 'Verify & continue',
    whoWalking: 'Who are we walking?', saveDog: 'Save Milo', whenWalk: 'When does Milo need a walk?', nearby: 'Nearby walkers',
    meetFirst: 'Meet first — free', chooseWalker: 'Choose this walker', requestWalk: 'Request walk', nextStatus: 'Simulate next update',
    liveTitle: 'Milo is out walking.', reportTitle: 'Milo had a good one.', bookAgain: 'Book Nigar again',
  },
  az: {
    navFind: 'Gəzdirici tap', navHow: 'Necə işləyir', navBecome: 'Gəzdirici ol', navSignIn: 'Daxil ol',
    heroEyebrow: 'Azərbaycan dilində it qayğısı · Bakı', heroTitle: 'Yaxşı gəzinti. Xoşbəxt it.',
    heroBody: 'Bakıda etibar etdiyin it gəzdiricisi — ehtiyacın olan vaxtda.', findWalker: 'Gəzdirici tap',
    becomeWalker: 'Gəzdirici ol', promise: 'Yaxşı gəzinti. Etibar etdiyin insan.', howTitle: 'İzləyə bildiyin qayğı.',
    howBody: 'İtinin profilini yarat, doğru insanı seç və gəzintinin hər anına yaxın ol.',
    trustEyebrow: 'Etibar və təhlükəsizlik', trustTitle: 'Qayış hər kəsə verilmir.',
    trustBody: 'Gəzdiricilər itinlə tanış olmazdan əvvəl etibarı addım-addım qazanırlar.',
    walkerTitle: 'İtləri sevirsən? GƏZ ilə gəz.', walkerBody: 'Qrafikini seç, yaxınlıqdakı itləri gəzdir və hər gəzintidən gəlir qazan.',
    appHome: 'Ana səhifə', appWalk: 'Gəzinti', appActivity: 'Fəaliyyət', appDog: 'Milo', appProfile: 'Profil',
    continuePhone: 'Telefonla davam et', phoneLabel: 'Telefon nömrəsi', sendCode: 'Kod göndər', enterCode: '4 rəqəmli kodu daxil et', verifyCode: 'Təsdiqlə və davam et',
    whoWalking: 'Kimi gəzdiririk?', saveDog: 'Milonu yadda saxla', whenWalk: 'Milo nə vaxt gəzməlidir?', nearby: 'Yaxın gəzdiricilər',
    meetFirst: 'Əvvəlcə tanış ol — pulsuz', chooseWalker: 'Bu gəzdiricini seç', requestWalk: 'Gəzinti sorğusu göndər', nextStatus: 'Növbəti vəziyyəti göstər',
    liveTitle: 'Milo gəzintidədir.', reportTitle: 'Milo yaxşı gəzdi.', bookAgain: 'Nigarı yenidən seç',
  },
  ru: {
    navFind: 'Найти выгульщика', navHow: 'Как это работает', navBecome: 'Стать выгульщиком', navSignIn: 'Войти',
    heroEyebrow: 'Забота о собаках в Баку', heroTitle: 'Хорошая прогулка. Счастливая собака.',
    heroBody: 'Надёжные выгульщики рядом с вами в Баку — когда это нужно.', findWalker: 'Найти выгульщика',
    becomeWalker: 'Стать выгульщиком', promise: 'Хорошая прогулка. Человек, которому доверяешь.', howTitle: 'Забота, которую видно.',
    howBody: 'Создайте профиль собаки, выберите человека и оставайтесь рядом на каждом этапе прогулки.',
    trustEyebrow: 'Доверие и безопасность', trustTitle: 'Поводок доверяют не каждому.',
    trustBody: 'Выгульщики заслуживают доверие шаг за шагом — ещё до встречи с вашей собакой.',
    walkerTitle: 'Любите собак? Гуляйте с GƏZ.', walkerBody: 'Выбирайте график, гуляйте рядом с домом и зарабатывайте за прогулку.',
    appHome: 'Главная', appWalk: 'Прогулка', appActivity: 'История', appDog: 'Майло', appProfile: 'Профиль',
    continuePhone: 'Продолжить с телефоном', phoneLabel: 'Номер телефона', sendCode: 'Отправить код', enterCode: 'Введите 4-значный код', verifyCode: 'Подтвердить',
    whoWalking: 'Кого мы выгуливаем?', saveDog: 'Сохранить Майло', whenWalk: 'Когда Майло нужна прогулка?', nearby: 'Выгульщики рядом',
    meetFirst: 'Сначала знакомство — бесплатно', chooseWalker: 'Выбрать выгульщика', requestWalk: 'Запросить прогулку', nextStatus: 'Следующее обновление',
    liveTitle: 'Майло на прогулке.', reportTitle: 'Майло отлично погулял.', bookAgain: 'Снова выбрать Нигяр',
  },
};

export function getGezCopy(locale: GezLocale): GezCopy {
  return gezCopy[locale] ?? gezCopy.az;
}
