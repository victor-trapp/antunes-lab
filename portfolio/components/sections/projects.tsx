import { ProjectCard } from "@/components/ui/project-card";
import { PROJECTS } from "@/data";
import type { ProjectItem } from "@/data/projects";

export const Projects = () => {
  return (
    <section
      id="projects"
      className="relative flex flex-col items-center justify-center pt-10 pb-28"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-12">
        My Projects
      </h1>

      <div className="w-full max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {PROJECTS.map((project) => {
            const p = project as ProjectItem;
            return (
              <ProjectCard
                key={p.title}
                title={p.title}
                description={p.description}
                link={p.link}
                ctaLabel={p.ctaLabel}
                secondaryLabel={p.secondaryLabel}
                secondaryLink={p.secondaryLink}
                hidePrimaryCta={p.hidePrimaryCta}
                tags={p.tags}
                status={p.status}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
