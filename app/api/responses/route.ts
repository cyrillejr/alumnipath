// app/api/responses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { graduateResponseSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = graduateResponseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const response = await prisma.graduateResponse.create({
      data: parsed.data,
    });

    return NextResponse.json(
      { success: true, id: response.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/responses error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [total, employedCount, statusGroups, departmentGroups, salaryGroups, yearGroups] =
      await Promise.all([
        prisma.graduateResponse.count(),
        prisma.graduateResponse.count({
          where: { status: { in: ["EMPLOYE", "ENTREPRENEUR"] } },
        }),
        prisma.graduateResponse.groupBy({
          by: ["status"],
          _count: { status: true },
        }),
        prisma.graduateResponse.groupBy({
          by: ["department"],
          _avg: { timeToFirstJob: true },
          _count: { department: true },
          orderBy: { _avg: { timeToFirstJob: "asc" } },
        }),
        prisma.graduateResponse.groupBy({
          by: ["salaryRange"],
          _count: { salaryRange: true },
          orderBy: { salaryRange: "asc" },
        }),
        prisma.graduateResponse.groupBy({
          by: ["graduationYear"],
          _avg: { timeToFirstJob: true },
          _count: { graduationYear: true },
          orderBy: { graduationYear: "asc" },
        }),
      ]);

    const employmentRate = total > 0 ? Math.round((employedCount / total) * 100) : 0;

    // Calcul du salaire médian approximatif
    const SALARY_MIDPOINTS: Record<string, number> = {
      "< 100 000 FCFA": 75000,
      "100 000 - 200 000 FCFA": 150000,
      "200 000 - 350 000 FCFA": 275000,
      "350 000 - 500 000 FCFA": 425000,
      "500 000 - 750 000 FCFA": 625000,
      "> 750 000 FCFA": 900000,
    };

    let weightedSalarySum = 0;
    let totalSalaryCount = 0;
    salaryGroups.forEach((g) => {
      const mid = SALARY_MIDPOINTS[g.salaryRange] ?? 0;
      weightedSalarySum += mid * g._count.salaryRange;
      totalSalaryCount += g._count.salaryRange;
    });
    const avgSalary = totalSalaryCount > 0
      ? Math.round(weightedSalarySum / totalSalaryCount)
      : 0;

    return NextResponse.json({
      kpis: {
        total,
        employmentRate,
        avgSalary,
        employedCount,
      },
      statusDistribution: statusGroups.map((g) => ({
        status: g.status,
        count: g._count.status,
      })),
      departmentInsertion: departmentGroups.map((g) => ({
        department: g.department,
        avgMonths: Math.round(g._avg.timeToFirstJob ?? 0),
        count: g._count.department,
      })),
      salaryTrends: salaryGroups.map((g) => ({
        range: g.salaryRange,
        count: g._count.salaryRange,
      })),
      yearTrends: yearGroups.map((g) => ({
        year: g.graduationYear,
        avgMonths: Math.round(g._avg.timeToFirstJob ?? 0),
        count: g._count.graduationYear,
      })),
    });
  } catch (error) {
    console.error("GET /api/responses error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
