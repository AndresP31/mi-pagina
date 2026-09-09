import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import caramelAsset from "@/assets/caramel.jpg.asset.json";
import doughAsset from "@/assets/cookie-dough.jpg.asset.json";
import stackAsset from "@/assets/cookie-stack.jpg.asset.json";
import creamAsset from "@/assets/cookies-cream.jpg.asset.json";
import chocolateAsset from "@/assets/double-chocolate.jpg.asset.json";
import vanillaAsset from "@/assets/vanilla-cookie.jpg.asset.json";
import logoAsset from "@/assets/migal.png.asset.json";
import editorialStackAsset from "@/assets/chocolate-stack-editorial.jpg.asset.json";
import mixedStackAsset from "@/assets/mixed-cookie-stack.jpg.asset.json";
import heroTextureAsset from "@/assets/miga1.jpg.asset.json";
import heroStackAsset from "@/assets/hero-stack-hd.jpg.asset.json";


import caramelTextureAsset from "@/assets/caramel-texture.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "miga | Galletas artesanales en Caracas" },
      { name: "description", content: "Galletas gruesas, suaves y artesanales en Caracas. Elige tus sabores y pide tu caja de miga por WhatsApp." },
      { property: "og:title", content: "miga | Galletas artesanales en Caracas" },
      { property: "og:description", content: "Galletas gruesas, suaves y artesanales. Arma tu caja y pide por WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Flavor = { name: string; description: string; price: number; image: string; position?: string };

const flavors: Flavor[] = [
  { name: "Vainilla", description: "Masa clásica suave de vainilla cargada con trozos de chocolate con leche.", price: 4, image: vanillaAsset.url },
  { name: "Chocolate", description: "Masa intensa de cacao, chispas de chocolate oscuro y centro cremoso.", price: 4, image: chocolateAsset.url },
  { name: "Red Velvet", description: "Masa suave estilo Red Velvet con chocolate blanco y centro de queso crema.", price: 4.5, image: creamAsset.url },
  { name: "Canela", description: "Masa especiada con azúcar de canela y centro estilo cinnamon roll.", price: 4, image: doughAsset.url },
  { name: "Limón", description: "Masa fresca infusionada con ralladura de limón y centro cremoso de pie.", price: 4, image: stackAsset.url, position: "center 68%" },
  { name: "Caramelo", description: "Masa de azúcar morena, trozos de toffee crocante y un toque de sal marina.", price: 4.5, image: caramelAsset.url },
];

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => entry?.isIntersecting && setVisible(true), { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>{children}</div>;
}

function useSmoothAnchor() {
  return (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stickyOffset = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--anchor-offset")) || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - stickyOffset;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    target.setAttribute("tabindex", "-1");
    window.setTimeout(() => target.focus({ preventScroll: true }), reduce ? 0 : 700);
    if (history.replaceState) history.replaceState(null, "", `#${id}`);
  };
}

function useParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const apply = () => {
      frame = 0;
      const y = window.scrollY;
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((node) => {
        const speed = Number(node.dataset["parallax"] ?? 0);
        const rect = node.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed * -0.12;
        node.style.setProperty("--parallax", `${offset.toFixed(2)}px`);
      });
      void y;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(apply); };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}


