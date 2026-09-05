import { defaultDog, gezWalkers, priceForDuration, type DogSize, type GezDog, type GezLocale } from './gez-prototype.ts';

export type WalkSnapshot = Readonly<{
  walkerId: string;
  dogName: string;
  dogSize: DogSize;
  treats: boolean;
  day: string;
  time: string;
  duration: number;
  price: number;
}>;

export function toggleComparison(ids: readonly string[], id: string): string[] {
  if (!gezWalkers.some(walker => walker.id === id)) return [...ids];
  if (ids.includes(id)) return ids.filter(value => value !== id);
  return ids.length < 2 ? [...ids, id] : [...ids];
}

export function createWalkSnapshot(input: { walkerId: string; dog: GezDog; day: string; time: string; duration: number }): WalkSnapshot | null {
  const { walkerId, dog, day, time, duration } = input;
  const walker = gezWalkers.find(item => item.id === walkerId);
  if (!walker?.acceptedSizes.includes(dog.size) || !['Today', 'Tomorrow'].includes(day)
    || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) || ![30, 45, 60, 90].includes(duration)) return null;
  return Object.freeze({ walkerId, dogName: dog.name.trim().slice(0, 40) || defaultDog.name, dogSize: dog.size,
    treats: dog.treats, day, time, duration, price: priceForDuration(walker.price45, duration) });
}

export const preparationItems = (treats: boolean) => treats
  ? ['leash', 'water', 'pickup', 'treats'] as const
  : ['leash', 'water', 'pickup'] as const;
export type PreparationItem = ReturnType<typeof preparationItems>[number];

export function getWalkMetrics(duration: number, progress: number) {
  const fraction = Math.max(0, Math.min(100, Number.isFinite(progress) ? progress : 0)) / 100;
  const minutes = Math.round((duration - 3) * fraction);
  return { minutes, distance: (minutes * 2.7 / 42).toFixed(1), steps: Math.round(minutes * 4180 / 42) };
}

export function addMinutesToTime(time: string, minutes: number) {
  const [hours, minute] = time.split(':').map(Number);
  const total = ((hours * 60 + minute + minutes) % 1440 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function walkSessionText(session: WalkSnapshot, locale: GezLocale) {
  const name = gezWalkers.find(walker => walker.id === session.walkerId)!.name.split(' ')[0];
  const dog = session.dogName;
  const text = {
    en: { received: `${name} has received your request.`, liveTitle: `${dog} is out walking.`, reportTitle: `${dog} had a good one.`, bookAgain: `Book ${name} again`, rate: `Rate ${name}`, note: `${name}'s note`, message: `Message ${name}`, withDog: `with ${dog}`, photo: `${dog} stopped in a shady spot for a water break.`, reportNote: `${dog} enjoyed a loop around the neighbourhood and a water break along the way. A relaxed finish, then back home.`, simulated: 'Simulated walk · sample route and photos', home: 'Home', live: 'Live', day: session.day === 'Tomorrow' ? 'Tomorrow' : 'Today' },
    az: { received: `${name} sorğunu aldı.`, liveTitle: `${dog} gəzintidədir.`, reportTitle: `${dog} yaxşı gəzdi.`, bookAgain: `${name} ilə yenidən gəz`, rate: `${name} üçün rəy ver`, note: `${name} — gəzinti qeydi`, message: `${name} ilə yazış`, withDog: `${dog} ilə`, photo: `${dog} kölgədə dayanıb su içdi.`, reportNote: `${dog} məhəllədə gəzdi və yolda su fasiləsi verdi. Sakit gəzintidən sonra evə qayıtdı.`, simulated: 'Demo gəzinti · nümunə marşrut və fotolar', home: 'Evdə', live: 'Canlı', day: session.day === 'Tomorrow' ? 'Sabah' : 'Bu gün' },
    ru: { received: `${name} получил ваш запрос.`, liveTitle: `${dog} на прогулке.`, reportTitle: `${dog} отлично погулял.`, bookAgain: `Снова выбрать ${name}`, rate: `Оценить ${name}`, note: `${name} — заметка`, message: `Написать ${name}`, withDog: `с ${dog}`, photo: `${dog} остановился в тени, чтобы попить воды.`, reportNote: `${dog} погулял по району с перерывом на воду. Спокойно закончили прогулку и вернулись домой.`, simulated: 'Демо-прогулка · пример маршрута и фото', home: 'Дома', live: 'В эфире', day: session.day === 'Tomorrow' ? 'Завтра' : 'Сегодня' },
  };
  return text[locale];
}
