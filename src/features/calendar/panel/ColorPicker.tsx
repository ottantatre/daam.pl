import { cn } from "@/lib/cn";
import { COLOR_FAMILIES } from "../colors";

interface Props {
  value: string;
  onChange: (color: string) => void;
  disabled?: string[];
}

export function ColorPicker({ value, onChange, disabled = [] }: Props) {
  const disabledSet = new Set(disabled);

  return (
    <div className="grid grid-rows-5 grid-flow-col gap-0.5 w-fit">
      {COLOR_FAMILIES.flat().map((c) => {
        const isDisabled = disabledSet.has(c) && value !== c;
        return (
          <button
            key={c}
            disabled={isDisabled}
            className={cn(
              "w-3.5 h-3.5 cursor-pointer",
              { "ring-1 ring-offset-1 ring-zinc-500": value === c },
              isDisabled && "opacity-20 cursor-not-allowed",
            )}
            style={{ backgroundColor: c }}
            onClick={() => onChange(c)}
          />
        );
      })}
    </div>
  );
}
