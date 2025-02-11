import Link from "next/link";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="bg-[#1A1A1A] mt-6 min-h-screen flex items-center px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl w-full mx-auto py-16 flex flex-col lg:flex-row justify-between items-center">
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start items-center gap-2 mb-5">
            <div className="flex justify-center lg:justify-start items-center gap-2 mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                className="w-32 text-green-500 md:w-36 fill-transparent stroke-green-500"
              >
                <circle cx="50" cy="50" r="48" strokeWidth="4" />
                <path d="M30,50 Q50,10 70,50 Q50,90 30,50" strokeWidth="6" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-semibold text-white mb-4">Welcome to PickAll</h1>
          <p className="text-lg text-zinc-300 mb-6">
            Choose the best for you. Simple, effective, and always stylish.
          </p>
        </div>

        <div className="w-full lg:w-1/2">
          <Image
            src="/path/to/your/image.jpg"
            alt="PickAll Banner"
            width={700}
            height={500}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
