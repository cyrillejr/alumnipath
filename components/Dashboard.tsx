// components/Dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from "recharts";
import {
  Users, TrendingUp, Clock, Banknote,
  GraduationCap, RefreshCw,
} from "lucide-react";
import { STATUS_LABELS } from "@/lib/validations";

interface DashboardData {
  kpis: {
    total: number;
    employmentRate: number;
    avgSalary: number;
    employedCount: number;
  };
  statusDistribution: { status: string; count: number }[];
  departmentInsertion: { department: string; avgMonths: number; count: number }[];
  salaryTrends: { range: string; count: number }[];
  yearTrends: { year: number; avgMonths: number; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  EMPLOYE: "#1d4ed8",
  ENTREPRENEUR: "#059669",
  EN_RECHERCHE: "#f59e0b",
  ETUDES: "#7c3aed",
};

const PIE_COLORS = ["#1d4ed8", "#059669", "#f59e0b", "#7c3aed"];

function KPISkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-slate-100 rounded-lg" />
        <div className="w-16 h-4 bg-slate-100 rounded" />
      </div>
      <div className="w-20 h-7 bg-slate-100 rounded mb-2" />
      <div className="w-32 h-4 bg-slate-100 rounded" />
    </div>
  );
}

function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6">
      <div className="w-48 h-5 bg-slate-100 rounded animate-pulse mb-6" />
      <div
        className="w-full bg-slate-50 rounded-lg animate-pulse"
        style={{ height }}
      />
    </div>
  );
}

function formatSalary(amount: number): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M FCFA`;
  if (amount >= 1000) return `${Math.round(amount / 1000)}K FCFA`;
  return `${amount} FCFA`;
}

const CustomTooltipBar = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-slate-800 mb-1">{label}</p>
        <p className="text-blue-700">{payload[0].value} mois en moyenne</p>
      </div>
    );
  }
  return null;
};

const CustomTooltipArea = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-slate-800 mb-1">Promo {label}</p>
        <p className="text-emerald-600">{payload[0].value} mois</p>
        <p className="text-slate-500">{payload[1]?.value} répondants</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/responses");
      if (!res.ok) throw new Error("Erreur de chargement");
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date());
    } catch {
      setError("Impossible de charger les données. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const kpiCards = data
    ? [
        {
          label: "Diplômés répondants",
          value: data.kpis.total.toString(),
          sub: "total de réponses collectées",
          icon: Users,
          color: "text-blue-700",
          bg: "bg-blue-50",
        },
        {
          label: "Taux d'emploi global",
          value: `${data.kpis.employmentRate}%`,
          sub: `${data.kpis.employedCount} employés ou entrepreneurs`,
          icon: TrendingUp,
          color: "text-emerald-700",
          bg: "bg-emerald-50",
        },
        {
          label: "Salaire moyen",
          value: formatSalary(data.kpis.avgSalary),
          sub: "revenu mensuel estimé",
          icon: Banknote,
          color: "text-indigo-700",
          bg: "bg-indigo-50",
        },
        {
          label: "Délai d'insertion",
          value: data.departmentInsertion.length
            ? `${Math.round(data.departmentInsertion.reduce((a, d) => a + d.avgMonths, 0) / data.departmentInsertion.length)} mois`
            : "—",
          sub: "délai moyen toutes filières",
          icon: Clock,
          color: "text-amber-700",
          bg: "bg-amber-50",
        },
      ]
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-800 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">AlumniPath</h1>
              <p className="text-xs text-slate-500">Université de Yaoundé I — Tableau de bord</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">
              Mis à jour à {lastRefresh.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </button>
            <a
              href="/"
              className="px-4 py-1.5 bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors"
            >
              + Répondre
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <KPISkeleton key={i} />)
            : kpiCards?.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={kpi.label}
                    className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${kpi.color}`} />
                      </div>
                    </div>
                    <p className={`text-2xl font-bold ${kpi.color} mb-1`}>{kpi.value}</p>
                    <p className="text-xs font-semibold text-slate-700">{kpi.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
                  </div>
                );
              })}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar chart: Délai par filière */}
          {loading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <h3 className="font-semibold text-slate-800 mb-1">Délai d'insertion par filière</h3>
              <p className="text-xs text-slate-400 mb-6">Nombre de mois moyen avant le premier emploi</p>
              {data?.departmentInsertion.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.departmentInsertion} margin={{ top: 5, right: 5, bottom: 60, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="department"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      angle={-35}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit=" mois" width={55} />
                    <Tooltip content={<CustomTooltipBar />} />
                    <Bar dataKey="avgMonths" fill="#1d4ed8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-72 flex items-center justify-center text-slate-400 text-sm">
                  Pas encore de données
                </div>
              )}
            </div>
          )}

          {/* Pie chart: Statuts */}
          {loading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <h3 className="font-semibold text-slate-800 mb-1">Répartition des statuts professionnels</h3>
              <p className="text-xs text-slate-400 mb-6">Distribution des diplômés par situation actuelle</p>
              {data?.statusDistribution.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.statusDistribution}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={55}
                      paddingAngle={3}
                      label={({ status, percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {data.statusDistribution.map((entry, index) => (
                        <Cell
                          key={entry.status}
                          fill={STATUS_COLORS[entry.status] ?? PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [value, STATUS_LABELS[name as string] ?? name]}
                    />
                    <Legend
                      formatter={(value) => STATUS_LABELS[value] ?? value}
                      iconType="circle"
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-72 flex items-center justify-center text-slate-400 text-sm">
                  Pas encore de données
                </div>
              )}
            </div>
          )}
        </div>

        {/* Area chart: Tendances par année de diplôme */}
        {loading ? (
          <ChartSkeleton height={250} />
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-800 mb-1">Tendance d'insertion par promotion</h3>
            <p className="text-xs text-slate-400 mb-6">Évolution du délai moyen d'insertion selon l'année de diplôme</p>
            {data?.yearTrends.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data.yearTrends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorMonths" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip content={<CustomTooltipArea />} />
                  <Area
                    type="monotone"
                    dataKey="avgMonths"
                    stroke="#059669"
                    strokeWidth={2}
                    fill="url(#colorMonths)"
                    name="Délai moyen (mois)"
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#1d4ed8"
                    strokeWidth={2}
                    fill="url(#colorCount)"
                    name="Répondants"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-56 flex items-center justify-center text-slate-400 text-sm">
                Pas encore de données
              </div>
            )}
          </div>
        )}

        {/* Salary distribution */}
        {!loading && data && data.salaryTrends.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-800 mb-1">Répartition des tranches salariales</h3>
            <p className="text-xs text-slate-400 mb-6">Nombre de diplômés par tranche de revenu mensuel</p>
            <div className="space-y-3">
              {data.salaryTrends.map((item) => {
                const pct = data.kpis.total > 0 ? (item.count / data.kpis.total) * 100 : 0;
                return (
                  <div key={item.range} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-44 flex-shrink-0">{item.range}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-700 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-700 w-12 text-right">
                      {item.count} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <footer className="text-center text-xs text-slate-400 pb-4">
          AlumniPath · Université de Yaoundé I · Données anonymisées et agrégées
        </footer>
      </main>
    </div>
  );
}
