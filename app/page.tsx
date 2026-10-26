import { SheetHeader } from "@/components/sheet-header";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { BuildLog } from "@/components/build-log";
import { Projects } from "@/components/projects";
import { Contact } from "@/components/contact";
import { DraftChat } from "@/components/draft-chat";

export default function Page() {
  return (
    <>
      <SheetHeader />
      <main>
        <Hero />
        <About />
        <Skills />
        <BuildLog />
        <Projects />
        <Contact />
      </main>
      <DraftChat />
    </>
  );
}
