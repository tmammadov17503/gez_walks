'use client';

/* eslint-disable next/no-img-element */

import { useState } from 'react';
import { ArrowRight, Check, Clock3, Droplets, MapPin, RotateCcw, ShieldCheck, Star } from 'lucide-react';
import type { GezLocale } from '@/lib/gez-prototype';

type JourneyStage = 'before' | 'during' | 'after';

const journeyCopy: Record<GezLocale, {
  aria: string;
  eyebrow: string;
  title: string;
  body: string;
  tabs: Record<JourneyStage, string>;
  stages: Record<JourneyStage, { question: string; title: string; body: string }>;
  verified: string;
  meet: string;
  walks: string;
  today: string;
  park: string;
  live: string;
  water: string;
  home: string;
  reportLabel: string;
  report: string;
  photos: string;
  note: string;
  tryDemo: string;
}> = {
  en: {
    aria: 'The walk from your side', eyebrow: 'One calm timeline', title: 'You never have to wonder.',
    body: 'Before, during, and after—the right detail appears exactly when reassurance matters.',
    tabs: { before: 'Before', during: 'During', after: 'After' },
    stages: {
      before: { question: 'Who is responsible?', title: 'You know who has the leash.', body: 'See Nigar’s identity, experience, and fit with Milo before you request the walk.' },
      during: { question: 'Is Milo okay?', title: 'You can see Milo is okay.', body: 'A gentle live route and human updates keep you close without feeling like surveillance.' },
      after: { question: 'How did it go?', title: 'You know exactly how it went.', body: 'Time, distance, care notes, and photos become one beautiful report you can return to.' },
    },
    verified: 'Identity verified', meet: 'Free meet & greet', walks: 'walks', today: 'Today', park: 'Central Park', live: 'LIVE · Nigar', water: 'Water break', home: 'Heading home', reportLabel: 'Walk report', report: 'Milo had a good one.', photos: '3 photos',
    note: 'Two park loops, a water break, and a calm walk home.', tryDemo: 'Try the full walk',
  },
  az: {
    aria: 'Gəzinti sənin tərəfdən', eyebrow: 'Bir sakit zaman xətti', title: 'Heç nəyi təxmin etməyə ehtiyac yoxdur.',
    body: 'Gəzintidən əvvəl, gəzinti zamanı və sonra — lazım olan məlumat doğru anda görünür.',
    tabs: { before: 'Əvvəl', during: 'Gəzinti', after: 'Sonra' },
    stages: {
      before: { question: 'Kim məsuldur?', title: 'İpin kimdə olduğunu bilirsən.', body: 'Gəzinti sorğusundan əvvəl Nigarın şəxsiyyətini, təcrübəsini və Milo ilə uyğunluğunu gör.' },
      during: { question: 'Milo yaxşıdır?', title: 'Milonun yaxşı olduğunu görürsən.', body: 'Sakit canlı marşrut və insani yeniliklər nəzarət hissi yaratmadan səni yaxın saxlayır.' },
      after: { question: 'Necə keçdi?', title: 'Gəzintinin necə keçdiyini dəqiq bilirsən.', body: 'Vaxt, məsafə, qayğı qeydləri və fotolar baxımlı bir hesabatda birləşir.' },
    },
    verified: 'Şəxsiyyəti yoxlanılıb', meet: 'Pulsuz tanışlıq', walks: 'gəzinti', today: 'Bu gün', park: 'Mərkəzi Park', live: 'CANLI · Nigar', water: 'Su fasiləsi', home: 'Evə qayıdır', reportLabel: 'Gəzinti hesabatı', report: 'Milo yaxşı gəzdi.', photos: '3 foto',
    note: 'Parkda iki dövrə, su fasiləsi və sakit ev yolu.', tryDemo: 'Tam gəzintini sına',
  },
  ru: {
    aria: 'Прогулка с вашей стороны', eyebrow: 'Одна спокойная история', title: 'Больше не нужно гадать.',
    body: 'До, во время и после прогулки нужная деталь появляется именно тогда, когда она важна.',
    tabs: { before: 'До', during: 'Во время', after: 'После' },
    stages: {
      before: { question: 'Кто отвечает?', title: 'Вы знаете, у кого поводок.', body: 'Проверьте личность, опыт Нигяр и совместимость с Майло до запроса прогулки.' },
      during: { question: 'Майло в порядке?', title: 'Вы видите, что Майло в порядке.', body: 'Спокойный живой маршрут и человеческие обновления дают уверенность без ощущения слежки.' },
      after: { question: 'Как всё прошло?', title: 'Вы точно знаете, как всё прошло.', body: 'Время, расстояние, заметки об уходе и фото собраны в одном красивом отчёте.' },
    },
    verified: 'Личность проверена', meet: 'Бесплатное знакомство', walks: 'прогулок', today: 'Сегодня', park: 'Центральный парк', live: 'В ЭФИРЕ · Нигяр', water: 'Перерыв на воду', home: 'Возвращаются домой', reportLabel: 'Отчёт о прогулке', report: 'Майло отлично погулял.', photos: '3 фото',
    note: 'Два круга по парку, вода и спокойная дорога домой.', tryDemo: 'Попробовать прогулку',
  },
};

