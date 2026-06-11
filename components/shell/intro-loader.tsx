// Imports
import { cn } from "@/utils/cn";

const IntroLoader = () => {
  return (
    <div className="fixed z-10 inset-0 custom-flex-center bg-background overflow-hidden">
      <div
        className={cn(
          "custom-flex-col gap-5",
          "text-text-primary text-3xl text-center leading-[90%] tracking-[-0.6px] uppercase",
        )}
      >
        <p>Jacob</p>
        <p>Grønberg</p>
      </div>
    </div>
  );
};

export default IntroLoader;
