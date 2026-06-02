import { z } from "zod";

const libraryPathField = z.string().trim().min(1, "Chemin requis");
export const libraryType = z.enum(["movie", "series", "documentary"]);

export const validateLibraryPathInput = z.object({
  path: libraryPathField,
});

export const listDirectoriesInput = z.object({
  path: z.string().trim().default(""), // "" = racine MEDIA_ROOT
});

export const createLibraryInput = z.object({
  name: z.string().trim().min(1, "Nom requis"),
  path: libraryPathField,
  type: libraryType.default("movie"),
});

export const scanLibraryInput = z.object({
  libraryId: z.string().uuid(),
});

export const deleteLibraryInput = scanLibraryInput;

export type ValidateLibraryPathInput = z.infer<typeof validateLibraryPathInput>;
export type ListDirectoriesInput = z.infer<typeof listDirectoriesInput>;
export type CreateLibraryInput = z.infer<typeof createLibraryInput>;
export type ScanLibraryInput = z.infer<typeof scanLibraryInput>;
export type DeleteLibraryInput = z.infer<typeof deleteLibraryInput>;
