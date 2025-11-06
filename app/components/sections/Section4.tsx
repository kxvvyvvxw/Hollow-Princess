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

        <div className="grid grid-cols-2 gap-4 w-full h-full items-center px-8">
          {/* First Column */}
          <div className="flex items-center justify-center">
            <div className="font-geist-sans text-4xl text-black opacity-50">
              C2
            </div>
          </div>
        </div>
      </div>
      {/* Camera Position: (-358.73, 637.01, 595.81) */}
    </section>
  );
}
