'use client';

/* eslint-disable next/no-img-element, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-static-element-interactions */

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  CloudSun,
  Dog,
  Edit3,
  Heart,
  Home,
  Languages,
  MessageCircle,
  Navigation,
  Phone,
  Plus,
  ShieldCheck,
  Star,
  UserRound,
  X,
} from 'lucide-react';
import { GezLogo } from '@/components/gez-logo';
import {
  advanceWalkStatus,
  defaultDog,
  filterGezWalkers,
  gezWalkers,
  getWalkConditions,
  priceForDuration,
  sanitizeStoredDog,
  toPersistedDog,
  type District,
  type GezCopy,
  type GezDog,
  type GezLocale,
  type GezWalker,
  type WalkStatus,
} from '@/lib/gez-prototype';

type AppPrototypeProps = {
  copy: GezCopy;
  locale: GezLocale;
  onLocaleChange: (locale: GezLocale) => void;
  onExit: () => void;
};

type AppTab = 'home' | 'walk' | 'activity' | 'dog' | 'profile';
type Gate = 'phone' | 'otp' | 'dog' | 'app';

const districts: Array<District | 'All'> = ['All', 'Yasamal', 'Sabail', 'Nasimi', 'Narimanov', 'Khatai', 'Binagadi'];
const durations = [30, 45, 60, 90];
const statusLabels: Record<GezLocale, Record<WalkStatus, string>> = {
  en: { requested: 'Requested', accepted: 'Accepted', arriving: 'Walker arriving', walking: 'Walking', completed: 'Home' },
  az: { requested: 'Göndərildi', accepted: 'Qəbul edildi', arriving: 'Gəzdirici gəlir', walking: 'Gəzintidə', completed: 'Evdə' },
  ru: { requested: 'Отправлено', accepted: 'Принято', arriving: 'Выгульщик едет', walking: 'На прогулке', completed: 'Дома' },
};

const appText: Record<GezLocale, Record<string, string>> = {
  en: {
    welcome: 'Good evening, Aylin', okay: 'Milo is home and all good.', next: 'Next walk', past: 'Past walks', favorite: 'Favorite walkers',
    editDog: 'Edit profile', today: 'Today', tomorrow: 'Tomorrow', date: 'Date', time: 'Time', duration: 'Duration', district: 'District',
    all: 'All Baku', available: 'available for Milo', details: 'View profile', with: 'with', pickup: 'Pickup instructions', apartment: 'Apartment / building',
    special: 'Special instructions', summary: 'Walk summary', received: 'Nigar has received your request.', simulate: 'This demo lets you advance every stage.',
    message: 'Message Nigar', urgent: 'Call if urgent', route: 'Live route', water: 'Water break', photo: 'Photo added', heading: 'Heading home',
    report: 'Walk report', bathroom: 'Bathroom', photos: 'Photos', note: "Nigar's note", rate: 'Rate Nigar', history: 'Walk history',
    account: 'Prototype account', signout: 'Sign out of demo', conditions: 'Walk conditions', save: 'Save changes', formNote: 'The details that help a walker understand Milo.',
    freeMeet: 'First-time owners can arrange a free meet & greet before booking.', noMatch: 'No compatible walker in this district yet. Try All Baku.',
  },
  az: {
    welcome: 'Axşamın xeyir, Aylin', okay: 'Milo evdədir və hər şey yaxşıdır.', next: 'Növbəti gəzinti', past: 'Keçmiş gəzintilər', favorite: 'Sevimli gəzdiricilər',
    editDog: 'Profili düzəlt', today: 'Bu gün', tomorrow: 'Sabah', date: 'Tarix', time: 'Vaxt', duration: 'Müddət', district: 'Rayon',
    all: 'Bütün Bakı', available: 'Milo üçün uyğundur', details: 'Profilə bax', with: 'ilə', pickup: 'Götürmə təlimatı', apartment: 'Mənzil / bina',
    special: 'Xüsusi təlimat', summary: 'Gəzinti xülasəsi', received: 'Nigar sorğunu aldı.', simulate: 'Demoda hər mərhələni irəli apara bilərsən.',
    message: 'Nigara yaz', urgent: 'Təcili zəng', route: 'Canlı marşrut', water: 'Su fasiləsi', photo: 'Foto əlavə edildi', heading: 'Evə qayıdırlar',
    report: 'Gəzinti hesabatı', bathroom: 'Tualet', photos: 'Fotolar', note: 'Nigarın qeydi', rate: 'Nigarı qiymətləndir', history: 'Gəzinti tarixçəsi',
    account: 'Prototip hesabı', signout: 'Demodan çıx', conditions: 'Gəzinti şəraiti', save: 'Dəyişiklikləri saxla', formNote: 'Gəzdiricinin Milonu tanımasına kömək edən detallar.',
    freeMeet: 'İlk dəfə sifariş edənlər əvvəlcədən pulsuz tanışlıq görüşü edə bilərlər.', noMatch: 'Bu rayonda Milo üçün uyğun gəzdirici yoxdur. Bütün Bakını yoxla.',
  },
  ru: {
    welcome: 'Добрый вечер, Айлин', okay: 'Майло дома, всё хорошо.', next: 'Следующая прогулка', past: 'Прошлые прогулки', favorite: 'Любимые выгульщики',
    editDog: 'Изменить профиль', today: 'Сегодня', tomorrow: 'Завтра', date: 'Дата', time: 'Время', duration: 'Длительность', district: 'Район',
    all: 'Весь Баку', available: 'подходит Майло', details: 'Открыть профиль', with: 'с', pickup: 'Как забрать собаку', apartment: 'Квартира / дом',
    special: 'Особые инструкции', summary: 'Итог прогулки', received: 'Нигяр получила запрос.', simulate: 'В демо можно пройти каждый этап.',
    message: 'Написать Нигяр', urgent: 'Срочный звонок', route: 'Живой маршрут', water: 'Перерыв на воду', photo: 'Добавлено фото', heading: 'Возвращаются домой',
    report: 'Отчёт о прогулке', bathroom: 'Туалет', photos: 'Фото', note: 'Заметка Нигяр', rate: 'Оценить Нигяр', history: 'История прогулок',
    account: 'Демо-аккаунт', signout: 'Выйти из демо', conditions: 'Условия прогулки', save: 'Сохранить', formNote: 'Детали, которые помогут лучше понять Майло.',
    freeMeet: 'Перед первым заказом можно бесплатно познакомиться с выгульщиком.', noMatch: 'В этом районе пока нет подходящего человека. Выберите весь Баку.',
  },
};

