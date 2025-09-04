"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

interface ColorInfo
{
  name: string;
  cssVar: string; // used as var(--{cssVar})
  description?: string;
}

interface ColorGroup
{
  title: string;
  colors: ColorInfo[];
}

interface ColorSwatchProps
{
  name: string;
  cssVar: string;
  description?: string;
}

interface ColorGroupProps
{
  title: string;
  colors: ColorInfo[];
}

// Parse "rgb(a,b,c)" or "rgba(a,b,c,a)" to [r,g,b]
const parseRgbString = (rgbStr: string): [number, number, number] | null =>
{
  const m = rgbStr.match(
    /rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+)?\s*\)/i
  );
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
};

// sRGB luminance
const getLuminanceFromRgb = (r: number, g: number, b: number): number =>
{
  const toLinear = (v: number) =>
  {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

// Decide black or white text based on background luminance
const getContrastingText = (
  rgbStr: string,
  threshold = 0.5
): "#000000" | "#FFFFFF" =>
{
  const rgb = parseRgbString(rgbStr);
  if (!rgb) return "#000000";
  const lum = getLuminanceFromRgb(rgb[0], rgb[1], rgb[2]);
  return lum > threshold ? "#000000" : "#FFFFFF";
};

const ColorDisplay: React.FC = () =>
{
  // A hidden element used to resolve any CSS color (hex, rgb, hsl, oklch) to computed rgb(...)
  const resolverRef = useRef<HTMLDivElement | null>(null);
  const [tick, setTick] = useState(0);

  // Create resolver once on mount
  useEffect(() =>
  {
    if (typeof window === "undefined") return;
    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.visibility = "hidden";
    el.style.pointerEvents = "none";
    el.style.width = "0";
    el.style.height = "0";
    document.body.appendChild(el);
    resolverRef.current = el;

    // Observe :root style/class changes so we re-render when CSS variables or theme class change
    const root = document.documentElement;
    const observer = new MutationObserver(() => setTick((t) => t + 1));
    observer.observe(root, { attributes: true, attributeFilter: ["style", "class"] });

    return () =>
    {
      observer.disconnect();
      document.body.removeChild(el);
      resolverRef.current = null;
    };
  }, []);

  const resolveVarToComputedRgb = useMemo(() =>
  {
    return (varName: string): string =>
    {
      if (typeof window === "undefined" || !resolverRef.current)
        return "rgb(0,0,0)";
      // Use CSS to resolve any color spaces to a computed rgb string
      resolverRef.current.style.color = `var(--${varName})`;
      const computed = getComputedStyle(resolverRef.current).color;
      return computed && computed !== "" ? computed : "rgb(0,0,0)";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]); // re-create when variables/theme change

  const getDisplayedValue = (varName: string): string =>
  {
    if (typeof window === "undefined") return `var(--${varName})`;
    // Prefer the actual raw variable value for display, fallback to computed rgb
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${varName}`)
      .trim();
    return raw || resolveVarToComputedRgb(varName);
  };

  const ColorSwatch: React.FC<ColorSwatchProps> = ({
    name,
    cssVar,
    description,
  }) =>
  {
    const copyToClipboard = (): void =>
    {
      navigator.clipboard.writeText(`var(--${cssVar})`);
    };

    // Let the background use the variable directly so it updates instantly with CSS
    const backgroundStyle = `var(--${cssVar})`;
    // Compute a contrasting text color from the resolved background
    const computedRgb = resolveVarToComputedRgb(cssVar);
    const textColor = getContrastingText(computedRgb);
    const shownValue = getDisplayedValue(cssVar);

    return (
      <div
        className="rounded-2xl p-4 cursor-pointer transition-transform hover:scale-105 border border-primary/15"
        style={{
          backgroundColor: backgroundStyle,
          color: textColor,
        }}
        onClick={copyToClipboard}
        title={`Click to copy var(--${cssVar})`}
      >
        <div className="font-medium text-sm mb-1">{name}</div>
        <div className="font-mono text-xs opacity-80">--{cssVar}</div>
        <div className="font-mono text-xs opacity-60 break-all">{shownValue}</div>
        {description && (
          <div className="text-xs mt-1 opacity-70">{description}</div>
        )}
      </div>
    );
  };

  const ColorGroup: React.FC<ColorGroupProps> = ({ title, colors }) => (
    <div className="mb-8">
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: `var(--foreground)` }}
      >
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {colors.map(({ name, cssVar, description }: ColorInfo) => (
          <ColorSwatch
            key={cssVar}
            name={name}
            cssVar={cssVar}
            description={description}
          />
        ))}
      </div>
    </div>
  );

  // Shadcn base tokens
  const shadcnBase: ColorGroup = {
    title: "Shadcn Base Tokens",
    colors: [
      { name: "Background", cssVar: "background" },
      { name: "Foreground", cssVar: "foreground" },
      { name: "Card", cssVar: "card" },
      { name: "Card Foreground", cssVar: "card-foreground" },
      { name: "Popover", cssVar: "popover" },
      { name: "Popover Foreground", cssVar: "popover-foreground" },
      { name: "Primary", cssVar: "primary", description: "Main brand color" },
      { name: "Primary Foreground", cssVar: "primary-foreground" },
      { name: "Secondary", cssVar: "secondary" },
      { name: "Secondary Foreground", cssVar: "secondary-foreground" },
      { name: "Muted", cssVar: "muted" },
      { name: "Muted Foreground", cssVar: "muted-foreground" },
      { name: "Accent", cssVar: "accent" },
      { name: "Accent Foreground", cssVar: "accent-foreground" },
      { name: "Destructive", cssVar: "destructive" },
      { name: "Destructive Foreground", cssVar: "destructive-foreground" },
      { name: "Border", cssVar: "border" },
      { name: "Input", cssVar: "input" },
      { name: "Ring", cssVar: "ring" },
    ],
  };

  // Shadcn extras mapped from Material
  const shadcnExtras: ColorGroup = {
    title: "Shadcn Extras (Material-mapped)",
    colors: [
      { name: "Primary Container", cssVar: "primary-container" },
      { name: "On Primary Container", cssVar: "on-primary-container" },
      { name: "Secondary Container", cssVar: "secondary-container" },
      { name: "On Secondary Container", cssVar: "on-secondary-container" },
      { name: "Tertiary", cssVar: "tertiary" },
      { name: "On Tertiary", cssVar: "on-tertiary" },
      { name: "Tertiary Container", cssVar: "tertiary-container" },
      { name: "On Tertiary Container", cssVar: "on-tertiary-container" },
      { name: "Outline Variant", cssVar: "outline-variant" },
      { name: "Inverse Surface", cssVar: "inverse-surface" },
      { name: "Inverse On Surface", cssVar: "inverse-on-surface" },
      { name: "Surface Dim", cssVar: "surface-dim" },
      { name: "Surface Bright", cssVar: "surface-bright" },
      { name: "Surface Container Lowest", cssVar: "surface-container-lowest" },
      { name: "Surface Container Low", cssVar: "surface-container-low" },
      { name: "Surface Container", cssVar: "surface-container" },
      { name: "Surface Container High", cssVar: "surface-container-high" },
      { name: "Surface Container Highest", cssVar: "surface-container-highest" },
    ],
  };

  // Sidebar and charts remain
  const sidebarGroup: ColorGroup = {
    title: "Sidebar Tokens",
    colors: [
      { name: "Sidebar", cssVar: "sidebar" },
      { name: "Sidebar Foreground", cssVar: "sidebar-foreground" },
      { name: "Sidebar Primary", cssVar: "sidebar-primary" },
      { name: "Sidebar Primary Foreground", cssVar: "sidebar-primary-foreground" },
      { name: "Sidebar Accent", cssVar: "sidebar-accent" },
      { name: "Sidebar Accent Foreground", cssVar: "sidebar-accent-foreground" },
      { name: "Sidebar Border", cssVar: "sidebar-border" },
      { name: "Sidebar Ring", cssVar: "sidebar-ring" },
    ],
  };

  const chartsGroup: ColorGroup = {
    title: "Chart Tokens",
    colors: [
      { name: "Chart 1", cssVar: "chart-1" },
      { name: "Chart 2", cssVar: "chart-2" },
      { name: "Chart 3", cssVar: "chart-3" },
      { name: "Chart 4", cssVar: "chart-4" },
      { name: "Chart 5", cssVar: "chart-5" },
    ],
  };

  // Material Design system tokens (md-sys-color-*)
  const materialCore: ColorGroup = {
    title: "Material Core (md-sys-color-*)",
    colors: [
      { name: "Background", cssVar: "md-sys-color-background" },
      { name: "On Background", cssVar: "md-sys-color-on-background" },
      { name: "Surface", cssVar: "md-sys-color-surface" },
      { name: "On Surface", cssVar: "md-sys-color-on-surface" },
      { name: "Surface Variant", cssVar: "md-sys-color-surface-variant" },
      { name: "On Surface Variant", cssVar: "md-sys-color-on-surface-variant" },
      { name: "Outline", cssVar: "md-sys-color-outline" },
      { name: "Outline Variant", cssVar: "md-sys-color-outline-variant" },
      { name: "Shadow", cssVar: "md-sys-color-shadow" },
      { name: "Scrim", cssVar: "md-sys-color-scrim" },
      { name: "Inverse Surface", cssVar: "md-sys-color-inverse-surface" },
      { name: "Inverse On Surface", cssVar: "md-sys-color-inverse-on-surface" },
      { name: "Inverse Primary", cssVar: "md-sys-color-inverse-primary" },
      { name: "Surface Tint", cssVar: "md-sys-color-surface-tint" },
    ],
  };

  const materialPrimary: ColorGroup = {
    title: "Material Primary",
    colors: [
      { name: "Primary", cssVar: "md-sys-color-primary" },
      { name: "On Primary", cssVar: "md-sys-color-on-primary" },
      { name: "Primary Container", cssVar: "md-sys-color-primary-container" },
      { name: "On Primary Container", cssVar: "md-sys-color-on-primary-container" },
    ],
  };

  const materialSecondary: ColorGroup = {
    title: "Material Secondary",
    colors: [
      { name: "Secondary", cssVar: "md-sys-color-secondary" },
      { name: "On Secondary", cssVar: "md-sys-color-on-secondary" },
      { name: "Secondary Container", cssVar: "md-sys-color-secondary-container" },
      { name: "On Secondary Container", cssVar: "md-sys-color-on-secondary-container" },
    ],
  };

  const materialTertiary: ColorGroup = {
    title: "Material Tertiary",
    colors: [
      { name: "Tertiary", cssVar: "md-sys-color-tertiary" },
      { name: "On Tertiary", cssVar: "md-sys-color-on-tertiary" },
      { name: "Tertiary Container", cssVar: "md-sys-color-tertiary-container" },
      { name: "On Tertiary Container", cssVar: "md-sys-color-on-tertiary-container" },
    ],
  };

  const materialError: ColorGroup = {
    title: "Material Error",
    colors: [
      { name: "Error", cssVar: "md-sys-color-error" },
      { name: "On Error", cssVar: "md-sys-color-on-error" },
      { name: "Error Container", cssVar: "md-sys-color-error-container" },
      { name: "On Error Container", cssVar: "md-sys-color-on-error-container" },
    ],
  };

  const materialSurfacesExtended: ColorGroup = {
    title: "Material Surfaces (Extended)",
    colors: [
      { name: "Surface Dim", cssVar: "md-sys-color-surface-dim" },
      { name: "Surface Bright", cssVar: "md-sys-color-surface-bright" },
      { name: "Surface Container Lowest", cssVar: "md-sys-color-surface-container-lowest" },
      { name: "Surface Container Low", cssVar: "md-sys-color-surface-container-low" },
      { name: "Surface Container", cssVar: "md-sys-color-surface-container" },
      { name: "Surface Container High", cssVar: "md-sys-color-surface-container-high" },
      { name: "Surface Container Highest", cssVar: "md-sys-color-surface-container-highest" },
    ],
  };

  const colorGroups: ColorGroup[] = [
    shadcnBase,
    shadcnExtras,
    sidebarGroup,
    chartsGroup,
    materialCore,
    materialPrimary,
    materialSecondary,
    materialTertiary,
    materialError,
    materialSurfacesExtended,
  ];

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: `var(--foreground)` }}
        >
          Material + shadcn Color Palette
        </h1>
        <p className="opacity-70 text-sm" style={{ color: `var(--foreground)` }}>
          Swatches use live CSS variables (both shadcn tokens and Material
          md-sys tokens). Click a swatch to copy its var() reference. Text
          color auto-adjusts for readability.
        </p>
      </div>

      {colorGroups.map((group: ColorGroup) => (
        <ColorGroup key={group.title} title={group.title} colors={group.colors} />
      ))}
    </div>
  );
};

export default ColorDisplay;