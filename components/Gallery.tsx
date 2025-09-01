'use client';
import Image from 'next/image';

export default function Gallery() {
  const imgs = [
    '/galeria-01.png',
    '/galeria-02.png',
    '/galeria-03.png',
    '/galeria-04.png',
    '/galeria-05.png',
    '/galeria-06.png',
    '/galeria-07.png',
    '/galeria-08.png',
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {imgs.map((src, i) => (
        <div key={src} className="overflow-hidden rounded-xl">
          <Image
            src={src}
            alt={`Galería ${i + 1}`}
            width={1200}
            height={800}
            className="w-full h-auto object-cover"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
