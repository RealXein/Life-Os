export interface IslamicReflection {
  id: string;
  reference: string;
  text: string;
}

export const ISLAMIC_REFLECTIONS: IslamicReflection[] = [
  {
    id: "94-5-6",
    reference: "Qur'an 94:5-6",
    text: "So verily, with the hardship, there is relief. Verily, with the hardship, there is relief.",
  },
  {
    id: "2-286",
    reference: "Qur'an 2:286",
    text: "Allah does not burden a soul beyond that it can bear.",
  },
  {
    id: "65-3",
    reference: "Qur'an 65:3",
    text: "And whoever relies upon Allah, then He is sufficient for him.",
  },
  {
    id: "13-28",
    reference: "Qur'an 13:28",
    text: "Verily, in the remembrance of Allah do hearts find rest.",
  },
  {
    id: "39-53",
    reference: "Qur'an 39:53",
    text: "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins.",
  },
  {
    id: "2-153",
    reference: "Qur'an 2:153",
    text: "Seek help through patience and prayer. Indeed, Allah is with the patient.",
  },
  {
    id: "94-7-8",
    reference: "Qur'an 94:7-8",
    text: "So when you have finished, stand up for worship. And to your Lord direct your longing.",
  },
  {
    id: "3-139",
    reference: "Qur'an 3:139",
    text: "Do not lose heart, nor fall into despair — you shall be the upper hand if you are true believers.",
  },
  {
    id: "2-152",
    reference: "Qur'an 2:152",
    text: "So remember Me, I will remember you, and be grateful to Me, and do not deny Me.",
  },
  {
    id: "16-97",
    reference: "Qur'an 16:97",
    text: "Whoever does righteousness, whether male or female, while being a believer — We will surely cause him to live a good life.",
  },
  {
    id: "47-7",
    reference: "Qur'an 47:7",
    text: "If you support Allah, He will support you and plant your feet firmly.",
  },
  {
    id: "41-30",
    reference: "Qur'an 41:30",
    text: "Indeed, those who say 'Our Lord is Allah' and then remain steadfast — the angels will descend upon them.",
  },
];

export function reflectionForDate(dateStr: string): IslamicReflection {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  return ISLAMIC_REFLECTIONS[hash % ISLAMIC_REFLECTIONS.length];
}
