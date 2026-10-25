function lumiArt(options) {
  if (options.image) {
    const src = `images/${encodeURIComponent(options.image)}`;
    return `<div class="art ${options.mode === "packshot" ? "art-studio" : ""}"><img class="photo" src="${src}" alt=""></div>`;
  }
  const palette = LUMI.palettes[options.palette] || LUMI.palettes.stone;
  const cloth = options.cloth || palette.cloth;
  const cloth2 = options.cloth2 || palette.cloth2;
  const mode = options.mode || "editorial";
  const studio = mode === "packshot";
  const background = studio
    ? "linear-gradient(180deg, #e4e0db 0%, #d4cfc9 100%)"
    : `linear-gradient(118deg, ${palette.from} 0%, ${palette.to} 58%, ${palette.light} 140%)`;
  const figure = studio
    ? `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid meet">${garmentSvg(options.garment, cloth, cloth2, 46, 48, 1.55)}</svg>`
    : figureSvg(options, cloth, cloth2, palette);
  return `<div class="art ${studio ? "art-studio" : ""}" style="background:${background}">
    <div class="art-glow" style="background:${studio ? "rgba(255,255,255,.45)" : palette.light}"></div>
    <div class="art-drift">${figure}</div>
    <div class="grain"></div>
    ${studio ? "" : '<div class="art-shade"></div>'}
  </div>`;
}

function figureSvg(options, cloth, cloth2, palette) {
  if (options.mode === "banner") {
    const inner = options.hair === "twins"
      ? `${person(470, 40, 0.95, cloth, cloth2, palette.skin, palette.hair, "baby", options.garment)}${person(620, 28, 1.05, "#efe8df", "#d9cfc2", palette.skin, "#e4cfae", "baby", "sweater")}`
      : options.hair === "none"
        ? garmentSvg(options.garment, cloth, cloth2, 620, 70, 1.55)
        : person(560, 8, 1.18, cloth, cloth2, palette.skin, palette.hair, options.hair, options.garment);
    return `<svg viewBox="0 0 980 420" preserveAspectRatio="xMaxYMid meet">${inner}</svg>`;
  }
  if (options.garment === "cap" && options.hair === "none") {
    return `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">${tote(150, 130, "#e7e1d8", "#cfc6bb", 1.25)}${cap(48, 150, cloth, cloth2, 1.55)}</svg>`;
  }
  if (options.hair === "twins") {
    return `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">${person(48, 90, 0.9, "#f7f1e8", "#e7d9c8", palette.skin, "#d7b98a", "baby", "sweater")}${person(150, 78, 0.98, "#cfc8c0", "#b7aea4", palette.skin, "#e6d2b0", "baby", "sweater")}</svg>`;
  }
  return `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">${person(62, 18, 1.2, cloth, cloth2, palette.skin, palette.hair, options.hair, options.garment)}</svg>`;
}

