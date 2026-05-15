"use client";

interface PricingPlan {
  name?: string;
  price?: string;
  highlighted?: boolean;
}

export function PricingTableSection({ content }: { content: Record<string, unknown> }) {
  const plans = (content.plans as PricingPlan[]) ?? [];

  return (
    <div className="flex justify-center gap-4 py-8">
      {plans.length > 0 ? (
        plans.map((plan, i) => (
          <div
            key={i}
            className={`w-48 rounded-lg border p-4 text-center ${
              plan.highlighted ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
            }`}
          >
            <p className="font-semibold text-gray-900">{plan.name || "Plan"}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {plan.price || "$0"}
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400">No plans added yet</p>
      )}
    </div>
  );
}
