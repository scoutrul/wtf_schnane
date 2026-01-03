
import { Difficulty, WordInstrument } from './types';

export const BPM = 96;
export const BEAT_DURATION = 60000 / BPM; 
export const SUBDIVISION = 8; 

export const WORDS: (WordInstrument & { color: string })[] = [
  { id: 'pepe', text: 'пэпэ', syllables: 2, rhythm: '2×1/8', character: 'BASE VIBE', price: 0, pitch: 440, color: '#D4AF37' }, 
  { id: 'rich', text: 'легушонок на богатом', syllables: 4, rhythm: '4×1/16', character: 'RICH PEPE', price: 5000, pitch: 350, color: '#32CD32' },
  { id: 'shnell', text: 'шнель бро', syllables: 2, rhythm: '2×1/8', character: 'QUICK CASH', price: 25000, pitch: 500, color: '#FFD700' },
  { id: 'wtfa', text: 'ватафа?', syllables: 3, rhythm: '3×1/16', character: 'WTF PROFIT', price: 100000, pitch: 660, color: '#FF1493' }, 
  { id: 'money', text: 'любит деньги', syllables: 3, rhythm: '3×1/16', character: 'MONEY LOVER', price: 500000, pitch: 200, color: '#FFFFFF' },
  { id: 'shneine', text: 'коко шнейне', syllables: 2, rhythm: '2×1/8', character: 'HIGH FASHION', price: 2500000, pitch: 220, color: '#1E90FF' }, 
  { id: 'babki', text: 'БАБКИ КЭШ', syllables: 2, rhythm: '2×1/4', character: 'PURE PROFIT', price: 10000000, pitch: 110, color: '#00FA9A' },
  { id: 'papa', text: 'ПАПОЧКА ПЭПА', syllables: 4, rhythm: '4×1/8', character: 'GODFATHER', price: 100000000, pitch: 400, color: '#FF4500' },
];

export const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: { stanzas: 2, factor: 1.0, label: 'LITTLE INVESTOR', price: 0 },
  [Difficulty.MEDIUM]: { stanzas: 6, factor: 10.0, label: 'CRYPTO WHALE', price: 100000 },
  [Difficulty.HARD]: { stanzas: 100, factor: 100.0, label: 'GALAXY EMPEROR', price: 10000000 },
};

export const POEM_LUKOMORYE = [
  "У лукоморья дуб зелёный;",
  "Златая цепь на дубе том:",
  "И днём и ночью кот учёный",
  "Всё ходит по цепи кругом;",
  "Идёт направо — песнь заводит,",
  "Налево — сказку говорит.",
  "Там чудеса: там леший бродит,",
  "Русалка на ветвях сидит;",
  "Там на неведомых дорожках",
  "Следы невиданных зверей;",
  "Избушка там на курьих ножках",
  "Стоит без окон, без дверей;",
  "Там лес и дол видений полны;",
  "Там о заре прихлынут волны",
  "На брег песчаный и пустой,",
  "И тридцать витязей прекрасных",
  "Чредой из вод выходят ясных,",
  "И с ними дядька их морской;",
  "Там королевич мимоходом",
  "Пленяет грозного царя;",
  "Там в облаках перед народом",
  "Через леса, через моря",
  "Колдун несёт богатыря;",
  "В темнице там царевна тужит,",
  "А бурый волк ей верно служит;",
  "Там ступа с Бабою Ягой",
  "Идёт, бредёт сама собой;",
  "Там царь Кащей над златом чахнет;",
  "Там русский дух... там Русью пахнет!",
  "И там я был, и мёд я пил;",
  "У моря видел дуб зелёный;",
  "Под ним сидел, и кот учёный",
  "Свои мне сказки говорил."
];
