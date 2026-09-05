import type { GezLocale } from '@/lib/gez-prototype';

export const planningCopy = {
  en: { compare: 'Compare', remove: 'Remove', open: 'Compare walkers', title: 'Two good people. Your choice.', intro: 'See the differences that matter for your dog.', hint: 'Choose up to two walkers to compare.', one: 'Add one more walker', limit: 'Two selected — remove one to try another.', clear: 'Clear', close: 'Close comparison', view: 'View', price: 'Per walk', experience: 'Completed walks', languages: 'Languages', sizes: 'Dog sizes', strengths: 'Good to know', availability: 'Example availability', sample: 'Fictional profiles. Availability is illustrative, not a confirmed time slot.', fit: 'Accepts your dog’s size', noFit: 'Not a size match', prep: 'Ready at the door', optional: 'Optional reminders for you. These checks are not sent to the walker and do not delay the demo.', leash: 'Leash or harness ready', water: 'Water bottle ready', pickup: 'Pickup instructions reviewed', treats: 'Approved treats ready (optional)', ready: 'ready', pause: 'Pause motion', resume: 'Resume motion', error: 'Check the walk time and choose a compatible walker.', rated: 'Your rating is saved for this demo walk.' },
  az: { compare: 'Müqayisə et', remove: 'Çıxar', open: 'Gəzdiriciləri müqayisə et', title: 'İki yaxşı insan. Seçim sənindir.', intro: 'İtin üçün vacib olan fərqlərə bax.', hint: 'Müqayisə üçün iki gəzdiriciyə qədər seç.', one: 'Daha bir gəzdirici seç', limit: 'İki gəzdirici seçilib — başqasını seçmək üçün birini çıxar.', clear: 'Təmizlə', close: 'Müqayisəni bağla', view: 'Profilə bax:', price: 'Gəzinti qiyməti', experience: 'Tamamlanmış gəzintilər', languages: 'Dillər', sizes: 'İt ölçüləri', strengths: 'Bilməyə dəyər', availability: 'Nümunə vaxtlar', sample: 'Profillər uydurmadır. Vaxtlar nümunədir, təsdiqlənmiş görüş deyil.', fit: 'İtinin ölçüsünü qəbul edir', noFit: 'Ölçü uyğun deyil', prep: 'Qapıda hər şey hazırdır?', optional: 'Sənin üçün könüllü xatırlatmalar. İşarələr gəzdiriciyə göndərilmir və demonu gecikdirmir.', leash: 'Xalta və ya qoşqu hazırdır', water: 'Su qabı hazırdır', pickup: 'Götürmə təlimatına baxılıb', treats: 'İcazəli ləzzətlər hazırdır (istəyə bağlı)', ready: 'hazırdır', pause: 'Hərəkəti dayandır', resume: 'Hərəkəti davam etdir', error: 'Vaxtı yoxla və uyğun gəzdirici seç.', rated: 'Rəyin bu demo gəzinti üçün saxlanıldı.' },
  ru: { compare: 'Сравнить', remove: 'Убрать', open: 'Сравнить выгульщиков', title: 'Два хороших человека. Ваш выбор.', intro: 'Сравните то, что важно для вашей собаки.', hint: 'Выберите до двух выгульщиков для сравнения.', one: 'Добавьте ещё одного', limit: 'Выбрано двое — уберите одного, чтобы добавить другого.', clear: 'Очистить', close: 'Закрыть сравнение', view: 'Профиль:', price: 'За прогулку', experience: 'Завершённые прогулки', languages: 'Языки', sizes: 'Размеры собак', strengths: 'Полезно знать', availability: 'Пример расписания', sample: 'Вымышленные профили. Время указано для примера и не подтверждено.', fit: 'Работает с размером вашей собаки', noFit: 'Размер не подходит', prep: 'Всё готово у двери?', optional: 'Необязательные напоминания для вас. Отметки не отправляются выгульщику и не задерживают демо.', leash: 'Поводок или шлейка готовы', water: 'Бутылка воды готова', pickup: 'Инструкции по встрече проверены', treats: 'Разрешённые лакомства готовы (по желанию)', ready: 'готово', pause: 'Приостановить анимацию', resume: 'Продолжить анимацию', error: 'Проверьте время и выберите подходящего выгульщика.', rated: 'Оценка сохранена для этой демо-прогулки.' },
} satisfies Record<GezLocale, Record<string, string>>;

export const dogSizeCopy = {
  en: { small: 'Small', medium: 'Medium', large: 'Large' },
  az: { small: 'Kiçik', medium: 'Orta', large: 'Böyük' },
  ru: { small: 'Маленькие', medium: 'Средние', large: 'Крупные' },
};

export function dogInterfaceCopy(locale: GezLocale, dogName: string) {
  const name = dogName.trim() || 'Milo';
  return {
    en: {
      walkQuestion: `When does ${name} need a walk?`,
      available: `available for ${name}`,
      home: `${name} is home and all good.`,
      lastWalk: `${name}’s last walk ended at 17:12. Water, route and Nigar’s note are saved in Activity.`,
      noMatch: `No compatible walker for ${name} in this district yet. Try All Baku.`,
      nextWalk: `When ${name} needs fresh air, your trusted walkers are here.`,
      formNote: `The details that help a walker understand ${name}.`,
      backToDog: `Back to ${name}`,
    },
    az: {
      walkQuestion: `${name} nə vaxt gəzintiyə çıxmalıdır?`,
      available: `${name} üçün uyğundur`,
      home: `${name} evdədir və hər şey yaxşıdır.`,
      lastWalk: `${name} son gəzintidən saat 17:12-də qayıdıb. Su, marşrut və Nigarın qeydi Fəaliyyət bölməsindədir.`,
      noMatch: `Bu rayonda ${name} üçün uyğun gəzdirici yoxdur. Bütün Bakını yoxla.`,
      nextWalk: `${name} təmiz havaya çıxmaq istəyəndə etibar etdiyin gəzdiricilər buradadır.`,
      formNote: `Gəzdiricinin ${name} haqqında bilməli olduğu detallar.`,
      backToDog: `${name} profilinə qayıt`,
    },
    ru: {
      walkQuestion: `${name}: когда нужна прогулка?`,
      available: `подходят для ${name}`,
      home: `${name} дома, всё хорошо.`,
      lastWalk: `${name} вернулся с прогулки в 17:12. Вода, маршрут и заметка Нигяр сохранены в разделе «Активность».`,
      noMatch: `В этом районе пока нет подходящего человека для ${name}. Выберите весь Баку.`,
      nextWalk: `Когда ${name} понадобится свежий воздух, проверенные выгульщики будут рядом.`,
      formNote: `Детали, которые помогут выгульщику лучше понять ${name}.`,
      backToDog: `Вернуться к ${name}`,
    },
  }[locale];
}
