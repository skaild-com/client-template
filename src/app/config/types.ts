export interface Service {
  title: string;
  description: string;
  imageUrl?: string;
  icon?: string;
}

export interface Feature {
  title: string;
  description: string;
  imageUrl?: string;
  icon?: string;
}

export interface Hero {
  title: string;
  subtitle: string;
  backgroundUrl?: string;
  illustrationUrl?: string;
  cta: {
    primary: string;
    secondary: string;
  };
}

export interface SiteContent {
  hero: Hero;
  services: Service[];
  features: Feature[];
}

export interface SiteConfig {
  id: string;
  business: {
    name: string;
    phone: string;
    email: string;
    businessType: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    hours: {
      weekdays: string;
      weekends: string;
    };
  };
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    style: {
      layout: string;
      buttonRadius: string;
      headerStyle: string;
    };
  };
  content: SiteContent;
}
