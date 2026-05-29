import Image from "next/image";

// Images
import Jack from "@/public/images/jack.png";
import Haryo from "@/public/images/haryo.png";
import Olenka from "@/public/images/olenka.png";

// Imports
import { CTA } from "../global/components";

const Contact = () => {
  return (
    <>
      {/* Hero Section */}
      <section id="hero">
        <div className="min-h-[110vh] pt-35 pb-20 custom-flex-center">
          <div className="flex flex-col items-center">
            <h1 className="z-2 text-text-default text-[min(7vw,120px)] text-center leading-[90%]">
              Let&apos;s Work <br />{" "}
              <span className="text-text-primary">Together</span>
            </h1>

            <div className="-mt-8 flex items-center justify-center gap-10">
              <div className="flex-1">
                <Image src={Olenka} alt="Olenka" className="w-full h-auto" />
              </div>
              <Image src={Jack} alt="Jack" className="w-[50%] h-auto" />
              <div className="flex-1">
                <Image src={Haryo} alt="Haryo" className="w-full h-auto" />
              </div>
            </div>

            <a
              href="https://wa.me/2349052513369"
              target="_blank"
              rel="noopener noreferrer"
              className="-mt-27.5"
            >
              <CTA size={220}>
                Chat on <br /> WhatsApp
              </CTA>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
