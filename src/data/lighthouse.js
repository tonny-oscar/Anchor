export const lighthouseMessages = [
  'The wave always breaks. Stay anchored until it does.',
  "You don't have to see the whole shore. Just the next stroke.",
  'A craving is a visitor, not the captain.',
  'Tides go out. Tides come back. So does hope.',
  'Rest is not giving up. Even ships come into harbor.',
  'You are not your worst day at sea.',
  'Every sunrise over the water is a fresh chart.',
  'Lighthouses exist to be used. So does help.',
  'Slow progress is still moving away from the rocks.',
  'Feel it, name it, and let it drift past.',
  'The wake behind the boat does not steer it.',
  'Small, steady strokes cross oceans.',
  'Today, keeping your head above water is enough.',
  'Storms are loud. They are also temporary.',
  'A smooth sea never made a skilled sailor.',
  'You have survived every hard day so far.',
  'Drop anchor in this moment. Breathe. Stay.',
  'The ocean is patient with the shore. Be patient with yourself.',
];

export function todaysMessage(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - start) / 86400000);
  return lighthouseMessages[dayOfYear % lighthouseMessages.length];
}

export const moods = [
  { value: 'Good', label: 'Calm seas', emoji: '🌤️', color: 'bg-calm-400' },
  { value: 'Okay', label: 'Steady', emoji: '🌊', color: 'bg-serenity-400' },
  { value: 'Low', label: 'Overcast', emoji: '🌫️', color: 'bg-gray-400' },
  { value: 'Cravings', label: 'Stormy', emoji: '⛈️', color: 'bg-gentle-500' },
];

export const moodColors = Object.fromEntries(moods.map(m => [m.value, m.color]));
