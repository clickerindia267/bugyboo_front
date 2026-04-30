import { Link } from "react-router-dom";
import imgNewborn from "@/assets/cat-newborn.jpg";
import imgFrok from "@/assets/frok1.jpeg";
import imgNightwear from "@/assets/nightwear1.jpeg";
import imgPinktop from "@/assets/pinktop1.jpeg";
import imgProduct1 from "@/assets/product-1.jpg";
import { Sun, Star, Cloud, Smile } from "lucide-react";

const Blob = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="currentColor" d="M44.7,-76.4C58.3,-69.2,70,-56.9,79.6,-42.6C89.2,-28.3,96.8,-12,95.3,3.6C93.8,19.2,83.3,34.1,72.2,46.9C61.1,59.7,49.5,70.4,35.6,77.3C21.7,84.2,5.5,87.3,-9.9,85.1C-25.3,82.9,-39.8,75.4,-52.1,65.3C-64.4,55.2,-74.4,42.5,-81.3,27.7C-88.2,12.9,-91.9,-3.9,-88.1,-19.1C-84.3,-34.3,-73,-47.9,-59.8,-57.8C-46.6,-67.7,-31.5,-73.9,-16.4,-77.3C-1.3,-80.7,13.8,-81.3,31.1,-83.6L44.7,-76.4Z" transform="translate(100 100)" />
  </svg>
);

const Rainbow = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={className}>
    <path d="M10 50 A 40 40 0 0 1 90 50" />
    <path d="M20 50 A 30 30 0 0 1 80 50" />
    <path d="M30 50 A 20 20 0 0 1 70 50" />
    <path d="M40 50 A 10 10 0 0 1 60 50" />
    <path d="M5 50 Q 15 40 25 50 Q 35 60 45 50 Q 55 40 65 50 Q 75 60 85 50 Q 95 40 100 50" fill="none" strokeWidth="2" />
  </svg>
);

const ShootingStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M20 30 L80 10 L85 15 L30 40 Z" />
    <path d="M20 30 L10 20 L30 15 L40 25 Z" />
    <circle cx="25" cy="22" r="2" fill="currentColor" />
    <path d="M80 10 Q 90 15 95 30" strokeDasharray="2 2" />
  </svg>
);

const BabyLogo = ({ className }: { className?: string }) => (
  <div className={`relative flex items-center justify-center rounded-full border-2 border-white text-white ${className}`}>
    <Smile className="w-1/2 h-1/2" />
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow" style={{ animationDuration: '10s' }}>
      <path id="curve" d="M 10 50 A 40 40 0 1 1 90 50 A 40 40 0 1 1 10 50" fill="transparent" />
      <text className="text-[14px] uppercase tracking-widest" fill="currentColor">
        <textPath href="#curve" startOffset="10%">baby logo baby logo</textPath>
      </text>
    </svg>
  </div>
);

const Polaroid = ({ src, className, innerClassName }: { src: string, className?: string, innerClassName?: string }) => (
  <div className={`bg-white p-3 pb-8 shadow-lg ${className}`}>
    <div className={`w-full h-full bg-blue-100 overflow-hidden ${innerClassName}`}>
      <img src={src} alt="Product" className="w-full h-full object-cover" />
    </div>
  </div>
);

