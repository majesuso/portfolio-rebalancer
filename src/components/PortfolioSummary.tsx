import type { PortfolioPositionForm } from "../types";
import { formatCurrency } from "../utils/formatCurrency";

interface PortfolioSummaryProps {
  portfolioValue: number;
  positions: PortfolioPositionForm[];
}

const PortfolioSummary = ({
  portfolioValue,
  positions,
}: PortfolioSummaryProps) => {

  const totalAllocation = positions.reduce(
    (total, position) => total + position.targetPercentage,
    0
  );

  return (
    <section className="rounded-2xl bg-[#172D29] p-6 text-white sm:p-8">

      <p className="text-sm font-medium text-emerald-100/70">
        Total portfolio value
      </p>

      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        <h2 className="text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
          {formatCurrency(portfolioValue)}
        </h2>

        <span className="text-sm text-emerald-100/70">
          USD
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 border-t border-white/15 pt-5">

        <div>
          <p className="text-sm text-emerald-100/70">
            Assets
          </p>

          <p className="mt-1 text-xl font-medium">
            {positions.length} stocks
          </p>
        </div>

        <div>
          <p className="text-sm text-emerald-100/70">
            Target allocation
          </p>

          <p className="mt-1 text-xl font-medium">
            {Number.isFinite(totalAllocation)
              ? `${totalAllocation}%`
              : "—"}
          </p>
        </div>

      </div>
    </section>
  );
};

export default PortfolioSummary;