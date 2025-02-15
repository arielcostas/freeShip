import '../../index.css';

const HeroSection = () => {
  return (
    <div className="bg-[#1A1A1A] mt-6 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="w-full max-w-7xl flex flex-col items-center text-center gap-4">
        {/* Nuevo Logo con animación */}
        <svg
          fill="#148211"
          height="200px"
          width="200px"
          version="1.1"
          id="Icons"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 32 32"
          xmlSpace="preserve"
          className="animate-leveitate"
        >
          <g id="SVGRepo_iconCarrier">
            <g>
              <path d="M16,16.1c-0.9,0-9.1-0.1-9.1-3.3C6.9,8,11,4,16,4s9.1,4,9.1,8.9C25.1,16,16.9,16.1,16,16.1z"></path>
            </g>
            <path d="M27,11.6c0.1,0.4,0.1,0.9,0.1,1.3c0,4.7-7.7,5.3-11.1,5.3S4.9,17.6,4.9,12.9c0-0.4,0-0.9,0.1-1.3C1.8,13,0,15,0,17.3C0,21.6,7,25,16,25s16-3.4,16-7.8C32,15,30.2,13,27,11.6z M18,22h-4c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1S18.6,22,18,22z"></path>
          </g>
        </svg>

        {/* Título */}
        <h1 className="text-5xl font-semibold text-white">pickall</h1>
      </div>
    </div>
  );
};

export default HeroSection;
