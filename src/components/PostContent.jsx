export default function PostContent({ text }) {
  const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);

  return (
    <div className="space-y-5 text-lg leading-relaxed text-gray-800">
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          return <h2 key={i} className="text-2xl font-bold pt-4">{block.slice(3)}</h2>;
        }
        const lines = block.split('\n');
        if (lines.every(l => l.trim().startsWith('- '))) {
          return (
            <ul key={i} className="space-y-2 pl-1">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3">
                  <span className="text-calm-500 mt-1">⚓</span>
                  <span>{l.trim().slice(2)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i} className="whitespace-pre-line">{block}</p>;
      })}
    </div>
  );
}