function person(x, y, scale, cloth, cloth2, skin, hair, hairKind, garment) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    ${hairBack(hairKind, hair, cloth)}
    <ellipse cx="72" cy="48" rx="22" ry="26" fill="${skin}"/>
    ${hairFront(hairKind, hair, cloth)}
    <path d="M62 70h20l4 14H58z" fill="${skin}"/>
    ${garmentSvg(garment, cloth, cloth2, 8, 78, 0.78)}
  </g>`;
}

function hairBack(kind, color, cloth) {
  if (kind === "long") return `<path d="M50 86c0-46 44-58 48-8 2 34 4 78-2 112-8-36-12-8-16 18-6-32-8-12-14 6-8-40-8-70-16-128z" fill="${color}"/>`;
  if (kind === "short") return `<path d="M48 50c2-24 50-28 54 0 1 8-8 12-12 6-8-10-24-10-30 0-5 6-14 2-12-6z" fill="${color}"/>`;
  if (kind === "beanie" || kind === "baby") return `<path d="M46 44c4-26 52-28 56 0v8H46z" fill="${kind === "baby" ? cloth : color}"/>`;
  return "";
}

function hairFront(kind, color, cloth) {
  if (kind === "beanie") return `<path d="M44 40c8-16 52-16 60 2 0 8-10 10-16 4-8-8-24-8-32 0-6 6-14 4-12-6z" fill="${color}"/>`;
  if (kind === "baby") return `<circle cx="50" cy="30" r="8" fill="${cloth}"/><circle cx="94" cy="30" r="8" fill="${cloth}"/>`;
  return "";
}

function garmentSvg(kind, cloth, cloth2, x, y, scale) {
  const body = {
    sweater: `<path d="M70 18c18 16 42 16 60 0l28 36-22 16-8-18v120H72V52L64 70 42 54z" fill="${cloth}"/><path d="M86 22c8 10 20 10 28 0v16c-8 8-20 8-28 0z" fill="${cloth2}"/>`,
    hoodie: `<path d="M74 8c20 6 36 6 54 0 8 18 8 28 4 36-16 10-46 10-62 0-4-8-4-18 4-36z" fill="${cloth}"/><path d="M68 36c16 18 48 18 66 0l24 34-24 14-6-16v112H74V68L68 84 46 70z" fill="${cloth}"/><path d="M92 48v34M108 48v28" stroke="${cloth2}" stroke-width="2"/><path d="M118 150h18v10h-18z" fill="${cloth2}"/>`,
    puffer: `<path d="M78 8h44l8 22H70z" fill="${cloth}"/><path d="M62 28h78l18 28-20 12-8-16v130H72V52L64 68 44 56z" fill="${cloth}"/>${[48, 72, 96, 120, 144].map((yy) => `<path d="M74 ${yy}h54" stroke="${cloth2}" stroke-width="2" opacity=".7"/>`).join("")}`,
    cardigan: `<path d="M70 16c16 14 40 14 58 0l26 34-20 14-8-16v122H76V48L68 64 46 50z" fill="${cloth}"/><path d="M98 40v128" stroke="${cloth2}" stroke-width="3"/>`,
    onesie: `<path d="M78 24c14 10 30 10 44 0 10 8 12 16 8 24H70c-4-8-2-16 8-24z" fill="${cloth}"/><path d="M64 46h72c8 20 12 40 8 70l-10 70H78L66 116c-6-28-6-50-2-70z" fill="${cloth}"/><circle cx="100" cy="96" r="3" fill="${cloth2}"/><circle cx="100" cy="114" r="3" fill="${cloth2}"/>`,
    coat: `<path d="M72 10c16 12 40 12 56 0l22 30-16 12-6-12v168H72V40L66 52 50 40z" fill="${cloth}"/><path d="M98 28v160" stroke="${cloth2}" stroke-width="2" opacity=".5"/>`,
    jacket: `<path d="M70 16c16 12 42 12 58 0l24 32-18 14-8-14v108H74V48L66 62 48 48z" fill="${cloth}"/><path d="M86 34h28l-4 18H90z" fill="${cloth2}"/><path d="M100 52v116" stroke="${cloth2}" stroke-width="2"/>`,
    trousers: `<path d="M62 40h76l-4 150H98l-4-90-6 90H66z" fill="${cloth}"/><path d="M70 40h60v16H70z" fill="${cloth2}"/>`,
    jeans: `<path d="M60 36h80l-6 156h-28l-4-96-6 96H66z" fill="${cloth}"/><path d="M68 36h64v18H68z" fill="${cloth2}"/><path d="M98 64v110" stroke="${cloth2}" stroke-width="1.5" opacity=".4"/>`,
    dress: `<path d="M78 16c12 10 32 10 44 0l8 22H70z" fill="${cloth2}"/><path d="M64 36h72l18 150H46z" fill="${cloth}"/>`,
    shirt: `<path d="M74 14c14 12 38 12 52 0l22 28-16 12-6-12 4 130H70L74 42 68 54 52 42z" fill="${cloth}"/><path d="M90 20l10 22 10-22" fill="${cloth2}"/><path d="M100 42v120" stroke="${cloth2}" stroke-width="2"/>`,
    sweatshirt: `<path d="M68 20c18 14 46 14 64 0l26 32-22 14-6-14v112H70V52L64 66 44 52z" fill="${cloth}"/><path d="M88 24c8 10 16 10 24 0v12c-8 8-16 8-24 0z" fill="${cloth2}"/><path d="M74 150h52v12H74z" fill="${cloth2}"/>`,
    pajamas: `<path d="M78 16h44l10 24H68z" fill="${cloth}"/><path d="M70 38h60v70H70z" fill="${cloth}"/><path d="M74 112h22l-2 70H70zM104 112h24l6 70h-24z" fill="${cloth2}"/>`,
    scarf: `<path d="M48 70c30-20 70-20 104 0l-8 16c-28-16-60-16-88 0z" fill="${cloth}"/><path d="M70 84h28v120H78z" fill="${cloth}"/><path d="M102 84h28l8 120h-28z" fill="${cloth2}"/>`,
    tote: tote(0, 0, cloth, cloth2, 1),
    cap: cap(0, 0, cloth, cloth2, 1),
  }[kind] || "";
  if (kind === "tote" || kind === "cap") return body;
  return `<g transform="translate(${x} ${y}) scale(${scale})">${body}</g>`;
}

function tote(x, y, cloth, cloth2, scale) {
  return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M18 28h84v90H18z" fill="${cloth}"/><path d="M34 28c0-16 52-16 52 0" fill="none" stroke="${cloth2}" stroke-width="6"/></g>`;
}

function cap(x, y, cloth, cloth2, scale) {
  return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M10 34c6-20 54-22 64-2 2 6-6 12-14 10H24c-8 2-16-4-14-8z" fill="${cloth}"/><path d="M8 38h86c-6 10-20 14-34 12C40 48 20 46 8 38z" fill="${cloth}"/><path d="M28 22h18" stroke="${cloth2}" stroke-width="2"/></g>`;
}
