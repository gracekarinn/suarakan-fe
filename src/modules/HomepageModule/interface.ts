// modules/homepagemodules/sections/interface.ts

/**
 * Interface untuk hero section.
 * Misalnya, "Suara Anda, Perubahan Nyata"
 */
export interface IHeroSection {
  title: string;
  subtitle: string;
  buttonText: string;
  image: string; // path gambar ilustrasi
}

/**
 * Interface untuk fitur-fitur "Mengapa Suarakan?"
 */
export interface IFeatureCard {
  title: string;
  description: string;
}

/**
 * Interface untuk section "Mengapa SUARAKAN?"
 */
export interface IWhySuarakanSection {
  heading: string;
  description: string;
  features: IFeatureCard[];
}

/**
 * Interface utama yang menampung semua konten homepage
 */
export interface IHomepageContent {
  heroSection: IHeroSection;
  whySuarakanSection: IWhySuarakanSection;
}
