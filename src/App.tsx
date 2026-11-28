import Header from "./components/Header";
import PortfolioForm from "./components/PortfolioForm";
import PortfolioSummary from "./components/PortfolioSummary";
import RebalanceResult from "./components/RebalanceResult";
import { usePortfolio } from "./hooks/usePortfolio";
import { PortfolioPosition } from "./types/PortfolioPosition";
import { Stock } from "./types/Stock";

function App() {
  const {
    register,
    positions,
    portfolioValue,
    rebalanceValue,
  } = usePortfolio();

  const stock = new Stock('META', 200);
const position = new PortfolioPosition(stock, 3);

console.log(position.getValue()); // 600

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900 font-sans">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        <Header />

        <div className="mt-8">
          <PortfolioSummary
            portfolioValue={portfolioValue}
            positions={positions}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">

          <div className="lg:col-span-7">
            <PortfolioForm
              register={register}
              positions={positions}
              portfolioValue={portfolioValue}
            />
          </div>

          <div className="lg:col-span-5">
            <RebalanceResult
              results={rebalanceValue}
            />
          </div>

        </div>

        <footer className="mt-8 text-center text-xs text-slate-500">
          Illustrative prices. No real trades are executed.
        </footer>

      </main>
    </div>
  );
}

export default App;