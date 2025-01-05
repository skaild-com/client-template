interface Service {
  title: string;
  description: string;
  imageUrl?: string;
  icon?: string;
}

interface Feature {
  title: string;
  description: string;
  imageUrl?: string;
  icon?: string;
}

interface Hero {
  title: string;
  subtitle: string;
  cta: {
    primary: string;
    secondary: string;
  };
}

export interface GeneratedContent {
  hero: Hero;
  services: Service[];
  features: Feature[];
}

export type { Service, Feature, Hero };
