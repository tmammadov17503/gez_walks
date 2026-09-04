'use client';

/* eslint-disable next/no-img-element -- Portraits also serve the standalone GitHub Pages build. */

import { useEffect, useState } from 'react';
import { CalendarDays, Check, Heart, MapPin } from 'lucide-react';
import { bakuDate, createMeetRequest, meetTimes, readConnections, toggleFavorite, upsertMeeting, type MeetRequest, type WalkerConnections } from '@/lib/gez-connections';
import { gezWalkers, type GezLocale, type GezWalker } from '@/lib/gez-prototype';

export const connectionText = {
  en: {
    favorites: 'Favorite walkers', save: 'Save', saved: 'Saved', remove: 'Remove', only: 'Favorites only',
    empty: 'A familiar face for the next walk.', emptyHint: 'Tap a heart to keep the walkers you like here.', browse: 'Find a walker', view: 'View profile',
    meet: 'Meet before the first walk', arrange: 'Arrange a free meet & greet', intro: 'A relaxed 15-minute introduction for you, your dog, and your walker. No walk booking required.',
    date: 'Preferred date', time: 'Time · Baku', location: 'Suggested meeting point', publicPlace: 'Meet in a public place, keep your dog on a leash, and take your time getting comfortable.',
    submit: 'Save demo request', requested: 'Meet & greet requested · demo', disclaimer: 'Saved on this device only. No message has been sent and the walker has not confirmed.',
    invalid: 'Choose a future time within the next 30 days.', cancel: 'Cancel request', reschedule: 'Change time', close: 'Not now',
    meetings: 'Your meet & greets', free: '15 min · Free', storage: 'Storage is unavailable. Your changes will last for this visit only.',
    mismatch: 'Not a size match', mismatchHint: 'This walker does not accept the size in your dog’s current profile. You can still meet, but choose a compatible walker to book a walk.',
  },
  az: {
    favorites: 'Sevimli gəzdiricilər', save: 'Saxla', saved: 'Saxlanıldı', remove: 'Sil', only: 'Yalnız sevimlilər',
    empty: 'Növbəti gəzintidə tanış bir sima.', emptyHint: 'Bəyəndiyin gəzdiricini saxlamaq üçün ürəyə toxun.', browse: 'Gəzdirici tap', view: 'Profilə bax',
    meet: 'İlk gəzintidən əvvəl tanış olun', arrange: 'Pulsuz tanışlıq görüşü planla', intro: 'Sənin, itinin və gəzdiricinin rahat tanış olması üçün 15 dəqiqə. Gəzinti sifarişi tələb olunmur.',
    date: 'İstədiyin tarix', time: 'Vaxt · Bakı', location: 'Təklif olunan görüş yeri', publicPlace: 'İctimai yerdə görüşün, itini xaltada saxla və rahat tanış olmaq üçün vaxt ayır.',
    submit: 'Demo sorğunu saxla', requested: 'Tanışlıq sorğusu · demo', disclaimer: 'Yalnız bu cihazda saxlanılıb. Mesaj göndərilməyib və gəzdirici hələ təsdiqləməyib.',
    invalid: 'Növbəti 30 gün ərzində gələcək vaxtı seç.', cancel: 'Sorğunu ləğv et', reschedule: 'Vaxtı dəyiş', close: 'İndi yox',
    meetings: 'Tanışlıq görüşlərin', free: '15 dəq · Pulsuz', storage: 'Yaddaş əlçatan deyil. Dəyişikliklər yalnız bu ziyarət ərzində qalacaq.',
    mismatch: 'Ölçü uyğun deyil', mismatchHint: 'Bu gəzdirici itinin profilindəki ölçünü qəbul etmir. Tanış ola bilərsiniz, amma gəzinti üçün uyğun gəzdirici seç.',
  },
  ru: {
    favorites: 'Любимые выгульщики', save: 'Сохранить', saved: 'Сохранено', remove: 'Убрать', only: 'Только избранные',
    empty: 'Знакомый человек для следующей прогулки.', emptyHint: 'Нажмите на сердечко, чтобы сохранить понравившегося выгульщика.', browse: 'Найти выгульщика', view: 'Открыть профиль',
    meet: 'Познакомьтесь до первой прогулки', arrange: 'Запланировать бесплатное знакомство', intro: 'Спокойные 15 минут для знакомства с вами, вашей собакой и выгульщиком. Заказывать прогулку не обязательно.',
    date: 'Желаемая дата', time: 'Время · Баку', location: 'Предлагаемое место встречи', publicPlace: 'Встречайтесь в общественном месте, держите собаку на поводке и не спешите.',
    submit: 'Сохранить демо-запрос', requested: 'Запрос на знакомство · демо', disclaimer: 'Сохранено только на этом устройстве. Сообщение не отправлено, выгульщик ещё не подтвердил встречу.',
    invalid: 'Выберите будущее время в ближайшие 30 дней.', cancel: 'Отменить запрос', reschedule: 'Изменить время', close: 'Не сейчас',
    meetings: 'Ваши встречи', free: '15 мин · Бесплатно', storage: 'Хранилище недоступно. Изменения сохранятся только на время этого визита.',
    mismatch: 'Размер не подходит', mismatchHint: 'Этот выгульщик не работает с размером собаки, указанным в профиле. Познакомиться можно, но для прогулки выберите подходящего человека.',
  },
} satisfies Record<GezLocale, Record<string, string>>;

