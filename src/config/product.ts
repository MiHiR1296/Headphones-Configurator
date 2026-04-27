export type BodyOptionId = 'pearl' | 'ivory' | 'moss' | 'navy'
export type HeadbandOptionId = 'source' | 'cocoa' | 'black' | 'stone' | 'moss'
export type MetalOptionId = 'source' | 'champagne' | 'silver' | 'gunmetal'
export type PlasticOptionId = 'source' | 'graphite' | 'pearl' | 'navy' | 'moss'
export type StitchOptionId = 'white' | 'black'
export type ViewId = 'hero' | 'detail'
export type ExperienceMode = 'customize' | 'information'
export type PresetId = 'pearl-reference' | 'soft-ivory' | 'moss-edition'
export type HotspotId = 'headband' | 'comfort' | 'ports' | 'adjusters'

export type ConfigState = {
  preset: PresetId
  body: BodyOptionId
  headband: HeadbandOptionId
  metal: MetalOptionId
  plastic: PlasticOptionId
  stitches: StitchOptionId
  view: ViewId
  rotationPaused: boolean
  mode: ExperienceMode
  activeHotspot: HotspotId | null
}

export type SwatchOption<T extends string> = {
  id: T
  label: string
  hex: string
  secondaryHex?: string
  source?: boolean
}

export const bodyOptions: SwatchOption<BodyOptionId>[] = [
  { id: 'pearl', label: 'Pearl Earcups', hex: '#f3efe6' },
  { id: 'ivory', label: 'Ivory Earcups', hex: '#ebe5dc' },
  { id: 'moss', label: 'Moss Earcups', hex: '#4b5f4a' },
  { id: 'navy', label: 'Navy Earcups', hex: '#162234' },
]

export const headbandOptions: SwatchOption<HeadbandOptionId>[] = [
  { id: 'source', label: 'Source Suede', hex: '#7d7b65', source: true },
  { id: 'cocoa', label: 'Cocoa Suede', hex: '#6b4b34' },
  { id: 'black', label: 'Black Suede', hex: '#171615' },
  { id: 'stone', label: 'Stone Suede', hex: '#b9b5aa' },
  { id: 'moss', label: 'Moss Suede', hex: '#4b5f4a' },
]

export const metalOptions: SwatchOption<MetalOptionId>[] = [
  { id: 'source', label: 'Source Metal', hex: '#e0c49f', source: true },
  { id: 'champagne', label: 'Champagne', hex: '#d7bd84' },
  { id: 'silver', label: 'Brushed Silver', hex: '#b7bcc0' },
  { id: 'gunmetal', label: 'Gunmetal', hex: '#4c5258' },
]

export const plasticOptions: SwatchOption<PlasticOptionId>[] = [
  { id: 'source', label: 'Source Grey Plastic', hex: '#555555', source: true },
  { id: 'graphite', label: 'Graphite Plastic', hex: '#202225' },
  { id: 'pearl', label: 'Pearl Plastic', hex: '#d8d4ca' },
  { id: 'navy', label: 'Navy Plastic', hex: '#172233' },
  { id: 'moss', label: 'Moss Plastic', hex: '#4f5d49' },
]

export const stitchOptions: SwatchOption<StitchOptionId>[] = [
  { id: 'white', label: 'White Stitches', hex: '#f2eee7' },
  { id: 'black', label: 'Black Stitches', hex: '#151515' },
]

export const presets: Array<{
  id: PresetId
  label: string
  description: string
  config: Pick<ConfigState, 'body' | 'headband' | 'metal' | 'plastic' | 'stitches'>
}> = [
  {
    id: 'pearl-reference',
    label: 'Pearl Reference',
    description: 'Pearl earcups with Blender source suede, plastic, and hardware.',
    config: {
      body: 'pearl',
      headband: 'source',
      metal: 'source',
      plastic: 'source',
      stitches: 'white',
    },
  },
  {
    id: 'soft-ivory',
    label: 'Soft Ivory',
    description: 'Ivory earcups with stone suede, pearl plastic, and brushed silver.',
    config: {
      body: 'ivory',
      headband: 'stone',
      metal: 'silver',
      plastic: 'pearl',
      stitches: 'black',
    },
  },
  {
    id: 'moss-edition',
    label: 'Moss Edition',
    description: 'Muted green earcups, moss headband, dark plastic, and gunmetal hardware.',
    config: {
      body: 'moss',
      headband: 'moss',
      metal: 'gunmetal',
      plastic: 'graphite',
      stitches: 'white',
    },
  },
]

export const defaultConfig: ConfigState = {
  preset: 'pearl-reference',
  body: 'pearl',
  headband: 'source',
  metal: 'source',
  plastic: 'source',
  stitches: 'white',
  view: 'hero',
  rotationPaused: false,
  mode: 'customize',
  activeHotspot: null,
}

export const partGroups = {
  headbandHard: ['Leather Frame'],
  headbandCushion: ['Upper Head Cussions', 'Side Head Cussions_R', 'Side Head Cussions_L'],
  headbandStitches: ['Outer Stiches', 'Inner Stiches'],
  earcups: ['Ear Cup_R', 'Ear Cup_L', 'Cover_R', 'Cover_L'],
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
      desktop: [48, 23],
      mobile: [58, 23],
    },
    camera: {
      position: [0.62, 1.32, 1.18],
      target: [0, 0.54, 0.02],
    },
  },
  {
    id: 'comfort',
    label: 'Ear cushions',
    title: 'Soft over-ear cushions',
    description:
      'The over-ear pads keep the original Blender leather texture response while matching the selected earcup finish.',
    mesh: 'Ear Cup_L',
    position: [-0.62, 0.16, -0.32],
    screen: {
      desktop: [59, 55],
      mobile: [68, 63],
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
      desktop: [37, 74],
      mobile: [32, 76],
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
      desktop: [41, 37],
      mobile: [28, 70],
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

export function findPresetForConfig(
  config: Pick<ConfigState, 'body' | 'headband' | 'metal' | 'plastic' | 'stitches'>,
) {
  return (
    presets.find(
      (preset) =>
        preset.config.body === config.body &&
        preset.config.headband === config.headband &&
        preset.config.metal === config.metal &&
        preset.config.plastic === config.plastic &&
        preset.config.stitches === config.stitches,
    )?.id ?? 'pearl-reference'
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
