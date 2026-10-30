import { useMesa } from "../hooks/useMesa";
import { useIsMobile } from "../hooks/useMediaQuery";

import DesktopMesa from "./DesktopMesa";
import MobileMesa from "./MobileMesa";

// One set of rules (useMesa), two faces: the page on a computer and the app shell on a phone.
export const CalculatePage = () => {
  const mesa = useMesa();
  const isMobile = useIsMobile();

  return isMobile ? <MobileMesa mesa={mesa} /> : <DesktopMesa mesa={mesa} />;
};
