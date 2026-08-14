import { GovernanceSection } from "../components/home/governance-section";
import { LandmarkHero } from "../components/home/landmark-hero";
import { ProjectsNews } from "../components/home/projects-news";
import { ProvinceMapSection } from "../components/home/province-map-section";
import { ServicesFooter } from "../components/home/services-footer";
import { SiteHeader } from "../components/home/site-header";
import { getPublicData } from "../lib/public-data";

export default async function HomePage() {
  const data = await getPublicData();
  return <main className="public-home">
    <SiteHeader />
    <LandmarkHero />
    <ProvinceMapSection />
    <GovernanceSection data={data} />
    <ProjectsNews data={data} />
    <ServicesFooter />
  </main>;
}
