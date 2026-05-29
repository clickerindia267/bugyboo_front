import { Link } from "react-router-dom";
import occasionNewIn from "@/assets/occasion-new-in.webp";
import occasionBirthday from "@/assets/occasion-birthday.webp";
import occasionStepOut from "@/assets/occasion-step-out.webp";
import occasionVacation from "@/assets/occasion-vacation.webp";
import occasionGirls from "@/assets/occasion-girls-wardrobe.webp";
import occasionBoys from "@/assets/occasion-boys-wardrobe.webp";
import occasionBaby from "@/assets/occasion-baby-wardrobe.webp";
import occasionGirlsNew from "@/assets/occasion-girls.webp";
import occasionBoysNew from "@/assets/occasion-boys.webp";

const occasions = [
  { key: "New In", label: "NEW IN!", img: occasionNewIn },
  { key: "Birthday", label: "Birthday", img: occasionBirthday },
  { key: "Step Out", label: "Step Out", img: occasionStepOut },
  { key: "Vacation", label: "Vacation", img: occasionVacation },
  { key: "Girls", label: "Girls Wardrobe", img: occasionGirls },
  { key: "Boys", label: "Boys Wardrobe", img: occasionBoys },
  { key: "Newborn", label: "Baby Wardrobe", img: occasionBaby },
  { key: "Girls", label: "Girls", img: occasionGirlsNew },
  { key: "Boys", label: "Boys", img: occasionBoysNew },
];

const ShopByOccasion = () => {
  const getLink = (o: (typeof occasions)[number]) => {
    if (["Girls", "Boys", "Newborn"].includes(o.key)) {
      return `/shop?category=${encodeURIComponent(o.key)}`;
    } else {
      return `/shop?occasion=${encodeURIComponent(o.key)}`;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto">
        {/* Section heading - Converted to H1 for homepage visible H1 requirement with 100% visual parity */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-foreground">
            What Are You Looking for?
          </h1>
        </div>

        {/* Occasion circles — Converted to crawlable Links for search engines */}
        <div className="flex items-start justify-center gap-5 sm:gap-7 md:gap-10 lg:gap-12 flex-wrap">
          {occasions.map((o) => (
            <Link
              key={o.label}
              to={getLink(o)}
              className="group flex flex-col items-center gap-2.5 focus:outline-none"
            >
              {/* circle with brand teal ring */}
              <div className="relative w-20 h-20 sm:w-[5.5rem] sm:h-[5.5rem] md:w-24 md:h-24 rounded-full transition-all duration-500 ring-[2.5px] ring-[#3f646f]/50 ring-offset-[3px] ring-offset-background group-hover:ring-[#3f646f] group-hover:scale-110">
                <img
                  src={o.img}
                  alt={`Shop ${o.label} collection`}
                  loading="lazy"
                  width={96}
                  height={96}
                  className="w-full h-full rounded-full object-cover object-top"
                />
              </div>
              {/* label */}
              <span className="text-xs md:text-sm font-medium tracking-wide text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-center leading-tight max-w-[5.5rem]">
                {o.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByOccasion;
