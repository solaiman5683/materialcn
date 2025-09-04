type GeneratedColors = Record<string, string>;

type SchemeLike = {
    background: number;
    onBackground: number;
    surface: number;
    onSurface: number;
    surfaceVariant: number;
    onSurfaceVariant: number;
    outline: number;
    inverseSurface: number;
    inverseOnSurface: number;
    inversePrimary: number;

    primary: number;
    onPrimary: number;
    primaryContainer: number;
    onPrimaryContainer: number;

    secondary: number;
    onSecondary: number;
    secondaryContainer: number;
    onSecondaryContainer: number;

    tertiary: number;
    onTertiary: number;
    tertiaryContainer: number;
    onTertiaryContainer: number;

    error: number;
    onError: number;
    errorContainer: number;
    onErrorContainer: number;

    // Optional in older versions
    shadow?: number;
    scrim?: number;
    surfaceTint?: number;

    surfaceDim?: number;
    surfaceBright?: number;
    surfaceContainerLowest?: number;
    surfaceContainerLow?: number;
    surfaceContainer?: number;
    surfaceContainerHigh?: number;
    surfaceContainerHighest?: number;

    outlineVariant?: number;
};

export type { SchemeLike, GeneratedColors };