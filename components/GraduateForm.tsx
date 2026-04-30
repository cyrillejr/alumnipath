// components/GraduateForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  graduateResponseSchema,
  GraduateResponseInput,
  DEPARTMENTS,
  SALARY_RANGES,
  STATUS_LABELS,
} from "@/lib/validations";
import {
  GraduationCap,
  Briefcase,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Star,
} from "lucide-react";

const STEPS = [
  { title: "Formation", icon: GraduationCap, desc: "Votre parcours académique" },
  { title: "Situation", icon: Briefcase, desc: "Votre statut professionnel" },
  { title: "Carrière", icon: TrendingUp, desc: "Vos données d'insertion" },
];

export default function GraduateForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<GraduateResponseInput>({
    resolver: zodResolver(graduateResponseSchema),
    mode: "onChange",
    defaultValues: {
      graduationYear: undefined,
      department: "",
      status: undefined,
      salaryRange: "",
      timeToFirstJob: undefined,
      topSkill: "",
    },
  });

  const stepFields: (keyof GraduateResponseInput)[][] = [
    ["graduationYear", "department"],
    ["status"],
    ["salaryRange", "timeToFirstJob", "topSkill"],
  ];

  const handleNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (data: GraduateResponseInput) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setSubmitted(true);
    } catch {
      setServerError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Merci pour votre contribution !</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Vos données enrichissent l'analyse de l'insertion des diplômés de l'Université de Yaoundé I.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSubmitted(false); setStep(0); }}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              Nouvelle réponse
            </button>
            <a
              href="/dashboard"
              className="px-5 py-2.5 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium"
            >
              Voir le tableau de bord
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-800 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <GraduationCap className="w-4 h-4" />
            Université de Yaoundé I
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AlumniPath</h1>
          <p className="text-slate-500">Enquête sur l'insertion professionnelle des diplômés</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isDone
                        ? "bg-emerald-500 text-white"
                        : isActive
                        ? "bg-blue-800 text-white ring-4 ring-blue-100"
                        : "bg-white border-2 border-slate-200 text-slate-400"
                    }`}
                  >
                    {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${isActive ? "text-blue-800" : "text-slate-400"}`}>
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 w-16 sm:w-24 mx-2 transition-all duration-500 ${i < step ? "bg-emerald-400" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-800">{STEPS[step].title}</h2>
            <p className="text-slate-500 text-sm mt-1">{STEPS[step].desc}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Step 0: Formation */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Année d'obtention du diplôme <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("graduationYear", { valueAsNumber: true })}
                    placeholder="Ex : 2021"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                      errors.graduationYear
                        ? "border-red-300 bg-red-50 focus:ring-red-200"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    } focus:outline-none focus:ring-2`}
                  />
                  {errors.graduationYear && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.graduationYear.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Filière / Département <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("department")}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors bg-white ${
                      errors.department
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    } focus:outline-none focus:ring-2`}
                  >
                    <option value="">Sélectionner une filière...</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.department.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Situation */}
            {step === 1 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Votre situation actuelle <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.entries(STATUS_LABELS) as [string, string][]).map(([value, label]) => {
                    const currentStatus = watch("status");
                    const isSelected = currentStatus === value;
                    return (
                      <label
                        key={value}
                        className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          {...register("status")}
                          value={value}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                          isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-0.5" />}
                        </div>
                        <span className={`text-sm font-medium ${isSelected ? "text-blue-800" : "text-slate-700"}`}>
                          {label}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.status && (
                  <p className="mt-2 text-xs text-red-500">{errors.status.message}</p>
                )}
              </div>
            )}

            {/* Step 2: Carrière */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Tranche salariale mensuelle <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("salaryRange")}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white ${
                      errors.salaryRange ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    } focus:outline-none focus:ring-2`}
                  >
                    <option value="">Sélectionner une tranche...</option>
                    {SALARY_RANGES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {errors.salaryRange && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.salaryRange.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Délai pour obtenir le premier emploi (en mois) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("timeToFirstJob", { valueAsNumber: true })}
                    placeholder="Ex : 6"
                    min={0}
                    max={120}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                      errors.timeToFirstJob ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    } focus:outline-none focus:ring-2`}
                  />
                  {errors.timeToFirstJob && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.timeToFirstJob.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Compétence la plus valorisée dans votre emploi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      {...register("topSkill")}
                      placeholder="Ex : Analyse de données, Communication..."
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm ${
                        errors.topSkill ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                      } focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {errors.topSkill && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.topSkill.message}</p>
                  )}
                </div>
              </div>
            )}

            {serverError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {serverError}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(s - 1, 0))}
                disabled={step === 0}
                className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>

              <span className="text-xs text-slate-400">{step + 1} / {STEPS.length}</span>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-semibold"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold disabled:opacity-70"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Envoi en cours...</>
                  ) : (
                    <><CheckCircle className="w-4 h-4" />Soumettre</>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
