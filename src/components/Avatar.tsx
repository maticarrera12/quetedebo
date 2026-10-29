import { initialOf } from "../utils/format";

interface AvatarProps {
  name: string;
  color: string;
  size?: number;
  ring?: string;
}

const Avatar = ({ name, color, size = 44, ring }: AvatarProps) => (
  <span
    aria-hidden="true"
    className="inline-flex flex-none items-center justify-center rounded-full font-extrabold text-ink"
    style={{
      width: size,
      height: size,
      fontSize: size * 0.38,
      background: color,
      ...(ring ? { border: `${Math.max(3, Math.round(size * 0.07))}px solid ${ring}` } : {}),
    }}
  >
    {initialOf(name)}
  </span>
);

export default Avatar;
