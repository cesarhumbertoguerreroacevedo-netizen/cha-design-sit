'use client';

import * as React from 'react';

type Side = 'left' | 'right' | 'top' | 'bottom';

type SheetContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

type SheetProps = {
  children: React.ReactNode;
  /** Si lo pasas, el Sheet es controlado (usa este valor). */
  open?: boolean;
  /** Se llama cada vez que cambia el estado (controlado o no). */
  onOpenChange?: (open: boolean) => void;
};

/** Contenedor del Sheet (soporta modo controlado y no controlado) */
export function Sheet({ children, open, onOpenChange }: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = typeof open === 'boolean';
  const actualOpen = isControlled ? (open as boolean) : internalOpen;

  const setOpen = (v: boolean) => {
    if (!isControlled) setInternalOpen(v);
    onOpenChange?.(v);
  };

  // Cerrar con ESC cuando está abierto
  React.useEffect(() => {
    if (!actualOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [actualOpen]);

  return (
    <SheetContext.Provider value={{ open: actualOpen, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

/** Botón para abrir el Sheet */
export function SheetTrigger({
  asChild,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const ctx = React.useContext(SheetContext);
  if (!ctx) return null;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children as any).props?.onClick?.(e);
        ctx.setOpen(true);
      },
      ...props,
    });
  }

  return (
    <button onClick={() => ctx.setOpen(true)} {...props}>
      {children}
    </button>
  );
}

/** Botón para cerrar el Sheet */
export function SheetClose({
  asChild,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const ctx = React.useContext(SheetContext);
  if (!ctx) return null;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children as any).props?.onClick?.(e);
        ctx.setOpen(false);
      },
      ...props,
    });
  }

  return (
    <button onClick={() => ctx.setOpen(false)} {...props}>
      {children}
    </button>
  );
}

/** Panel del Sheet (drawer). Acepta side: 'left' | 'right' | 'top' | 'bottom' */
export function SheetContent({
  side = 'right',
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { side?: Side }) {
  const ctx = React.useContext(SheetContext);
  if (!ctx || !ctx.open) return null;

  const panelBase =
    'fixed z-50 bg-white dark:bg-neutral-900 shadow-xl p-6 w-80 max-w-[90vw] h-auto';
  const positions: Record<Side, string> = {
    left: 'left-0 top-0 bottom-0 h-full',
    right: 'right-0 top-0 bottom-0 h-full',
    top: 'top-0 left-0 right-0 w-full',
    bottom: 'bottom-0 left-0 right-0 w-full',
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => ctx.setOpen(false)}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`${panelBase} ${positions[side]} ${className ?? ''}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

/** Encabezado del contenido del Sheet */
export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 ${className ?? ''}`} {...props} />;
}

/** Título del Sheet */
export function SheetTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-lg font-semibold ${className ?? ''}`} {...props} />;
}

/** Descripción del Sheet */
export function SheetDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm text-neutral-500 ${className ?? ''}`} {...props} />;
}
