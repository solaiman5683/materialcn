/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import
    {
        argbFromHex,
        themeFromSourceColor,
        hexFromArgb,
        type Theme,
    } from "@materialx/material-color-utilities";

type GeneratedColors = Record<string, string>;

// Normalize HEX to uppercase
const HEX = (argb: number) => hexFromArgb(argb).toUpperCase();

// Use fixed tones to match Material Theme Builder reference
function deriveExtendedSurfaces(theme: Theme, dark: boolean)
{
    const n = theme.palettes.neutral;
    const tone = (t: number) => HEX(n.tone(t));

    return dark
        ? {
            surfaceDim: tone(6),
            surfaceBright: tone(24),
            surfaceContainerLowest: tone(4),
            surfaceContainerLow: tone(10),
            surfaceContainer: tone(12),
            surfaceContainerHigh: tone(17),
            surfaceContainerHighest: tone(22),
        }
        : {
            surfaceDim: tone(87),
            surfaceBright: tone(98),
            surfaceContainerLowest: tone(100),
            surfaceContainerLow: tone(96),
            surfaceContainer: tone(94),
            surfaceContainerHigh: tone(92),
            surfaceContainerHighest: tone(90),
        };
}

export function useMaterialColors(sourceColor: string, isDark: boolean)
{
    const [colors, setColors] = useState<GeneratedColors | null>(null);
    const [error, setError] = useState<string | null>(null);
    const lastAppliedRef = useRef<GeneratedColors | null>(null);

    const computeColors = useCallback((hex: string, darkMode: boolean): GeneratedColors =>
    {
        if (!/^#[0-9A-F]{6}$/i.test(hex)) {
            throw new Error("Invalid hex color. Use #RRGGBB.");
        }

        const theme = themeFromSourceColor(argbFromHex(hex));
        const s = darkMode ? theme.schemes.dark : theme.schemes.light;
        const sa = s as any;

        // Extended surfaces derived from neutral palette
        const ext = deriveExtendedSurfaces(theme, darkMode);

        // Outline-variant fallback from neutral-variant palette tones
        const nv = theme.palettes.neutralVariant;
        const outlineVariantFallback = HEX(nv.tone(darkMode ? 30 : 80));

        // Core Material colors
        const md: GeneratedColors = {
            "--md-sys-color-background": HEX(s.background),
            "--md-sys-color-on-background": HEX(s.onBackground),
            "--md-sys-color-surface": HEX(s.surface),
            "--md-sys-color-on-surface": HEX(s.onSurface),
            "--md-sys-color-surface-variant": HEX(s.surfaceVariant),
            "--md-sys-color-on-surface-variant": HEX(s.onSurfaceVariant),
            "--md-sys-color-outline": HEX(s.outline),
            "--md-sys-color-outline-variant":
                typeof sa.outlineVariant === "number" ? HEX(sa.outlineVariant) : outlineVariantFallback,
            "--md-sys-color-shadow": HEX((sa.shadow as number) ?? 0xff000000),
            "--md-sys-color-scrim": HEX((sa.scrim as number) ?? 0xff000000),
            "--md-sys-color-inverse-surface": HEX(s.inverseSurface),
            "--md-sys-color-inverse-on-surface": HEX(s.inverseOnSurface),
            "--md-sys-color-inverse-primary": HEX(s.inversePrimary),
            "--md-sys-color-surface-tint": HEX((sa.surfaceTint as number) ?? s.primary),

            // Extended surfaces
            "--md-sys-color-surface-dim": ext.surfaceDim,
            "--md-sys-color-surface-bright": ext.surfaceBright,
            "--md-sys-color-surface-container-lowest": ext.surfaceContainerLowest,
            "--md-sys-color-surface-container-low": ext.surfaceContainerLow,
            "--md-sys-color-surface-container": ext.surfaceContainer,
            "--md-sys-color-surface-container-high": ext.surfaceContainerHigh,
            "--md-sys-color-surface-container-highest": ext.surfaceContainerHighest,

            // Primaries
            "--md-sys-color-primary": HEX(s.primary),
            "--md-sys-color-on-primary": HEX(s.onPrimary),
            "--md-sys-color-primary-container": HEX(s.primaryContainer),
            "--md-sys-color-on-primary-container": HEX(s.onPrimaryContainer),

            // Secondary
            "--md-sys-color-secondary": HEX(s.secondary),
            "--md-sys-color-on-secondary": HEX(s.onSecondary),
            "--md-sys-color-secondary-container": HEX(s.secondaryContainer),
            "--md-sys-color-on-secondary-container": HEX(s.onSecondaryContainer),

            // Tertiary
            "--md-sys-color-tertiary": HEX(s.tertiary),
            "--md-sys-color-on-tertiary": HEX(s.onTertiary),
            "--md-sys-color-tertiary-container": HEX(s.tertiaryContainer),
            "--md-sys-color-on-tertiary-container": HEX(s.onTertiaryContainer),

            // Error
            "--md-sys-color-error": HEX(s.error),
            "--md-sys-color-on-error": HEX(s.onError),
            "--md-sys-color-error-container": HEX(s.errorContainer),
            "--md-sys-color-on-error-container": HEX(s.onErrorContainer),
        };

        // Map to shadcn tokens
        const shadcn: GeneratedColors = {
            "--background": md["--md-sys-color-background"],
            "--foreground": md["--md-sys-color-on-background"],

            "--card": md["--md-sys-color-surface"],
            "--card-foreground": md["--md-sys-color-on-surface"],

            "--popover": md["--md-sys-color-surface"],
            "--popover-foreground": md["--md-sys-color-on-surface"],

            "--primary": md["--md-sys-color-primary"],
            "--primary-foreground": md["--md-sys-color-on-primary"],

            "--secondary": md["--md-sys-color-secondary"],
            "--secondary-foreground": md["--md-sys-color-on-secondary"],

            "--muted": md["--md-sys-color-surface-variant"],
            "--muted-foreground": md["--md-sys-color-on-surface-variant"],

            "--accent": md["--md-sys-color-tertiary-container"],
            "--accent-foreground": md["--md-sys-color-on-tertiary-container"],

            "--destructive": md["--md-sys-color-error"],
            "--destructive-foreground": md["--md-sys-color-on-error"],

            "--border": md["--md-sys-color-outline"],
            "--input": md["--md-sys-color-outline-variant"],
            "--ring": md["--md-sys-color-primary"],

            // Sidebar tokens
            "--sidebar": md["--md-sys-color-surface-container-low"],
            "--sidebar-foreground": md["--md-sys-color-on-surface"],
            "--sidebar-primary": md["--md-sys-color-primary"],
            "--sidebar-primary-foreground": md["--md-sys-color-on-primary"],
            "--sidebar-accent": md["--md-sys-color-secondary-container"],
            "--sidebar-accent-foreground": md["--md-sys-color-on-secondary-container"],
            "--sidebar-border": md["--md-sys-color-outline-variant"],
            "--sidebar-ring": md["--md-sys-color-primary"],

            // Extended surfaces as plain aliases
            "--surface-dim": md["--md-sys-color-surface-dim"],
            "--surface-bright": md["--md-sys-color-surface-bright"],
            "--surface-container-lowest": md["--md-sys-color-surface-container-lowest"],
            "--surface-container-low": md["--md-sys-color-surface-container-low"],
            "--surface-container": md["--md-sys-color-surface-container"],
            "--surface-container-high": md["--md-sys-color-surface-container-high"],
            "--surface-container-highest": md["--md-sys-color-surface-container-highest"],

            "--inverse-surface": md["--md-sys-color-inverse-surface"],
            "--inverse-on-surface": md["--md-sys-color-inverse-on-surface"],
            "--outline-variant": md["--md-sys-color-outline-variant"],

            "--primary-container": md["--md-sys-color-primary-container"],
            "--on-primary-container": md["--md-sys-color-on-primary-container"],
            "--secondary-container": md["--md-sys-color-secondary-container"],
            "--on-secondary-container": md["--md-sys-color-on-secondary-container"],
            "--tertiary": md["--md-sys-color-tertiary"],
            "--on-tertiary": md["--md-sys-color-on-tertiary"],
            "--tertiary-container": md["--md-sys-color-tertiary-container"],
            "--on-tertiary-container": md["--md-sys-color-on-tertiary-container"],
        };

        console.log('Generated Material Colors:', JSON.stringify({ ...md, ...shadcn }, null, 2));

        return { ...md, ...shadcn };
    }, []);

    const generateColors = useCallback(
        (hex: string, darkMode: boolean) =>
        {
            try {
                const generated = computeColors(hex, darkMode);
                setColors(generated);
                setError(null);
                return generated;
            } catch (err) {
                console.error("Error generating colors:", err);
                setError(err instanceof Error ? err.message : "Unknown error");
                return null;
            }
        },
        [computeColors]
    );

    useEffect(() =>
    {
        generateColors(sourceColor, isDark);
    }, [sourceColor, isDark, generateColors]);

    useEffect(() =>
    {
        if (!colors) return;
        const root = document.documentElement;
        const prev = lastAppliedRef.current || {};
        for (const [k, v] of Object.entries(colors)) {
            if (prev[k] !== v) root.style.setProperty(k, v);
        }
        lastAppliedRef.current = colors;
    }, [colors]);

    return { colors, error, generateColors };
}
