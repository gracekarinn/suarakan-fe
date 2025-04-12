
export interface IHeroSection {
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
}


export interface IFeatureCard {
  title: string;
  description: string;
}

export interface IWhySuarakanSection {
  heading: string;
  description: string;
  features: IFeatureCard[];
}


export interface IHomepageContent {
  heroSection: IHeroSection;
  whySuarakanSection: IWhySuarakanSection;
}
