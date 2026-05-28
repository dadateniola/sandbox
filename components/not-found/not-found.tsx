import Link from "next/link";
import Image from "next/image";

// Images
import Eve from "@/public/images/eve.png";

// Imports
import { CTA } from "../global/components";

const NotFound = () => {
  return (
    <main>
      {/* Hero Section */}
      <section id="hero">
        <div className="min-h-[110vh] custom-flex-center">
          <div className="flex flex-col items-center">
            <h1 className="z-2 text-text-default text-[min(7vw,120px)] text-center leading-[90%]">
              Page Not <br /> <span className="text-text-primary">Found</span>
            </h1>

            <Image
              src={Eve}
              alt="Eve"
              className="-mt-9 w-1/2 h-auto object-cover"
            />

            <Link href="/">
              <CTA size={220} className="-mt-27.5">
                Back to <br /> Home
              </CTA>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
