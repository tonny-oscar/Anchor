export const WHATSAPP_NUMBER = '254748130017';
export const WHATSAPP_DISPLAY = '0748 130 017';

export function whatsappLink(text = "Hi Anchor team, I'd like to join the community.") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const kenyaHelplines = [
  { name: 'NACADA helpline', number: '1192', note: 'Free, confidential alcohol and drug abuse support' },
  { name: 'Emergency services', number: '999', note: 'Police, ambulance and fire (also 112)' },
  { name: 'Kenya Red Cross', number: '1199', note: 'Free emergency and psychosocial support' },
];

export const postCategories = ['Article', 'Story', 'Tip', 'Guide', 'Family', 'Resource', 'News', 'Event'];

export const coverImages = [
  '/ocean/sunset-waves.jpg',
  '/ocean/calm-horizon.jpg',
  '/ocean/shore-gulls.jpg',
  '/ocean/bright-shore.jpg',
  '/ocean/islands.jpg',
  '/ocean/single-wave.jpg',
  '/ocean/surfer.jpg',
  '/ocean/aerial-shore.jpg',
  '/ocean/underwater.jpg',
  '/ocean/deep-water.jpg',
  '/ocean/dawn-beach.jpg',
];
