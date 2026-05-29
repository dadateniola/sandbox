// Types
import type { MenuState } from "../global/types";

export interface NavbarProps {
  menuState: MenuState;
  className?: string;
  onMenuClick: () => void;
}
