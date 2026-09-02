'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  Clock3,
  LocateFixed,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type YoldaExperienceProps = {
  signInPath: string;
  userName: string | null;
};

const districts = ['Yasamal', 'Nərimanov', 'Nəsimi', 'Səbail'];

function YoldaMark() {
  return (
    <svg aria-hidden="true" className="size-8" viewBox="0 0 36 36" fill="none">
      <path d="M8 7.5c0 7.7 4.4 11.1 10 11.1S28 15.2 28 7.5" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M18 18.6v10" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="8" cy="6.5" r="3.5" fill="currentColor" />
      <circle cx="28" cy="6.5" r="3.5" fill="currentColor" />
      <circle cx="18" cy="29" r="3.5" fill="currentColor" />
    </svg>
  );
}

export function YoldaExperience({ signInPath, userName }: YoldaExperienceProps) {
  const [district, setDistrict] = useState('Yasamal');
  const [duration, setDuration] = useState(30);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchStarted, setSearchStarted] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="relative z-30 mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a href="#top" className="flex items-center gap-2.5" aria-label="YOLDA Walks home">
          <span className="text-primary"><YoldaMark /></span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-[1.08rem] font-black tracking-[-0.04em]">YOLDA</span>
            <span className="text-xs font-semibold text-muted-foreground">walks</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-[#41544d] md:flex" aria-label="Main navigation">
          <a href="#how" className="transition-colors hover:text-primary">Necə işləyir</a>
          <a href="#safety" className="transition-colors hover:text-primary">Təhlükəsizlik</a>
          <a href="#walkers" className="transition-colors hover:text-primary">Gəzdirici ol</a>
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <button className="rounded-full px-3 py-2 text-xs font-bold text-muted-foreground transition hover:bg-secondary" aria-label="Change language">
            AZ <ChevronDown className="ml-1 inline size-3" />
          </button>
          {userName ? (
            <Link href="/dashboard" className="rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">Profilim</Link>
          ) : (
            <a href={signInPath} target="_top" className="rounded-full border border-border bg-white px-4 py-2.5 text-sm font-bold shadow-[0_3px_0_#d9d5c7] transition hover:-translate-y-0.5">Daxil ol</a>
          )}
        </div>

        <button
          className="grid size-10 place-items-center rounded-full border border-border bg-white sm:hidden"
          onClick={() => setMobileNavOpen((current) => !current)}
          aria-expanded={mobileNavOpen}
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>
      </header>

      {mobileNavOpen && (
        <nav className="relative z-20 mx-5 grid gap-3 rounded-3xl border border-border bg-white p-5 text-sm font-bold shadow-xl sm:hidden">
          <a href="#how">Necə işləyir</a>
          <a href="#safety">Təhlükəsizlik</a>
          <a href="#walkers">Gəzdirici ol</a>
          <a href={signInPath} target="_top" className="mt-2 rounded-full bg-primary px-4 py-3 text-center text-primary-foreground">Daxil ol</a>
        </nav>
      )}

      <section id="top" className="relative mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-[1440px] items-center gap-10 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[minmax(0,1.03fr)_minmax(480px,.97fr)] lg:px-12 lg:pb-20 lg:pt-10">
        <div className="relative z-10 max-w-[690px]">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#bdd0c7] bg-white/70 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.13em] text-primary shadow-sm backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#77a900] opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-[#77a900]" />
            </span>
            Bakıda ilk gəzinti 20% endirimli
          </div>

          <h1 className="max-w-[660px] text-[clamp(3.6rem,7.3vw,7.4rem)] font-black leading-[0.86] tracking-[-0.075em] text-primary">
            Sən rahat ol.
            <span className="mt-2 block text-[#ef7658]">O, gəzintidə.</span>
          </h1>
          <p className="mt-7 max-w-[570px] text-base leading-7 text-[#52645d] sm:text-lg sm:leading-8">
            Yaxınlıqdakı yoxlanılmış it gəzdiricisini tap, vaxtı seç və hər addımı canlı izlə. <span className="font-semibold text-primary">Baku dog care, made human.</span>
          </p>

          <div className="mt-9 rounded-[28px] border border-[#dcd9cc] bg-white p-3 shadow-[0_24px_70px_rgba(29,63,52,0.12)] sm:p-4">
            <div className="mb-3 flex items-center justify-between px-1.5">
              <span className="text-xs font-black uppercase tracking-[0.12em] text-primary">Gəzinti tap</span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><LocateFixed className="size-3.5 text-[#ef7658]" /> 12 gəzdirici yaxınlıqda</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-[1.05fr_1fr_.82fr_auto]">
              <div className="rounded-2xl bg-secondary px-4 py-3.5">
                <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">İtin</span>
                <span className="mt-1 flex items-center gap-2 text-sm font-extrabold text-primary">
                  <span className="grid size-6 place-items-center rounded-full bg-[#d4f785] text-[11px]">M</span> Milo
                </span>
              </div>
              <label className="rounded-2xl bg-secondary px-4 py-3.5">
                <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Rayon</span>
                <select
                  aria-label="Rayon"
                  className="mt-1 w-full appearance-none bg-transparent text-sm font-extrabold text-primary outline-none"
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                >
                  {districts.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <div className="rounded-2xl bg-secondary px-4 py-3.5">
                <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">Müddət</span>
                <span className="mt-1 flex items-center gap-2 text-sm font-extrabold text-primary"><Clock3 className="size-4 text-[#ef7658]" /> {duration} dəq</span>
              </div>
              <Button
                size="lg"
                onClick={() => setSearchStarted(true)}
                className="h-full min-h-14 rounded-2xl bg-primary px-5 text-sm font-black shadow-[inset_0_-3px_0_rgba(0,0,0,.18)] hover:bg-[#245447]"
              >
                Tap <ArrowRight className="size-4" />
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 px-1.5">
              {[30, 45, 60].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => setDuration(minutes)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${duration === minutes ? 'bg-[#d4f785] text-primary' : 'bg-secondary text-muted-foreground hover:text-primary'}`}
                >
                  {minutes} dəq
                </button>
              ))}
              <span className="ml-auto hidden items-center gap-1 text-[11px] font-semibold text-muted-foreground sm:flex"><CalendarDays className="size-3.5" /> Bu gün, 18:30</span>
            </div>
          </div>

          {searchStarted && (
            <output className="mt-4 flex items-center gap-3 rounded-2xl border border-[#bcd58b] bg-[#effbd5] px-4 py-3 text-sm font-semibold text-primary">
              <Sparkles className="size-4" /> {district} üzrə {duration} dəqiqəlik gəzinti üçün 3 uyğun gəzdirici tapıldı.
            </output>
          )}

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-[#66766f]">
            <span className="flex items-center gap-2"><BadgeCheck className="size-4 text-[#6f9b10]" /> Şəxsiyyət yoxlanışı</span>
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#6f9b10]" /> Təhlükəsiz ödəniş</span>
            <span className="flex items-center gap-2"><MapPin className="size-4 text-[#6f9b10]" /> Canlı GPS</span>
          </div>
        </div>

        <div className="relative min-h-[520px] lg:min-h-[650px]">
          <div className="absolute left-[2%] top-[8%] h-[73%] w-[88%] rotate-[-5deg] rounded-[45%_55%_46%_54%/56%_40%_60%_44%] bg-[#d7f58e]" />
          <div className="absolute right-[-9%] top-[16%] size-52 rounded-full bg-[#f2a48f]/75 blur-[1px] sm:size-72" />
          <div className="absolute inset-x-[7%] bottom-[8%] top-[14%] overflow-hidden rounded-[44px] border border-white/70 bg-[#1d4a3e] shadow-[0_40px_100px_rgba(22,62,51,.25)]">
            <Image src="/og.png" alt="YOLDA gəzdiricisi Bakı bulvarında itlə gəzintidə" fill sizes="(min-width: 1024px) 42vw, 90vw" className="object-cover object-[66%_center]" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#173f35] via-transparent to-transparent" />
            <div className="absolute left-[9%] top-[8%] rounded-full border border-white/30 bg-[#173f35]/60 px-4 py-2 text-xs font-bold text-white backdrop-blur">LIVE · Yasamal</div>
            <div className="absolute inset-x-[9%] bottom-[7%] grid grid-cols-3 gap-3 text-white">
              <div><div className="text-[10px] font-bold uppercase tracking-widest text-white/55">Vaxt</div><div className="mt-1 text-xl font-black">24:18</div></div>
              <div><div className="text-[10px] font-bold uppercase tracking-widest text-white/55">Məsafə</div><div className="mt-1 text-xl font-black">1.8 km</div></div>
              <div><div className="text-[10px] font-bold uppercase tracking-widest text-white/55">Əhval</div><div className="mt-1 text-xl font-black">Əla</div></div>
            </div>
          </div>

          <div className="absolute right-0 top-[5%] z-10 w-[220px] rounded-[24px] border border-white bg-white p-4 shadow-[0_20px_60px_rgba(25,58,49,.17)] sm:w-[245px]">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-[#ffe0d7] text-sm font-black text-[#9b452e]">AG</span>
              <div className="min-w-0 flex-1"><div className="flex items-center gap-1 text-sm font-black">Aysel G. <BadgeCheck className="size-4 fill-[#d4f785] text-primary" /></div><div className="mt-0.5 flex items-center gap-1 text-xs font-bold text-muted-foreground"><Star className="size-3 fill-[#ef7658] text-[#ef7658]" /> 4.97 · 126 gəzinti</div></div>
            </div>
          </div>

          <div className="absolute bottom-[1%] left-0 z-10 max-w-[230px] rounded-[24px] border border-white bg-[#fff7ef] p-4 shadow-[0_20px_60px_rgba(25,58,49,.14)]">
            <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary"><span className="grid size-7 place-items-center rounded-full bg-[#d4f785]">✓</span> Foto hesabat</div>
            <p className="text-sm font-semibold leading-5 text-[#5a6963]">Milo su içdi, parkda oynadı və indi evə qayıdır.</p>
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-border bg-white px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1344px] flex-wrap items-center justify-between gap-6">
          <p className="max-w-sm text-sm font-bold text-primary">Hər gəzintidə rahatlıq, izləmə və real insan dəstəyi.</p>
          <div className="flex flex-wrap gap-7 text-sm font-black text-primary sm:gap-12">
            <span><strong className="mr-2 text-2xl">4.9</strong> orta reytinq</span>
            <span><strong className="mr-2 text-2xl">24/7</strong> dəstək</span>
            <span><strong className="mr-2 text-2xl">4</strong> pilot rayonu</span>
          </div>
        </div>
      </section>

      <section id="safety" className="bg-[#173f35] px-5 py-20 text-white sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1344px] gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-[#d4f785]">YOLDA standartı</span>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">Etibar bir funksiya deyil. Bütün sistemdir.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['01', 'Yoxlanılmış insan', 'Şəxsiyyət, müsahibə və praktiki gəzinti sınağı.'],
              ['02', 'Ağıllı uyğunluq', 'İtin ölçüsü, enerjisi və davranışına görə seçim.'],
              ['03', 'Canlı nəzarət', 'GPS marşrutu, foto hesabatı və təcili dəstək.'],
            ].map(([number, title, copy]) => (
              <article key={number} className="rounded-[28px] border border-white/15 bg-white/[0.06] p-6">
                <span className="text-xs font-black text-[#d4f785]">{number}</span>
                <h3 className="mt-10 text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="walkers" className="bg-[#f3f0e7] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center rounded-[40px] bg-[#d4f785] px-6 py-14 text-center sm:px-12">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-primary">Gəzinti etməyi sevirsən?</span>
          <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.05em] text-primary sm:text-6xl">Bakını gəz. Dost qazan. Gəlir əldə et.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#3f594f]">Qrafikini özün seç, təlim al və yaxınlığındakı it sahiblərinə kömək et.</p>
          <Button className="mt-8 h-12 rounded-full bg-primary px-6 font-black">Gəzdirici ol <ArrowRight /></Button>
        </div>
      </section>

      <footer className="bg-[#f3f0e7] px-5 pb-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1344px] flex-col gap-5 border-t border-[#d6d2c5] pt-7 text-xs font-semibold text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-primary"><YoldaMark /><span className="font-black">YOLDA walks</span></div>
          <p>Bakıda it sahibləri və gəzdiricilər üçün yaradılıb. © 2026</p>
        </div>
      </footer>
    </main>
  );
}
