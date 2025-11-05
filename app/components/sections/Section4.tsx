import Image from "next/image";

export default function Section4() {
  return (
    <section
      id="section-4"
      data-section="4"
      className="relative z-10 h-screen min-h-screen w-full flex items-center justify-center"
    >
      <div className="grid grid-cols-2 gap-4 w-full h-full items-center px-8">
        {/* First Column */}
        <div className="flex items-center justify-center">
          <div className="font-geist-sans text-4xl text-black opacity-50">
            C1
          </div>
        </div>

        {/* Second Column */}
        <div className="relative flex items-center justify-center">
          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-8 rounded-full bg-[#dfe3e9]/70 blur-xl -z-10" />
          <div className="relative w-full h-[1080px] max-w-[1260px]">
            <Image
              src={"/images/t-p-t-02.png"}
              alt="Top n Pants"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
      {/* Camera Position: (-358.73, 637.01, 595.81) */}
    </section>
  );
}
