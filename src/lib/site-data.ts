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
  location?: string;
  artStyle?: string;
}

export function buildSnsLinks(data: SiteData): { label: string; handle: string; href: string }[] {
  const links: { label: string; handle: string; href: string }[] = [];
  if (data.snsX) links.push({ label: "X / Twitter", handle: data.snsX, href: data.snsX.startsWith("http") ? data.snsX : `https://x.com/${data.snsX.replace("@", "")}` });
  if (data.snsInstagram) links.push({ label: "Instagram", handle: data.snsInstagram, href: data.snsInstagram.startsWith("http") ? data.snsInstagram : `https://instagram.com/${data.snsInstagram.replace("@", "")}` });
  if (data.snsPixiv) links.push({ label: "Pixiv", handle: data.snsPixiv, href: data.snsPixiv.startsWith("http") ? data.snsPixiv : `https://pixiv.net/users/${data.snsPixiv}` });
  if (data.snsNote) links.push({ label: "note", handle: data.snsNote, href: data.snsNote.startsWith("http") ? data.snsNote : `https://note.com/${data.snsNote}` });
  if (data.snsOther) links.push({ label: "Other", handle: data.snsOther, href: data.snsOther.startsWith("http") ? data.snsOther : "#" });
  return links;
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
