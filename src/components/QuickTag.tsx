"use client";

interface Props {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  multi?: boolean;
}

export default function QuickTag({ tags, selected, onToggle, multi = false }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const active = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
              active
                ? "bg-primary text-white shadow-sm"
                : "bg-dark/5 text-text-secondary hover:bg-dark/10"
            }`}>
            {multi && active && <span className="mr-1">✓</span>}
            {tag}
          </button>
        );
      })}
    </div>
  );
}
