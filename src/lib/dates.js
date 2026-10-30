export function toDayString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDay(day) {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(fromDay, toDay = toDayString()) {
  return Math.max(0, Math.round((parseDay(toDay) - parseDay(fromDay)) / 86400000));
}

export function addDays(day, n) {
  const date = parseDay(day);
  date.setDate(date.getDate() + n);
  return toDayString(date);
}

export function formatDay(day, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  return parseDay(day).toLocaleDateString('en-US', options);
}
