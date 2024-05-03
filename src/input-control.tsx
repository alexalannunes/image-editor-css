import { HTMLProps } from "react";

interface RangeControlProps extends Omit<HTMLProps<HTMLInputElement>, 'onChange'> {
    label: string;
    value: number;
    onChange: (v: number) => void;
}

// TODO convert to forwardRef component
export function RangeControl({
    value,
    onChange,
    label,
    ...rest
}: RangeControlProps) {
    return (
        <div>
            {label}
            <input
                {...rest}
                value={value}
                onChange={(e) => {
                    onChange(Number(e.target.value));
                }}
                type="range"
            />
            <input
                {...rest}
                value={value}
                type="number"
                onChange={(e) => {
                    onChange(Number(e.target.value));
                }}
                style={{ width: 50 }}
            />
        </div>
    );
}