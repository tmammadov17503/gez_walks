'use client';

/* eslint-disable next/no-img-element */

import { useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Menu,
  ShieldCheck,
  X,
} from 'lucide-react';
import { GezLogo } from '@/components/gez-logo';
import type { GezCopy, GezLocale } from '@/lib/gez-prototype';

type MarketingHomeProps = {
  copy: GezCopy;
  locale: GezLocale;
  onLocaleChange: (locale: GezLocale) => void;
  onStart: () => void;
};

const supportingCopy: Record<GezLocale, {
  live: string;
  place: string;
  update: string;
  note: string;
  steps: [string, string, string];
  stepCopy: [string, string, string];
  trust: string[];
  apply: [string, string, string, string];
}> = {
  en: {
    live: 'Walk in progress', place: 'Yasamal · Central Park', update: 'A little update',
    note: 'Milo had water and is taking the shaded route home.',
    steps: ['Create your dog', 'Choose the right person', 'Follow the walk'],
    stepCopy: ['Share the little things that make your dog themselves.', 'Meet first, ask questions, and choose with confidence.', 'See the route and receive a thoughtful report afterward.'],
    trust: ['Identity check', 'Interview', 'References', 'Dog-handling education', 'Trial walk', 'Community ratings'],
    apply: ['Your name', 'District', 'Dog experience', 'Apply to walk'],
  },
  az: {
    live: 'Gəzinti gedir', place: 'Yasamal · Mərkəzi Park', update: 'Kiçik bir xəbər',
    note: 'Milo su içdi və indi kölgəli yolla evə qayıdır.',
    steps: ['İtinin profilini yarat', 'Doğru insanı seç', 'Gəzintini izlə'],
    stepCopy: ['İtini onun özü edən kiçik detalları bizimlə paylaş.', 'Əvvəlcə tanış ol, suallarını ver və rahat seçim et.', 'Marşrutu gör və sonda gözəl gəzinti hesabatı al.'],
    trust: ['Şəxsiyyət yoxlanışı', 'Müsahibə', 'Tövsiyələr', 'İt davranışı üzrə təlim', 'Sınaq gəzintisi', 'İcma rəyləri'],
    apply: ['Adın', 'Rayon', 'İt təcrübən', 'Müraciət et'],
  },
  ru: {
    live: 'Прогулка идёт', place: 'Ясамал · Центральный парк', update: 'Небольшое обновление',
    note: 'Майло попил воды и возвращается домой по тенистой дороге.',
    steps: ['Создайте профиль', 'Выберите человека', 'Следите за прогулкой'],
    stepCopy: ['Расскажите о мелочах, которые делают вашу собаку особенной.', 'Сначала познакомьтесь, задайте вопросы и спокойно выбирайте.', 'Смотрите маршрут и получите красивый отчёт после прогулки.'],
    trust: ['Проверка личности', 'Интервью', 'Рекомендации', 'Обучение обращению с собаками', 'Пробная прогулка', 'Отзывы сообщества'],
    apply: ['Ваше имя', 'Район', 'Опыт с собаками', 'Подать заявку'],
  },
};

