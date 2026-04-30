# AlumniPath 🎓

> Plateforme de collecte et d'analyse de l'insertion professionnelle des diplômés de l'Université de Yaoundé I.

---

## Stack Technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Langage | TypeScript strict |
| Styling | Tailwind CSS |
| Icônes | Lucide React |
| Graphiques | Recharts |
| Base de données | PostgreSQL via Prisma ORM |
| Validation | Zod + React Hook Form |
| Hébergement | Vercel (recommandé) |

---

## Structure du projet

```
alumnipath/
├── app/
│   ├── api/
│   │   └── responses/
│   │       └── route.ts          # POST (soumission) + GET (agrégation stats)
│   ├── dashboard/
│   │   └── page.tsx              # Page tableau de bord
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Page formulaire (public)
├── components/
│   ├── GraduateForm.tsx          # Formulaire multi-étapes
│   └── Dashboard.tsx             # Dashboard avec 4 graphiques
├── lib/
│   ├── prisma.ts                 # Client Prisma singleton
│   └── validations.ts            # Schémas Zod + constantes
├── prisma/
│   ├── schema.prisma             # Modèle GraduateResponse
│   └── seed.ts                   # 80 entrées de démonstration
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Déploiement en 2 minutes 🚀

### Étape 1 — Configurer la base de données (Supabase)

1. Créer un compte gratuit sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet (choisir la région **Europe West** pour moins de latence depuis Yaoundé)
3. Dans **Project Settings > Database > Connection string**, copier l'URI en mode **URI**
4. Créer un fichier `.env.local` à la racine :

```bash
cp .env.example .env.local
# Éditer .env.local avec votre DATABASE_URL Supabase
```

### Étape 2 — Initialiser la base de données

```bash
# Installer les dépendances
npm install

# Pousser le schéma Prisma vers Supabase
npm run db:push

# (Optionnel) Remplir avec 80 réponses de démo
npm run db:seed
```

### Étape 3 — Déployer sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer (suivre les instructions)
vercel

# Ajouter la variable d'environnement
vercel env add DATABASE_URL
# Coller votre DATABASE_URL Supabase
```

**Ou via l'interface Vercel :**
1. Pousser le code sur GitHub
2. Importer le repo sur [vercel.com/new](https://vercel.com/new)
3. Dans **Settings > Environment Variables**, ajouter `DATABASE_URL`
4. Cliquer **Deploy** ✅

---

## Développement local

```bash
# 1. Cloner & installer
git clone https://github.com/votre-username/alumnipath
cd alumnipath
npm install

# 2. Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local

# 3. Synchroniser le schéma
npm run db:push

# 4. Optionnel : données de démo
npm run db:seed

# 5. Lancer le serveur
npm run dev
# → http://localhost:3000       (formulaire)
# → http://localhost:3000/dashboard  (tableau de bord)
```

---

## API Endpoints

### `POST /api/responses`
Enregistre une réponse de diplômé.

**Body JSON :**
```json
{
  "graduationYear": 2021,
  "department": "Informatique",
  "status": "EMPLOYE",
  "salaryRange": "200 000 - 350 000 FCFA",
  "timeToFirstJob": 4,
  "topSkill": "Analyse de données"
}
```

**Réponse 201 :**
```json
{ "success": true, "id": "uuid-v4" }
```

---

### `GET /api/responses`
Retourne les statistiques agrégées pour le dashboard.

**Réponse 200 :**
```json
{
  "kpis": {
    "total": 80,
    "employmentRate": 68,
    "avgSalary": 285000,
    "employedCount": 54
  },
  "statusDistribution": [...],
  "departmentInsertion": [...],
  "salaryTrends": [...],
  "yearTrends": [...]
}
```

---

## Schéma Prisma

```prisma
model GraduateResponse {
  id             String         @id @default(uuid())
  createdAt      DateTime       @default(now())
  graduationYear Int
  department     String
  status         GraduateStatus
  salaryRange    String
  timeToFirstJob Int            // mois
  topSkill       String

  @@map("graduate_responses")
}

enum GraduateStatus {
  EMPLOYE
  ENTREPRENEUR
  EN_RECHERCHE
  ETUDES
}
```

---

## Fonctionnalités

### Formulaire (/) 
- ✅ Formulaire multi-étapes 3 pages
- ✅ Validation temps réel (Zod + React Hook Form)
- ✅ Aucune soumission vide autorisée
- ✅ Feedback visuel sur la progression
- ✅ Page de confirmation après soumission

### Dashboard (/dashboard)
- ✅ 4 KPIs dynamiques (total répondants, taux d'emploi, salaire moyen, délai moyen)
- ✅ BarChart : délai d'insertion moyen par filière
- ✅ PieChart : répartition des statuts professionnels (donut)
- ✅ AreaChart : tendance d'insertion par année de promotion
- ✅ Barres horizontales : distribution des salaires
- ✅ Skeletons pendant le chargement
- ✅ Bouton d'actualisation manuel

---

## Licence

MIT — Université de Yaoundé I, 2024
