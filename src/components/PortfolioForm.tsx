import type { UseFormRegister } from "react-hook-form";
import type { PortfolioFormValues, PortfolioPositionForm } from "../types";
import { formatCurrency } from "../utils/formatCurrency";

interface PortfolioFormProps {
  register: UseFormRegister<PortfolioFormValues>;
  positions: PortfolioPositionForm[];
  portfolioValue: number;
}

const PortfolioForm = ({
  register,
  positions,
  portfolioValue,
}: PortfolioFormProps) => {

  const inputStyles = `
    w-full min-w-0 rounded-lg border border-slate-200
    bg-white px-3 py-2.5 text-sm tabular-nums
    outline-none transition
    focus:border-emerald-700
    focus:ring-2 focus:ring-emerald-700/10
  `;

  const labelStyles =
    "mb-2 block text-xs font-medium text-slate-500";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Portfolio positions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Adjust your holdings, prices and target allocation.
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={(event) => event.preventDefault()}
      >

        {positions.map((position, index) => {

          const positionValue =
            position.currentPrice * position.quantity;

          const currentAllocation =
            portfolioValue > 0
              ? (positionValue / portfolioValue) * 100
              : 0;

          const validAllocation =
            Number.isFinite(currentAllocation);

          return (
            <fieldset
              key={position.symbol}
              className="min-w-0 rounded-xl border border-slate-200 p-4"
            >

              <legend className="sr-only">
                {position.symbol} position
              </legend>

              {/* Stock information */}
              <div className="mb-5 flex items-center justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-semibold text-slate-700"
                  >
                    {position.symbol.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <input
                      {...register(`positions.${index}.symbol`)}
                      readOnly
                      aria-label="Stock symbol"
                      className="w-full bg-transparent font-semibold outline-none"
                    />

                    <p className="text-xs text-slate-500">
                      Portfolio asset
                    </p>
                  </div>

                </div>

                <div className="shrink-0 text-right">
                  <p className="font-semibold tabular-nums">
                    {formatCurrency(positionValue)}
                  </p>

                  <p className="text-xs text-slate-500">
                    Position value
                  </p>
                </div>

              </div>

              {/* Editable fields */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                <label>
                  <span className={labelStyles}>
                    Shares
                  </span>

                  <input
                    type="number"
                    step="any"
                    className={inputStyles}
                    {...register(`positions.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                  />
                </label>

                <label>
                  <span className={labelStyles}>
                    Current price ($)
                  </span>

                  <input
                    type="number"
                    step="any"
                    className={inputStyles}
                    {...register(`positions.${index}.currentPrice`, {
                      valueAsNumber: true,
                    })}
                  />
                </label>

                <label>
                  <span className={labelStyles}>
                    Target (%)
                  </span>

                  <input
                    type="number"
                    step="any"
                    className={inputStyles}
                    {...register(`positions.${index}.targetPercentage`, {
                      valueAsNumber: true,
                    })}
                  />
                </label>

              </div>

              {/* Current allocation indicator */}
              <div className="mt-5">

                <div className="mb-2 flex justify-between gap-2 text-xs">

                  <span className="text-slate-500">
                    Current allocation
                  </span>

                  <span className="font-medium tabular-nums">
                    {validAllocation
                      ? `${currentAllocation.toFixed(1)}%`
                      : "—"}
                  </span>

                </div>

                <div
                  aria-hidden="true"
                  className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                >
                  <div
                    className="h-full rounded-full bg-slate-500 transition-all duration-300 motion-reduce:transition-none"
                    style={{
                      width: validAllocation
                        ? `${Math.min(100, Math.max(0, currentAllocation))}%`
                        : "0%",
                    }}
                  />
                </div>

              </div>

            </fieldset>
          );
        })}

      </form>

    </section>
  );
};

export default PortfolioForm;