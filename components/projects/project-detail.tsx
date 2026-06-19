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
    <div className="w-full h-screen custom-flex-center">
      <h1 className="text-[4vw] text-text-default">
        Project Detail - {project.title}
      </h1>
    </div>
  );
};

export default ProjectDetail;
