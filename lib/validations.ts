// lib/validations.ts
import { z } from "zod";

export const graduateResponseSchema = z.object({
  graduationYear: z
    .number({ required_error: "L'année de diplôme est requise" })
    .int()
    .min(2000, "Année invalide")
    .max(new Date().getFullYear(), "Année invalide"),
  department: z
    .string({ required_error: "La filière est requise" })
    .min(1, "Veuillez sélectionner une filière"),
  status: z.enum(["EMPLOYE", "ENTREPRENEUR", "EN_RECHERCHE", "ETUDES"], {
    required_error: "Le statut professionnel est requis",
  }),
  salaryRange: z
    .string({ required_error: "La tranche salariale est requise" })
    .min(1, "Veuillez sélectionner une tranche salariale"),
  timeToFirstJob: z
    .number({ required_error: "Le délai d'insertion est requis" })
    .int()
    .min(0, "Valeur invalide")
    .max(120, "Valeur invalide"),
  topSkill: z
    .string({ required_error: "La compétence principale est requise" })
    .min(2, "Compétence trop courte")
    .max(100, "Compétence trop longue"),
});

export type GraduateResponseInput = z.infer<typeof graduateResponseSchema>;

export const DEPARTMENTS = [
  "Informatique",
  "Mathématiques",
  "Physique",
  "Chimie",
  "Biologie",
  "Géographie",
  "Histoire",
  "Philosophie",
  "Lettres Modernes",
  "Sciences Économiques",
] as const;

export const SALARY_RANGES = [
  "< 100 000 FCFA",
  "100 000 - 200 000 FCFA",
  "200 000 - 350 000 FCFA",
  "350 000 - 500 000 FCFA",
  "500 000 - 750 000 FCFA",
  "> 750 000 FCFA",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  EMPLOYE: "Employé(e)",
  ENTREPRENEUR: "Entrepreneur(e)",
  EN_RECHERCHE: "En recherche d'emploi",
  ETUDES: "Poursuite d'études",
};
