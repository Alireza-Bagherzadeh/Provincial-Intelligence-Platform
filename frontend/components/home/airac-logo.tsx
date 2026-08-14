import Image from "next/image";

type AiracLogoProps = {
  className?: string;
  priority?: boolean;
  hero?: boolean;
};

export function AiracLogo({ className = "", priority = false, hero = false }: AiracLogoProps) {
  return <span className={`airac-logo ${hero ? "airac-logo-hero" : "airac-logo-themed"} ${className}`.trim()}>
    {hero ? (
      <Image className="airac-logo-image" src="/images/logo-white.png" alt="مرکز راهبری پژوهش و پیشرفت هوش مصنوعی جهاد دانشگاهی" fill sizes="(max-width: 600px) 112px, 156px" priority={priority} />
    ) : <>
      <Image className="airac-logo-image airac-logo-white" src="/images/logo-white.png" alt="مرکز راهبری پژوهش و پیشرفت هوش مصنوعی جهاد دانشگاهی" fill sizes="(max-width: 600px) 52px, 110px" priority={priority} />
      <Image className="airac-logo-image airac-logo-black" src="/images/logo-dark.png" alt="مرکز راهبری پژوهش و پیشرفت هوش مصنوعی جهاد دانشگاهی" fill sizes="(max-width: 600px) 52px, 110px" priority={priority} />
    </>}
  </span>;
}

