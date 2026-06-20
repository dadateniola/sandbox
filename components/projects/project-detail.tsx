import Image from "next/image";

// Types
import type { ProjectDetailProps, ProjectKey } from "./types";

// Imports
import { PROJECTS } from "./data";
import NotFound from "../not-found/not-found";

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  // Render
  const project = PROJECTS[projectId as ProjectKey];

  if (!project) {
    return (
      <NotFound type="project" cta={{ type: "projects", href: "/projects" }} />
    );
  }

  return (
    <div className="pt-56 pb-20 custom-flex-col gap-56">
      {/* Hero Section */}
      <section id="hero">
        <div className="flex justify-center">
          <div className="w-full max-w-300 flex flex-col items-center">
            <Image
              src={project.coverImage}
              alt={project.title}
              className="w-[42%] h-auto object-cover"
            />

            <h1 className="mt-[-7vw] text-text-primary text-[min(11vw,200px)] text-center text-balance leading-[110%] tracking-[-6px]">
              {project.title}
            </h1>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
