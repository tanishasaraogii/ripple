export type Category = 'food' | 'museum' | 'adventure' | 'landmark' | 'show' | 'nature';
export type PriceTier = 'budget' | 'mid' | 'luxury';

export interface Guest {
  id: string;
  guest_name: string;
  city: string;
  experience_name: string;
  experience_category: Category;
  end_time: string;
  price_tier: PriceTier;
  solo_or_group: 'solo' | 'group';
  fire_offset_seconds: number;
}

export interface Recommendation {
  id: string;
  name: string;
  category: Category;
  distance_minutes: number;
  available_slots: number | 'unlimited';
  price: number;
  highlight_line: string;
}

export const GUESTS: Guest[] = [
  { id: '1', guest_name: 'Sarah', city: 'Paris', experience_name: 'Eiffel Tower Skip-the-Line', experience_category: 'landmark', end_time: '3:00pm', price_tier: 'luxury', solo_or_group: 'group', fire_offset_seconds: 8 },
  { id: '2', guest_name: 'James', city: 'Tokyo', experience_name: 'Tokyo Street Food Tour', experience_category: 'food', end_time: '2:30pm', price_tier: 'mid', solo_or_group: 'solo', fire_offset_seconds: 120 },
  { id: '3', guest_name: 'Priya', city: 'Rome', experience_name: 'Colosseum Underground Tour', experience_category: 'museum', end_time: '4:00pm', price_tier: 'mid', solo_or_group: 'group', fire_offset_seconds: 240 },
  { id: '4', guest_name: 'Marco', city: 'Barcelona', experience_name: 'Barcelona Sagrada Familia Tour', experience_category: 'landmark', end_time: '1:45pm', price_tier: 'budget', solo_or_group: 'solo', fire_offset_seconds: 360 },
];

export const CATALOGUE: Record<string, Recommendation[]> = {
  'Paris': [
    { id: 'p1', name: "Musée d'Orsay", category: 'museum', distance_minutes: 8, available_slots: 4, price: 18, highlight_line: "Impressionism's greatest hits, no queue right now" },
    { id: 'p2', name: "Seine River Sunset Cruise", category: 'landmark', distance_minutes: 12, available_slots: 6, price: 24, highlight_line: "Golden hour on the water — this slot sells out by 4pm" },
    { id: 'p3', name: "Montmartre Food Walk", category: 'food', distance_minutes: 15, available_slots: 3, price: 32, highlight_line: "The locals' Paris, not the tourist one" },
  ],
  'Tokyo': [
    { id: 't1', name: "Shibuya Crossing Night Walk", category: 'landmark', distance_minutes: 10, available_slots: 'unlimited', price: 0, highlight_line: "The world's busiest crossing at dusk — free with Headout guide" },
    { id: 't2', name: "Tsukiji Outer Market Snack Tour", category: 'food', distance_minutes: 18, available_slots: 5, price: 28, highlight_line: "Still fresh, still local, still worth it" },
    { id: 't3', name: "teamLab Planets", category: 'show', distance_minutes: 22, available_slots: 2, price: 38, highlight_line: "Digital art you walk through — last 2 slots today" },
  ],
  'Rome': [
    { id: 'r1', name: "Trastevere Food Tour", category: 'food', distance_minutes: 12, available_slots: 4, price: 35, highlight_line: "Rome's most authentic neighbourhood, best eaten not photographed" },
    { id: 'r2', name: "Vatican Museums Fast Track", category: 'museum', distance_minutes: 20, available_slots: 3, price: 45, highlight_line: "The Sistine Chapel without the wait" },
    { id: 'r3', name: "Aperitivo Rooftop Experience", category: 'food', distance_minutes: 8, available_slots: 6, price: 22, highlight_line: "Sunset drinks above the city — opens in 45 mins" },
  ],
  'Barcelona': [
    { id: 'b1', name: "Park Güell Guided Tour", category: 'landmark', distance_minutes: 14, available_slots: 5, price: 20, highlight_line: "Gaudí's fairy-tale park, guided so you actually understand it" },
    { id: 'b2', name: "Gothic Quarter Food Tour", category: 'food', distance_minutes: 6, available_slots: 4, price: 30, highlight_line: "Barcelona's oldest streets, best tapas" },
    { id: 'b3', name: "Barceloneta Sunset Sailing", category: 'adventure', distance_minutes: 25, available_slots: 3, price: 55, highlight_line: "Mediterranean sailing — last boat of the day" },
  ]
};

export function getRecommendation(guest: Guest): Recommendation | null {
  const cityCat = CATALOGUE[guest.city];
  if (!cityCat) return null;

  // Filter: < 20 min, different category
  let candidates = cityCat.filter(c => c.distance_minutes < 20 && c.category !== guest.experience_category);

  if (candidates.length === 0) return null;

  // Weighting
  let weightedCandidates = [...candidates];
  if (guest.solo_or_group === 'solo') {
    const preferred = candidates.filter(c => c.category === 'food' || c.category === 'adventure');
    if (preferred.length > 0) weightedCandidates = preferred;
  } else {
    const preferred = candidates.filter(c => c.category === 'landmark' || c.category === 'show');
    if (preferred.length > 0) weightedCandidates = preferred;
  }

  // Scarcity sort
  weightedCandidates.sort((a, b) => {
    const slotsA = a.available_slots === 'unlimited' ? 9999 : a.available_slots;
    const slotsB = b.available_slots === 'unlimited' ? 9999 : b.available_slots;
    return slotsA - slotsB;
  });

  return weightedCandidates[0];
}
