import {
  bodyOptions,
  defaultConfig,
  findPresetForConfig,
  headbandOptions,
  hotspotDefinitions,
  isOption,
  metalOptions,
  plasticOptions,
  presets,
  stitchOptions,
  type BodyOptionId,
  type ConfigState,
  type ExperienceMode,
  type HotspotId,
  type ViewId,
} from '../config/product'

const views: ViewId[] = ['hero', 'detail']
const modes: ExperienceMode[] = ['customize', 'information']
const hotspotIds = hotspotDefinitions.map((hotspot) => hotspot.id)

export function readConfigFromUrl(): ConfigState {
  if (typeof window === 'undefined') return defaultConfig

  const params = new URLSearchParams(window.location.search)
  const presetId = params.get('preset')
  const preset = presets.find((item) => item.id === presetId) ?? presets[0]

  const base: ConfigState = {
    ...defaultConfig,
    preset: preset.id,
    ...preset.config,
  }

  const body = params.get('body')
  const headband = params.get('headband')
  const metal = params.get('metal')
  const plastic = params.get('plastic')
  const stitches = params.get('stitches')
  const view = params.get('view')
  const paused = params.get('paused')
  const mode = params.get('mode')
  const legacyHotspots = params.get('hotspots')
  const activeHotspot = params.get('hotspot')
  const parsedHotspot = hotspotIds.includes(activeHotspot as HotspotId)
    ? (activeHotspot as HotspotId)
    : null
  const parsedMode =
    modes.includes(mode as ExperienceMode) || mode === 'info'
      ? mode === 'info'
        ? 'information'
        : (mode as ExperienceMode)
      : legacyHotspots === '1' || parsedHotspot
        ? 'information'
        : base.mode

  const parsedBody = body === 'graphite' ? 'pearl' : body

  const next = {
    ...base,
    body: isOption(parsedBody, bodyOptions) ? (parsedBody as BodyOptionId) : base.body,
    headband: isOption(headband, headbandOptions) ? headband : base.headband,
    metal: isOption(metal, metalOptions) ? metal : base.metal,
    plastic: isOption(plastic, plasticOptions) ? plastic : base.plastic,
    stitches: isOption(stitches, stitchOptions) ? stitches : base.stitches,
    view: views.includes(view as ViewId) ? (view as ViewId) : base.view,
    rotationPaused:
      paused === '1' || paused === 'true'
        ? true
        : paused === '0' || paused === 'false'
          ? false
          : base.rotationPaused,
    mode: parsedMode,
    activeHotspot: parsedHotspot,
  }

  return {
    ...next,
    preset: findPresetForConfig(next),
  }
}

export function writeConfigToUrl(config: ConfigState) {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams()
  params.set('preset', config.preset)
  params.set('body', config.body)
  params.set('headband', config.headband)
  params.set('metal', config.metal)
  params.set('plastic', config.plastic)
  params.set('stitches', config.stitches)
  if (config.view !== defaultConfig.view) params.set('view', config.view)
  if (config.rotationPaused) params.set('paused', '1')
  if (config.mode !== defaultConfig.mode) params.set('mode', config.mode)
  if (config.activeHotspot) params.set('hotspot', config.activeHotspot)

  const query = params.toString()
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
  window.history.replaceState(null, '', nextUrl)
}

export function getShareUrl(config: ConfigState) {
  if (typeof window === 'undefined') return ''

  const params = new URLSearchParams()
  params.set('preset', config.preset)
  params.set('body', config.body)
  params.set('headband', config.headband)
  params.set('metal', config.metal)
  params.set('plastic', config.plastic)
  params.set('stitches', config.stitches)
  if (config.view !== defaultConfig.view) params.set('view', config.view)
  if (config.rotationPaused) params.set('paused', '1')
  if (config.mode !== defaultConfig.mode) params.set('mode', config.mode)
  if (config.activeHotspot) params.set('hotspot', config.activeHotspot)

  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}
