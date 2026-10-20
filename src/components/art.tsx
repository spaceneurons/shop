import { palettes, type Garment, type Hair, type PaletteId } from "@/lib/data";
import { cn } from "@/lib/utils";

type ArtProps = {
  palette: PaletteId;
  garment: Garment;
  hair?: Hair;
  cloth?: string;
  cloth2?: string;
  mode?: "editorial" | "packshot" | "banner";
  className?: string;
};

export function Art({
  palette,
  garment,
  hair = "long",
  cloth,
  cloth2,
  mode = "editorial",
  className,
}: ArtProps) {
  const tones = palettes[palette];
  const fill = cloth ?? tones.cloth;
  const fill2 = cloth2 ?? tones.cloth2;
  const studio = mode === "packshot";

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: studio
          ? "linear-gradient(180deg, #e4e0db 0%, #d4cfc9 100%)"
          : `linear-gradient(118deg, ${tones.from} 0%, ${tones.to} 58%, ${tones.light} 140%)`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-[18%] -top-[20%] h-[80%] w-[70%] rounded-full opacity-70 blur-2xl"
        style={{ background: studio ? "rgba(255,255,255,.45)" : tones.light }}
      />
      <div className={cn("art-drift absolute inset-0", studio ? "p-[6%]" : "")}>
        <Figure
          garment={garment}
          hair={studio ? "none" : hair}
          cloth={fill}
          cloth2={fill2}
          skin={tones.skin}
          hairColor={tones.hair}
          mode={mode}
        />
      </div>
      <div className="grain pointer-events-none absolute inset-0" />
      {!studio && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
      )}
    </div>
  );
}

