// Types
import type { ProjectDetailProps } from "./types";

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  return (
    <div className="w-full h-screen custom-flex-center">
      <h1 className="text-[4vw] text-text-default">
        Project Detail - {projectId}
      </h1>
    </div>
  );
};

export default ProjectDetail;
