import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Renders real app components inside a same-origin iframe at a fixed desktop
 * width, so viewport media queries and vw units resolve exactly as they do on
 * a 1280px desktop. The result is scaled to fit the tour column. The frame is
 * inert: no pointer, keyboard, or focus interaction reaches the content.
 */
export function LiveFrame({
  children,
  width = 1280,
  title,
  maxVisibleHeight,
}: {
  children: ReactNode;
  width?: number;
  title: string;
  maxVisibleHeight?: number;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [height, setHeight] = useState(900);
  const [scale, setScale] = useState(0.6);

  const setup = () => {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    if (!doc || !doc.body) return;
    doc.documentElement.className = document.documentElement.className;
    for (const a of Array.from(document.documentElement.attributes)) {
      if (a.name.startsWith("data-") || a.name === "style") doc.documentElement.setAttribute(a.name, a.value);
    }
    doc.head.innerHTML = "";
    document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((n) => doc.head.appendChild(n.cloneNode(true)));
    doc.body.className = document.body.className;
    doc.body.style.margin = "0";
    doc.body.style.overflow = "hidden";
    const root = doc.createElement("div");
    doc.body.appendChild(root);
    setMount(root);
  };

  // Mirror any stylesheet injected after mount (lazy chunks, dev HMR).
  useEffect(() => {
    if (!mount) return;
    const doc = mount.ownerDocument;
    const mo = new MutationObserver((records) => records.forEach((r) => r.addedNodes.forEach((n) => {
      if (n instanceof HTMLStyleElement || (n instanceof HTMLLinkElement && n.rel === "stylesheet")) doc.head.appendChild(n.cloneNode(true));
    })));
    mo.observe(document.head, { childList: true });
    return () => mo.disconnect();
  }, [mount]);

  // Size the frame to the rendered dashboard content.
  useEffect(() => {
    if (!mount) return;
    let ro: ResizeObserver | null = null;
    let pending = 0;
    const t = window.setTimeout(() => {
      const el = mount.querySelector<HTMLElement>("[data-xp-measure]");
      if (!el) return;
      const measure = () => {
        const r = el.getBoundingClientRect();
        setHeight(Math.max(640, Math.ceil(r.top + r.height + 28)));
      };
      measure();
      ro = new ResizeObserver(() => {
        cancelAnimationFrame(pending);
        pending = requestAnimationFrame(measure);
      });
      ro.observe(el);
    }, 30);
    return () => { window.clearTimeout(t); cancelAnimationFrame(pending); ro?.disconnect(); };
  }, [mount]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let pending = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => setScale(el.clientWidth / width));
    });
    ro.observe(el);
    return () => { cancelAnimationFrame(pending); ro.disconnect(); };
  }, [width]);

  const visibleHeight = maxVisibleHeight == null ? height : Math.min(height, maxVisibleHeight);

  return (
    <div ref={wrapRef} className="xp-live" style={{ height: visibleHeight * scale }}>
      <iframe
        ref={frameRef}
        title={title}
        srcDoc="<!doctype html><html><head></head><body></body></html>"
        onLoad={setup}
        tabIndex={-1}
        aria-hidden
        inert
        style={{ width, height, transform: `scale(${scale})` }}
      />
      {mount ? createPortal(children, mount) : null}
    </div>
  );
}
