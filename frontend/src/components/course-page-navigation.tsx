"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type NavigationItem = {
  anchor: string;
  label: string;
};

type CoursePageNavigationProps = {
  items: NavigationItem[];
};

export function CoursePageNavigation({ items }: CoursePageNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState(items[0]?.anchor ?? "");
  const [expandedTop, setExpandedTop] = useState<number | null>(null);
  const [collapsedTop, setCollapsedTop] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const anchorIds = useMemo(() => items.map((item) => item.anchor), [items]);

  useEffect(() => {
    const updateFloatingPosition = () => {
      if (!containerRef.current || window.innerWidth < 1024) {
        setExpandedTop(null);
        setCollapsedTop(null);
        return;
      }

      const headerSafeOffset = 112;
      const dockedTopOffset = 16;
      const collapsedButtonHeight = 112;
      const collapsedCenteredTop = window.innerHeight / 2 - collapsedButtonHeight / 2;
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const isNearPageTop = window.scrollY < 24;

      setCollapsedTop(Math.max(headerSafeOffset, collapsedCenteredTop));
      setExpandedTop(
        isNearPageTop ? Math.max(headerSafeOffset, containerTop) : dockedTopOffset,
      );
    };

    updateFloatingPosition();
    window.addEventListener("resize", updateFloatingPosition);
    window.addEventListener("scroll", updateFloatingPosition, { passive: true });

    return () => {
      window.removeEventListener("resize", updateFloatingPosition);
      window.removeEventListener("scroll", updateFloatingPosition);
    };
  }, []);

  useEffect(() => {
    const updateFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");

      if (hash && anchorIds.includes(hash)) {
        setActiveAnchor(hash);
      }
    };

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    return () => {
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, [anchorIds]);

  useEffect(() => {
    const sections = anchorIds
      .map((anchor) => document.getElementById(anchor))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          setActiveAnchor(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-18% 0px -58% 0px",
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [anchorIds]);

  const handleNavigate = (anchor: string) => {
    const target = document.getElementById(anchor);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", `#${anchor}`);
    setActiveAnchor(anchor);
  };

  const placeholderWidthClass = isCollapsed ? "lg:w-12" : "lg:w-[18.5rem]";
  const panelBaseClass =
    "z-20 h-fit self-start transition-[width,opacity,transform] duration-300 ease-out";
  const panelPositionClass =
    isCollapsed
      ? collapsedTop === null
        ? "relative"
        : "lg:fixed lg:left-4 xl:left-6"
      : expandedTop === null
        ? "relative"
        : "lg:fixed lg:left-4 xl:left-6";

  if (isCollapsed) {
    return (
      <div
        ref={containerRef}
        className={`relative self-start transition-[width] duration-300 ease-out ${placeholderWidthClass}`}
      >
        <div
          ref={panelRef}
          className={`${panelBaseClass} ${panelPositionClass}`}
          style={collapsedTop === null ? undefined : { top: `${collapsedTop}px` }}
        >
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            title="展开导航"
            aria-label="展开导航"
            className="flex h-28 w-12 items-center justify-center rounded-[1rem] border border-white/12 bg-[rgba(255,255,255,0.08)] text-sm font-medium text-white/82 backdrop-blur-md transition-all duration-300 ease-out hover:bg-[rgba(255,255,255,0.14)] hover:shadow-[0_14px_40px_rgba(8,10,20,0.16)]"
          >
            <span className="text-lg leading-none">&gt;</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative self-start transition-[width] duration-300 ease-out ${placeholderWidthClass}`}
    >
      <div
        ref={panelRef}
        className={`${panelBaseClass} ${panelPositionClass}`}
        style={expandedTop === null ? undefined : { top: `${expandedTop}px` }}
      >
        <section className="relative rounded-[2rem] border border-white/12 bg-[rgba(255,255,255,0.08)] p-5 backdrop-blur-md transition-all duration-300 ease-out">
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            title="折叠导航"
            aria-label="折叠导航"
            className="absolute top-1/2 right-[-0.9rem] flex h-16 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-[rgba(255,255,255,0.12)] text-white/76 backdrop-blur-md transition-all duration-300 ease-out hover:bg-[rgba(255,255,255,0.18)] hover:text-white"
          >
            <span className="text-lg leading-none">&lt;</span>
          </button>
          <div className="w-[17rem] pr-3">
            <p className="text-sm uppercase tracking-[0.22em] text-white/48">页面导航</p>
            <div className="buyu-scrollbar mt-5 grid max-h-[calc(100svh-12rem)] gap-2 overflow-y-auto pr-1">
              {items.map((item, index) => {
                const isActive = item.anchor === activeAnchor;

                return (
                  <button
                    key={item.anchor}
                    type="button"
                    onClick={() => handleNavigate(item.anchor)}
                    className={`grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 rounded-[1.15rem] border px-4 py-3 text-left text-sm transition ${
                      isActive
                        ? "border-[rgba(229,173,88,0.28)] bg-[rgba(229,173,88,0.14)] text-white"
                        : "border-white/10 bg-[rgba(255,255,255,0.08)] text-white/76 hover:bg-[rgba(255,255,255,0.14)] hover:text-white"
                    }`}
                  >
                    <span className="pt-0.5 text-xs font-medium tabular-nums text-white/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-6">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
