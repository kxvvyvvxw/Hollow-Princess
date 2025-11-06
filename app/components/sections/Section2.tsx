import LocationButton from "../LocationButton";

export default function Section2() {
  const shows = [
    { date: "2026.03.12", location: "Seoul, KR" },
    { date: "2026.03.26", location: "Busan, KR" },
    { date: "2026.04.09", location: "Daegu, KR" },
    { date: "2026.05.07", location: "Tokyo, JP" },
    { date: "2026.05.21", location: "Osaka, JP" },
  ];

  const krShows = shows.filter((s) => s.location.endsWith(", KR"));
  const jpShows = shows.filter((s) => s.location.endsWith(", JP"));

  // mobile soft-light diffusion overlay
  return (
    <section
      id="section-2"
      data-section="2"
      className="relative z-10 h-screen w-full flex items-center"
    >
      <div className="w-full px-8 md:px-24 lg:px-32 py-10">
        <div className="relative z-20 w-full space-y-14 md:space-y-20">
          <div className="text-sm uppercase tracking-widest text-neutral-600/50 select-none">
            KR
          </div>
          {krShows.map((s) => (
            <div key={`${s.date}-${s.location}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 items-baseline">
                <div className="justify-self-start">
                  <LocationButton label={s.date} compact align="left" />
                </div>
                <div className="justify-self-end text-right">
                  <LocationButton
                    label={s.location}
                    subLabel={
                      s.location === "Seoul, KR"
                        ? "Sinsa Boutique — Garosu-gil"
                        : s.location === "Busan, KR"
                        ? "Haeundae Market Studio"
                        : s.location === "Daegu, KR"
                        ? "Dongseongno Select Shop"
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="text-sm uppercase tracking-widest text-neutral-600/50 select-none">
            JP
          </div>
          {jpShows.map((s) => (
            <div key={`${s.date}-${s.location}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 items-baseline">
                <div className="justify-self-start">
                  <LocationButton label={s.date} compact align="left" />
                </div>
                <div className="justify-self-end text-right">
                  <LocationButton
                    label={s.location}
                    subLabel={
                      s.location === "Tokyo, JP"
                        ? "Shibuya Ward Showroom"
                        : s.location === "Osaka, JP"
                        ? "Umeda Pop-Up Gallery"
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Camera Position: (-761.97, 618.59, 112.76) */}
    </section>
  );
}
