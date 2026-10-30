export default function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
}) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-200">
      <button
        type="button"
        className="px-3 py-2 hover:bg-slate-100 disabled:opacity-40"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span className="min-w-10 text-center text-sm font-semibold">
        {quantity}
      </span>

      <button
        type="button"
        className="px-3 py-2 hover:bg-slate-100 disabled:opacity-40"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
