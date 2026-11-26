const Header = () => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Investment management
        </p>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Portfolio Rebalancer
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your holdings and balance your portfolio.
        </p>
      </div>

      <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
        Demo portfolio
      </span>

    </header>
  );
};

export default Header;