const BabyBanners = () => {
  return (
    <section className="py-10 md:py-16 bg-[#fdf2f8]">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap');`}
      </style>
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Left Large Block */}
          <Link to="/shop?category=Newborn" className="block w-full lg:w-1/2 relative bg-[#ffeb8e] aspect-square rounded-xl overflow-hidden text-[#5e5e5e] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
              <svg viewBox="0 0 500 500" preserveAspectRatio="none" className="w-full h-full">
                <path d="M250,0 Q350,100 500,50 L500,0 Z" fill="#f6a9c0" />
                <path d="M0,350 Q100,450 250,500 L0,500 Z" fill="#8ebbe8" />
                <path d="M0,280 Q50,250 100,300 Q150,350 200,320 L200,500 L0,500 Z" fill="#ffffff" />
                <path d="M200,450 Q250,400 350,450 Q450,500 500,480 L500,500 L200,500 Z" fill="#ffffff" />
              </svg>
            </div>
            
            {/* Line Art Icons */}
            <BabyLogo className="absolute top-[8%] left-[8%] w-[15%] h-[15%] max-w-[80px] max-h-[80px] text-white" />
            <Sun className="absolute top-[25%] left-[8%] w-[20%] h-[20%] max-w-[96px] max-h-[96px] text-white" strokeWidth={1} />
            <ShootingStar className="absolute top-[12%] right-[12%] w-[25%] h-[25%] max-w-[128px] max-h-[128px] text-white" />
            <Rainbow className="absolute bottom-[15%] right-[8%] w-[25%] h-[25%] max-w-[128px] max-h-[128px] text-white" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
              <div className="w-[75%] sm:w-[65%] max-w-[400px]">
                <Polaroid 
                  src={imgNewborn} 
                  className="w-full aspect-square transform -rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 mx-auto shadow-xl" 
                />
              </div>
              <h3 className="text-4xl sm:text-5xl md:text-6xl mt-6 sm:mt-8 text-[#4a4a4a] tracking-tight text-center" style={{ fontFamily: "'Dancing Script', cursive" }}>
                New Collection
              </h3>
            </div>
          </Link>

          {/* Right Blocks Grid */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 grid-rows-2 gap-4">
            
            {/* Top Middle */}
            <Link to="/shop?category=Baby" className="relative bg-[#f6a9c0] aspect-square rounded-xl overflow-hidden text-[#5e5e5e] p-4 flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-[150%] h-[150%] pointer-events-none">
                <svg viewBox="0 0 200 200" className="w-full h-full absolute top-[10%] left-[10%]">
                  <path d="M50,100 C50,0 200,0 200,100 C200,200 50,200 50,100 Z" fill="#ffeb8e" opacity="0.8" />
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-[#8ebbe8] rounded-tl-full" />
              <BabyLogo className="absolute top-[8%] left-[8%] w-[15%] h-[15%] max-w-[48px] max-h-[48px] text-white" />
              <Cloud className="absolute top-[10%] right-[10%] w-[15%] h-[15%] max-w-[48px] max-h-[48px] text-white" strokeWidth={1} />
              
              <div className="z-10 text-center w-full h-full flex flex-col items-center justify-between">
                <h3 className="text-3xl sm:text-4xl mt-2 text-[#4a4a4a]" style={{ fontFamily: "'Dancing Script', cursive" }}>Baby Shop</h3>
                <div className="w-[75%] max-w-[220px] my-auto">
                  <Polaroid src={imgFrok} className="w-full aspect-square mx-auto group-hover:scale-105 transition-transform shadow-lg" />
                </div>
              </div>
            </Link>

            {/* Top Right */}
            <Link to="/shop?category=Newborn" className="relative bg-[#ffeb8e] aspect-square rounded-xl overflow-hidden text-[#5e5e5e] p-4 flex items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-[50%] h-[30%] bg-[#8ebbe8] rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-[50%] h-[35%] bg-[#f6a9c0] rounded-tr-full" />
              <div className="absolute bottom-0 left-0 w-[50%] h-[20%] bg-white rounded-tr-full" />
              <Sun className="absolute top-[10%] left-[10%] w-[20%] h-[20%] max-w-[64px] max-h-[64px] text-white" strokeWidth={1} />
              <BabyLogo className="absolute top-[8%] right-[8%] w-[12%] h-[12%] max-w-[40px] max-h-[40px] text-white" />
              
              <div className="z-10 flex w-full h-full justify-between items-center text-left">
                <div className="w-[45%] flex flex-col justify-center h-full pt-4 pl-2">
                  <h3 className="text-3xl sm:text-4xl text-[#4a4a4a]" style={{ fontFamily: "'Dancing Script', cursive" }}>New Born</h3>
                </div>
                <div className="w-[55%] max-w-[180px] my-auto">
                  <Polaroid src={imgNightwear} className="w-full aspect-square transform rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-transform shadow-lg" />
                </div>
              </div>
            </Link>

            {/* Bottom Middle */}
            <Link to="/shop" className="relative bg-[#ffeb8e] aspect-square rounded-xl overflow-hidden text-[#5e5e5e] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#f6a9c0] rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-[#8ebbe8] rounded-tr-full" />
              <BabyLogo className="absolute top-[8%] right-[8%] w-[15%] h-[15%] max-w-[48px] max-h-[48px] text-white" />
              <Sun className="absolute bottom-[8%] left-[8%] w-[20%] h-[20%] max-w-[64px] max-h-[64px] text-white" strokeWidth={1} />
              
              <div className="z-10 relative w-full h-full flex flex-col items-center justify-between">
                <h3 className="text-3xl sm:text-4xl mt-2 text-[#4a4a4a]" style={{ fontFamily: "'Dancing Script', cursive" }}>Just Arrived</h3>
                <div className="w-[75%] max-w-[220px] my-auto">
                  <Polaroid src={imgPinktop} className="w-full aspect-square transform -rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-transform shadow-lg" />
                </div>
              </div>
            </Link>

            {/* Bottom Right */}
            <Link to="/shop?category=Boys" className="relative bg-[#ffeb8e] aspect-square rounded-xl overflow-hidden text-[#5e5e5e] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="absolute bottom-0 right-0 w-[60%] h-[35%] bg-[#8ebbe8] rounded-tl-full" />
              <Rainbow className="absolute bottom-[10%] right-[10%] w-[25%] h-[25%] max-w-[80px] max-h-[80px] text-white" />
              
              <div className="z-10 flex w-full h-full justify-between items-center text-left">
                <div className="w-[55%] max-w-[180px] my-auto">
                  <Polaroid src={imgProduct1} className="w-full aspect-square transform -rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-transform shadow-lg" />
                </div>
                <div className="w-[45%] flex flex-col justify-center h-full pb-8 pl-3">
                  <h3 className="text-3xl sm:text-4xl text-[#4a4a4a]" style={{ fontFamily: "'Dancing Script', cursive" }}>Cute Baby</h3>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
};

export default BabyBanners;
