const launchPhotos: Record<string, { src: string; alt: string }> = {
  "home": {
    "src": "/media/hero.webp",
    "alt": "Illustrative Cantonese seafood and Macau congee on a warmly lit dining table"
  },
  "dafu-seafood": {
    "src": "/media/seafood.webp",
    "alt": "Illustration of wok-tossed crab with ginger and scallions"
  },
  "dafu-congee": {
    "src": "/media/congee.webp",
    "alt": "Illustration of Macau-style crab congee with spring onions"
  },
  "dafu-sing-bar": {
    "src": "/media/sing-bar.webp",
    "alt": "Concept illustration of a Hong Kong-inspired singing bar"
  }
};

export function launchPhoto(slug?: string) {
  return slug ? launchPhotos[slug] : undefined;
}
