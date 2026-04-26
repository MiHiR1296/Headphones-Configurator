import {
  bodyOptions,
  cushionOptions,
  defaultConfig,
  findPresetForConfig,
  isOption,
  ledOptions,
  metalOptions,
  presets,
  type ConfigState,
  type ModeId,
  type ViewId,
} from '../config/product'

const modes: ModeId[] = ['assembled', 'exploded']
const views: ViewId[] = ['hero', 'side', 'detail']

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
  const cushion = params.get('cushion')
  const metal = params.get('metal')
  const led = params.get('led')
  const mode = params.get('mode')
  const view = params.get('view')
  const hotspots = params.get('hotspots')

  const next = {
    ...base,
    body: isOption(body, bodyOptions) ? body : base.body,
    cushion: isOption(cushion, cushionOptions) ? cushion : base.cushion,
    metal: isOption(metal, metalOptions) ? metal : base.metal,
    led: isOption(led, ledOptions) ? led : base.led,
    mode: modes.includes(mode as ModeId) ? (mode as ModeId) : base.mode,
    view: views.includes(view as ViewId) ? (view as ViewId) : base.view,
    hotspots: hotspots === '1',
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
  params.set('cushion', config.cushion)
  params.set('metal', config.metal)
  params.set('led', config.led)
  if (config.mode !== defaultConfig.mode) params.set('mode', config.mode)
  if (config.view !== defaultConfig.view) params.set('view', config.view)
  if (config.hotspots) params.set('hotspots', '1')

  const query = params.toString()
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
  window.history.replaceState(null, '', nextUrl)
}

export function getShareUrl(config: ConfigState) {
  if (typeof window === 'undefined') return ''

  const params = new URLSearchParams()
  params.set('preset', config.preset)
  params.set('body', config.body)
  params.set('cushion', config.cushion)
  params.set('metal', config.metal)
  params.set('led', config.led)
  if (config.mode !== defaultConfig.mode) params.set('mode', config.mode)
  if (config.view !== defaultConfig.view) params.set('view', config.view)
  if (config.hotspots) params.set('hotspots', '1')

  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}
