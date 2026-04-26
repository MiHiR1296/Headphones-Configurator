export type BodyOptionId = 'graphite' | 'ivory' | 'moss' | 'navy'
export type CushionOptionId = 'cocoa' | 'black' | 'stone'
export type MetalOptionId = 'champagne' | 'silver' | 'gunmetal'
export type LedOptionId = 'ice' | 'lime' | 'amber' | 'off'
export type ModeId = 'assembled' | 'exploded'
export type ViewId = 'hero' | 'side' | 'detail'
export type PresetId = 'studio-graphite' | 'soft-ivory' | 'moss-edition'

export type ConfigState = {
  preset: PresetId
  body: BodyOptionId
  cushion: CushionOptionId
  metal: MetalOptionId
  led: LedOptionId
  mode: ModeId
  view: ViewId
  hotspots: boolean
}

export type SwatchOption<T extends string> = {
  id: T
  label: string
  hex: string
  secondaryHex?: string
}

export const bodyOptions: SwatchOption<BodyOptionId>[] = [
  { id: 'graphite', label: 'Graphite', hex: '#1d2024' },
  { id: 'ivory', label: 'Ivory', hex: '#ebe5dc' },
  { id: 'moss', label: 'Moss', hex: '#4b5f4a' },
  { id: 'navy', label: 'Navy', hex: '#162234' },
]

export const cushionOptions: SwatchOption<CushionOptionId>[] = [
  { id: 'cocoa', label: 'Cocoa Leather', hex: '#6b4b34' },
  { id: 'black', label: 'Black Leather', hex: '#171615' },
  { id: 'stone', label: 'Stone Fabric', hex: '#b9b5aa' },
]

export const metalOptions: SwatchOption<MetalOptionId>[] = [
  { id: 'champagne', label: 'Champagne', hex: '#d7bd84' },
  { id: 'silver', label: 'Brushed Silver', hex: '#b7bcc0' },
  { id: 'gunmetal', label: 'Gunmetal', hex: '#4c5258' },
]

export const ledOptions: SwatchOption<LedOptionId>[] = [
  { id: 'ice', label: 'Ice Blue', hex: '#7bd7ff' },
  { id: 'lime', label: 'Lime', hex: '#b7ff68' },
  { id: 'amber', label: 'Amber', hex: '#ffb357' },
  { id: 'off', label: 'Off', hex: '#3b3b3b' },
]

export const presets: Array<{
  id: PresetId
  label: string
  description: string
  config: Pick<ConfigState, 'body' | 'cushion' | 'metal' | 'led'>
}> = [
  {
    id: 'studio-graphite',
    label: 'Studio Graphite',
    description: 'Dark body, cocoa cushions, champagne metal.',
    config: {
      body: 'graphite',
      cushion: 'cocoa',
      metal: 'champagne',
      led: 'ice',
    },
  },
  {
    id: 'soft-ivory',
    label: 'Soft Ivory',
    description: 'Ivory shell with stone fabric and brushed silver.',
    config: {
      body: 'ivory',
      cushion: 'stone',
      metal: 'silver',
      led: 'amber',
    },
  },
  {
    id: 'moss-edition',
    label: 'Moss Edition',
    description: 'Muted green shell, black cushions, gunmetal hardware.',
    config: {
      body: 'moss',
      cushion: 'black',
      metal: 'gunmetal',
      led: 'lime',
    },
  },
]

export const defaultConfig: ConfigState = {
  preset: 'studio-graphite',
  body: 'graphite',
  cushion: 'cocoa',
  metal: 'champagne',
  led: 'ice',
  mode: 'assembled',
  view: 'hero',
  hotspots: false,
}

export const partGroups = {
  headband: ['Leather Frame', 'Outer Stiches', 'Inner Stiches'],
  cushions: [
    'Upper Head Cussions',
    'Side Head Cussions_R',
    'Side Head Cussions_L',
    'Ear Cup_R',
    'Ear Cup_L',
  ],
  outerShell: ['Audion System_R', 'Audion System_L', 'Cover_R', 'Cover_L'],
  metalYokes: ['Extension_R', 'Extension_L', 'Ear cups Adjuster_R', 'Ear cups Adjuster_L'],
  buttonsPorts: [
    'Headphone On/Off Buttion',
    'Bluetooth On/Off Button',
    'Usb C port',
    'Audio Port',
  ],
  led: ['Led Ligth'],
  decals: ['Decals', 'Decals '],
  drivers: ['Vibrator_R', 'Vibrator_L'],
} as const

export const cameraViews: Record<
  ViewId,
  { label: string; position: [number, number, number]; target: [number, number, number] }
> = {
  hero: {
    label: 'Hero',
    position: [2.7, 1.2, 2.8],
    target: [0, 0.02, 0],
  },
  side: {
    label: 'Side',
    position: [0.28, 1.05, 3.35],
    target: [0, 0.02, 0],
  },
  detail: {
    label: 'Detail',
    position: [1.3, 0.82, 1.24],
    target: [-0.16, 0.12, 0],
  },
}

export const hotspotDefinitions = [
  {
    id: 'drivers',
    label: '40 mm acoustic drivers',
    mesh: 'Vibrator_R',
    position: [0.92, -0.18, 0.24],
  },
  {
    id: 'cushions',
    label: 'Soft sealed cushions',
    mesh: 'Ear Cup_L',
    position: [-0.72, 0.24, -0.18],
  },
  {
    id: 'controls',
    label: 'Tactile controls + ports',
    mesh: 'Bluetooth On/Off Button',
    position: [0.42, -0.52, 0.68],
  },
  {
    id: 'yokes',
    label: 'Brushed adjustable yokes',
    mesh: 'Ear cups Adjuster_R',
    position: [-0.2, 0.76, 0.05],
  },
] as const

export function findPresetForConfig(config: Pick<ConfigState, 'body' | 'cushion' | 'metal' | 'led'>) {
  return (
    presets.find(
      (preset) =>
        preset.config.body === config.body &&
        preset.config.cushion === config.cushion &&
        preset.config.metal === config.metal &&
        preset.config.led === config.led,
    )?.id ?? 'studio-graphite'
  )
}

export function isOption<T extends string>(
  value: string | null,
  options: ReadonlyArray<{ id: T }>,
): value is T {
  return !!value && options.some((option) => option.id === value)
}