function Figure({
  garment,
  hair,
  cloth,
  cloth2,
  skin,
  hairColor,
  mode,
}: {
  garment: Garment;
  hair: Hair;
  cloth: string;
  cloth2: string;
  skin: string;
  hairColor: string;
  mode: "editorial" | "packshot" | "banner";
}) {
  if (mode === "banner") {
    return (
      <svg viewBox="0 0 980 420" className="h-full w-full" preserveAspectRatio="xMaxYMid meet">
        {hair === "twins" ? (
          <g>
            <Person x={470} y={40} scale={0.95} cloth={cloth} cloth2={cloth2} skin={skin} hairColor={hairColor} hair="baby" garment={garment} />
            <Person x={620} y={28} scale={1.05} cloth="#efe8df" cloth2="#d9cfc2" skin={skin} hairColor="#e4cfae" hair="baby" garment="sweater" />
          </g>
        ) : hair === "none" ? (
          <GarmentShape garment={garment} cloth={cloth} cloth2={cloth2} x={620} y={70} scale={1.55} />
        ) : (
          <Person x={560} y={8} scale={1.18} cloth={cloth} cloth2={cloth2} skin={skin} hairColor={hairColor} hair={hair} garment={garment} />
        )}
      </svg>
    );
  }

  if (garment === "cap" && hair === "none") {
    return (
      <svg viewBox="0 0 300 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <Tote x={150} y={130} cloth="#e7e1d8" cloth2="#cfc6bb" scale={1.25} />
        <Cap x={48} y={150} cloth={cloth} cloth2={cloth2} scale={1.55} />
      </svg>
    );
  }

  if (hair === "twins") {
    return (
      <svg viewBox="0 0 300 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <Person x={48} y={90} scale={0.9} cloth="#f7f1e8" cloth2="#e7d9c8" skin={skin} hairColor="#d7b98a" hair="baby" garment="sweater" />
        <Person x={150} y={78} scale={0.98} cloth="#cfc8c0" cloth2="#b7aea4" skin={skin} hairColor="#e6d2b0" hair="baby" garment="sweater" />
      </svg>
    );
  }

  if (mode === "packshot") {
    return (
      <svg viewBox="0 0 300 400" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <GarmentShape garment={garment} cloth={cloth} cloth2={cloth2} x={46} y={48} scale={1.55} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 300 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <Person
        x={62}
        y={18}
        scale={1.2}
        cloth={cloth}
        cloth2={cloth2}
        skin={skin}
        hairColor={hairColor}
        hair={hair}
        garment={garment}
      />
    </svg>
  );
}

function Person({
  x,
  y,
  scale,
  cloth,
  cloth2,
  skin,
  hairColor,
  hair,
  garment,
}: {
  x: number;
  y: number;
  scale: number;
  cloth: string;
  cloth2: string;
  skin: string;
  hairColor: string;
  hair: Hair;
  garment: Garment;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <HairBack hair={hair} color={hairColor} cloth={cloth} />
      <ellipse cx="72" cy="48" rx="22" ry="26" fill={skin} />
      <HairFront hair={hair} color={hairColor} cloth={cloth} />
      <path d="M62 70h20l4 14H58z" fill={skin} />
      <GarmentShape garment={garment} cloth={cloth} cloth2={cloth2} x={8} y={78} scale={0.78} />
    </g>
  );
}

function HairBack({ hair, color, cloth }: { hair: Hair; color: string; cloth: string }) {
  if (hair === "long") {
    return (
      <path
        d="M48 78c-2-40 8-62 24-66 18-4 40 8 46 40 2 18 6 70 2 120-8-30-10-8-14 16-4-28-6-10-12 8-6-30-8-14-16-4-6-40-10-78-30-114z"
        fill={color}
      />
    );
  }
  if (hair === "short") {
    return <path d="M46 46c2-24 52-28 56 0 2 10-8 14-14 8 2-16-28-16-30 0-6 6-16 2-12-8z" fill={color} />;
  }
  if (hair === "beanie" || hair === "baby") {
    return <path d="M46 44c4-26 52-28 56 0v8H46z" fill={hair === "baby" ? cloth : color} />;
  }
  return null;
}

function HairFront({ hair, color, cloth }: { hair: Hair; color: string; cloth: string }) {
  if (hair === "beanie") {
    return <path d="M44 40c8-16 52-16 60 2 0 8-10 10-16 4-8-8-24-8-32 0-6 6-14 4-12-6z" fill={color} />;
  }
  if (hair === "baby") {
    return (
      <g>
        <circle cx="50" cy="30" r="8" fill={cloth} />
        <circle cx="94" cy="30" r="8" fill={cloth} />
      </g>
    );
  }
  return null;
}

function GarmentShape({
  garment,
  cloth,
  cloth2,
  x,
  y,
  scale,
}: {
  garment: Garment;
  cloth: string;
  cloth2: string;
  x: number;
  y: number;
  scale: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {garment === "sweater" && <Sweater cloth={cloth} cloth2={cloth2} />}
      {garment === "hoodie" && <Hoodie cloth={cloth} cloth2={cloth2} />}
      {garment === "puffer" && <Puffer cloth={cloth} cloth2={cloth2} />}
      {garment === "cardigan" && <Cardigan cloth={cloth} cloth2={cloth2} />}
      {garment === "onesie" && <Onesie cloth={cloth} cloth2={cloth2} />}
      {garment === "tote" && <Tote x={20} y={10} cloth={cloth} cloth2={cloth2} scale={1.4} />}
      {garment === "cap" && <Cap x={28} y={40} cloth={cloth} cloth2={cloth2} scale={1.7} />}
      {garment === "coat" && <Coat cloth={cloth} cloth2={cloth2} />}
      {garment === "trousers" && <Trousers cloth={cloth} cloth2={cloth2} />}
      {garment === "dress" && <Dress cloth={cloth} cloth2={cloth2} />}
      {garment === "shirt" && <Shirt cloth={cloth} cloth2={cloth2} />}
      {garment === "scarf" && <Scarf cloth={cloth} cloth2={cloth2} />}
      {garment === "jeans" && <Jeans cloth={cloth} cloth2={cloth2} />}
      {garment === "sweatshirt" && <Sweatshirt cloth={cloth} cloth2={cloth2} />}
      {garment === "pajamas" && <Pajamas cloth={cloth} cloth2={cloth2} />}
      {garment === "jacket" && <Jacket cloth={cloth} cloth2={cloth2} />}
    </g>
  );
}

function Sweater({ cloth, cloth2 }: { cloth: string; cloth2: string }) {
  return (
    <g>
      <path d="M70 18c18 16 42 16 60 0l28 36-22 16-8-18v120H72V52L64 70 42 54z" fill={cloth} />
      <path d="M86 22c8 10 20 10 28 0v16c-8 8-20 8-28 0z" fill={cloth2} />
      <path d="M78 78h44" stroke={cloth2} strokeWidth="3" />
    </g>
  );
}

function Hoodie({ cloth, cloth2 }: { cloth: string; cloth2: string }) {
  return (
    <g>
      <path d="M74 8c20 6 36 6 54 0 8 18 8 28 4 36-16 10-46 10-62 0-4-8-4-18 4-36z" fill={cloth} />
      <path d="M68 36c16 18 48 18 66 0l24 34-24 14-6-16v112H74V68L68 84 46 70z" fill={cloth} />
      <path d="M92 48v34" stroke={cloth2} strokeWidth="2" />
      <path d="M108 48v28" stroke={cloth2} strokeWidth="2" />
      <path d="M118 150h18v10h-18z" fill={cloth2} opacity=".85" />
    </g>
  );
}

function Puffer({ cloth, cloth2 }: { cloth: string; cloth2: string }) {
  return (
    <g>
      <path d="M78 8h44l8 22H70z" fill={cloth} />
      <path d="M62 28h78l18 28-20 12-8-16v130H72V52L64 68 44 56z" fill={cloth} />
      {[48, 72, 96, 120, 144].map((yy) => (
        <path key={yy} d={`M74 ${yy}h54`} stroke={cloth2} strokeWidth="2" opacity=".7" />
      ))}
      <path d="M98 36v18" stroke={cloth2} strokeWidth="2" />
    </g>
  );
}

function Cardigan({ cloth, cloth2 }: { cloth: string; cloth2: string }) {
  return (
    <g>
      <path d="M70 16c16 14 40 14 58 0l26 34-20 14-8-16v122H76V48L68 64 46 50z" fill={cloth} />
      <path d="M98 40v128" stroke={cloth2} strokeWidth="3" />
      {[58, 82, 106, 130].map((yy) => (
        <circle key={yy} cx="98" cy={yy} r="2.4" fill={cloth2} />
      ))}
    </g>
  );
}

function Onesie({ cloth, cloth2 }: { cloth: string; cloth2: string }) {
  return (
    <g>
      <path d="M78 24c14 10 30 10 44 0 10 8 12 16 8 24H70c-4-8-2-16 8-24z" fill={cloth} />
      <path d="M64 46h72c8 20 12 40 8 70l-10 70H78L66 116c-6-28-6-50-2-70z" fill={cloth} />
      <path d="M86 70h28" stroke={cloth2} strokeWidth="3" />
      <circle cx="100" cy="96" r="3" fill={cloth2} />
      <circle cx="100" cy="114" r="3" fill={cloth2} />
    </g>
  );
}

function Coat({ cloth, cloth2 }: { cloth: string; cloth2: string }) {
  return (
    <g>
      <path d="M72 10c16 12 40 12 56 0l22 30-16 12-6-12v168H72V40L66 52 50 40z" fill={cloth} />
      <path d="M98 28v160" stroke={cloth2} strokeWidth="2" opacity=".5" />
      <path d="M84 78h10M108 78h10" stroke={cloth2} strokeWidth="2" />
    </g>
  );
}

function Jacket({ cloth, cloth2 }: { cloth: string; cloth2: string }) {
  return (
    <g>
      <path d="M70 16c16 12 42 12 58 0l24 32-18 14-8-14v108H74V48L66 62 48 48z" fill={cloth} />
      <path d="M86 34h28l-4 18H90z" fill={cloth2} />
      <path d="M100 52v116" stroke={cloth2} strokeWidth="2" />
      <path d="M78 90h16M108 90h16" stroke={cloth2} strokeWidth="2" opacity=".7" />
    </g>
  );
}

function Trousers({ cloth, cloth2 }: { cloth: string; cloth2: string }) {
  return (
    <g>
      <path d="M62 40h76l-4 150H98l-4-90-6 90H66z" fill={cloth} />
      <path d="M70 40h60v16H70z" fill={cloth2} />
      <path d="M96 70v90" stroke={cloth2} strokeWidth="2" opacity=".45" />
    </g>
  );
}

function Jeans({ cloth, cloth2 }: { cloth: string; cloth2: string }) {
  return (
    <g>
      <path d="M60 36h80l-6 156h-28l-4-96-6 96H66z" fill={cloth} />
      <path d="M68 36h64v18H68z" fill={cloth2} />
      <path d="M78 70h8M114 70h8" stroke={cloth2} strokeWidth="3" />
      <path d="M98 64v110" stroke={cloth2} strokeWidth="1.5" opacity=".4" />
    </g>
  );
}

function Dress({ cloth, cloth2 }: { cloth: string; cloth2: string }) {
  return (
    <g>
      <path d="M78 16c12 10 32 10 44 0l8 22H70z" fill={cloth2} />
      <path d="M64 36h72l18 150H46z" fill={cloth} />
      <path d="M86 70c10 8 18 8 28 0" stroke={cloth2} strokeWidth="2" fill="none" />
    </g>
  );
}

function Shirt({ cloth, cloth2 }: { cloth: string; cloth2: string }) {
  return (
    <g>
      <path d="M74 14c14 12 38 12 52 0l22 28-16 12-6-12 4 130H70L74 42 68 54 52 42z" fill={cloth} />
      <path d="M90 20l10 22 10-22" fill={cloth2} />
      <path d="M100 42v120" stroke={cloth2} strokeWidth="2" />
      {[64, 88, 112, 136].map((yy) => (
        <circle key={yy} cx="100" cy={yy} r="2" fill={cloth2} />
      ))}
    </g>
  );
}

function Sweatshirt({ cloth, cloth2 }: { cloth: string; cloth2: string }) {
  return (
    <g>
      <path d="M68 20c18 14 46 14 64 0l26 32-22 14-6-14v112H70V52L64 66 44 52z" fill={cloth} />
      <path d="M88 24c8 10 16 10 24 0v12c-8 8-16 8-24 0z" fill={cloth2} />
      <path d="M74 150h52v12H74z" fill={cloth2} />
    </g>
  );
}

function Pajamas({ cloth, cloth2 }: { cloth: string; cloth2: string }) {
  return (
    <g>
      <path d="M78 16h44l10 24H68z" fill={cloth} />
      <path d="M70 38h60v70H70z" fill={cloth} />
      <path d="M74 112h22l-2 70H70zM104 112h24l6 70h-24z" fill={cloth2} />
    </g>
  );
}

function Scarf({ cloth, cloth2 }: { cloth: string; cloth2: string }) {
  return (
    <g>
      <path d="M48 70c30-20 70-20 104 0l-8 16c-28-16-60-16-88 0z" fill={cloth} />
      <path d="M70 84h28v120H78z" fill={cloth} />
      <path d="M102 84h28l8 120h-28z" fill={cloth2} />
      <path d="M78 180h20M110 184h22" stroke={cloth2} strokeWidth="3" />
    </g>
  );
}

function Tote({
  x,
  y,
  cloth,
  cloth2,
  scale,
}: {
  x: number;
  y: number;
  cloth: string;
  cloth2: string;
  scale: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M18 28h84v90H18z" fill={cloth} />
      <path d="M34 28c0-16 52-16 52 0" fill="none" stroke={cloth2} strokeWidth="6" />
      <path d="M30 48h60" stroke={cloth2} strokeWidth="2" opacity=".4" />
    </g>
  );
}

function Cap({
  x,
  y,
  cloth,
  cloth2,
  scale,
}: {
  x: number;
  y: number;
  cloth: string;
  cloth2: string;
  scale: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M10 34c6-20 54-22 64-2 2 6-6 12-14 10H24c-8 2-16-4-14-8z" fill={cloth} />
      <path d="M8 38h86c-6 10-20 14-34 12C40 48 20 46 8 38z" fill={cloth} />
      <path d="M28 22h18" stroke={cloth2} strokeWidth="2" />
    </g>
  );
}
