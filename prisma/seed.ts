// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEPARTMENTS = [
  "Informatique", "Mathématiques", "Physique", "Chimie", "Biologie",
  "Géographie", "Histoire", "Philosophie", "Lettres Modernes", "Sciences Économiques",
];

const SALARY_RANGES = [
  "< 100 000 FCFA",
  "100 000 - 200 000 FCFA",
  "200 000 - 350 000 FCFA",
  "350 000 - 500 000 FCFA",
  "500 000 - 750 000 FCFA",
  "> 750 000 FCFA",
];

const STATUSES = ["EMPLOYE", "ENTREPRENEUR", "EN_RECHERCHE", "ETUDES"] as const;

const TOP_SKILLS = [
  "Analyse de données", "Communication", "Leadership", "Python", "Excel avancé",
  "Gestion de projet", "Comptabilité", "Marketing digital", "Recherche scientifique",
  "Rédaction technique", "Modélisation mathématique", "Enseignement",
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("🌱 Seeding AlumniPath database...");

  // Clear existing data
  await prisma.graduateResponse.deleteMany();

  const responses = Array.from({ length: 80 }).map(() => {
    const dept = rand(DEPARTMENTS);
    const status = rand(STATUSES);

    // Informatique & Sciences Éco = salaires + élevés
    const salaryBoost = ["Informatique", "Sciences Économiques"].includes(dept) ? 1 : 0;
    const salaryIndex = Math.min(
      SALARY_RANGES.length - 1,
      randInt(salaryBoost, 3 + salaryBoost)
    );

    // Informatique = insertion + rapide
    const baseTime = dept === "Informatique" ? randInt(1, 8) : randInt(3, 18);

    return {
      graduationYear: randInt(2018, 2023),
      department: dept,
      status,
      salaryRange: SALARY_RANGES[salaryIndex],
      timeToFirstJob: baseTime,
      topSkill: rand(TOP_SKILLS),
    };
  });

  await prisma.graduateResponse.createMany({ data: responses });

  console.log(`✅ Created ${responses.length} graduate responses`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
