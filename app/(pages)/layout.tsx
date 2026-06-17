// Imports
import AppShell from "@/components/shell/app-shell";
import { TransitionProvider } from "@/transition/engine/TransitionContext";

const SlugLayout = () => {
  return (
    <TransitionProvider>
      <AppShell />
    </TransitionProvider>
  );
};

export default SlugLayout;
