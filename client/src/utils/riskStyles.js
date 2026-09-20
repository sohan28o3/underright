export function getRiskStyles(riskLevel) {
  switch (riskLevel) {
    case "Low Risk":
      return {
        badge:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        bar: "bg-emerald-500",
        text: "text-emerald-700",
        light: "bg-emerald-50",
      };

    case "Moderate-Low Risk":
      return {
        badge:
          "border-cyan-200 bg-cyan-50 text-cyan-700",
        bar: "bg-cyan-500",
        text: "text-cyan-700",
        light: "bg-cyan-50",
      };

    case "Moderate Risk":
      return {
        badge:
          "border-amber-200 bg-amber-50 text-amber-700",
        bar: "bg-amber-500",
        text: "text-amber-700",
        light: "bg-amber-50",
      };

    case "High Risk":
      return {
        badge:
          "border-orange-200 bg-orange-50 text-orange-700",
        bar: "bg-orange-500",
        text: "text-orange-700",
        light: "bg-orange-50",
      };

    case "Very High Risk":
      return {
        badge:
          "border-red-200 bg-red-50 text-red-700",
        bar: "bg-red-500",
        text: "text-red-700",
        light: "bg-red-50",
      };

    default:
      return {
        badge:
          "border-slate-200 bg-slate-50 text-slate-700",
        bar: "bg-slate-500",
        text: "text-slate-700",
        light: "bg-slate-50",
      };
  }
}