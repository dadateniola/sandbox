import React from "react";
import Link from "next/link";
import Image from "next/image";

// Images
import { ArrowDown } from "../svg/svg";
import Hernandez from "@/public/images/hernandez.png";
import Vinogradov from "@/public/images/vinogradov.png";

// Imports
import { cn } from "@/utils/cn";
import { HOME_PROJECTS_LAYOUT, SERVICES } from "./data";

import { CTA } from "../global/components";
import { HomeSection } from "./components";
import { EXHIBITIONS } from "../exhibitions/data";
import { ProjectGrid } from "../projects/components";
import { ExhibitionCard } from "../exhibitions/components";

const Home = () => {
  return (
    <div className="pt-38.5 custom-flex-col gap-40">
      {/* Hero Section */}
      <section id="hero">
        <div className="relative">
          {/* Hero Image */}
          <div className="relative w-full flex flex-col items-end">
            <Image
              src={Vinogradov}
              alt="Vinogradov"
              className="w-[54%] h-auto object-cover"
            />

            <div className="mr-25 flex items-center gap-5">
              <ArrowDown />

              <p className="leading-[160%]">
                Scroll Down <br /> & Explore
              </p>
            </div>
          </div>

          {/* Hero Text */}
          <div
            className={cn(
              "absolute top-19.25 left-0 flex flex-col items-center gap-2.75",
              "[&>p]:text-[min(3.5vw,60px)] [&>p]:uppercase [&>p]:leading-[110%]",
            )}
          >
            <h1 className="text-text-primary text-[min(11vw,200px)] leading-[90%]">
              Jacob <br />
              Grønberg
            </h1>

            <p className="translate-x-[-6%]">Photographer</p>
            <p className="translate-x-[12%]">& Visual artist</p>
          </div>

          {/* Hero Intro */}
          <div className="absolute bottom-2.5 left-15 flex">
            <div className="custom-flex-col gap-2.5">
              <div className="relative size-45 overflow-hidden">
                <Image
                  src={Hernandez}
                  alt="Hernandez"
                  fill
                  sizes="250px"
                  className="object-cover"
                />
              </div>

              <p className="leading-[160%]">Hi, I&apos;m Jacob</p>
            </div>

            <Link href="/contact" className="mt-23.5 -ml-5">
              <CTA size={160} style={{ fontSize: 18 }}>
                Work <br /> With Me
              </CTA>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services">
        <div className="px-25 flex items-start gap-30">
          <div className="flex-1 flex justify-end">
            <p className="leading-[160%]">— Services</p>
          </div>

          <div className="w-[65%] custom-flex-col gap-12.5">
            {SERVICES.map((service, index) => (
              <React.Fragment key={index}>
                <div className="flex items-start gap-12.5">
                  <p className="w-15 text-text-primary text-3xl leading-[120%]">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <div className="custom-flex-col gap-5">
                    <p className="text-3xl leading-[120%] uppercase">
                      {service}
                    </p>

                    <p className="text-lg leading-[160%]">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                </div>

                {index !== SERVICES.length - 1 && <hr />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <HomeSection title="Latest Work" href="/projects">
        <ProjectGrid layout={HOME_PROJECTS_LAYOUT} />
      </HomeSection>

      {/* Exhibitions Section */}
      <HomeSection title="Exhibitions ‘22" href="/exhibitions">
        <div className="custom-flex-col gap-12.5">
          {EXHIBITIONS.slice(0, 3).map((exhibition, index) => (
            <React.Fragment key={index}>
              <ExhibitionCard {...exhibition} />
              {index !== 2 && <hr />}
            </React.Fragment>
          ))}
        </div>
      </HomeSection>

      {/* Contact Section */}
      <section id="contact">
        <div className="py-[20vh] flex items-center justify-center gap-17.5">
          <Link href="/contact">
            <CTA size={220}>
              Get in <br /> Touch
            </CTA>
          </Link>

          <h2 className="text-[min(6vw,100px)] leading-[110%] uppercase">
            Let&apos;s Work <br />{" "}
            <span className="text-text-primary">Together</span>
          </h2>
        </div>
      </section>
    </div>
  );
};

export default Home;
