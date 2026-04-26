export type BodyOptionId = 'graphite' | 'ivory' | 'moss' | 'navy'
export type CushionOptionId = 'cocoa' | 'black' | 'stone'
export type MetalOptionId = 'champagne' | 'silver' | 'gunmetal'
export type ViewId = 'hero' | 'side' | 'detail'
export type ExperienceMode = 'customize' | 'information'
export type PresetId = 'studio-graphite' | 'soft-ivory' | 'moss-edition'
export type HotspotId = 'headband' | 'comfort' | 'ports' | 'adjusters'

export type ConfigState = {
  preset: PresetId
  body: BodyOptionId
  cushion: CushionOptionId
  metal: MetalOptionId
  view: ViewId
  mode: ExperienceMode
  activeHotspot: HotspotId | null
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

export const presets: Array<{
  id: PresetId
  label: string
  description: string
  config: Pick<ConfigState, 'body' | 'cushion' | 'metal'>
}> = [
  {
    id: 'studio-graphite',
    label: 'Studio Graphite',
    description: 'Dark body, cocoa cushions, champagne metal.',
    config: {
      body: 'graphite',
      cushion: 'cocoa',
      metal: 'champagne',
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
    },
  },
]

export const defaultConfig: ConfigState = {
  preset: 'studio-graphite',
  body: 'graphite',
  cushion: 'cocoa',
  metal: 'champagne',
  view: 'hero',
  mode: 'customize',
  activeHotspot: null,
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

export const informationView = {
  position: [2.25, 1.18, 2.95],
  target: [0, 0.12, 0],
  modelRotation: 0,
} as const satisfies {
  position: readonly [number, number, number]
  target: readonly [number, number, number]
  modelRotation: number
}

export const mobileInformationView = {
  position: [0.16, 1.05, 4.55],
  target: [0, 0.08, 0],
  modelRotation: 0,
} as const satisfies {
  position: readonly [number, number, number]
  target: readonly [number, number, number]
  modelRotation: number
}

export const hotspotDefinitions = [
  {
    id: 'headband',
    label: 'Suede headband',
    title: 'Suede leather headband',
    description:
      'Soft suede-style leather wraps the upper headband, with visible stitch detail preserved from the Blender material maps.',
    mesh: 'Upper Head Cussions',
    position: [0, 0.86, 0.06],
    screen: {
      desktop: [48, 22],
      mobile: [58, 23],
    },
    camera: {
      position: [0.62, 1.32, 1.18],
      target: [0, 0.54, 0.02],
    },
  },
  {
    id: 'comfort',
    label: 'Cushion seal',
    title: 'Soft over-ear cushions',
    description:
      'The ear cushions keep the original leather/fabric normal texture and now take the selected cushion tint directly.',
    mesh: 'Ear Cup_L',
    position: [-0.62, 0.16, -0.32],
    screen: {
      desktop: [40, 52],
      mobile: [38, 52],
    },
    camera: {
      position: [-1.2, 0.42, 1.05],
      target: [-0.34, 0.02, -0.12],
    },
  },
  {
    id: 'ports',
    label: 'USB-C + 3.5 mm',
    title: 'Fast charging and wired audio',
    description:
      'A fast-charging USB-C port sits beside the 3.5 mm audio jack, so the product works both wireless and plugged in.',
    mesh: 'Usb C port',
    position: [0.48, -0.38, 0.54],
    screen: {
      desktop: [50, 70],
      mobile: [62, 67],
    },
    camera: {
      position: [0.86, 0.18, 0.98],
      target: [0.28, -0.22, 0.16],
    },
  },
  {
    id: 'adjusters',
    label: 'Metal adjusters',
    title: 'Brushed metal adjustment arms',
    description:
      'The yokes and extension arms keep the Blender metallic response while the finish switches between champagne, silver, and gunmetal.',
    mesh: 'Ear cups Adjuster_R',
    position: [-0.24, 0.58, 0.08],
    screen: {
      desktop: [43, 35],
      mobile: [42, 38],
    },
    camera: {
      position: [-0.72, 0.82, 1.18],
      target: [-0.16, 0.38, 0],
    },
  },
] as const satisfies ReadonlyArray<{
  id: HotspotId
  label: string
  title: string
  description: string
  mesh: string
  position: readonly [number, number, number]
  screen: {
    desktop: readonly [number, number]
    mobile: readonly [number, number]
  }
  camera: {
    position: readonly [number, number, number]
    target: readonly [number, number, number]
  }
}>

export function findPresetForConfig(config: Pick<ConfigState, 'body' | 'cushion' | 'metal'>) {
  return (
    presets.find(
      (preset) =>
        preset.config.body === config.body &&
        preset.config.cushion === config.cushion &&
        preset.config.metal === config.metal,
    )?.id ?? 'studio-graphite'
  )
}

export function findHotspot(id: HotspotId | null) {
  return hotspotDefinitions.find((hotspot) => hotspot.id === id) ?? null
}

export function isOption<T extends string>(
  value: string | null,
  options: ReadonlyArray<{ id: T }>,
): value is T {
  return !!value && options.some((option) => option.id === value)
}
