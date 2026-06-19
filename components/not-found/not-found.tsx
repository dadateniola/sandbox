import Link from "next/link";
import Image from "next/image";

// Types
import type { NotFoundProps } from "./types";

// Images
import Eve from "@/public/images/eve.png";

// Imports
import { CTA } from "../global/components";
import { formatString } from "@/utils/formatString";

const NotFound: React.FC<NotFoundProps> = ({ cta, type = "Page" }) => {
  return (
    <>
      {/* Hero Section */}
      <section id="hero">
        <div className="min-h-[110vh] pt-35 pb-20 custom-flex-center">
          <div className="flex flex-col items-center">
            <h1 className="z-2 text-text-default text-[min(7vw,120px)] text-center leading-[90%] capitalize">
              {type} Not <br /> <span className="text-text-primary">Found</span>
            </h1>

            <Image
              src={Eve}
              alt="Eve"
              className="-mt-9 w-full h-auto object-cover"
            />

            <Link href={cta?.href || "/"}>
              <CTA size={220} className="-mt-27.5">
                Back to <br /> {formatString(cta?.type || "Home", "capitalize")}
              </CTA>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
