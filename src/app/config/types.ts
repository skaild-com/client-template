export interface SiteConfig {
  id: string;
  business: {
    name: string;
    phone: string;
    email: string;
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
      buttonRadius: "rounded" | "square" | "pill";
      headerStyle: "minimal" | "standard" | "prominent";
      layout: "wide" | "boxed";
    };
  };
  content: {
    hero: {
      title: string;
      subtitle: string;
      cta: {
        primary: string;
        secondary: string;
      };
    };
    services: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    features: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
}
