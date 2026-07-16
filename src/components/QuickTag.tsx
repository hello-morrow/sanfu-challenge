"use client";

export default function QuickTag({ tags, selected, onSelect }: {
  tags: string[]; selected: string; onSelect: (t: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button key={tag} type="button" onClick={() => onSelect(tag)}
          className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            selected === tag
              ? "bg-primary text-white shadow-sm"
              : "bg-dark/5 text-text-secondary hover:bg-dark/10"
          }`}>
          {tag}
        </button>
      ))}
    </div>
  );
}
