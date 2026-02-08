export default function Milestones() {
  const milestones = [
    { name: 'First 24 Hours', days: 1, achieved: true, icon: '🌟', benefit: 'Body begins detoxification' },
    { name: '3 Days Strong', days: 3, achieved: true, icon: '💪', benefit: 'Physical withdrawal symptoms peak' },
    { name: '1 Week', days: 7, achieved: true, icon: '🏆', benefit: 'Sleep patterns start improving' },
    { name: '2 Weeks', days: 14, achieved: false, icon: '🎯', benefit: 'Mental clarity increases' },
    { name: '30 Days', days: 30, achieved: false, icon: '🌙', benefit: 'Brain chemistry rebalancing' },
    { name: '60 Days', days: 60, achieved: false, icon: '⭐', benefit: 'Mood stabilization' },
    { name: '90 Days', days: 90, achieved: false, icon: '💎', benefit: 'New habits firmly established' },
    { name: '6 Months', days: 180, achieved: false, icon: '🎖️', benefit: 'Physical health significantly improved' },
    { name: '1 Year', days: 365, achieved: false, icon: '👑', benefit: 'Complete lifestyle transformation' },
    { name: '18 Months', days: 547, achieved: false, icon: '🦅', benefit: 'Relapse risk greatly reduced' },
    { name: '2 Years', days: 730, achieved: false, icon: '🌟', benefit: 'New identity fully formed' },
    { name: '5 Years', days: 1825, achieved: false, icon: '🏅', benefit: 'Long-term recovery established' }
  ];

  const recoveryTimeline = [
    { time: '20 minutes', benefit: 'Heart rate and blood pressure normalize' },
    { time: '12 hours', benefit: 'Carbon monoxide levels return to normal' },
    { time: '24 hours', benefit: 'Anxiety peaks but body begins healing' },
    { time: '48 hours', benefit: 'Nerve endings start regrowing' },
    { time: '72 hours', benefit: 'Breathing becomes easier' },
    { time: '1 week', benefit: 'Sleep quality improves' },
    { time: '2 weeks', benefit: 'Circulation and lung function improve' },
    { time: '1 month', benefit: 'Coughing and shortness of breath decrease' },
    { time: '3 months', benefit: 'Brain receptors return to normal levels' },
    { time: '9 months', benefit: 'Lung capacity increases significantly' },
    { time: '1 year', benefit: 'Heart disease risk cut in half' },
    { time: '5 years', benefit: 'Stroke risk reduced to non-user level' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Milestones</h1>
        <p className="encouragement-text mb-8">Every day counts. Celebrate your progress.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {milestones.map((m, i) => (
            <div key={i} className={`card text-center ${m.achieved ? 'bg-gradient-to-br from-calm-50 to-calm-100 border-2 border-calm-300' : 'opacity-60'}`}>
              <div className={`text-6xl mb-4 ${m.achieved ? '' : 'grayscale'}`}>{m.icon}</div>
              <h3 className="text-xl font-bold mb-2">{m.name}</h3>
              <p className="text-gray-600 mb-2">{m.days} {m.days === 1 ? 'day' : 'days'}</p>
              <p className="text-sm text-gray-600 italic">{m.benefit}</p>
              {m.achieved && <div className="mt-3 text-calm-600 font-semibold">✓ Achieved</div>}
              {!m.achieved && <div className="mt-3 text-gray-500">🔒 Locked</div>}
            </div>
          ))}
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-6">Recovery Timeline: What's Happening in Your Body</h2>
          <div className="space-y-4">
            {recoveryTimeline.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gradient-to-r from-calm-50 to-serenity-50 rounded-xl">
                <div className="bg-calm-600 text-white px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap">
                  {item.time}
                </div>
                <p className="text-gray-700 pt-1">{item.benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card text-center bg-gradient-to-br from-gentle-50 to-gentle-100">
          <h2 className="text-2xl font-bold mb-2">Keep Going!</h2>
          <p className="text-gray-700">You're building a new life, one day at a time. Every milestone is a victory worth celebrating.</p>
        </div>
      </div>
    </div>
  );
}