function LanguageButtons({ locale, onChange }: { locale: GezLocale; onChange: (locale: GezLocale) => void }) {
  return (
    <div className="flex rounded-full border border-[#ddd7cc] p-1" aria-label="Language selector">
      {(['az', 'en', 'ru'] as const).map((item) => (
        <button key={item} onClick={() => onChange(item)} aria-pressed={locale === item} className={`rounded-full px-2.5 py-1.5 text-[0.62rem] font-bold uppercase ${locale === item ? 'bg-[#31483b] text-white' : 'text-[#778078]'}`}>{item}</button>
      ))}
    </div>
  );
}

function SignInGate({ copy, onComplete, onBack }: { copy: GezCopy; onComplete: () => void; onBack: () => void }) {
  const [step, setStep] = useState<'choice' | 'phone' | 'otp'>('choice');
  const [phone, setPhone] = useState('50 555 14 18');
  const [otp, setOtp] = useState('');

  return (
    <main className="grid min-h-screen bg-[#f6f1e7] lg:grid-cols-[.9fr_1.1fr]">
      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between"><button onClick={onBack}><GezLogo /></button><span className="text-xs font-semibold text-[#778078]">AZ · EN · RU</span></div>
        <div className="my-auto mx-auto w-full max-w-[470px] py-16">
          <button onClick={step === 'choice' ? onBack : () => setStep('choice')} className="mb-10 flex items-center gap-2 text-xs font-bold text-[#6d776f]"><ArrowLeft className="size-4" /> Back</button>
          <p className="text-[0.67rem] font-bold uppercase tracking-[0.18em] text-[#8a958c]">GƏZ prototype</p>
          <h1 className="font-display mt-4 text-5xl font-medium tracking-[-0.045em]">{step === 'otp' ? copy.enterCode : copy.continuePhone}</h1>
          <p className="mt-4 text-sm leading-6 text-[#737c75]">No password. We use your number only to keep your dog and walks connected to you.</p>

          {step === 'choice' && (
            <div className="mt-9 grid gap-3">
              <button onClick={() => setStep('phone')} className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#31483b] text-sm font-bold text-white"><Phone className="size-4" />{copy.continuePhone}</button>
              <button onClick={onComplete} className="h-14 rounded-2xl border border-[#d8d3c7] bg-[#fffaf1] text-sm font-bold">Continue with Apple</button>
              <button onClick={onComplete} className="h-14 rounded-2xl border border-[#d8d3c7] bg-[#fffaf1] text-sm font-bold">Continue with Google</button>
            </div>
          )}

          {step === 'phone' && (
            <form className="mt-9" onSubmit={(event) => { event.preventDefault(); setStep('otp'); }}>
              <label className="text-xs font-bold text-[#59665e]">{copy.phoneLabel}</label>
              <div className="mt-2 flex h-15 items-center rounded-2xl border border-[#d8d3c7] bg-[#fffaf1] px-4 focus-within:border-[#8ca27f]">
                <span className="border-r border-[#ddd7cc] pr-3 text-sm font-bold">+994</span>
                <input required value={phone} onChange={(event) => setPhone(event.target.value)} className="min-w-0 flex-1 bg-transparent px-3 text-base font-semibold outline-none" inputMode="tel" aria-label="Azerbaijan phone number" />
              </div>
              <button className="mt-4 h-14 w-full rounded-2xl bg-[#31483b] text-sm font-bold text-white">{copy.sendCode}</button>
            </form>
          )}

          {step === 'otp' && (
            <form className="mt-9" onSubmit={(event) => { event.preventDefault(); if (otp.length === 4) onComplete(); }}>
              <div className="flex gap-3">
                {[0, 1, 2, 3].map((index) => <div key={index} className="grid h-16 flex-1 place-items-center rounded-2xl border border-[#d8d3c7] bg-[#fffaf1] text-xl font-bold">{otp[index] ?? '·'}</div>)}
              </div>
              <input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" aria-label="One-time code" className="absolute h-px w-px opacity-0" />
              <p className="mt-4 text-xs text-[#7a837c]">Prototype tip: enter any four digits.</p>
              <button disabled={otp.length !== 4} className="mt-4 h-14 w-full rounded-2xl bg-[#31483b] text-sm font-bold text-white disabled:opacity-40">{copy.verifyCode}</button>
            </form>
          )}
        </div>
      </section>
      <section className="relative hidden overflow-hidden bg-[#eae4d8] lg:block">
        <img src="/gez-baku-model.png" alt="GƏZ miniature Baku walking scene" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute bottom-10 left-10 max-w-sm rounded-[28px] border border-white/50 bg-[#fffaf1]/90 p-6 backdrop-blur-sm">
          <p className="font-display text-2xl italic text-[#31483b]">“A good walk. Someone you trust.”</p>
        </div>
      </section>
    </main>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className="flex items-center justify-between rounded-2xl border border-[#ddd7cc] bg-[#fffaf1] px-4 py-3 text-left text-sm font-semibold">
      {label}<span className={`relative h-6 w-11 rounded-full transition ${value ? 'bg-[#7f9873]' : 'bg-[#d8d3c7]'}`}><span className={`absolute top-1 size-4 rounded-full bg-white transition ${value ? 'left-6' : 'left-1'}`} /></span>
    </button>
  );
}

function DogProfileForm({ copy, locale, initial, onSave, onBack }: { copy: GezCopy; locale: GezLocale; initial: GezDog; onSave: (dog: GezDog) => void; onBack?: () => void }) {
  const [dog, setDog] = useState(initial);
  const t = appText[locale];
  const set = <K extends keyof GezDog>(key: K, value: GezDog[K]) => setDog((current) => ({ ...current, [key]: value }));

  return (
    <main className="min-h-screen bg-[#f6f1e7] px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-[950px]">
        <div className="flex items-center justify-between">{onBack ? <button onClick={onBack} className="grid size-11 place-items-center rounded-full border border-[#d8d3c7]"><ArrowLeft className="size-4" /></button> : <GezLogo />}<span className="text-xs font-bold text-[#78827b]">01 / 02</span></div>
        <div className="mt-12 grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <div className="relative mx-auto grid size-44 place-items-center overflow-hidden rounded-[44%] bg-[#d8e0ce]">
              <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=85" alt="Milo the Golden Retriever" className="h-full w-full object-cover" />
              <button className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-[#fffaf1]"><Edit3 className="size-4" /></button>
            </div>
            <h1 className="font-display mt-8 text-5xl font-medium leading-none tracking-[-0.045em]">{copy.whoWalking}</h1>
            <p className="mt-5 text-sm leading-6 text-[#717a73]">{t.formNote}</p>
          </div>

          <form onSubmit={(event) => { event.preventDefault(); onSave(dog); }} className="grid gap-5 rounded-[34px] border border-[#ddd7cc] bg-[#fffaf1] p-5 sm:grid-cols-2 sm:p-8">
            <label className="grid gap-2 text-xs font-bold">Name<input required value={dog.name} onChange={(event) => set('name', event.target.value)} className="gez-input" /></label>
            <label className="grid gap-2 text-xs font-bold">Breed<input required value={dog.breed} onChange={(event) => set('breed', event.target.value)} className="gez-input" /></label>
            <label className="grid gap-2 text-xs font-bold">Age<input type="number" min="0" max="30" value={dog.age} onChange={(event) => set('age', Number(event.target.value))} className="gez-input" /></label>
            <label className="grid gap-2 text-xs font-bold">Weight · kg<input type="number" min="1" max="100" value={dog.weight} onChange={(event) => set('weight', Number(event.target.value))} className="gez-input" /></label>
            <fieldset className="sm:col-span-2"><legend className="text-xs font-bold">Size</legend><div className="mt-2 flex gap-2">{(['small', 'medium', 'large'] as const).map((size) => <button type="button" key={size} onClick={() => set('size', size)} className={`flex-1 rounded-xl border px-3 py-3 text-xs font-bold capitalize ${dog.size === size ? 'border-[#31483b] bg-[#31483b] text-white' : 'border-[#ddd7cc]'}`}>{size}</button>)}</div></fieldset>
            <fieldset className="sm:col-span-2"><legend className="text-xs font-bold">Energy</legend><div className="mt-2 flex gap-2">{(['calm', 'moderate', 'active'] as const).map((energy) => <button type="button" key={energy} onClick={() => set('energy', energy)} className={`flex-1 rounded-xl border px-3 py-3 text-xs font-bold capitalize ${dog.energy === energy ? 'border-[#859c79] bg-[#dfe8d8]' : 'border-[#ddd7cc]'}`}>{energy}</button>)}</div></fieldset>
            <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2">
              <ToggleRow label="Friendly with dogs" value={dog.friendlyDogs} onChange={(value) => set('friendlyDogs', value)} />
              <ToggleRow label="Friendly with strangers" value={dog.friendlyStrangers} onChange={(value) => set('friendlyStrangers', value)} />
              <ToggleRow label="Pulls on leash" value={dog.pulls} onChange={(value) => set('pulls', value)} />
              <ToggleRow label="Reactive" value={dog.reactive} onChange={(value) => set('reactive', value)} />
              <ToggleRow label="Can receive treats" value={dog.treats} onChange={(value) => set('treats', value)} />
            </div>
            <label className="grid gap-2 text-xs font-bold sm:col-span-2">Medical information<textarea value={dog.medical} onChange={(event) => set('medical', event.target.value)} className="gez-textarea" /></label>
            <label className="grid gap-2 text-xs font-bold">Emergency contact<input value={dog.emergency} onChange={(event) => set('emergency', event.target.value)} className="gez-input" /></label>
            <label className="grid gap-2 text-xs font-bold">Vet<input value={dog.vet} onChange={(event) => set('vet', event.target.value)} className="gez-input" /></label>
            <label className="grid gap-2 text-xs font-bold sm:col-span-2">Special instructions<textarea value={dog.instructions} onChange={(event) => set('instructions', event.target.value)} className="gez-textarea" /></label>
            <button className="h-13 rounded-full bg-[#31483b] text-sm font-bold text-white sm:col-span-2">{onBack ? t.save : copy.saveDog}</button>
          </form>
        </div>
      </div>
    </main>
  );
}

function AppNavigation({ tab, setTab, copy }: { tab: AppTab; setTab: (tab: AppTab) => void; copy: GezCopy }) {
  const items: Array<[AppTab, string, typeof Home]> = [['home', copy.appHome, Home], ['walk', copy.appWalk, Dog], ['activity', copy.appActivity, Activity], ['dog', copy.appDog, Heart], ['profile', copy.appProfile, UserRound]];
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 flex h-17 items-center justify-around rounded-[24px] border border-[#ddd7cc] bg-[#fffaf1]/95 px-2 backdrop-blur-lg md:static md:h-auto md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none" aria-label="App navigation">
      {items.map(([id, label, Icon]) => <button key={id} onClick={() => setTab(id)} className={`flex min-w-13 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[0.6rem] font-bold transition md:flex-row md:gap-2 md:text-xs ${tab === id ? 'bg-[#31483b] text-white' : 'text-[#747f77]'}`}><Icon className="size-4" />{label}</button>)}
    </nav>
  );
}

function WalkerCard({ walker, duration, onOpen }: { walker: GezWalker; duration: number; onOpen: () => void }) {
  return (
    <article onClick={onOpen} className="group cursor-pointer overflow-hidden rounded-[26px] border border-[#ddd7cc] bg-[#fffaf1] transition hover:-translate-y-1 hover:border-[#aeb9a6]">
      <div className="relative aspect-[1.15] overflow-hidden bg-[#e4dfd4]"><img src={walker.portrait} alt={walker.name} className="h-full w-full object-cover grayscale-[12%] transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0" /><span className="absolute right-3 top-3 rounded-full bg-[#fffaf1]/90 px-3 py-1.5 text-[0.65rem] font-bold">{walker.district}</span></div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3"><div><h3 className="flex items-center gap-1.5 text-lg font-bold tracking-[-0.02em]">{walker.name}<BadgeCheck className="size-4 text-[#6f8666]" /></h3><p className="mt-1 text-xs font-semibold text-[#778078]">★ {walker.rating} · {walker.walks} walks</p></div><p className="text-right text-sm font-bold">{priceForDuration(walker.price45, duration)} AZN<span className="block text-[0.6rem] font-medium text-[#879089]">{duration} min</span></p></div>
        <div className="mt-4 flex flex-wrap gap-1.5">{walker.specialties.slice(0, 2).map((tag) => <span key={tag} className="rounded-full bg-[#e8ecdf] px-2.5 py-1 text-[0.62rem] font-semibold text-[#526150]">{tag}</span>)}</div>
      </div>
    </article>
  );
}

function LiveMap({ progress }: { progress: number }) {
  const dash = 520 - (520 * progress) / 100;
  return (
    <div className="relative min-h-[440px] overflow-hidden rounded-[32px] bg-[#dce3da] sm:min-h-[560px]">
      <div className="absolute left-[8%] top-[8%] h-28 w-40 rotate-6 rounded-[22px] bg-[#eee7d8]" />
      <div className="absolute right-[7%] top-[12%] h-36 w-44 -rotate-3 rounded-[22px] bg-[#e9e1d2]" />
      <div className="absolute bottom-[8%] left-[12%] h-40 w-48 rotate-2 rounded-[24px] bg-[#f0e9dc]" />
      <div className="absolute bottom-[14%] right-[9%] size-36 rounded-[45%] bg-[#b7c7ae]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 560" fill="none" aria-label="Simplified live walking route in Yasamal">
        <path d="M-20 300C130 220 183 379 310 315S496 153 720 213" stroke="#f7f2e9" strokeWidth="54" />
        <path d="M255-20c14 115-66 178-27 277 43 109 173 100 175 322" stroke="#f7f2e9" strokeWidth="42" />
        <path d="M79 459c97-67 147-88 231-56 99 38 205-25 281-132" stroke="#80947b" strokeWidth="7" strokeLinecap="round" strokeDasharray="520" strokeDashoffset={dash} className="transition-all duration-700" />
        <circle cx={80 + progress * 4.8} cy={459 - Math.sin(progress / 18) * 105} r="14" fill="#31483b" stroke="#fffaf1" strokeWidth="7" className="transition-all duration-700" />
      </svg>
      <div className="absolute left-4 top-4 rounded-full bg-[#fffaf1]/90 px-4 py-2 text-xs font-bold backdrop-blur"><span className="mr-2 inline-block size-2 animate-pulse rounded-full bg-[#e17455]" />LIVE · Yasamal</div>
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-[22px] bg-[#fffaf1]/94 p-4 backdrop-blur">
        <div className="flex items-center gap-3"><img src={gezWalkers[0].portrait} alt="Nigar" className="size-10 rounded-full object-cover" /><div><strong className="block text-sm">Nigar</strong><span className="text-[0.65rem] text-[#778078]">with Milo</span></div></div>
        <div className="text-right"><strong className="block text-sm">27 min</strong><span className="text-[0.65rem] text-[#778078]">2.1 km</span></div>
      </div>
    </div>
  );
}

export function AppPrototype({ copy, locale, onLocaleChange, onExit }: AppPrototypeProps) {
  const [gate, setGate] = useState<Gate>('phone');
  const [dog, setDog] = useState<GezDog | null>(null);
  const [tab, setTab] = useState<AppTab>('home');
  const [editingDog, setEditingDog] = useState(false);
  const [district, setDistrict] = useState<District | 'All'>('All');
  const [duration, setDuration] = useState(45);
  const [day, setDay] = useState('Today');
  const [time, setTime] = useState('18:30');
  const [selectedWalker, setSelectedWalker] = useState<GezWalker | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [status, setStatus] = useState<WalkStatus | null>(null);
  const [routeProgress, setRouteProgress] = useState(18);
  const [rated, setRated] = useState(0);
  const t = appText[locale];
  const conditions = getWalkConditions(Number(time.split(':')[0]) < 17 ? 33 : 28);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedDog = window.localStorage.getItem('gez-dog');
        const savedAuth = window.localStorage.getItem('gez-auth');
        if (savedDog) setDog(sanitizeStoredDog(JSON.parse(savedDog)));
        if (savedAuth === 'true') setGate(savedDog ? 'app' : 'dog');
      } catch {
        // The demo remains usable if storage is unavailable.
      }
    });
  }, []);

  const matches = useMemo(() => filterGezWalkers(gezWalkers, { district, size: dog?.size ?? 'large' }), [district, dog?.size]);
  const currentWalker = selectedWalker ?? gezWalkers[0];

  const finishSignIn = () => {
    window.localStorage.setItem('gez-auth', 'true');
    setGate(dog ? 'app' : 'dog');
  };

  const saveDog = (nextDog: GezDog) => {
    setDog(nextDog);
    window.localStorage.setItem('gez-dog', JSON.stringify(toPersistedDog(nextDog)));
    setEditingDog(false);
    setGate('app');
    setTab('home');
  };

  const requestWalk = () => {
    setBookingOpen(false);
    setSelectedWalker(currentWalker);
    setStatus('requested');
  };

  const nextStatus = () => {
    if (!status) return;
    const next = advanceWalkStatus(status);
    setStatus(next);
    if (next === 'walking') setRouteProgress(24);
  };

  if (gate === 'phone') return <SignInGate copy={copy} onComplete={finishSignIn} onBack={onExit} />;
  if (gate === 'dog' || editingDog) return <DogProfileForm copy={copy} locale={locale} initial={dog ?? defaultDog} onSave={saveDog} onBack={editingDog ? () => setEditingDog(false) : undefined} />;

  if (status && status !== 'walking' && status !== 'completed') {
    return (
      <main className="flex min-h-screen flex-col bg-[#f6f1e7] px-5 py-6 sm:px-8">
        <div className="mx-auto flex w-full max-w-[1080px] items-center justify-between"><GezLogo /><button onClick={() => setStatus(null)} className="grid size-11 place-items-center rounded-full border border-[#d8d3c7]"><X className="size-4" /></button></div>
        <section className="m-auto w-full max-w-[720px] py-16 text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-[#dfe7d8]"><CheckCircle2 className="size-8 text-[#587050]" /></span>
          <h1 className="font-display mt-8 text-5xl font-medium tracking-[-0.05em] sm:text-6xl">{status === 'requested' ? t.received : statusLabels[locale][status]}</h1>
          <p className="mt-4 text-sm text-[#727c74]">{t.simulate}</p>
          <div className="mt-12 grid grid-cols-5 gap-1">
            {(['requested', 'accepted', 'arriving', 'walking', 'completed'] as WalkStatus[]).map((item, index, all) => {
              const active = all.indexOf(status) >= index;
              return <div key={item}><div className={`h-1.5 rounded-full ${active ? 'bg-[#7d9472]' : 'bg-[#ded8cc]'}`} /><p className={`mt-3 hidden text-[0.62rem] font-semibold sm:block ${active ? 'text-[#31483b]' : 'text-[#9aa19b]'}`}>{statusLabels[locale][item]}</p></div>;
            })}
          </div>
          <div className="mx-auto mt-10 flex max-w-md items-center gap-4 rounded-[24px] border border-[#ddd7cc] bg-[#fffaf1] p-4 text-left"><img src={currentWalker.portrait} alt={currentWalker.name} className="size-14 rounded-full object-cover" /><div className="flex-1"><strong className="block">{currentWalker.name}</strong><span className="text-xs text-[#778078]">{day} · {time} · {duration} min</span></div><span className="font-bold">{priceForDuration(currentWalker.price45, duration)} AZN</span></div>
          <button onClick={nextStatus} className="mt-8 h-14 rounded-full bg-[#31483b] px-8 text-sm font-bold text-white">{copy.nextStatus}<ArrowRight className="ml-2 inline size-4" /></button>
        </section>
      </main>
    );
  }

  if (status === 'walking') {
    return (
      <main className="min-h-screen bg-[#f6f1e7] px-4 py-4 sm:px-8 sm:py-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 flex items-center justify-between"><button onClick={() => setStatus('accepted')} className="grid size-11 place-items-center rounded-full border border-[#d8d3c7]"><ArrowLeft className="size-4" /></button><GezLogo /><span className="rounded-full bg-[#f0ddcf] px-3 py-2 text-[0.65rem] font-bold text-[#8c523f]">LIVE</span></div>
          <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
            <div><h1 className="font-display mb-6 text-4xl font-medium tracking-[-0.045em] sm:text-6xl">{copy.liveTitle}</h1><LiveMap progress={routeProgress} /></div>
            <aside className="flex flex-col gap-4 lg:pt-24">
              <div className="rounded-[26px] border border-[#ddd7cc] bg-[#fffaf1] p-5"><p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#858e87]">{t.route}</p><div className="mt-5 space-y-5">{[[Check, 'Walk started', '18:31'], [CloudSun, t.water, '18:49'], [Plus, t.photo, '18:55'], [Navigation, t.heading, routeProgress > 65 ? 'Now' : 'Soon']].map(([Icon, label, value], index) => { const IconComponent = Icon as typeof Check; return <div key={String(label)} className={`flex gap-3 ${routeProgress < 35 && index > 1 ? 'opacity-35' : ''}`}><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e5ebdf]"><IconComponent className="size-3.5" /></span><div className="flex-1"><strong className="block text-sm">{String(label)}</strong><span className="text-[0.65rem] text-[#8a928c]">{String(value)}</span></div></div>; })}</div></div>
              <div className={`overflow-hidden rounded-[26px] border border-[#ddd7cc] bg-[#fffaf1] transition ${routeProgress > 35 ? 'opacity-100' : 'opacity-40'}`}><img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=82" alt="Milo enjoying a walk" className="aspect-[1.65] w-full object-cover" /><p className="p-4 text-sm leading-6">Milo found his favorite shady corner. He had some water and is doing great.</p></div>
              <button onClick={() => routeProgress >= 82 ? setStatus('completed') : setRouteProgress((value) => Math.min(85, value + 28))} className="h-13 rounded-full bg-[#31483b] text-sm font-bold text-white">{routeProgress >= 82 ? 'Finish walk' : 'Next route update'}</button>
              <div className="grid grid-cols-2 gap-2"><button className="h-12 rounded-full border border-[#d8d3c7] text-xs font-bold"><MessageCircle className="mr-2 inline size-4" />{t.message}</button><button className="h-12 rounded-full border border-[#d8d3c7] text-xs font-bold"><Phone className="mr-2 inline size-4" />{t.urgent}</button></div>
            </aside>
          </div>
        </div>
      </main>
    );
  }

  if (status === 'completed') {
    return (
      <main className="min-h-screen bg-[#f6f1e7] px-5 py-6 sm:px-8">
        <div className="mx-auto max-w-[1050px]">
          <div className="flex items-center justify-between"><button onClick={() => { setStatus(null); setTab('activity'); }} className="grid size-11 place-items-center rounded-full border border-[#d8d3c7]"><ArrowLeft className="size-4" /></button><span className="text-xs font-bold uppercase tracking-[0.16em] text-[#7b857e]">{t.report}</span><GezLogo /></div>
          <section className="py-12 text-center"><p className="text-5xl">☀</p><h1 className="font-display mt-5 text-5xl font-medium tracking-[-0.05em] sm:text-7xl">{copy.reportTitle}</h1><p className="mt-4 text-sm text-[#737d75]">Yasamal · Today with Nigar</p></section>
          <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <LiveMap progress={100} />
            <div className="grid gap-4">
              <div className="grid grid-cols-3 rounded-[26px] border border-[#ddd7cc] bg-[#fffaf1] p-5 text-center"><div><strong className="block text-2xl">42</strong><span className="text-[0.65rem] text-[#7d867f]">min</span></div><div><strong className="block text-2xl">2.7</strong><span className="text-[0.65rem] text-[#7d867f]">km</span></div><div><strong className="block text-2xl">4,180</strong><span className="text-[0.65rem] text-[#7d867f]">steps</span></div></div>
              <div className="rounded-[26px] border border-[#ddd7cc] bg-[#fffaf1] p-5"><h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#858e87]">{t.summary}</h3><div className="mt-5 grid grid-cols-3 gap-3 text-sm"><div><span className="block text-[#7d867f]">Pee</span><strong>× 3</strong></div><div><span className="block text-[#7d867f]">Poop</span><strong>× 1</strong></div><div><span className="block text-[#7d867f]">Water</span><strong>Yes</strong></div></div></div>
              <div className="rounded-[26px] border border-[#ddd7cc] bg-[#fffaf1] p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#858e87]">{t.note}</p><p className="mt-4 text-sm leading-6">“Milo was full of energy today. We did two loops around the park, had a water break halfway through and he was very calm around other dogs.”</p></div>
              <div className="grid grid-cols-3 gap-2">{['photo-1552053831-71594a27632d', 'photo-1558788353-f76d92427f16', 'photo-1517849845537-4d257902454a'].map((id) => <img key={id} src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=80`} alt="Walk update" className="aspect-square rounded-2xl object-cover" />)}</div>
              <div className="rounded-[26px] border border-[#ddd7cc] bg-[#fffaf1] p-5 text-center"><p className="text-sm font-bold">{t.rate}</p><div className="mt-3 flex justify-center gap-2">{[1, 2, 3, 4, 5].map((star) => <button key={star} onClick={() => setRated(star)} aria-label={`Rate ${star} stars`}><Star className={`size-6 ${rated >= star ? 'fill-[#d68160] text-[#d68160]' : 'text-[#c9c5ba]'}`} /></button>)}</div></div>
              <button onClick={() => { setStatus(null); setSelectedWalker(gezWalkers[0]); setBookingOpen(true); }} className="h-14 rounded-full bg-[#31483b] text-sm font-bold text-white">{copy.bookAgain}</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const screenTitle = tab === 'walk' ? copy.whenWalk : tab === 'activity' ? t.history : tab === 'dog' ? dog?.name : tab === 'profile' ? t.account : t.welcome;

  return (
    <main className="min-h-screen bg-[#f6f1e7] pb-24 text-[#26362e] md:pb-8">
      <header className="sticky top-0 z-30 border-b border-[#ded8cc] bg-[#f6f1e7]/92 px-5 py-4 backdrop-blur-lg sm:px-8">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-6"><button onClick={onExit}><GezLogo /></button><div className="hidden md:block"><AppNavigation tab={tab} setTab={setTab} copy={copy} /></div><div className="flex items-center gap-3"><div className="hidden sm:block"><LanguageButtons locale={locale} onChange={onLocaleChange} /></div><button onClick={() => setTab('profile')} className="grid size-10 place-items-center rounded-full bg-[#dfe7d8] text-xs font-bold">AA</button></div></div>
      </header>
      <div className="mx-auto max-w-[1380px] px-5 py-8 sm:px-8 lg:py-11">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#8a938c]">GƏZ · Baku pilot</p><h1 className="font-display mt-2 text-4xl font-medium tracking-[-0.045em] sm:text-6xl">{screenTitle}</h1></div>{tab === 'dog' && <button onClick={() => setEditingDog(true)} className="rounded-full border border-[#d8d3c7] px-4 py-2.5 text-xs font-bold"><Edit3 className="mr-2 inline size-3.5" />{t.editDog}</button>}</div>

        {tab === 'home' && (
          <section className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <div className="relative min-h-[430px] overflow-hidden rounded-[34px] bg-[#31483b] p-7 text-white sm:p-10"><div className="relative z-10 max-w-lg"><span className="flex items-center gap-2 text-xs font-bold text-[#cad6c1]"><span className="size-2 rounded-full bg-[#b9ccab]" /> Home now</span><h2 className="font-display mt-7 text-5xl font-medium leading-[1.03] tracking-[-0.05em] sm:text-6xl">{t.okay}</h2><p className="mt-5 max-w-md text-sm leading-6 text-white/60">His last walk ended at 17:12. Water, route and Nigar’s note are saved in Activity.</p><button onClick={() => setTab('walk')} className="mt-8 h-13 rounded-full bg-[#f6f1e7] px-6 text-sm font-bold text-[#31483b]">{copy.findWalker}<ArrowRight className="ml-2 inline size-4" /></button></div><img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80" alt="Milo at home" className="absolute bottom-[-14%] right-[-5%] hidden h-[78%] w-[48%] rotate-3 rounded-[40%] object-cover opacity-90 sm:block" /></div>
            <div className="grid gap-5"><div className="rounded-[28px] border border-[#ddd7cc] bg-[#fffaf1] p-6"><div className="flex items-center justify-between"><p className="text-xs font-bold text-[#7c867f]">{t.conditions}</p><CloudSun className="size-5 text-[#7a8f74]" /></div><p className="font-display mt-5 text-5xl">28°C</p><p className="mt-2 text-sm text-[#68736c]">{getWalkConditions(28).message[locale]}</p></div><div className="rounded-[28px] border border-[#ddd7cc] bg-[#e7e2d7] p-6"><p className="text-xs font-bold text-[#7c867f]">{t.favorite}</p><div className="mt-5 flex items-center gap-4"><img src={gezWalkers[0].portrait} alt="Nigar" className="size-14 rounded-full object-cover" /><div><strong className="block">Nigar M.</strong><span className="text-xs text-[#778078]">★ 4.9 · Yasamal</span></div></div><button onClick={() => { setSelectedWalker(gezWalkers[0]); setBookingOpen(true); }} className="mt-5 w-full rounded-full border border-[#c9c4b9] py-3 text-xs font-bold">{copy.bookAgain}</button></div></div>
          </section>
        )}

        {tab === 'walk' && (
          <section>
            <div className="grid gap-3 rounded-[28px] border border-[#ddd7cc] bg-[#fffaf1] p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div><span className="px-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#89928b]">{t.today}</span><div className="mt-2 flex gap-1">{['Today', 'Tomorrow'].map((item) => <button key={item} onClick={() => setDay(item)} className={`flex-1 rounded-xl px-3 py-3 text-xs font-bold ${day === item ? 'bg-[#31483b] text-white' : 'bg-[#ede8de]'}`}>{item}</button>)}</div></div>
              <label><span className="px-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#89928b]">{t.time}</span><input type="time" value={time} onChange={(event) => setTime(event.target.value)} className="mt-2 h-11 w-full rounded-xl bg-[#ede8de] px-3 text-xs font-bold outline-none" /></label>
              <div><span className="px-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#89928b]">{t.duration}</span><div className="mt-2 flex gap-1">{durations.map((item) => <button key={item} onClick={() => setDuration(item)} className={`flex-1 rounded-xl py-3 text-[0.65rem] font-bold ${duration === item ? 'bg-[#31483b] text-white' : 'bg-[#ede8de]'}`}>{item}</button>)}</div></div>
              <label><span className="px-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#89928b]">{t.district}</span><select value={district} onChange={(event) => setDistrict(event.target.value as District | 'All')} className="mt-2 h-11 w-full rounded-xl bg-[#ede8de] px-3 text-xs font-bold outline-none">{districts.map((item) => <option key={item} value={item}>{item === 'All' ? t.all : item}</option>)}</select></label>
            </div>
            <div className={`mt-4 flex items-start gap-3 rounded-[22px] border p-4 ${conditions.level === 'hot' ? 'border-[#e1b59e] bg-[#f3e0d4]' : 'border-[#cbd6c4] bg-[#e6eddf]'}`}><CloudSun className="mt-0.5 size-5" /><div><strong className="text-sm">{conditions.temperature}°C · {conditions.level === 'hot' ? 'Hot pavement risk' : 'Comfortable'}</strong><p className="mt-1 text-xs leading-5 text-[#667068]">{conditions.message[locale]}</p></div></div>
            <div className="mt-8 flex items-center justify-between"><h2 className="text-xl font-bold">{copy.nearby}</h2><span className="text-xs text-[#78827b]">{matches.length} {t.available}</span></div>
            {matches.length ? <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{matches.map((walker) => <WalkerCard key={walker.id} walker={walker} duration={duration} onOpen={() => setSelectedWalker(walker)} />)}</div> : <div className="mt-5 rounded-[28px] border border-dashed border-[#cec8bb] p-12 text-center text-sm text-[#707a72]">{t.noMatch}</div>}
          </section>
        )}

        {tab === 'activity' && (
          <section className="grid gap-5 lg:grid-cols-[1fr_.75fr]">
            <div className="rounded-[28px] border border-[#ddd7cc] bg-[#fffaf1] p-6"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">{t.past}</h2><span className="text-xs text-[#818a83]">3 reports</span></div>{[['Today', '42 min · 2.7 km', 'Nigar'], ['24 Aug', '36 min · 2.2 km', 'Nigar'], ['18 Aug', '48 min · 3.1 km', 'Murad']].map(([date, stats, walker], index) => <button key={date} onClick={() => index === 0 && setStatus('completed')} className="flex w-full items-center gap-4 border-b border-[#e3ded4] py-5 text-left last:border-0"><span className="grid size-11 place-items-center rounded-full bg-[#e4ebde]"><Navigation className="size-4" /></span><div className="flex-1"><strong className="block text-sm">{date} · {walker}</strong><span className="text-xs text-[#7d867f]">{stats}</span></div><ChevronRight className="size-4 text-[#9ba19d]" /></button>)}</div>
            <div className="rounded-[28px] bg-[#e8e2d6] p-6"><p className="text-xs font-bold text-[#7d867f]">{t.next}</p><h3 className="font-display mt-5 text-4xl">No walk booked.</h3><p className="mt-3 text-sm leading-6 text-[#68736c]">When Milo needs fresh air, Nigar and the rest of your trusted walkers are here.</p><button onClick={() => setTab('walk')} className="mt-8 h-12 rounded-full bg-[#31483b] px-5 text-xs font-bold text-white">{copy.findWalker}</button></div>
          </section>
        )}

        {tab === 'dog' && dog && (
          <section className="grid gap-5 lg:grid-cols-[.7fr_1.3fr]"><div className="overflow-hidden rounded-[30px] border border-[#ddd7cc] bg-[#fffaf1]"><img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=82" alt="Milo" className="aspect-[1.2] w-full object-cover" /><div className="p-6"><h2 className="text-2xl font-bold">{dog.name}</h2><p className="mt-1 text-sm text-[#778078]">{dog.breed} · {dog.age} years · {dog.weight} kg</p><div className="mt-4 flex flex-wrap gap-2">{['Friendly', 'Active', 'Loves people'].map((item) => <span key={item} className="rounded-full bg-[#e7ecdf] px-3 py-1.5 text-xs font-semibold">{item}</span>)}</div></div></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-[26px] border border-[#ddd7cc] bg-[#fffaf1] p-5"><p className="text-xs font-bold text-[#818a83]">Behavior</p><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><dt>Dogs</dt><dd>{dog.friendlyDogs ? 'Friendly' : 'Needs space'}</dd></div><div className="flex justify-between"><dt>Leash</dt><dd>{dog.pulls ? 'Pulls' : 'Walks calmly'}</dd></div><div className="flex justify-between"><dt>Treats</dt><dd>{dog.treats ? 'Yes' : 'No'}</dd></div></dl></div><div className="rounded-[26px] border border-[#ddd7cc] bg-[#fffaf1] p-5"><p className="text-xs font-bold text-[#818a83]">Care</p><p className="mt-4 text-sm leading-6">{dog.instructions}</p></div><div className="rounded-[26px] border border-[#ddd7cc] bg-[#fffaf1] p-5 sm:col-span-2"><p className="text-xs font-bold text-[#818a83]">Emergency & vet</p><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><p>{dog.emergency}</p><p>{dog.vet}</p></div></div></div></section>
        )}

        {tab === 'profile' && (
          <section className="grid gap-5 lg:grid-cols-[1fr_.7fr]"><div className="rounded-[28px] border border-[#ddd7cc] bg-[#fffaf1] p-6"><div className="flex items-center gap-4"><span className="grid size-16 place-items-center rounded-full bg-[#dfe7d8] text-lg font-bold">AA</span><div><h2 className="text-xl font-bold">Aylin Aliyeva</h2><p className="text-sm text-[#7b857e]">+994 50 555 14 18</p></div></div><div className="mt-7 grid gap-3"><button className="flex items-center justify-between rounded-2xl border border-[#e1dcd2] p-4 text-sm font-semibold"><span className="flex items-center gap-3"><Languages className="size-4" />Language</span><span className="uppercase">{locale}</span></button><button onClick={() => { window.localStorage.removeItem('gez-auth'); setGate('phone'); }} className="flex items-center justify-between rounded-2xl border border-[#e1dcd2] p-4 text-sm font-semibold text-[#9a5946]">{t.signout}<ChevronRight className="size-4" /></button></div></div><div className="rounded-[28px] bg-[#31483b] p-6 text-white"><ShieldCheck className="size-6 text-[#c6d4bc]" /><h3 className="font-display mt-6 text-3xl">Your calm place.</h3><p className="mt-3 text-sm leading-6 text-white/60">Every booking, live route and walk report stays together here in the prototype.</p></div></section>
        )}
      </div>

      <div className="md:hidden"><AppNavigation tab={tab} setTab={setTab} copy={copy} /></div>

      {selectedWalker && !bookingOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#26362e]/45 p-3 backdrop-blur-sm sm:p-6" onClick={() => setSelectedWalker(null)}>
          <section className="mx-auto my-4 max-w-[980px] overflow-hidden rounded-[34px] bg-[#fffaf1]" onClick={(event) => event.stopPropagation()}>
            <div className="relative grid lg:grid-cols-[.85fr_1.15fr]"><img src={selectedWalker.portrait} alt={selectedWalker.name} className="h-[360px] w-full object-cover lg:h-full" /><button onClick={() => setSelectedWalker(null)} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-[#fffaf1]"><X className="size-4" /></button><div className="p-6 sm:p-10"><p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#7d887f]">{selectedWalker.district}</p><h2 className="font-display mt-3 text-5xl font-medium tracking-[-0.05em]">{selectedWalker.name}</h2><p className="mt-3 text-sm font-bold">{selectedWalker.rating} ★ · {selectedWalker.walks} walks</p><p className="mt-6 text-sm leading-7 text-[#68736c]">{selectedWalker.about}</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{selectedWalker.trustTags.map((tag) => <span key={tag} className="flex items-center gap-2 rounded-2xl bg-[#e7ecdf] px-4 py-3 text-xs font-semibold"><CheckCircle2 className="size-4 text-[#687e62]" />{tag}</span>)}</div><dl className="mt-7 grid gap-4 border-y border-[#e0dbd1] py-5 text-sm sm:grid-cols-2"><div><dt className="text-xs text-[#879089]">Availability</dt><dd className="mt-1 font-semibold">{selectedWalker.availability}</dd></div><div><dt className="text-xs text-[#879089]">Languages</dt><dd className="mt-1 font-semibold">{selectedWalker.languages.join(' · ')}</dd></div><div><dt className="text-xs text-[#879089]">Dog sizes</dt><dd className="mt-1 font-semibold capitalize">{selectedWalker.acceptedSizes.join(' · ')}</dd></div><div><dt className="text-xs text-[#879089]">Experience</dt><dd className="mt-1 font-semibold">{selectedWalker.specialties.join(' · ')}</dd></div></dl><div className="mt-6 rounded-2xl bg-[#f0e8da] p-4"><strong className="text-sm">{copy.meetFirst}</strong><p className="mt-1 text-xs leading-5 text-[#6e776f]">{t.freeMeet}</p></div><button onClick={() => setBookingOpen(true)} className="mt-5 h-14 w-full rounded-full bg-[#31483b] text-sm font-bold text-white">{copy.chooseWalker}</button></div></div>
          </section>
        </div>
      )}

      {bookingOpen && selectedWalker && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#26362e]/45 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={() => setBookingOpen(false)}>
          <section className="w-full max-w-[620px] rounded-t-[34px] bg-[#fffaf1] p-6 sm:rounded-[34px] sm:p-8" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between"><h2 className="font-display text-4xl font-medium tracking-[-0.045em]">{t.summary}</h2><button onClick={() => setBookingOpen(false)} className="grid size-10 place-items-center rounded-full border border-[#ddd7cc]"><X className="size-4" /></button></div>
            <div className="mt-7 flex items-center justify-between rounded-[24px] bg-[#ece7dc] p-4"><div className="flex items-center gap-3"><img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80" alt="Milo" className="size-12 rounded-full object-cover" /><strong>Milo</strong></div><span className="text-xs text-[#7e8780]">{t.with}</span><div className="flex items-center gap-3"><strong>{selectedWalker.name}</strong><img src={selectedWalker.portrait} alt={selectedWalker.name} className="size-12 rounded-full object-cover" /></div></div>
            <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-[#e0dbd1] py-5 text-sm sm:grid-cols-4"><div><dt className="text-xs text-[#89918b]">Date</dt><dd className="mt-1 font-bold">{day}</dd></div><div><dt className="text-xs text-[#89918b]">Time</dt><dd className="mt-1 font-bold">{time}</dd></div><div><dt className="text-xs text-[#89918b]">Duration</dt><dd className="mt-1 font-bold">{duration} min</dd></div><div><dt className="text-xs text-[#89918b]">Total</dt><dd className="mt-1 font-bold">{priceForDuration(selectedWalker.price45, duration)} AZN</dd></div></dl>
            <div className="mt-5 grid gap-3"><input placeholder={t.apartment} defaultValue="Building 12, entrance B, floor 4" className="gez-input" /><input placeholder={t.pickup} defaultValue="Call from the courtyard; I will bring Milo down." className="gez-input" /><textarea placeholder={t.special} defaultValue={dog?.instructions} className="gez-textarea" /></div>
            <div className={`mt-4 rounded-2xl p-4 text-xs ${conditions.level === 'hot' ? 'bg-[#f3e0d4]' : 'bg-[#e6eddf]'}`}><strong>{conditions.temperature}°C · {t.conditions}</strong><p className="mt-1 text-[#657068]">{conditions.message[locale]}</p></div>
            <button onClick={requestWalk} className="mt-5 h-14 w-full rounded-full bg-[#31483b] text-sm font-bold text-white">{copy.requestWalk}</button>
          </section>
        </div>
      )}
    </main>
  );
}
