import { FileVideo2, Film, Tv } from "lucide-react";

export const LIBRARY_TYPE_LABELS = {
  movie: "Films",
  series: "Séries",
  documentary: "Documentaires",
} as const;

export const LIBRARY_TYPES = [
  {
    value: "movie",
    label: LIBRARY_TYPE_LABELS.movie,
    example: "Exemple : Drive (2011)",
    icon: Film,
  },
  {
    value: "series",
    label: LIBRARY_TYPE_LABELS.series,
    example: "Exemple : Severance / Saison 01",
    icon: Tv,
  },
  {
    value: "documentary",
    label: LIBRARY_TYPE_LABELS.documentary,
    example: "Exemple : Planète Terre",
    icon: FileVideo2,
  },
] as const;
