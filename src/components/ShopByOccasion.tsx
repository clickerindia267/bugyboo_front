import { useNavigate } from "react-router-dom";
import occasionNewIn from "@/assets/occasion-new-in.png";
import occasionBirthday from "@/assets/occasion-birthday.png";
import occasionStepOut from "@/assets/occasion-step-out.png";
import occasionVacation from "@/assets/occasion-vacation.png";
import occasionGirls from "@/assets/occasion-girls-wardrobe.png";
import occasionBoys from "@/assets/occasion-boys-wardrobe.png";
import occasionBaby from "@/assets/occasion-baby-wardrobe.png";
import occasionGirlsNew from "@/assets/occasion-girls.png";
import occasionBoysNew from "@/assets/occasion-boys.png";

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
  const navigate = useNavigate();

  const handleSelect = (o: (typeof occasions)[number]) => {
    /* Girls / Boys / Newborn map to the existing category filter,
       everything else maps to the occasion filter */
    if (["Girls", "Boys", "Newborn"].includes(o.key)) {
      navigate(`/shop?category=${encodeURIComponent(o.key)}`);
    } else {
      navigate(`/shop?occasion=${encodeURIComponent(o.key)}`);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto">
        {/* Section heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-foreground">
            What Are You Looking for?
          </h2>
        </div>

        {/* Occasion circles — compact & scrollable on mobile */}
        <div className="flex items-start justify-center gap-5 sm:gap-7 md:gap-10 lg:gap-12 flex-wrap">
          {occasions.map((o) => (
            <button
              key={o.label}
              onClick={() => handleSelect(o)}
              className="group flex flex-col items-center gap-2.5 focus:outline-none"
            >
              {/* circle with yellow ring */}
              <div className="relative w-20 h-20 sm:w-[5.5rem] sm:h-[5.5rem] md:w-24 md:h-24 rounded-full transition-all duration-500 ring-[2.5px] ring-[#F9D54A]/60 ring-offset-[3px] ring-offset-background group-hover:ring-[#F9D54A] group-hover:scale-110">
                <img
                  src={o.img}
                  alt={o.label}
                  className="w-full h-full rounded-full object-cover object-top"
                />
              </div>
              {/* label */}
              <span className="text-xs md:text-sm font-medium tracking-wide text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-center leading-tight max-w-[5.5rem]">
                {o.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByOccasion;
