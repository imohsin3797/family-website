import fs from "fs";
import path from "path";
import FamilyGallery from "./components/FamilyGallery";
import {
  featuredDescriptions,
  featuredTitles,
  galleryCopy,
  sectionDefinitions,
} from "./content/galleryContent";

export type GallerySection =
  | { type: "hero"; photos: string[] }
  | { type: "divider"; title: string; subtitle?: string }
  | { type: "featured"; photo: string; title: string; description: string }
  | {
      type: "content";
      id: string;
      title: string;
      subtitle: string;
      chapterName: string;
      description: string;
      photos: string[];
      photoFit?: "cover" | "contain";
    }
  | { type: "closing"; photos: string[] }
  | { type: "finalNote"; title: string; subtitle?: string };

function getPhotos(folder: string): string[] {
  const dir = path.join(process.cwd(), "public", folder);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => /\.(jpe?g|png|gif|webp)$/i.test(file))
    .sort()
    .map((file) => `/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`);
}

function isLabeled(encodedPath: string): boolean {
  const name = decodeURIComponent(encodedPath.split("/").pop() || "");
  return !name.startsWith("Image") && !name.startsWith("Screenshot") && !name.startsWith(".");
}

function toTitle(encodedPath: string): string {
  return decodeURIComponent(encodedPath.split("/").pop() || "")
    .replace(/\.\w+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeLookupKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function descKey(encodedPath: string): string {
  return normalizeLookupKey(
    decodeURIComponent(encodedPath.split("/").pop() || "")
      .replace(/\.\w+$/, ""),
  );
}

function getDesc(encodedPath: string, folder: string): string {
  const key = descKey(encodedPath);
  if (featuredDescriptions[key]) return featuredDescriptions[key];

  const title = toTitle(encodedPath);
  const context = folder.match(/^\d{4}/) ? `our ${folder} chapter` : folder;
  return `A moment from ${context} that speaks for itself. ${title} - the kind of memory that brings a smile every time you look back.`;
}

function getFeaturedTitle(encodedPath: string): string {
  const key = descKey(encodedPath);
  if (featuredTitles[key]) return featuredTitles[key];
  return toTitle(encodedPath);
}

export default function Home() {
  let heroPhotos = getPhotos("Intro");
  const closingPhotos = getPhotos("Last");
  const sections: GallerySection[] = [];

  if (heroPhotos.length < 2) {
    const fallback = sectionDefinitions.flatMap((section) => getPhotos(section.folder)).slice(0, 4);
    heroPhotos = [...heroPhotos, ...fallback].slice(0, 4);
  }

  sections.push({ type: "hero", photos: heroPhotos });

  let insertedDivider = false;

  for (const section of sectionDefinitions) {
    const allPhotos = getPhotos(section.folder);
    if (allPhotos.length === 0) continue;

    const labeledPhotos = allPhotos.filter(isLabeled);
    const collagePhotos = allPhotos.filter((photo) => !isLabeled(photo));

    if (section.chapterLabel === "Milestones" && !insertedDivider) {
      insertedDivider = true;
      sections.push({
        type: "divider",
        title: galleryCopy.divider.title,
        subtitle: galleryCopy.divider.subtitle,
      });
    }

    if (collagePhotos.length > 0) {
      sections.push({
        type: "content",
        id: section.folder.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase(),
        title: section.title,
        subtitle: section.subtitle,
        chapterName: section.chapterLabel,
        description: section.description,
        photos: collagePhotos,
        photoFit: section.folder === "2011" ? "contain" : "cover",
      });
    }

    for (const photo of labeledPhotos) {
      sections.push({
        type: "featured",
        photo,
        title: getFeaturedTitle(photo),
        description: getDesc(photo, section.folder),
      });
    }
  }

  if (closingPhotos.length > 0) {
    sections.push({ type: "closing", photos: closingPhotos });
  }

  sections.push({
    type: "finalNote",
    title: galleryCopy.finalNote.title,
    subtitle: galleryCopy.finalNote.description,
  });

  return <FamilyGallery sections={sections} />;
}
