export const colorMeta = {
  blue: {
    name: "Blue",
    hex: "#007bff",
    moods: [
      { mood: "serene", emoji: "🌌" },
      { mood: "trustworthy", emoji: "🤝" },
      { mood: "introspective", emoji: "💭" },
    ],
    searchTerm: "blue minimal aesthetic",
  },
  green: {
    name: "Green",
    hex: "#00ff00",
    moods: [
      { mood: "natural", emoji: "🌿" },
      { mood: "grounded", emoji: "🌱" },
      { mood: "balanced", emoji: "⚖️" },
    ],
    searchTerm: "green earth tones",
  },
  yellow: {
    name: "Yellow",
    hex: "#ffeb3b",
    moods: [
      { mood: "happy", emoji: "😄" },
      { mood: "bright", emoji: "🌟" },
      { mood: "energetic", emoji: "⚡" },
    ],
    searchTerm: "yellow cheerful design",
  },
  orange: {
    name: "Orange",
    hex: "#ff7f00",
    moods: [
      { mood: "enthusiastic", emoji: "🤩" },
      { mood: "sunny", emoji: "🌞" },
      { mood: "vibrant", emoji: "🎉" },
    ],
    searchTerm: "orange creative energy",
  },

  red: {
    name: "Red",
    hex: "#ff0000",
    moods: [
      { mood: "passionate", emoji: "❤️" },
      { mood: "energetic", emoji: "🔥" },
      { mood: "bold", emoji: "💪" },
    ],
    searchTerm: "red power aesthetic",
  },
  pink: {
    name: "Pink",
    hex: "#ff69b4",
    moods: [
      { mood: "playful", emoji: "🧁" },
      { mood: "romantic", emoji: "💖" },
      { mood: "soft", emoji: "🌸" },
    ],
    searchTerm: "pink dreamy tones",
  },
  purple: {
    name: "Purple",
    hex: "#a020f0",
    moods: [
      { mood: "mystical", emoji: "🔮" },
      { mood: "royal", emoji: "👑" },
      { mood: "creative", emoji: "🎨" },
    ],
    searchTerm: "purple abstract art",
  },

  white: {
    name: "White",
    hex: "#ffffff",
    moods: [
      { mood: "pure", emoji: "🤍" },
      { mood: "peaceful", emoji: "🕊️" },
      { mood: "clean", emoji: "🧼" },
    ],
    searchTerm: "white minimal calm",
  },
};

export const gradientColors = Object.values(colorMeta)
  .map((c) => c.hex)
  .join(", ");
