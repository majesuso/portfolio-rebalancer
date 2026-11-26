import type { RebalanceAction } from "../types";
import { formatCurrency } from "../utils/formatCurrency";

interface RebalanceResultProps {
  results: RebalanceAction[];
}

const actionStyles = {
  BUY: "bg-emerald-50 text-emerald-800 border-emerald-100",
  SELL: "bg-orange-50 text-orange-800 border-orange-100",
  HOLD: "bg-slate-50 text-slate-600 border-slate-200",
};

const actionIcons = {
  BUY: "↙",
  SELL: "↗",
  HOLD: "−",
};

const actionLabels = {
  BUY: "Buy shares",
  SELL: "Sell shares",
  HOLD: "No changes needed",
};

const RebalanceResult = ({
  results,
}: RebalanceResultProps) => {

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

      <div className="mb-6">

        <div className="flex flex-wrap items-center justify-between gap-2">

          <h2 className="text-lg font-semibold">
            Rebalance results
          </h2>

          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            Live calculation
          </span>

        </div>

        <p className="mt-1 text-sm text-slate-500">
          Suggested trades to reach your target allocation.
        </p>

      </div>

      <div className="space-y-3">

        {results.map(({ symbol, action, amount }) => (

          <div
            key={symbol}
            className={`
              flex flex-wrap items-center justify-between
              gap-3 rounded-xl border p-4
              ${actionStyles[action]}
            `}
          >

            <div className="flex items-center gap-3">

              <span
                aria-hidden="true"
                className="text-2xl"
              >
                {actionIcons[action]}
              </span>

              <div>
                <p className="font-semibold">
                  {symbol}
                </p>

                <p className="text-xs">
                  {actionLabels[action]}
                </p>
              </div>

            </div>

            <div className="text-right">

              <p className="text-lg font-semibold tabular-nums">
                {formatCurrency(amount)}
              </p>

              <p className="text-xs font-medium tracking-wide">
                {action}
              </p>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">

        <p className="text-xs leading-relaxed text-slate-500">
          Rebalancing adjusts your holdings to match your
          desired allocation without adding new capital.
        </p>

      </div>

    </section>
  );
};

export default RebalanceResult;