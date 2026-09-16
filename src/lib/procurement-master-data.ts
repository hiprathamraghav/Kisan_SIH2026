export type LocationState = {
  state: string;
  districts: {
    district: string;
    tehsils: {
      tehsil: string;
      villages: string[];
    }[];
  }[];
};

export const locationHierarchy: LocationState[] = [
  {
    state: "Uttar Pradesh",
    districts: [
      {
        district: "Meerut",
        tehsils: [
          { tehsil: "Daurala", villages: ["Sardhana", "Pallavpuram", "Daurala", "Lawar"] },
          { tehsil: "Mawana", villages: ["Mawana", "Bahsuma", "Phalauda", "Kila Parikshitgarh"] },
        ],
      },
      {
        district: "Muzaffarnagar",
        tehsils: [
          { tehsil: "Khatauli", villages: ["Khatauli", "Jansath", "Mansurpur"] },
          { tehsil: "Budhana", villages: ["Budhana", "Shahpur", "Sisauli"] },
        ],
      },
    ],
  },
  {
    state: "Delhi",
    districts: [
      {
        district: "New Delhi",
        tehsils: [
          { tehsil: "Chanakyapuri", villages: ["Samalkha", "Bijwasan", "Mahipalpur"] },
          { tehsil: "Vasant Vihar", villages: ["Munirka", "Kapashera", "Rangpuri"] },
        ],
      },
      {
        district: "North West Delhi",
        tehsils: [
          { tehsil: "Narela", villages: ["Narela", "Bawana", "Alipur"] },
          { tehsil: "Rohini", villages: ["Rithala", "Kanjhawala", "Begumpur"] },
        ],
      },
    ],
  },
  {
    state: "Punjab",
    districts: [
      {
        district: "Ludhiana",
        tehsils: [
          { tehsil: "Ludhiana East", villages: ["Sahnewal", "Koom Kalan", "Dhandari"] },
          { tehsil: "Jagraon", villages: ["Jagraon", "Sidhwan Bet", "Hathur"] },
        ],
      },
      {
        district: "Patiala",
        tehsils: [
          { tehsil: "Rajpura", villages: ["Rajpura", "Shambhu", "Ghanaur"] },
          { tehsil: "Nabha", villages: ["Nabha", "Bhadson", "Duladdi"] },
        ],
      },
    ],
  },
  {
    state: "Haryana",
    districts: [
      {
        district: "Karnal",
        tehsils: [
          { tehsil: "Karnal", villages: ["Taraori", "Nilokheri", "Gharaunda"] },
          { tehsil: "Assandh", villages: ["Assandh", "Jalmana", "Ballah"] },
        ],
      },
      {
        district: "Hisar",
        tehsils: [
          { tehsil: "Hisar", villages: ["Adampur", "Barwala", "Mangali"] },
          { tehsil: "Hansi", villages: ["Hansi", "Narnaund", "Sisai"] },
        ],
      },
    ],
  },
];

export const cropMaster = [
  "Rice / Paddy",
  "Wheat",
  "Maize",
  "Jowar",
  "Bajra",
  "Ragi",
  "Barley",
  "Oats",
  "Chickpea / Gram",
  "Tur / Arhar",
  "Moong",
  "Urad",
  "Masoor",
  "Peas",
  "Mustard",
  "Groundnut",
  "Soybean",
  "Sunflower",
  "Sesame",
  "Safflower",
  "Linseed",
  "Cotton",
  "Sugarcane",
  "Jute",
  "Tobacco",
  "Potato",
  "Onion",
  "Tomato",
  "Cauliflower",
  "Cabbage",
  "Brinjal",
  "Okra",
  "Green Chilli",
  "Garlic",
  "Ginger",
  "Mango",
  "Banana",
  "Apple",
  "Orange",
  "Guava",
  "Grapes",
  "Pomegranate",
  "Papaya",
  "Litchi",
  "Turmeric",
  "Coriander",
  "Cumin",
  "Fenugreek",
  "Tea",
  "Coffee",
  "Coconut",
];

export function calculateProcessingMinutes(totalQuantity: number) {
  return Math.ceil((30 + totalQuantity * 4) * 1.05);
}

export function isValidLocation(state: string, district: string, tehsil: string, village: string) {
  return Boolean(
    locationHierarchy
      .find((item) => item.state === state)
      ?.districts.find((item) => item.district === district)
      ?.tehsils.find((item) => item.tehsil === tehsil)
      ?.villages.includes(village),
  );
}

export function parseSlotLabel(label: string, dateLabel: string) {
  const [start] = label.split(" - ");
  const date = new Date(`${dateLabel} ${start}`);
  return Number.isNaN(date.getTime()) ? null : date;
}
