export default function Progress() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Progress & Insights</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Total Sober Days</p>
            <p className="text-4xl font-bold text-calm-600">320</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Longest Ever Streak</p>
            <p className="text-4xl font-bold text-calm-600">45</p>
            <p className="text-sm text-gray-500">days</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Most Challenging Day</p>
            <p className="text-2xl font-bold">Friday</p>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Streak History</h2>
          <div className="h-64 flex items-end gap-2">
            {[45, 30, 12, 8, 25, 40, 12].map((h, i) => (
              <div key={i} className="flex-1 bg-calm-400 rounded-t-lg" style={{height: `${(h/45)*100}%`}}></div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">Past 7 streaks</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Mood Trends</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-20 text-sm">Good</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div className="bg-green-400 h-4 rounded-full" style={{width: '60%'}}></div>
                </div>
                <span className="text-sm">60%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-sm">Okay</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div className="bg-blue-400 h-4 rounded-full" style={{width: '25%'}}></div>
                </div>
                <span className="text-sm">25%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-sm">Low</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div className="bg-gray-400 h-4 rounded-full" style={{width: '10%'}}></div>
                </div>
                <span className="text-sm">10%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-sm">Cravings</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div className="bg-orange-400 h-4 rounded-full" style={{width: '5%'}}></div>
                </div>
                <span className="text-sm">5%</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Cravings Frequency</h2>
            <div className="h-48 flex items-end gap-2">
              {[3, 5, 2, 1, 4, 2, 1].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-orange-400 rounded-t-lg" style={{height: `${(h/5)*100}%`, minHeight: '20px'}}></div>
                  <span className="text-xs mt-2">{'SMTWTFS'[i]}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">This week</p>
          </div>
        </div>
      </div>
    </div>
  );
}
