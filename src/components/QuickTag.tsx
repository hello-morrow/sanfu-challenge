"use client";

export default function QuickTag({
  tags,
  selected,
  onSelect,
}: {
  tags: string[];
  selected: string;
  onSelect: (tag: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelect(tag)}
          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
            selected === tag
              ? "bg-green-primary text-white"
              : "bg-green-pale text-text-primary border border-green-light/50 hover:border-green-primary"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
