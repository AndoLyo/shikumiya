export interface SiteData {
  artistName: string;
  catchcopy: string;
  subtitle: string;
  bio: string;
  motto: string;
  email: string;
  snsX?: string;
  snsInstagram?: string;
  snsPixiv?: string;
  snsNote?: string;
  snsOther?: string;
  works: { src: string; title: string }[];
  heroImage?: string;
  profileImage?: string;
  colorPrimary?: string;
  colorAccent?: string;
  colorBackground?: string;
  skills?: string[];
  stats?: string[];
  tools?: string[];
}

export const defaultSiteData: SiteData = {
  artistName: "Your Name",
  catchcopy: "",
  subtitle: "Artist",
  bio: "",
  motto: "",
  email: "hello@example.com",
  works: [],
};
