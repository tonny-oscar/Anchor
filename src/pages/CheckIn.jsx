export default function CheckIn() {
  const entries = [
    { date: '2024-02-06', mood: 'Good', notes: 'Feeling strong today' },
    { date: '2024-02-05', mood: 'Okay', notes: '' },
    { date: '2024-02-04', mood: 'Cravings', notes: 'Tough evening but made it through' }
  ];

  const moodColors = { Good: 'bg-green-400', Okay: 'bg-blue-400', Low: 'bg-gray-400', Cravings: 'bg-orange-400' };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Daily Check-Ins</h1>
          <button className="btn-primary">New Check-In</button>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Mood Calendar</h2>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({length: 28}, (_, i) => (
              <div key={i} className={`aspect-square rounded-lg ${i % 4 === 0 ? moodColors.Good : i % 4 === 1 ? moodColors.Okay : i % 4 === 2 ? moodColors.Low : moodColors.Cravings}`}></div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-400 rounded"></div>Good</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-400 rounded"></div>Okay</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-400 rounded"></div>Low</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-400 rounded"></div>Cravings</div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Past Entries</h2>
            <select className="px-3 py-2 border border-gray-300 rounded-lg">
              <option>All Moods</option>
              <option>Good</option>
              <option>Okay</option>
              <option>Low</option>
              <option>Cravings</option>
            </select>
          </div>
          <div className="space-y-4">
            {entries.map((entry, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold">{entry.date}</p>
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${moodColors[entry.mood]}`}>{entry.mood}</span>
                </div>
                {entry.notes && <p className="text-gray-700">{entry.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