const meetingPlaces: Record<string, string> = {
  Yasamal: 'Mərkəzi Park', Sabail: 'Dənizkənarı Bulvar', Nasimi: 'Zabitlər Parkı',
  Narimanov: 'Nərimanov Parkı', Khatai: 'Ağ Şəhər Bulvarı', Binagadi: 'Zərifə Əliyeva Parkı',
};

export function useWalkerConnections() {
  const [connections, setConnections] = useState<WalkerConnections>({ favorites: [], meetings: [] });
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  useEffect(() => {
    queueMicrotask(() => {
      try { setConnections(readConnections(window.localStorage.getItem('gez-connections'))); }
      catch { setStorageUnavailable(true); }
    });
  }, []);
  const save = (next: WalkerConnections) => {
    setConnections(next);
    try { window.localStorage.setItem('gez-connections', JSON.stringify(next)); }
    catch { setStorageUnavailable(true); }
  };
  return {
    ...connections, storageUnavailable,
    toggle: (walkerId: string) => save({ ...connections, favorites: toggleFavorite(connections.favorites, walkerId) }),
    request: (meeting: MeetRequest) => save({ ...connections, meetings: upsertMeeting(connections.meetings, meeting) }),
    cancel: (walkerId: string) => save({ ...connections, meetings: connections.meetings.filter(meeting => meeting.walkerId !== walkerId) }),
  };
}

export function FavoriteButton({ walker, saved, locale, onToggle }: { walker: GezWalker; saved: boolean; locale: GezLocale; onToggle: () => void }) {
  const t = connectionText[locale];
  return <button type="button" aria-label={`${saved ? t.remove : t.save} ${walker.name}`} aria-pressed={saved} onClick={event => { event.stopPropagation(); onToggle(); }} className="grid size-11 shrink-0 place-items-center rounded-full border border-[#ded8cc] bg-[#fffaf1] text-[#52694c] transition hover:scale-105"><Heart className={`size-5 ${saved ? 'fill-[#d58160] text-[#a8654c]' : ''}`} /></button>;
}

export function FavoriteWalkers({ ids, locale, onOpen, onBrowse }: { ids: string[]; locale: GezLocale; onOpen: (walker: GezWalker) => void; onBrowse: () => void }) {
  const t = connectionText[locale];
  const walkers = gezWalkers.filter(walker => ids.includes(walker.id));
  return <section aria-label={t.favorites} className="rounded-[28px] border border-[#ddd7cc] bg-[#e7e2d7] p-6">
    <div className="flex items-center justify-between gap-3"><h2 className="text-sm font-bold">{t.favorites}</h2><Heart className="size-4 text-[#798d70]" /></div>
    {walkers.length ? <div className="mt-3 divide-y divide-[#cdc8bc]">{walkers.map(walker => <button key={walker.id} onClick={() => onOpen(walker)} className="flex w-full items-center gap-3 py-4 text-left"><img src={walker.portrait} alt="" className="size-12 shrink-0 rounded-full object-cover" /><span className="min-w-0"><strong className="block text-sm">{walker.name}</strong><span className="text-xs text-[#68736c]">★ {walker.rating} · {walker.district}</span></span><span className="ml-auto text-lg" aria-hidden="true">↗</span></button>)}</div> : <><p className="mt-5 text-base font-semibold">{t.empty}</p><p className="mt-2 text-sm leading-6 text-[#68736c]">{t.emptyHint}</p><button onClick={onBrowse} className="mt-5 min-h-11 w-full rounded-full border border-[#bbbfae] px-4 py-3 text-sm font-bold">{t.browse}</button></>}
  </section>;
}

function MeetingSummary({ meeting, locale }: { meeting: MeetRequest; locale: GezLocale }) {
  const t = connectionText[locale];
  return <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold"><span className="flex items-center gap-2"><CalendarDays className="size-4" />{new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'Asia/Baku' }).format(new Date(`${meeting.date}T12:00:00+04:00`))}</span><span>{meeting.time} · Bakı</span><span>{t.free}</span></div>;
}

