import Avatar from "./Avatar";
import { personColor } from "../utils/format";
import type { Friend } from "../types/types";

interface AvatarStackProps {
  friends: Friend[];
  ring: string;
  size?: number;
  max?: number;
}

// Friends sitting close together; the ring takes the colour of what is behind them.
const AvatarStack = ({ friends, ring, size = 44, max = 6 }: AvatarStackProps) => {
  const shown = friends.slice(0, max);
  const extra = friends.length - shown.length;

  return (
    <div
      className="flex items-center"
      role="img"
      aria-label={`En la mesa: ${friends.map((friend) => friend.name).join(", ")}`}
    >
      {shown.map((friend, index) => (
        <span key={index} style={{ marginLeft: index === 0 ? 0 : -size * 0.2 }}>
          <Avatar
            name={friend.name}
            color={personColor(friends, friend.name)}
            size={size}
            ring={ring}
          />
        </span>
      ))}

      {extra > 0 && (
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center rounded-full bg-track font-bold text-muted"
          style={{
            width: size,
            height: size,
            marginLeft: -size * 0.2,
            fontSize: size * 0.32,
            border: `${Math.max(3, Math.round(size * 0.07))}px solid ${ring}`,
          }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
};

export default AvatarStack;
