export default function Section3() {
  return (
    <section
      id="section-3"
      data-section="3"
      className="relative z-10 h-screen min-h-screen w-full flex items-center justify-center"
    >
      <div className="grid grid-cols-2 gap-4 w-full h-full items-center px-8">
        {/* First Column */}
        <div className="flex items-center justify-center">
          <div className="font-geist-sans text-3xl md:text-4xl text-black/60 leading-tight tracking-tight">
            One edge
            <br />
            sharpens your <span className="font-gothic">memory</span>
          </div>
        </div>

        {/* Second Column */}
        <div className="flex items-center justify-center">
          <div className="font-geist-sans text-3xl md:text-4xl text-black/60 leading-tight tracking-tight text-right">
            The other
            <br />
            sharpens your <span className="font-gothic">teeth</span>
          </div>
        </div>
      </div>
      {/* Camera Position: (342.74, -196.34, 709.88) */}
    </section>
  );
}