export function MeetGreetPlanner({ walker, locale, meeting, onRequest, onCancel }: { walker: GezWalker; locale: GezLocale; meeting?: MeetRequest; onRequest: (meeting: MeetRequest) => void; onCancel: () => void }) {
  const t = connectionText[locale];
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(meeting?.date ?? bakuDate(new Date(), 1));
  const [time, setTime] = useState(meeting?.time ?? '17:30');
  const [error, setError] = useState(false);
  return <section className="mt-6 rounded-[24px] border border-[#d5dccb] bg-[#edf0e5] p-5">
    <h3 className="text-lg font-semibold">{t.meet}</h3><p className="mt-2 text-sm leading-6 text-[#68736c]">{t.intro}</p>
    {meeting && !open && <div aria-live="polite" className="mt-4 rounded-2xl bg-[#fffaf1] p-4"><p className="flex items-center gap-2 text-sm font-bold"><Check className="size-4 shrink-0" />{t.requested}</p><MeetingSummary meeting={meeting} locale={locale} /><p className="mt-3 text-xs leading-5 text-[#68736c]">{t.disclaimer}</p></div>}
    {!open && <div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => { setDate(meeting?.date ?? bakuDate(new Date(), 1)); setTime(meeting?.time ?? '17:30'); setOpen(true); }} className="min-h-11 rounded-full border border-[#aab99e] bg-[#fffaf1] px-5 py-3 text-sm font-bold">{meeting ? t.reschedule : t.arrange}</button>{meeting && <button type="button" onClick={onCancel} className="min-h-11 rounded-full px-3 text-sm text-[#94614e] underline underline-offset-4">{t.cancel}</button>}</div>}
    {open && <form className="mt-5 grid gap-4" onSubmit={event => { event.preventDefault(); const request = createMeetRequest(walker.id, date, time); if (!request) { setError(true); return; } onRequest(request); setError(false); setOpen(false); }}>
      <div className="grid gap-4 sm:grid-cols-2"><label className="grid min-w-0 gap-2 text-sm font-semibold">{t.date}<input required type="date" min={bakuDate()} max={bakuDate(new Date(), 30)} value={date} onChange={event => { setDate(event.target.value); setError(false); }} className="gez-input min-w-0" /></label><label className="grid gap-2 text-sm font-semibold">{t.time}<select value={time} onChange={event => { setTime(event.target.value); setError(false); }} className="gez-input">{meetTimes.map(slot => <option key={slot}>{slot}</option>)}</select></label></div>
      <div className="rounded-2xl bg-[#fffaf1] p-4"><p className="text-xs text-[#68736c]">{t.location}</p><p className="mt-2 flex items-center gap-2 text-sm font-semibold"><MapPin className="size-4 shrink-0" />{meetingPlaces[walker.district]} · {walker.district}</p><p className="mt-3 text-sm leading-6 text-[#68736c]">{t.publicPlace}</p></div>
      <p className="text-xs leading-5 text-[#68736c]">{t.disclaimer}</p>
      {error && <p role="alert" className="text-sm text-[#99482e]">{t.invalid}</p>}
      <button className="min-h-12 rounded-full bg-[#31483b] px-4 py-3 text-sm font-bold text-white">{t.submit}</button><button type="button" onClick={() => { setOpen(false); setError(false); }} className="min-h-11 rounded-full text-sm font-semibold">{t.close}</button>
    </form>}
  </section>;
}

export function MeetingsPanel({ meetings, locale, onOpen, onCancel }: { meetings: MeetRequest[]; locale: GezLocale; onOpen: (walker: GezWalker) => void; onCancel: (walkerId: string) => void }) {
  const t = connectionText[locale];
  if (!meetings.length) return null;
  return <section aria-label={t.meetings} className="mb-6 rounded-[28px] border border-[#d0dac5] bg-[#e8efdf] p-5 sm:p-6"><h2 className="text-xl font-bold">{t.meetings}</h2><p className="mt-2 text-xs leading-5 text-[#68736c]">{t.disclaimer}</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{meetings.map(meeting => {
    const walker = gezWalkers.find(item => item.id === meeting.walkerId)!;
    return <article key={meeting.walkerId} className="rounded-[22px] bg-[#fffaf1] p-4"><div className="flex items-center gap-3"><img src={walker.portrait} alt="" className="size-11 rounded-full object-cover" /><div><h3 className="text-base font-bold">{walker.name}</h3><p className="text-xs text-[#68736c]">{meetingPlaces[walker.district]}</p></div></div><MeetingSummary meeting={meeting} locale={locale} /><div className="mt-4 flex flex-wrap gap-3"><button onClick={() => onOpen(walker)} className="min-h-11 rounded-full border border-[#c8d1be] px-4 text-sm font-semibold">{t.view}</button><button onClick={() => onCancel(walker.id)} className="min-h-11 rounded-full px-2 text-sm text-[#94614e] underline underline-offset-4">{t.cancel}</button></div></article>;
  })}</div></section>;
}
