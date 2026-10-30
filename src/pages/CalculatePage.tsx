import { useMesa } from "../hooks/useMesa";

import DesktopMesa from "./DesktopMesa";

// One set of rules (useMesa) behind the view; the phone gets its own view next.
export const CalculatePage = () => <DesktopMesa mesa={useMesa()} />;