function Index() {
  const smoothTo = useSmoothAnchor();
  useParallax();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const change = (name: string, amount: number) => setQuantities((current) => ({ ...current, [name]: Math.max(0, (current[name] ?? 0) + amount) }));
  const selected = flavors.filter((flavor) => (quantities[flavor.name] ?? 0) > 0);
  const count = selected.reduce((sum, flavor) => sum + (quantities[flavor.name] ?? 0), 0);
  const total = selected.reduce((sum, flavor) => sum + flavor.price * (quantities[flavor.name] ?? 0), 0);
  const whatsappUrl = useMemo(() => {
    const detail = selected.map((flavor) => `• ${quantities[flavor.name]} × ${flavor.name}`).join("\n");
    const message = count ? `¡Hola! Quiero hacer un pedido de Miga:\n${detail}\nTotal estimado: $${total.toFixed(2)}` : "¡Hola! Quiero hacer un pedido de Miga";
    return `https://wa.me/584142071474?text=${encodeURIComponent(message)}`;
  }, [count, quantities, selected, total]);

  return (
    <main className="overflow-x-hidden bg-background text-foreground">
      <header className="hero relative overflow-hidden bg-primary text-primary-foreground">
        <img src={heroTextureAsset.url} alt="" className="hero-texture" aria-hidden="true" />

        <div className="relative mx-auto flex min-h-[min(96svh,900px)] max-w-[1440px] flex-col px-5 sm:px-8">
          <nav className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pt-6 sm:grid-cols-3">
            <a href="#inicio" className="logo-link" onClick={(event) => smoothTo(event, "inicio")} aria-label="miga, inicio"><img src={logoAsset.url} alt="miga" className="h-auto w-24 sm:w-28" /></a>
            <span className="hidden text-center text-[11px] font-semibold uppercase text-primary-foreground/65 sm:block">Caracas · Soft &amp; Chunky</span>
            <a href="#pedido" onClick={(event) => smoothTo(event, "pedido")} className="justify-self-end rounded-md border border-primary-foreground/30 px-4 py-2 text-[11px] font-bold uppercase transition hover:bg-primary-foreground hover:text-primary">Pedir</a>
          </nav>

          <div id="inicio" className="relative flex flex-1 flex-col items-center justify-center pb-10 pt-10 sm:pt-14">
            <h1 className="sr-only">miga · galletas artesanales en Caracas</h1>

            <div className="hero-stage">
              <div className="hero-panel" data-parallax="0.25">
                <img src={heroStackAsset.url} alt="Galletas de chocolate rellenas apiladas" fetchPriority="high" />
              </div>
              <img src={logoAsset.url} alt="miga" className="hero-wordmark" />
            </div>

            <p className="hero-note mt-6 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-primary-foreground/55">Galletas artesanales · Caracas</p>

            <div className="hero-actions flex flex-wrap items-center justify-center gap-3">
              <a href="#sabores" onClick={(event) => smoothTo(event, "sabores")} className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-foreground transition hover:scale-[1.03]">Ver sabores →</a>
              <a href="#pedido" onClick={(event) => smoothTo(event, "pedido")} className="rounded-xl border border-primary-foreground/25 px-5 py-3 text-sm font-semibold text-primary-foreground/85 transition hover:bg-primary-foreground/10">Ver mi pedido</a>
            </div>
          </div>

        </div>
        <div className="overflow-hidden border-y border-primary-foreground/15 py-3">
          <div className="marquee flex w-max whitespace-nowrap font-display text-xl font-black uppercase text-primary-foreground/85">
            {[0, 1, 2, 3].map((item) => <span key={item} className="px-6">MIGA • CARACAS • SOFT &amp; CHUNKY •</span>)}
          </div>
        </div>
      </header>


      <div className="ticker-secondary overflow-hidden bg-background py-2 text-primary" aria-hidden="true">
        <div className="marquee-reverse flex w-max whitespace-nowrap text-[11px] font-semibold uppercase">
          {[0, 1, 2, 3, 4].map((item) => <span key={item} className="px-8">Horneadas en pequeños lotes <span className="mx-6 text-accent">◆</span> centro suave <span className="mx-6 text-accent">◆</span> bordes firmes</span>)}
        </div>
      </div>

      <section id="sabores" className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal className="mb-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div><p className="mb-3 text-xs font-bold uppercase text-accent">El catálogo</p><h2 className="font-display text-5xl font-black leading-none sm:text-7xl">Seis sabores.</h2></div>
          <span className="hidden text-xs font-semibold text-muted-foreground sm:block">Precios en USD</span>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flavors.map((flavor) => {
            const quantity = quantities[flavor.name] ?? 0;
            return (
              <Reveal key={flavor.name} className="h-full">
                <article className="product-card flex h-full flex-col gap-4 bg-primary p-4 text-primary-foreground">
                  <img src={flavor.image} alt={`Galleta sabor ${flavor.name}`} className="aspect-[4/3] w-full object-cover" style={flavor.position ? { objectPosition: flavor.position } : undefined} loading="lazy" />
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                    <div className="min-w-0"><h3 className="font-display text-2xl font-black">{flavor.name}</h3><p className="mt-2 text-sm leading-relaxed text-primary-foreground/65">{flavor.description}</p></div>
                    <span className="font-display text-2xl font-black">${flavor.price}</span>
                  </div>
                  {quantity === 0 ? (
                    <button onClick={() => change(flavor.name, 1)} className="mt-auto flex w-full items-center justify-center gap-2 bg-accent py-3 font-bold text-accent-foreground transition hover:scale-[1.02]" aria-label={`Agregar ${flavor.name}`}><Plus size={17} /> Agregar</button>
                  ) : (
                    <div className="mt-auto grid grid-cols-[44px_1fr_44px] items-center bg-accent text-accent-foreground">
                      <button onClick={() => change(flavor.name, -1)} className="grid h-11 place-items-center transition hover:bg-primary/15" aria-label={`Quitar ${flavor.name}`}><Minus size={17} /></button>
                      <span className="text-center font-display text-lg font-black">{quantity}</span>
                      <button onClick={() => change(flavor.name, 1)} className="grid h-11 place-items-center transition hover:bg-primary/15" aria-label={`Agregar otra ${flavor.name}`}><Plus size={17} /></button>
                    </div>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <div className="overflow-hidden border-y border-primary/15 bg-background py-4" aria-hidden="true">
        <div className="marquee flex w-max whitespace-nowrap font-display text-2xl font-black uppercase text-primary sm:text-3xl">
          {[0, 1, 2, 3].map((item) => <span key={item} className="px-8">ELIGE · COMBINA · DISFRUTA · <span className="text-accent">REPITE ·</span></span>)}
        </div>
      </div>

      <section id="pedido" className="bg-accent text-accent-foreground">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
          <Reveal className="lg:col-span-7">
            <p className="mb-3 text-xs font-bold uppercase text-accent-foreground/70">Formas de llevar</p>
            <h2 className="font-display text-5xl font-black leading-none sm:text-7xl">Elige tu pack.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[{n:"1",title:"1 Galleta",copy:"Empaque individual de la marca.",price:"Desde $4"},{n:"4",title:"Caja de 4",copy:"Tu selección en la caja insignia de miga.",price:"$16"},{n:"6",title:"Caja de 6",copy:"Tu selección en empaque especial.",price:"$24"}].map((pack, index) => (
                <article key={pack.n} className={`pack p-5 ${index === 1 ? "bg-background text-foreground" : "border border-accent-foreground/25"}`}>
                  <span className="font-display text-5xl font-black">{pack.n}</span><h3 className="mt-4 font-bold">{pack.title}</h3><p className="mt-2 min-h-10 text-xs opacity-65">{pack.copy}</p><p className="mt-5 font-display text-xl font-black">{pack.price}</p>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5">
            <aside className="bg-primary p-6 text-primary-foreground shadow-summary">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><h3 className="font-display text-3xl font-black">Tu selección</h3><span className="text-xs font-bold uppercase text-accent">{count} {count === 1 ? "galleta" : "galletas"}</span></div>
              {selected.length ? <ul className="mt-5 divide-y divide-primary-foreground/15">{selected.map((flavor) => <li key={flavor.name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-3"><div><p className="font-semibold">{flavor.name}</p><p className="text-xs text-primary-foreground/55">× {quantities[flavor.name]}</p></div><span className="font-display text-lg font-black">${(flavor.price * (quantities[flavor.name] ?? 0)).toFixed(2)}</span></li>)}</ul> : <p className="my-10 text-sm leading-relaxed text-primary-foreground/55">Agrega tus sabores favoritos para preparar el mensaje de tu pedido.</p>}
              <div className="mt-4 flex items-end justify-between border-t border-primary-foreground/20 pt-5"><span className="text-sm text-primary-foreground/65">Total estimado</span><span className="font-display text-4xl font-black">${total.toFixed(2)}</span></div>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-6 flex w-full items-center justify-center gap-2 bg-background py-4 text-sm font-bold text-foreground transition hover:scale-[1.02]"><ShoppingBag size={17} /> Pedir por WhatsApp</a>
              <p className="mt-3 text-center text-[11px] text-primary-foreground/50">Pedido coordinado directamente por WhatsApp</p>
            </aside>
          </Reveal>
        </div>
      </section>

      <section className="ending-section relative overflow-hidden bg-primary text-primary-foreground">
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
          <Reveal className="ending-visual relative lg:col-span-7">
            <div className="ending-main ml-auto w-[82%] overflow-hidden" data-parallax="0.5"><img src={mixedStackAsset.url} alt="Galletas de vainilla y chocolate apiladas" className="aspect-[4/5] w-full object-cover" loading="lazy" /></div>
            <div className="ending-detail absolute bottom-8 left-0 w-[38%] overflow-hidden border-[6px] border-primary" data-parallax="-0.8"><img src={caramelTextureAsset.url} alt="Detalle cremoso de caramelo" className="aspect-square w-full object-cover" loading="lazy" /></div>
            <span className="ending-caption absolute left-4 top-5 bg-accent px-4 py-2 text-[11px] font-bold uppercase text-accent-foreground">Textura que se queda</span>
          </Reveal>
          <Reveal className="lg:col-span-5"><p className="mb-4 text-xs font-semibold uppercase text-accent">Hechas en Caracas</p><h2 className="font-display text-5xl font-black leading-[.9] sm:text-7xl">Mucho sabor.<br />Sin medias tintas.</h2><div className="my-7 h-px w-20 bg-accent" /><p className="max-w-[44ch] text-lg leading-relaxed text-primary-foreground/70">Cada galleta combina bordes firmes, centro suave y una mezcla generosa de texturas. Elige la tuya, arma tu caja y disfruta sin complicaciones.</p><a href="#sabores" onClick={(event) => smoothTo(event, "sabores")} className="story-link mt-8 inline-block text-sm font-bold">Volver a los sabores →</a></Reveal>
        </div>

        <div className="closing-band border-t border-primary-foreground/15">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-14 sm:px-8 md:grid-cols-3">
            {[{ n: "01", t: "Pequeños lotes", c: "Horneadas el mismo día del despacho." }, { n: "02", t: "Seis sabores", c: "Combínalos como quieras en tu caja." }, { n: "03", t: "Pedido directo", c: "Coordinamos todo por WhatsApp." }].map((item) => (
              <Reveal key={item.n}>
                <div className="closing-item">
                  <span className="font-display text-xs font-black tracking-widest text-accent">{item.n}</span>
                  <h3 className="mt-3 font-display text-2xl font-black">{item.t}</h3>
                  <p className="mt-2 text-sm text-primary-foreground/60">{item.c}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="overflow-hidden border-t border-primary-foreground/15 py-4" aria-hidden="true">
            <div className="marquee-reverse flex w-max whitespace-nowrap font-display text-2xl font-black uppercase text-primary-foreground/25 sm:text-4xl">
              {[0, 1, 2, 3].map((item) => <span key={item} className="px-8">SOFT &amp; CHUNKY <span className="text-accent">◆</span> CARACAS <span className="text-accent">◆</span></span>)}
            </div>
          </div>
        </div>
      </section>


      <footer className="border-t border-primary-foreground/15 bg-primary px-5 py-10 text-primary-foreground sm:px-8"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 sm:flex-row sm:items-center"><img src={logoAsset.url} alt="miga" className="h-auto w-24" /><span className="text-xs text-primary-foreground/55">Caracas, Venezuela · Soft &amp; Chunky · © 2026</span></div></footer>
    </main>
  );
}