const DashboardPage = () => (
  <div className="p-6 space-y-4 bg-gray-100 min-h-screen">
    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg">
        Besökare: Kommer snart statistik här.
      </div>
      <div className="bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg">
        Bokningar: Kommer snart statistik här.
      </div>
      <div className="bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg">
        Köp (sålda varor): Kommer snart statistik här.
      </div>
      <div className="bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg">
        Tillgängliga moduler att köpa: Kommer snart lista här.
      </div>
      <div className="bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg">
        Moduler som kunden köpte redan: Kommer snart lista här.
      </div>
      <div className="bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg">
        Betalningar: Kommer snart statistik här.
      </div>
    </div>
  </div>
);

export default DashboardPage;