import Link from "next/link";

// Imports
import { PROJECTS_GRID } from "./data";
import { CTA } from "../global/components";
import { ProjectCard } from "./components";

const Projects = () => {
  return (
    <div className="pt-46.25 pb-20 custom-flex-col gap-42.5">
      {/* Hero Section */}
      <section id="hero">
        <div className="flex items-start gap-30">
          <div className="flex flex-col gap-7.5">
            <h1 className="text-text-primary text-[min(11vw,200px)] leading-[90%]">
              Projects
            </h1>

            <p className="max-w-150 pl-[0.7vw] text-[22px] leading-[160%]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt.
            </p>
          </div>

          <Link href="/contact">
            <CTA size={220} style={{ fontSize: 24 }}>
              Get in <br /> Touch
            </CTA>
          </Link>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects">
        <div className="grid grid-cols-10 gap-y-30">
          {PROJECTS_GRID.map((item, index) =>
            typeof item === "number" ? (
              <div key={index} style={{ gridColumn: `span ${item}` }} />
            ) : (
              <ProjectCard key={index} {...item} />
            ),
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
