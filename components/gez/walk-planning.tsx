'use client';

/* eslint-disable next/no-img-element -- Shared portraits support the static Pages build. */
import { ArrowRight, Check, GitCompareArrows, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { gezWalkers, priceForDuration, type DogSize, type GezLocale, type GezWalker } from '@/lib/gez-prototype';
import { preparationItems, type PreparationItem } from '@/lib/gez-planning';
import { dogSizeCopy, planningCopy } from './planning-copy';

export function CompareChoice({ walker, checked, full, locale, onToggle }: { walker: GezWalker; checked: boolean; full: boolean; locale: GezLocale; onToggle: () => void }) {
  return <label className={`mt-3 flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2 text-sm font-semibold ${checked ? 'border-[#8b9e7d] bg-[#e7ecdf]' : 'border-[#e3ded4]'} ${full && !checked ? 'cursor-not-allowed opacity-45' : 'cursor-pointer'}`}>
    <Checkbox aria-label={`${planningCopy[locale].compare} ${walker.name}`} checked={checked} disabled={full && !checked} onCheckedChange={onToggle} className="size-5" />{planningCopy[locale].compare}
  </label>;
}

export function ComparisonBar({ ids, locale, onClear, onRemove, onOpen }: { ids: string[]; locale: GezLocale; onClear: () => void; onRemove: (id: string) => void; onOpen: () => void }) {
  const t = planningCopy[locale];
  if (!ids.length) return <p className="mt-4 text-sm text-[#68736c]">{t.hint}</p>;
  return <section aria-label={t.open} className="gez-comparison-bar sticky z-20 mt-5 rounded-[24px] border border-[#b9c7ad] bg-[#edf1e7] p-4">
    <div className="flex flex-wrap items-center gap-3">
      <GitCompareArrows className="hidden size-5 shrink-0 text-[#677e5d] sm:block" />
      <div className="flex flex-1 flex-wrap gap-2">{ids.map(id => {
        const walker = gezWalkers.find(item => item.id === id)!;
        return <button key={id} onClick={() => onRemove(id)} aria-label={`${t.remove} ${walker.name}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#fffaf1] py-1 pl-1 pr-3 text-sm font-semibold"><img src={walker.portrait} alt="" className="size-9 rounded-full object-cover" />{walker.name}<X className="size-3.5" /></button>;
      })}</div>
      <button onClick={onClear} className="min-h-11 px-3 text-sm underline underline-offset-4">{t.clear}</button>
      <button disabled={ids.length !== 2} onClick={onOpen} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#31483b] px-5 text-sm font-semibold text-white disabled:opacity-45 sm:w-auto">{t.open}<ArrowRight className="size-4 shrink-0" /></button>
    </div>
    <p aria-live="polite" className="mt-2 text-xs leading-5 text-[#68736c]">{ids.length === 2 ? t.limit : t.one}</p>
  </section>;
}

export function WalkerComparison({ ids, locale, duration, size, onClose, onView }: { ids: string[]; locale: GezLocale; duration: number; size: DogSize; onClose: () => void; onView: (walker: GezWalker) => void }) {
  const t = planningCopy[locale];
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent showCloseButton={false} className="gez-walker-dialog gap-0 overflow-y-auto rounded-[28px] bg-[#fffaf1] p-0 text-[#26362e] sm:max-w-[880px]">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#ded8cc] bg-[#fffaf1] p-5 sm:p-6"><div><DialogTitle className="font-display text-2xl leading-tight sm:text-3xl">{t.title}</DialogTitle><DialogDescription className="mt-2 text-sm leading-6 text-[#68736c]">{t.intro}</DialogDescription></div><button onClick={onClose} aria-label={t.close} className="grid size-11 shrink-0 place-items-center rounded-full border border-[#d8d3c7]"><X className="size-4" /></button></div>
      <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">{ids.map(id => {
        const walker = gezWalkers.find(item => item.id === id)!;
        const compatible = walker.acceptedSizes.includes(size);
        return <article key={id} className="min-w-0 rounded-[24px] border border-[#dcd8cb] bg-[#f6f1e7] p-5">
          <div className="flex items-center gap-3"><img src={walker.portrait} alt="" className="size-16 shrink-0 rounded-2xl object-cover" /><div><h3 className="text-xl font-semibold">{walker.name}</h3><p className="mt-1 text-sm text-[#68736c]">{walker.district} · ★ {walker.rating}</p></div></div>
          <p className="mt-5 flex items-baseline gap-2"><strong className="font-display text-3xl">{priceForDuration(walker.price45, duration)} AZN</strong><span className="text-sm text-[#68736c]">/ {duration} min</span></p>
          <p className={`mt-4 flex items-center gap-2 text-sm font-semibold ${compatible ? 'text-[#526c47]' : 'text-[#995c40]'}`}><Check className="size-4 shrink-0" />{compatible ? t.fit : t.noFit}</p>
          <dl className="mt-5 divide-y divide-[#ddd7cc] text-sm">{[[t.experience, walker.walks], [t.languages, walker.languages.join(' · ')], [t.sizes, walker.acceptedSizes.map(item => dogSizeCopy[locale][item]).join(' · ')], [t.strengths, walker.specialties.join(' · ')], [t.availability, walker.availability]].map(([label, value]) => <div key={label} className="py-3"><dt className="text-xs text-[#68736c]">{label}</dt><dd className="mt-1 font-medium leading-6">{value}</dd></div>)}</dl>
          <button onClick={() => onView(walker)} className="mt-4 flex min-h-12 w-full items-center justify-between gap-2 rounded-full bg-[#31483b] px-5 text-sm font-semibold text-white">{t.view} {walker.name}<ArrowRight className="size-4 shrink-0" /></button>
        </article>;
      })}</div><p className="px-6 pb-6 text-xs leading-5 text-[#68736c]">{t.sample}</p>
    </DialogContent>
  </Dialog>;
}

export function WalkPreparation({ locale, treats, checked, onToggle }: { locale: GezLocale; treats: boolean; checked: PreparationItem[]; onToggle: (item: PreparationItem) => void }) {
  const t = planningCopy[locale];
  const items = preparationItems(treats);
  const count = items.filter(item => checked.includes(item)).length;
  return <Accordion className="mx-auto mt-6 max-w-md rounded-[24px] border border-[#cbd6c1] bg-[#edf1e7] px-5 text-left">
    <AccordionItem value="preparation"><AccordionTrigger className="min-h-16 items-center gap-3 hover:no-underline"><span className="text-base font-semibold">{t.prep}<span className="mt-1 block text-xs font-normal text-[#68736c]">{count}/{items.length} {t.ready}</span></span></AccordionTrigger>
      <AccordionContent><p className="mb-3 text-sm leading-6 text-[#68736c]">{t.optional}</p>{items.map(item => <label key={item} className="flex min-h-12 cursor-pointer items-center gap-3 border-t border-[#d8dfd0] py-3 text-sm font-medium"><Checkbox checked={checked.includes(item)} onCheckedChange={() => onToggle(item)} className="size-5" />{t[item]}</label>)}</AccordionContent>
    </AccordionItem>
  </Accordion>;
}