const stages: JourneyStage[] = ['before', 'during', 'after'];

export function ReassuranceJourney({ locale, onStart }: { locale: GezLocale; onStart: () => void }) {
  const [stage, setStage] = useState<JourneyStage>('before');
  const t = journeyCopy[locale];
  const active = t.stages[stage];

  return (
    <section aria-label={t.aria} className="gez-reassurance-section gez-deferred-section relative overflow-hidden bg-[#ebe5d8] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7b887f]">{t.eyebrow}</p>
          <h2 className="font-display mt-5 max-w-[620px] text-5xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-7xl">{t.title}</h2>
          <p className="mt-6 max-w-[520px] text-base leading-7 text-[#68736c]">{t.body}</p>
          <fieldset className="mt-8 inline-flex w-full rounded-full border border-[#cbc4b7] bg-[#f6f1e7] p-1 sm:w-auto">
            <legend className="sr-only">{t.aria}</legend>
            {stages.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={stage === item}
                onClick={() => setStage(item)}
                className={`min-h-11 flex-1 rounded-full px-5 text-sm font-bold transition sm:flex-none ${stage === item ? 'bg-[#31483b] text-white' : 'text-[#68736c] hover:bg-white/70'}`}
              >
                {t.tabs[item]}
              </button>
            ))}
          </fieldset>
          <div className="mt-8 min-h-[166px]" aria-live="polite">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a25f48]">{active.question}</p>
            <h3 className="mt-3 max-w-lg text-2xl font-bold tracking-[-0.035em] sm:text-3xl">{active.title}</h3>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#68736c]">{active.body}</p>
          </div>
        </div>

        <div className="gez-reassurance-stage relative mx-auto w-full max-w-[690px]">
          <div className="gez-reassurance-orbit" aria-hidden="true" />
          <div key={stage} className="gez-reassurance-window relative overflow-hidden rounded-[38px] border border-white/70 bg-[#fffaf1] p-4 sm:p-6">
            {stage === 'before' && (
              <div className="grid min-h-[430px] content-between gap-6 rounded-[28px] bg-[#f0eadf] p-5 sm:p-8">
                <div className="flex items-center justify-between"><span className="rounded-full bg-[#e4ecdd] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#4c6548]">{t.verified}</span><ShieldCheck className="size-5 text-[#6e8468]" /></div>
                <div className="grid items-center gap-6 sm:grid-cols-[150px_1fr]">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=82" alt="Nigar M." className="aspect-square w-32 rounded-[28px] object-cover sm:w-full" />
                  <div><p className="font-display text-4xl">Nigar M.</p><p className="mt-2 flex items-center gap-2 text-sm font-bold"><Star className="size-4 fill-[#d68160] text-[#d68160]" />4.9 · 57 {t.walks}</p><p className="mt-3 flex items-center gap-2 text-sm text-[#68736c]"><MapPin className="size-4" />Yasamal · 1.2 km</p></div>
                </div>
                <div className="flex flex-col gap-3 rounded-[22px] bg-[#fffaf1] p-4 sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2 text-sm font-bold"><Clock3 className="size-4 text-[#7b8f73]" />{t.today} · 18:30</span><span className="text-sm font-semibold text-[#68736c]">{t.meet}</span></div>
              </div>
            )}

            {stage === 'during' && (
              <div className="gez-reassurance-map relative min-h-[430px] overflow-hidden rounded-[28px] bg-[#dfe7dc] p-5 sm:p-8">
                <div className="relative z-10 flex items-center justify-between"><span className="rounded-full bg-[#31483b] px-3 py-2 text-xs font-bold tracking-[0.14em] text-white">{t.live}</span><span className="font-display text-3xl">27 min</span></div>
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 430" fill="none" aria-hidden="true"><path d="M-40 102C88 57 145 162 261 123c109-36 150-103 272-48 66 30 79 88 147 81M-42 340c102-59 160-17 240-70 84-55 111-18 175 17 103 56 168-24 309 38" stroke="#bdcbb8" strokeWidth="42"/><path d="M70 366c75-84 102-66 160-119 73-68 47-119 139-131 88-12 91 95 173 78" stroke="#E68A68" strokeWidth="6" strokeLinecap="round" className="gez-reassurance-route"/><circle cx="542" cy="194" r="11" fill="#31483B"/><circle cx="542" cy="194" r="19" stroke="#31483B" strokeOpacity=".2" strokeWidth="7"/></svg>
                <div className="absolute bottom-5 left-5 right-5 z-10 grid gap-3 sm:grid-cols-2 sm:items-end"><div className="rounded-[22px] bg-[#fffaf1]/95 p-4"><p className="flex items-center gap-2 text-sm font-bold"><Droplets className="size-4 text-[#6e8c94]" />{t.water}</p><p className="mt-2 text-xs text-[#68736c]">18:51 · {t.park}</p></div><div className="rounded-[22px] bg-[#31483b] p-4 text-white"><p className="flex items-center gap-2 text-sm font-bold"><Check className="size-4" />{t.home}</p><p className="mt-2 text-xs text-white/60">2.1 km · Nigar</p></div></div>
              </div>
            )}

            {stage === 'after' && (
              <div className="grid min-h-[430px] content-between gap-6 rounded-[28px] bg-[#31483b] p-5 text-white sm:p-8">
                <div><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.15em] text-[#bdccb5]">{t.reportLabel}</span><Check className="size-5 text-[#c7d6bf]" /></div><p className="font-display mt-6 text-4xl sm:text-5xl">{t.report}</p></div>
                <div className="grid grid-cols-3 gap-2"><div className="rounded-[18px] bg-white/10 p-4"><strong className="font-display text-2xl">42 min</strong></div><div className="rounded-[18px] bg-white/10 p-4"><strong className="font-display text-2xl">2.7 km</strong></div><div className="rounded-[18px] bg-white/10 p-4"><strong className="font-display text-2xl">{t.photos}</strong></div></div>
                <div className="rounded-[22px] bg-[#fffaf1] p-5 text-[#26362e]"><p className="text-sm font-semibold leading-6">“{t.note}”</p><p className="mt-3 text-xs text-[#7a837d]">Nigar · Yasamal</p></div>
              </div>
            )}
          </div>
          <button onClick={onStart} className="gez-reassurance-cta relative z-10 mx-auto -mt-6 flex min-h-12 items-center gap-3 rounded-full bg-[#e68a68] px-6 text-sm font-bold text-[#342c27] shadow-[0_18px_40px_-20px_#26362e] transition hover:-translate-y-1">
            {stage === 'after' ? <RotateCcw className="size-4" /> : <ArrowRight className="size-4" />}{t.tryDemo}
          </button>
        </div>
      </div>
    </section>
  );
}
