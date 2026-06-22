import React from "react";
import Link from "next/link";
import Image from "next/image";

// Types
import type { ProjectDetailProps, ProjectKey } from "./types";

// Imports
import { CTA } from "../global/components";
import NotFound from "../not-found/not-found";
import { ProjectDetailAbout, ProjectGrid } from "./components";
import { getNextProject, getProjectLink, PROJECTS } from "./data";

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  // Variables
  const project = PROJECTS[projectId as ProjectKey];

  if (!project) {
    return (
      <NotFound type="project" cta={{ type: "projects", href: "/projects" }} />
    );
  }

  // Render
  const nextProject = getNextProject(project.slug);
  const projectDetails = Object.entries(project.details);

  return (
    // pt-56
    <div className="pt-25 pb-20 custom-flex-col gap-56">
      <div className="custom-flex-col gap-32">
        {/* Hero Section */}
        <section id="hero">
          <div className="flex justify-center">
            <div className="w-full max-w-300 flex flex-col items-center">
              <Image
                src={project.coverImage}
                alt={project.title}
                data-project-slug={project.slug}
                data-transition-role="project-hero-image"
                // w-1/2
                className="w-[40%] h-auto object-cover"
              />

              <h1 className="mt-[-7vw] text-text-primary text-[min(11vw,200px)] text-center text-balance leading-[110%] tracking-[-6px]">
                {project.title}
              </h1>
            </div>
          </div>
        </section>

        <section id="about">
          <div className="w-full flex justify-end">
            <div className="w-[56%] min-w-200 custom-flex-col gap-32">
              <ProjectDetailAbout title="About">
                <p className="text-lg leading-[160%]">
                  Massa vitae tortor condimentum lacinia quis vel eros donec. In
                  fermentum et sollicitudin ac orci phasellus egestas tellus
                  rutrum.
                  <br />
                  <br />
                  Congue nisi vitae suscipit tellus mauris a diam maecenas.
                  Vestibulum morbi blandit cursus risus at ultrices mi tempus
                  imperdiet.
                  <br />
                  <br />
                  Sit amet aliquam id diam maecenas ultricies mi eget. Tortor id
                  aliquet lectus proin. Varius quam quisque id diam vel quam
                  elementum pulvinar.
                </p>
              </ProjectDetailAbout>

              <ProjectDetailAbout
                title="Details"
                className="custom-flex-col gap-8"
              >
                {projectDetails.map(([key, value], index) => (
                  <React.Fragment key={key}>
                    <div className="flex items-center justify-between gap-4 text-lg">
                      <p className="text-text-primary leading-[120%] uppercase">
                        {key}
                      </p>

                      <p className="leading-[160%]">{value}</p>
                    </div>

                    {index < projectDetails.length - 1 && <hr />}
                  </React.Fragment>
                ))}
              </ProjectDetailAbout>
            </div>
          </div>
        </section>
      </div>

      {/* Gallery Section */}
      {project.gallery && (
        <section id="gallery">
          <ProjectGrid layout={project.gallery} />
        </section>
      )}

      {/* Next Project Section */}
      <section id="next-project">
        <div className="flex justify-center">
          <div className="w-full max-w-300 flex flex-col items-center">
            <div className="z-2 w-full custom-flex-col gap-5 text-center">
              <p className="text-[min(3.5vw,60px)] leading-[110%] uppercase">
                Next Project
              </p>

              <p className="w-full max-w-300 text-text-primary text-[min(10vw,200px)] text-balance leading-[90%] tracking-[-6px]">
                {nextProject.title}
              </p>
            </div>

            <div className="-mt-15 w-1/2">
              <Image
                src={nextProject.coverImage}
                alt={nextProject.title}
                data-project-slug={nextProject.slug}
                data-transition-role="project-card-image"
                className="w-full h-auto object-cover"
              />
            </div>

            <Link href={getProjectLink(nextProject.slug)} className="-mt-27.5">
              <CTA size={220} className="text-[24px]">
                Discover
              </CTA>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
