'use client';
import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge, Shapes, Gem, MessageCircle, ShoppingBag, Mail, Phone, ChevronLeft, ChevronRight, Plus } from "lucide-react";

const colors = { creme:"#BEA691", mocha:"#967864", espresso:"#5A3C32", choco:"#281A14", light:"#F2EAE3" };

const CHAWordmark = ({ className = "w-24 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 220 60" className={className} aria-label="CHA Design logo">
    <defs>
      <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={colors.creme} /><stop offset="100%" stopColor={colors.mocha} />
      </linearGradient>
      <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.25" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <g fill="none" stroke="url(#grad)" strokeWidth="6" filter="url(#softGlow)" strokeLinecap="round">
      <path d="M20 45 Q10 30 20 15 T40 15 T60 30 T80 45" />
      <path d="M95 15 V45 M95 32 H125 M125 15 V45" />
      <path d="M150 45 V15 H185 M167 30 H190 M185 45 V15" />
    </g>
  </svg>
);

const Section = ({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`max-w-6xl mx-auto px-4 sm:px-6 ${className}`}>{children}</section>
);

function Carousel({ items }: { items: { src?: string; fallback?: React.ReactNode; caption?: string }[] }) {
  const scroller = React.useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => { const el = scroller.current; if (!el) return; const w = el.clientWidth; el.scrollBy({ left: dir * (w * 0.9), behavior: "smooth" }); };
  return (<div className="relative">
    <div ref={scroller} className="overflow-x-auto flex gap-4 scroll-smooth snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "thin" }}>
      {items.map((it, i) => (
        <div key={i} className="snap-center shrink-0 w-[85%] md:w-[60%] rounded-2xl ring-1 ring-white/10 bg-white/5 aspect-[4/3] overflow-hidden grid place-items-center relative">
          {it.src ? <img alt={it.caption ?? `slide-${i}`} src={it.src} className="h-full w-full object-cover" /> : (it.fallback ?? <div className="text-white/60">Imagen</div>)}
          {it.caption && <div className="absolute bottom-3 left-3 text-xs tracking-widest text-white/80">{it.caption}</div>}
        </div>
      ))}
    </div>
    <div className="absolute inset-y-0 left-0 hidden md:flex items-center">
      <Button onClick={() => scrollBy(-1)} variant="outline" className="rounded-full border-white/20 bg-black/30 hover:bg-black/50"><ChevronLeft className="w-5 h-5"/></Button>
    </div>
    <div className="absolute inset-y-0 right-0 hidden md:flex items-center">
      <Button onClick={() => scrollBy(1)} variant="outline" className="rounded-full border-white/20 bg-black/30 hover:bg-black/50"><ChevronRight className="w-5 h-5"/></Button>
    </div>
  </div>);
}

export default function CHALandingPage() {
  const carouselItems = [
    { src: "https://images.unsplash.com/photo-1603575449299-5e05e19f1c30?auto=format&fit=crop&w=1400&q=80", caption: "CHA · Piedra" },
    { src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80", caption: "CHA · Madera" },
    { src: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=1400&q=80", caption: "CHA · Cuero" },
  ];
  const initialCatalog = [
    { id: "p1", name: "Piedra / Pizarra personalizada", priceHint: "desde $350 MXN", tag: "Piedra", img: "https://images.unsplash.com/photo-1603575449299-5e05e19f1c30?auto=format&fit=crop&w=1200&q=70" },
    { id: "p2", name: "Llaveros de madera", priceHint: "desde $180 MXN", tag: "Madera", img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=70" },
    { id: "p3", name: "Accesorios en cuero", priceHint: "desde $220 MXN", tag: "Cuero", img: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=1200&q=70" }
  ];

  const [inquiry, setInquiry] = useState<{ id: string; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [catalog, setCatalog] = useState(initialCatalog);
  const fileRef = useRef<HTMLInputElement>(null);
  const [featured, setFeatured] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("Todos");
  const dynamicCarousel = featured.length ? featured.map(id => { const item = catalog.find(p => p.id === id)!; return { src: item?.img, caption: item?.tag }; }) : carouselItems;
  const toggleFeatured = (id: string) => setFeatured(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const waLink = useMemo(() => {
    const phone = "527715029619";
    const text = encodeURIComponent("Hola CHA Design, quisiera una cotización: " + inquiry.map(i=>i.name).join(", "));
    return `https://wa.me/${phone}?text=${text}`;
  }, [inquiry]);
  const mailLink = useMemo(() => {
    const to = "chadesign40@gmail.com";
    const subject = encodeURIComponent("Solicitud de cotización CHA Design");
    const body = encodeURIComponent(`Hola, me interesa cotizar:\n${inquiry.map(i=>"• "+i.name).join("\n")}\n\nDetalles:`);
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }, [inquiry]);

  return (
    <div className="min-h-screen w-full text-[--text]" style={{['--creme' as any]: colors.creme,['--mocha' as any]: colors.mocha,['--espresso' as any]: colors.espresso,['--choco' as any]: colors.choco,['--text' as any]: colors.light,background:`radial-gradient(1200px 600px at 80% -10%, ${colors.espresso}20, transparent), radial-gradient(900px 500px at -10% 10%, ${colors.mocha}22, transparent), linear-gradient(180deg, ${colors.choco}, #120C09 60%, #0C0705)`}}>
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/30 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3"><CHAWordmark className="w-28 h-10" /><span className="hidden sm:inline text-sm tracking-widest text-[color:var(--creme)]">CHA DESIGN</span></div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#servicios" className="hover:text-[color:var(--creme)]">Servicios</a>
            <a href="#galeria" className="hover:text-[color:var(--creme)]">Galería</a>
            <a href="#catalogo" className="hover:text-[color:var(--creme)]">Catálogo</a>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild><Button><ShoppingBag className="w-4 h-4 mr-2" /> Cotizar ({inquiry.length})</Button></SheetTrigger>
              <SheetContent><SheetHeader><SheetTitle>Solicitud de cotización</SheetTitle></SheetHeader>
                <div className="p-4 space-y-3">{inquiry.length===0&&<div className="text-white/60">Aún no agregas productos.</div>}
                  {inquiry.map(it=>(<Card key={it.id}><CardContent className="py-3 px-4 flex items-center justify-between"><div className="text-sm">{it.name}</div><Button variant="outline" onClick={()=>setInquiry(prev=>prev.filter(p=>p.id!==it.id))}>🗑️</Button></CardContent></Card>))}
                  <div className="flex gap-2 pt-2"><a href={waLink} target="_blank" rel="noreferrer"><Button className="bg-green-600 hover:bg-green-700 text-white"><Phone className="w-4 h-4 mr-2"/> WhatsApp</Button></a><a href={mailLink}><Button variant="outline"> <Mail className="w-4 h-4 mr-2"/> Email</Button></a></div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden" id="galeria">
        <Section className="pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">Arte y precisión en <span className="text-[color:var(--creme)]">grabado láser</span></h1>
              <p className="mt-4 text-base/7 text-white/90 max-w-prose">Transformamos madera, piedra, pizarra, cuero y metal en piezas únicas.</p>
              <div className="mt-6 flex flex-wrap gap-3"><a href="#catalogo"><Button className="bg-[color:var(--mocha)] hover:bg-[color:var(--creme)] hover:text-black"><MessageCircle className="w-4 h-4 mr-2" /> Ver catálogo</Button></a><a href={waLink} target="_blank" rel="noreferrer"><Button variant="outline">WhatsApp</Button></a></div>
              <div className="mt-6 flex items-center gap-4 text-xs text-white/60"><div className="flex items-center gap-2"><Badge className="w-4 h-4 text-[color:var(--creme)]" /> Marca propia</div><div className="flex items-center gap-2"><Shapes className="w-4 h-4 text-[color:var(--creme)]" /> Hecho a medida</div><div className="flex items-center gap-2"><Gem className="w-4 h-4 text-[color:var(--creme)]" /> Detalle fino</div></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
              <Carousel items={dynamicCarousel} />
              <p className="mt-3 text-xs text-white/50">Marca como “Destacado” en el catálogo para que aparezca aquí.</p>
            </motion.div>
          </div>
        </Section>
      </header>

      <Section id="servicios" className="py-14 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8">Servicios</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Gem className="w-5 h-5" />, title: "Grabado en piedra / pizarra", desc: "Texturas elegantes y durables." },
            { icon: <Shapes className="w-5 h-5" />, title: "Grabado en madera", desc: "Tablas, llaveros, arte mural y branding." },
            { icon: <Badge className="w-5 h-5" />, title: "Cuero y accesorios", desc: "Marcado fino para obsequios." },
          ].map((s, i) => (
            <Card key={i}><CardHeader><CardTitle className="flex items-center gap-2 text-[color:var(--creme)]">{s.icon}{s.title}</CardTitle></CardHeader><CardContent className="text-sm text-white/80">{s.desc}</CardContent></Card>
          ))}
        </div>
      </Section>

      <Section id="catalogo" className="py-14 sm:py-20">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold">Catálogo</h2>
          <div className="flex items-center gap-3">
            <p className="text-white/60 text-sm hidden md:block">Agrega productos y envíanos tu solicitud.</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e)=>{
              const file = e.target.files?.[0]; if(!file) return; const reader = new FileReader();
              reader.onload = () => { const id = `p${Date.now()}`; setCatalog(prev => [{ id, name: "Nuevo producto", priceHint: "a cotizar", tag: "Personalizado", img: String(reader.result)}, ...prev]); };
              reader.readAsDataURL(file);
            }}/>
            <Button variant="outline" onClick={()=>fileRef.current?.click()}>Subir foto</Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Todos","Piedra","Madera","Cuero","Metal","Personalizado"].map(t => (
            <Button key={t} variant={selectedTag===t?"default":"outline"} className={selectedTag===t?"bg-[color:var(--mocha)] text-black hover:bg-[color:var(--creme)]":""} onClick={()=>setSelectedTag(t)}>{t}</Button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.filter(p => selectedTag==="Todos" || p.tag===selectedTag).map(p => (
            <Card key={p.id} className="overflow-hidden">
              <div className="aspect-[4/3] ring-1 ring-white/10 grid place-items-center overflow-hidden relative">
                <img src={p.img} alt={p.name} className="h-full w-full object-cover"/>
                <div className="absolute bottom-2 left-2 text-[10px] tracking-widest bg-black/30 px-2 py-1 rounded-md">CHA · DESIGN</div>
                <button type="button" onClick={()=> {setFeatured(f=>f.includes(p.id)?f.filter(x=>x!==p.id):[...f,p.id]);}} className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 rounded-full px-2 py-1 text-xs">
                  {featured.includes(p.id) ? "★ Destacado" : "☆ Destacar"}
                </button>
              </div>
              <CardHeader className="pb-2"><CardTitle className="text-base">{p.name}</CardTitle></CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-white/70">
                <span>{p.priceHint}</span>
                <Button size="sm" className="bg-[color:var(--mocha)] hover:bg-[color:var(--creme)] hover:text-black" onClick={()=>{ setInquiry(prev => prev.find(x=>x.id===p.id)? prev : [...prev, { id:p.id, name:p.name }]); }}>
                  <Plus className="w-4 h-4 mr-1"/> Cotizar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="contacto" className="py-14 sm:py-20">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[color:var(--espresso)] to-[color:var(--mocha)] shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold">¿Listo para tu pieza personalizada?</h3>
              <p className="mt-2 text-white/90">Cuéntanos tu idea y te respondemos con una propuesta y precio estimado.</p>
              <div className="mt-6 flex gap-3 flex-wrap">
                <a href={`https://wa.me/527715029619?text=${encodeURIComponent('Hola CHA Design, quisiera una cotización')}`} target="_blank" rel="noreferrer"><Button className="bg-green-600 hover:bg-green-700 text-white"><Phone className="w-4 h-4 mr-2"/> WhatsApp</Button></a>
                <a href={`mailto:chadesign40@gmail.com?subject=${encodeURIComponent('Solicitud de cotización CHA Design')}`}><Button variant="secondary" className="bg-[#BEA691] text-black"><Mail className="w-4 h-4 mr-2"/> Enviar correo</Button></a>
              </div>
            </div>
            <form className="grid sm:grid-cols-2 gap-4">
              <Input placeholder="Nombre" />
              <Input placeholder="Email" type="email" />
              <Input placeholder="Teléfono (opcional)" className="sm:col-span-2" />
              <Textarea placeholder="Cuéntanos tu idea…" className="sm:col-span-2 min-h-[120px]" />
              <Button className="rounded-2xl bg-black/40 hover:bg-black/60 w-fit">Enviar</Button>
            </form>
          </div>
        </div>
      </Section>

      <footer className="border-t border-white/10">
        <Section className="py-10 grid md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-3"><CHAWordmark className="w-20 h-8" /><div className="text-sm text-white/70">© {new Date().getFullYear()} CHA Design</div></div>
          <div className="text-sm text-white/70">Grabado láser creativo · Hecho en Canadá / México</div>
          <div className="flex justify-start md:justify-end gap-3"><Button variant="outline" size="sm">Instagram</Button><Button variant="outline" size="sm">Facebook</Button><Button variant="outline" size="sm">TikTok</Button></div>
        </Section>
      </footer>
    </div>
  );
}
