'use client';

/* eslint-disable next/no-img-element -- Portraits also serve the standalone GitHub Pages build. */

import { CheckCircle2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { FavoriteButton, MeetGreetPlanner, connectionText } from './walker-connections';
import type { MeetRequest } from '@/lib/gez-connections';
import type { GezCopy, GezLocale, GezWalker } from '@/lib/gez-prototype';

type Props = {
  walker: GezWalker;
  locale: GezLocale;
  copy: GezCopy;
  favorite: boolean;
  compatible: boolean;
  meeting?: MeetRequest;
  onToggleFavorite: () => void;
  onRequestMeeting: (meeting: MeetRequest) => void;
  onCancelMeeting: () => void;
  onChoose: () => void;
  onClose: () => void;
};

export function WalkerProfile({ walker, locale, copy, favorite, compatible, meeting, onToggleFavorite, onRequestMeeting, onCancelMeeting, onChoose, onClose }: Props) {
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent showCloseButton={false} className="gez-walker-dialog gap-0 overflow-y-auto rounded-[30px] bg-[#fffaf1] p-0 text-[#26362e] ring-0 sm:max-w-[980px]">
      <div className="pointer-events-none sticky top-4 z-20 -mb-11 flex h-11 justify-end pr-4"><button onClick={onClose} aria-label="Close walker profile" className="pointer-events-auto grid size-11 shrink-0 place-items-center rounded-full border border-[#ded8cc] bg-[#fffaf1]"><X className="size-4" /></button></div>
      <div className="grid lg:grid-cols-[.85fr_1.15fr]">
        <img src={walker.portrait} alt={walker.name} className="h-[min(360px,48dvh)] min-h-[220px] w-full object-cover lg:sticky lg:top-0 lg:h-[640px]" />
        <div className="p-6 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7d887f]">{walker.district}</p>
          <div className="mt-3 flex items-center justify-between gap-3"><DialogTitle className="font-display text-4xl font-medium tracking-[-0.05em] sm:text-5xl">{walker.name}</DialogTitle><FavoriteButton walker={walker} saved={favorite} locale={locale} onToggle={onToggleFavorite} /></div>
          <p className="mt-3 text-sm font-bold">{walker.rating} ★ · {walker.walks} walks</p>
          <DialogDescription className="mt-6 text-sm leading-7 text-[#68736c]">{walker.about}</DialogDescription>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">{walker.trustTags.map(tag => <span key={tag} className="flex items-center gap-2 rounded-2xl bg-[#e7ecdf] px-4 py-3 text-xs font-semibold"><CheckCircle2 className="size-4 shrink-0 text-[#687e62]" />{tag}</span>)}</div>
          <dl className="mt-7 grid gap-4 border-y border-[#e0dbd1] py-5 text-sm sm:grid-cols-2">
            <div><dt className="text-xs text-[#879089]">Availability</dt><dd className="mt-1 font-semibold">{walker.availability}</dd></div>
            <div><dt className="text-xs text-[#879089]">Languages</dt><dd className="mt-1 font-semibold">{walker.languages.join(' · ')}</dd></div>
            <div><dt className="text-xs text-[#879089]">Dog sizes</dt><dd className="mt-1 font-semibold capitalize">{walker.acceptedSizes.join(' · ')}</dd></div>
            <div><dt className="text-xs text-[#879089]">Experience</dt><dd className="mt-1 font-semibold">{walker.specialties.join(' · ')}</dd></div>
          </dl>
          <MeetGreetPlanner walker={walker} locale={locale} meeting={meeting} onRequest={onRequestMeeting} onCancel={onCancelMeeting} />
          {!compatible && <p className="mt-5 rounded-2xl bg-[#f2e2d2] p-4 text-sm leading-6 text-[#815742]">{connectionText[locale].mismatchHint}</p>}
          <button onClick={onChoose} disabled={!compatible} className="mt-5 min-h-14 w-full rounded-full bg-[#31483b] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{compatible ? copy.chooseWalker : connectionText[locale].mismatch}</button>
        </div>
      </div>
    </DialogContent>
  </Dialog>;
}