export function MarketingHome({ copy, locale, onLocaleChange, onStart }: MarketingHomeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const local = supportingCopy[locale];

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-dvh overflow-x-clip bg-[#f6f1e7] text-[#26362e]">
      <header className="gez-safe-top relative z-40 mx-auto flex w-full max-w-[1480px] items-center justify-between px-5 pb-5 sm:px-8 lg:px-12">
        <a href="#top" aria-label="GƏZ home"><GezLogo /></a>

        <nav className="hidden items-center gap-7 text-[0.82rem] font-semibold text-[#5f6962] lg:flex" aria-label="Main navigation">
          <button onClick={onStart} className="hover:text-[#26362e]">{copy.navFind}</button>
          <button onClick={() => goTo('how')} className="hover:text-[#26362e]">{copy.navHow}</button>
          <button onClick={() => goTo('become')} className="hover:text-[#26362e]">{copy.navBecome}</button>
        </nav>

        <div className="hidden items-center gap-4 sm:flex">
          <div className="flex rounded-full border border-[#d8d3c7] p-1" aria-label="Language selector">
            {(['az', 'en', 'ru'] as const).map((item) => (
              <button
                key={item}
                aria-pressed={locale === item}
                onClick={() => onLocaleChange(item)}
                className={`rounded-full px-2.5 py-1.5 text-[0.67rem] font-bold uppercase transition ${locale === item ? 'bg-[#31483b] text-white' : 'text-[#778078] hover:text-[#31483b]'}`}
              >
                {item}
              </button>
            ))}
          </div>
          <button onClick={onStart} className="rounded-full bg-[#31483b] px-5 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#24372d]">
            {copy.navSignIn}
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((value) => !value)}
          className="grid size-11 place-items-center rounded-full border border-[#d8d3c7] lg:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {menuOpen && (
        <div className="relative z-30 mx-4 rounded-[26px] border border-[#d8d3c7] bg-[#fffaf1] p-5 lg:hidden">
          <nav className="grid gap-4 text-left text-sm font-semibold">
            <button onClick={onStart} className="text-left">{copy.navFind}</button>
            <button onClick={() => goTo('how')} className="text-left">{copy.navHow}</button>
            <button onClick={() => goTo('become')} className="text-left">{copy.navBecome}</button>
          </nav>
          <div className="mt-5 flex gap-2 border-t border-[#ded8cc] pt-4">
            {(['az', 'en', 'ru'] as const).map((item) => (
              <button key={item} onClick={() => onLocaleChange(item)} className={`rounded-full px-4 py-2 text-xs font-bold uppercase ${locale === item ? 'bg-[#31483b] text-white' : 'bg-[#ede8de]'}`}>{item}</button>
            ))}
          </div>
        </div>
      )}

      <section id="top" className="relative mx-auto grid min-h-[calc(100dvh-5.5rem)] max-w-[1480px] items-center gap-8 px-5 pb-16 pt-8 sm:px-8 lg:min-h-[760px] lg:grid-cols-[.8fr_1.2fr] lg:px-12 lg:pb-24 lg:pt-10">
        <div className="relative z-10 max-w-[610px]">
          <p className="mb-7 flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.19em] text-[#68756d]">
            <span className="size-1.5 rounded-full bg-[#e68a68]" /> {copy.heroEyebrow}
          </p>
          <h1 className="font-display text-[clamp(3.25rem,14vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.065em] text-[#26362e] sm:text-[clamp(3.6rem,7.2vw,7.5rem)]">
            {copy.heroTitle}
          </h1>
          <p className="mt-7 max-w-[520px] text-[1.05rem] leading-8 text-[#657068] sm:text-lg">{copy.heroBody}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button onClick={onStart} className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#31483b] px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#24372d]">
              {copy.findWalker}<ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </button>
            <button onClick={() => goTo('become')} className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-[#cec8bb] px-7 text-sm font-bold transition hover:bg-white/70">
              {copy.becomeWalker}<ArrowDownRight className="size-4" />
            </button>
          </div>
          <p className="mt-10 font-display text-lg italic text-[#56655d]">“{copy.promise}”</p>
        </div>

        <div className="relative min-h-[360px] sm:min-h-[500px] lg:min-h-[650px]">
          <div className="absolute inset-x-[-7%] top-[3%] h-[92%] overflow-hidden rounded-[52px] bg-[#efe8dc] lg:inset-x-[-4%]">
            <img
              src="./gez-baku-model.png"
              alt="A miniature Baku neighbourhood with a dog walker following a route home"
              className="h-full w-full object-cover object-center"
            />
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 900 650" fill="none" aria-hidden="true">
              <path className="gez-route-line" d="M438 476c73 52 188 73 274 8 55-42 16-88-38-100" stroke="#E68A68" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="gez-float-card absolute bottom-[3%] left-[-2%] z-10 max-w-[260px] rounded-[24px] border border-[#ded8cc] bg-[#fffaf1]/95 p-4 backdrop-blur-sm sm:left-[1%] sm:max-w-[300px]">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.15em] text-[#657068]"><span className="relative size-2 rounded-full bg-[#8ca27f] before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-[#8ca27f]" />{local.live}</span>
              <span className="text-xs font-semibold text-[#7b837d]">27 min</span>
            </div>
            <p className="mt-3 text-sm font-bold">{local.place}</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#e7e1d6]"><div className="gez-progress h-full w-2/3 rounded-full bg-[#e68a68]" /></div>
          </div>
          <div className="absolute right-[-1%] top-[5%] z-10 hidden w-[218px] rotate-[2deg] rounded-[24px] border border-[#ded8cc] bg-[#f6f1e7]/95 p-4 sm:block">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#8a938c]">{local.update}</p>
            <p className="mt-3 text-sm font-semibold leading-5">{local.note}</p>
          </div>
        </div>
      </section>

      <section id="how" className="gez-care-section relative isolate overflow-hidden border-y border-[#ded8cc] bg-[#fbf7ef] px-5 pb-44 pt-20 sm:px-8 sm:pb-56 lg:px-12 lg:pt-24">
        <div className="pointer-events-none absolute -bottom-16 -right-14 z-0 w-56 sm:-right-8 sm:w-72 lg:right-8 lg:w-80" aria-hidden="true">
          <img src="./gez-paw-high-five.png" alt="" width="1254" height="1254" loading="lazy" decoding="async" className="gez-paw-sway w-full rotate-[-18deg]" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1320px]">
          <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <h2 className="font-display max-w-[700px] text-5xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-7xl">{copy.howTitle}</h2>
            <p className="max-w-[520px] text-base leading-7 text-[#68736c] lg:justify-self-end">{copy.howBody}</p>
          </div>
          <div className="gez-depth-grid mt-12 grid gap-4 md:grid-cols-3">
            {local.steps.map((step, index) => (
              <article key={step} className="gez-depth-card group rounded-[28px] border border-[#ded8cc] bg-[#f6f1e7] p-7 lg:p-8">
                <span className="inline-grid size-11 place-items-center rounded-2xl border border-[#e4d6c6] bg-[#fffaf1] text-xs font-bold text-[#b96c4e]">0{index + 1}</span>
                <h3 className="mt-8 text-xl font-bold tracking-[-0.025em]">{step}</h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-[#707a73]">{local.stepCopy[index]}</p>
                <ArrowRight className="mt-8 size-5 text-[#8ba083] transition group-hover:translate-x-1" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="relative bg-[#31483b] px-5 py-20 text-[#fbf7ef] sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
          <div>
            <p className="text-[0.67rem] font-bold uppercase tracking-[0.2em] text-[#b9c7ac]">{copy.trustEyebrow}</p>
            <h2 className="font-display mt-5 max-w-[600px] text-5xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-7xl">{copy.trustTitle}</h2>
            <p className="mt-7 max-w-lg text-base leading-7 text-white/60">{copy.trustBody}</p>
            <div className="gez-trust-scene mt-9 overflow-hidden rounded-[30px] border border-white/15 bg-[#d7c7ae]">
              <img src="./gez-dog-care-3d.webp" alt="A golden retriever placing its paw in a caring hand, with a miniature Baku behind it" width="1536" height="1024" loading="lazy" decoding="async" className="aspect-[1.5] w-full object-cover object-left" />
            </div>
          </div>
          <ol className="grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-1">
            {local.trust.map((item, index) => (
              <li key={item} className="gez-trust-step flex items-center gap-4 border-b border-white/15 py-5 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6 lg:py-7 lg:odd:border-r-0 lg:even:pl-0">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#b8c7a5]/15 text-xs font-bold text-[#cad5bf]">{index + 1}</span>
                <span className="text-sm font-semibold">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="become" className="relative isolate overflow-hidden bg-[#f6f1e7] px-5 py-24 sm:px-8 lg:px-12">
        <img src="./gez-paw-high-five.png" alt="" aria-hidden="true" width="1254" height="1254" loading="lazy" decoding="async" className="pointer-events-none absolute -left-24 top-2 z-0 w-64 rotate-[35deg] opacity-30 sm:-left-20 sm:top-0 sm:w-80" />
        <div className="relative z-10 mx-auto grid max-w-[1200px] overflow-hidden rounded-[42px] border border-[#d8d3c7] bg-[#ebe5d8] lg:grid-cols-[1fr_.9fr]">
          <div className="p-8 sm:p-12 lg:p-16">
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#31483b] text-white"><ShieldCheck className="size-5" /></span>
            <h2 className="font-display mt-8 text-5xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-6xl">{copy.walkerTitle}</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-[#657068]">{copy.walkerBody}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-[#55635b]">
              {['Your schedule', 'Dogs nearby', 'Earn per walk'].map((item) => <span key={item} className="flex items-center gap-1.5"><Check className="size-3.5 text-[#667c5c]" />{item}</span>)}
            </div>
          </div>
          <form
            className="m-3 rounded-[34px] bg-[#fffaf1] p-6 sm:p-9"
            onSubmit={(event) => { event.preventDefault(); setApplied(true); }}
          >
            <div className="grid gap-4">
              <input required placeholder={local.apply[0]} className="h-13 rounded-2xl border border-[#ded8cc] bg-transparent px-4 text-sm outline-none focus:border-[#8ca27f]" />
              <select className="h-13 rounded-2xl border border-[#ded8cc] bg-transparent px-4 text-sm outline-none">
                <option>{local.apply[1]}</option><option>Yasamal</option><option>Sabail</option><option>Nasimi</option><option>Narimanov</option><option>Khatai</option>
              </select>
              <textarea required placeholder={local.apply[2]} className="min-h-28 rounded-2xl border border-[#ded8cc] bg-transparent p-4 text-sm outline-none focus:border-[#8ca27f]" />
              <button className="h-13 rounded-full bg-[#31483b] text-sm font-bold text-white transition hover:bg-[#24372d]">{local.apply[3]}</button>
              {applied && <output className="rounded-2xl bg-[#e6eddf] px-4 py-3 text-sm font-semibold text-[#31483b]">Thank you — this prototype application is ready for review.</output>}
            </div>
          </form>
        </div>
      </section>

      <footer className="bg-[#f6f1e7] px-5 pb-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-5 border-t border-[#d8d3c7] pt-7 text-xs text-[#747d76] sm:flex-row sm:items-center sm:justify-between">
          <GezLogo />
          <p>Built in Baku for dogs and their people. · © 2026</p>
        </div>
      </footer>
    </main>
  );
}
