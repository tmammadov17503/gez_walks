'use client';

import { useActionState, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LogOut,
  MapPin,
  PawPrint,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { addDogAction, bookWalkAction, initialActionState } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { matchWalkers, priceForWalk, type Walker } from '@/lib/marketplace';
import { walkers } from '@/lib/walkers';

type DogView = {
  id: string;
  name: string;
  breed: string;
  ageYears: number;
  size: 'small' | 'medium' | 'large';
  energy: 'calm' | 'medium' | 'high';
  notes: string;
  createdAt: string;
};

type BookingView = {
  id: string;
  dogId: string;
  walkerId: string;
  district: string;
  duration: number;
  scheduledFor: string;
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
  priceManat: number;
  createdAt: string;
};

type DashboardClientProps = {
  userName: string;
  signOutPath: string;
  dogs: DogView[];
  bookings: BookingView[];
};

const districtOptions = ['Yasamal', 'Nərimanov', 'Nəsimi', 'Səbail'] as const;

function Logo() {
  return (
    <span className="flex items-center gap-2 text-primary">
      <span className="grid size-9 place-items-center rounded-full bg-[#d4f785]"><PawPrint className="size-4" /></span>
      <span className="font-black tracking-[-0.04em]">YOLDA <small className="font-semibold text-muted-foreground">walks</small></span>
    </span>
  );
}

function AddDogDialog() {
  const [state, formAction, pending] = useActionState(addDogAction, initialActionState);

  return (
    <Dialog>
      <DialogTrigger render={<Button className="h-10 rounded-full px-4 font-black" />}>
        <Plus className="size-4" /> İt əlavə et
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-[28px] p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-[-0.04em]">İtini tanıyaq</DialogTitle>
          <DialogDescription>Doğru profil daha təhlükəsiz və uyğun gəzdirici seçməyə kömək edir.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          <label htmlFor="dog-name" className="grid gap-1.5 text-xs font-black text-primary">Adı
            <Input id="dog-name" name="name" required maxLength={40} placeholder="Milo" className="h-11 rounded-xl font-semibold" />
          </label>
          <label htmlFor="dog-breed" className="grid gap-1.5 text-xs font-black text-primary">Cinsi
            <Input id="dog-breed" name="breed" maxLength={60} placeholder="Cocker Spaniel" className="h-11 rounded-xl font-semibold" />
          </label>
          <label htmlFor="dog-age" className="grid gap-1.5 text-xs font-black text-primary">Yaşı
            <Input id="dog-age" name="ageYears" type="number" min={0} max={30} required placeholder="3" className="h-11 rounded-xl font-semibold" />
          </label>
          <label htmlFor="dog-size" className="grid gap-1.5 text-xs font-black text-primary">Ölçüsü
            <select id="dog-size" name="size" className="h-11 rounded-xl border border-input bg-white px-3 text-sm font-semibold">
              <option value="small">Kiçik</option><option value="medium">Orta</option><option value="large">Böyük</option>
            </select>
          </label>
          <label htmlFor="dog-energy" className="grid gap-1.5 text-xs font-black text-primary">Enerjisi
            <select id="dog-energy" name="energy" className="h-11 rounded-xl border border-input bg-white px-3 text-sm font-semibold">
              <option value="calm">Sakit</option><option value="medium">Orta</option><option value="high">Çox enerjili</option>
            </select>
          </label>
          <label htmlFor="dog-notes" className="grid gap-1.5 text-xs font-black text-primary sm:col-span-2">Qeyd
            <textarea id="dog-notes" name="notes" maxLength={240} placeholder="Nəyi bilməliyik?" className="min-h-24 rounded-xl border border-input bg-white p-3 text-sm font-semibold outline-none focus:border-ring" />
          </label>
          {state.message && <output className={`sm:col-span-2 text-sm font-bold ${state.status === 'error' ? 'text-red-600' : 'text-[#548000]'}`}>{state.message}</output>}
          <Button disabled={pending} className="h-11 rounded-xl font-black sm:col-span-2">{pending ? 'Əlavə edilir…' : 'Profili yadda saxla'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function WalkerCard({ walker, dogId, duration, scheduledFor }: { walker: Walker; dogId: string | null; duration: number; scheduledFor: string }) {
  const [state, formAction, pending] = useActionState(bookWalkAction, initialActionState);
  const initials = walker.name.split(' ').map((part) => part[0]).join('');

  return (
    <article className="rounded-[28px] border border-border bg-white p-5 shadow-[0_16px_50px_rgba(27,61,51,.07)]">
      <div className="flex items-start gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-[#ffe1d8] text-sm font-black text-[#93432f]">{initials}</span>
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1 text-base font-black">{walker.name} <BadgeCheck className="size-4 fill-[#d4f785] text-primary" /></h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-muted-foreground"><MapPin className="size-3" /> {walker.district}</p>
        </div>
        <span className="rounded-full bg-[#effbd5] px-2.5 py-1 text-xs font-black text-primary">{walker.nextAvailableMinutes} dəq</span>
      </div>
      <div className="my-5 grid grid-cols-3 gap-2 rounded-2xl bg-secondary p-3 text-center">
        <div><span className="block text-lg font-black">{walker.rating}</span><span className="text-[10px] font-bold text-muted-foreground">reytinq</span></div>
        <div><span className="block text-lg font-black">{walker.walks}</span><span className="text-[10px] font-bold text-muted-foreground">gəzinti</span></div>
        <div><span className="block text-lg font-black">{priceForWalk(walker.price30, duration)} ₼</span><span className="text-[10px] font-bold text-muted-foreground">{duration} dəq</span></div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wide text-[#557068]">
        <span className="rounded-full border border-border px-2.5 py-1">İlk yardım</span>
        <span className="rounded-full border border-border px-2.5 py-1">GPS</span>
        {walker.largeDogs && <span className="rounded-full border border-border px-2.5 py-1">Böyük itlər</span>}
      </div>
      <form action={formAction}>
        <input type="hidden" name="dogId" value={dogId ?? ''} />
        <input type="hidden" name="walkerId" value={walker.id} />
        <input type="hidden" name="district" value={walker.district} />
        <input type="hidden" name="duration" value={duration} />
        <input type="hidden" name="scheduledFor" value={scheduledFor} />
        <Button disabled={!dogId || pending} className="h-10 w-full rounded-xl font-black">
          {pending ? 'Sorğu göndərilir…' : dogId ? 'Sabah üçün seç' : 'Əvvəlcə it əlavə et'}
        </Button>
      </form>
      {state.message && <output className={`mt-3 block text-xs font-bold ${state.status === 'error' ? 'text-red-600' : 'text-[#548000]'}`}>{state.message}</output>}
    </article>
  );
}

export function DashboardClient({ userName, signOutPath, dogs, bookings }: DashboardClientProps) {
  const [district, setDistrict] = useState<(typeof districtOptions)[number]>('Yasamal');
  const [duration, setDuration] = useState(30);
  const [dogId, setDogId] = useState(dogs[0]?.id ?? '');
  const [scheduledFor] = useState(() => new Date(Date.now() + 86_400_000).toISOString());
  const selectedDog = dogs.find((dog) => dog.id === dogId) ?? dogs[0] ?? null;
  const matches = useMemo(
    () => matchWalkers(walkers, { district, dogSize: selectedDog?.size ?? 'medium' }),
    [district, selectedDog?.size],
  );

  return (
    <main className="min-h-screen bg-[#f5f2e9] text-primary">
      <header className="border-b border-border bg-white/90 px-5 py-4 backdrop-blur sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between">
          <Link href="/"><Logo /></Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-bold text-muted-foreground sm:block">Salam, {userName}</span>
            <a href={signOutPath} target="_top" className="grid size-9 place-items-center rounded-full border border-border bg-white" aria-label="Sign out"><LogOut className="size-4" /></a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1360px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-12 lg:py-10">
        <aside className="space-y-5">
          <Link href="/" className="flex items-center gap-2 text-xs font-black text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Ana səhifə</Link>
          <div className="rounded-[28px] bg-primary p-5 text-white shadow-[0_18px_50px_rgba(23,63,53,.16)]">
            <div className="flex items-center justify-between"><span className="text-xs font-black uppercase tracking-widest text-white/55">Mənim itlərim</span><PawPrint className="size-4 text-[#d4f785]" /></div>
            {dogs.length ? (
              <div className="mt-5 space-y-2">
                {dogs.map((dog) => (
                  <button key={dog.id} onClick={() => setDogId(dog.id)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${dogId === dog.id ? 'bg-white text-primary' : 'bg-white/8 hover:bg-white/12'}`}>
                    <span className={`grid size-10 place-items-center rounded-full text-sm font-black ${dogId === dog.id ? 'bg-[#d4f785]' : 'bg-white/15'}`}>{dog.name[0]}</span>
                    <span><strong className="block text-sm">{dog.name}</strong><small className={dogId === dog.id ? 'text-muted-foreground' : 'text-white/55'}>{dog.breed} · {dog.ageYears} yaş</small></span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-6 text-white/65">İlk gəzintini sifariş etmək üçün itini əlavə et.</p>
            )}
            <div className="mt-5"><AddDogDialog /></div>
          </div>

          <div className="rounded-[24px] border border-[#c9df9a] bg-[#effbd5] p-5">
            <ShieldCheck className="size-6" />
            <h3 className="mt-4 font-black">YOLDA qoruması</h3>
            <p className="mt-2 text-xs font-semibold leading-5 text-[#50685e]">Yoxlanılmış gəzdirici, canlı marşrut və hər sifarişdə dəstək.</p>
          </div>
        </aside>

        <section>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#ef7658]">Yaxın gəzdiricilər</span>
              <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] sm:text-5xl">Kim gəzintiyə çıxır?</h1>
              <p className="mt-3 text-sm font-semibold text-muted-foreground">{selectedDog ? `${selectedDog.name} üçün uyğun və yoxlanılmış insanlar.` : 'İtini əlavə et, ən uyğun insanları göstərək.'}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-white p-1.5 text-xs font-black shadow-sm">
              {[30, 45, 60].map((minutes) => <button key={minutes} onClick={() => setDuration(minutes)} className={`rounded-full px-3 py-2 transition ${duration === minutes ? 'bg-[#d4f785]' : 'text-muted-foreground hover:text-primary'}`}>{minutes} dəq</button>)}
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 rounded-[24px] border border-border bg-white p-3 shadow-sm sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 px-2"><Search className="size-4 text-[#ef7658]" /><span className="text-sm font-black">Rayon seç</span></div>
            <select value={district} onChange={(event) => setDistrict(event.target.value as typeof district)} className="h-11 rounded-2xl bg-secondary px-4 text-sm font-black outline-none sm:min-w-48">
              {districtOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
            <div className="flex h-11 items-center gap-2 rounded-2xl bg-primary px-4 text-xs font-black text-white"><Sparkles className="size-4 text-[#d4f785]" /> {matches.length} uyğun nəticə</div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((walker) => <WalkerCard key={walker.id} walker={walker} dogId={selectedDog?.id ?? null} duration={duration} scheduledFor={scheduledFor} />)}
          </div>
          {!matches.length && <div className="mt-6 rounded-[28px] border border-dashed border-border bg-white p-10 text-center"><PawPrint className="mx-auto size-8 text-[#ef7658]" /><h2 className="mt-4 text-xl font-black">Bu rayonda gəzdirici tezliklə olacaq</h2><p className="mt-2 text-sm text-muted-foreground">Başqa rayonu yoxla və ya gözləmə siyahısına qoşul.</p></div>}

          <div className="mt-10">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-black tracking-[-0.04em]">Gəzintilərim</h2><span className="text-xs font-bold text-muted-foreground">Son {bookings.length} sorğu</span></div>
            <div className="mt-4 overflow-hidden rounded-[26px] border border-border bg-white">
              {bookings.length ? bookings.map((booking, index) => {
                const dog = dogs.find((item) => item.id === booking.dogId);
                const walker = walkers.find((item) => item.id === booking.walkerId);
                return (
                  <div key={booking.id} className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center ${index ? 'border-t border-border' : ''}`}>
                    <span className="grid size-11 place-items-center rounded-full bg-[#effbd5]"><CalendarDays className="size-5" /></span>
                    <div className="flex-1"><strong className="block text-sm">{dog?.name ?? 'İt'} · {walker?.name ?? 'Gəzdirici'}</strong><span className="mt-1 flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground"><span className="flex items-center gap-1"><Clock3 className="size-3" /> {new Date(booking.scheduledFor).toLocaleDateString('az-AZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span><span>{booking.duration} dəq · {booking.priceManat} ₼</span></span></div>
                    <span className="flex items-center gap-1.5 rounded-full bg-[#fff1dd] px-3 py-1.5 text-xs font-black text-[#8b5a19]"><CheckCircle2 className="size-3.5" /> Sorğu göndərilib</span>
                  </div>
                );
              }) : <div className="p-8 text-center text-sm font-semibold text-muted-foreground">Hələ gəzinti sifariş etməmisən.</div>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
