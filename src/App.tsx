import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ControlPanel } from './components/ControlPanel'
import { ConfiguratorScene } from './components/ConfiguratorScene'
import {
  defaultConfig,
  findPresetForConfig,
  presets,
  type ConfigState,
  type HotspotId,
  type PresetId,
} from './config/product'
import { getShareUrl, readConfigFromUrl, writeConfigToUrl } from './lib/url-state'

function App() {
  const [config, setConfig] = useState<ConfigState>(() => readConfigFromUrl())
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    writeConfigToUrl(config)
  }, [config])

  const updateConfig = useCallback((patch: Partial<ConfigState>) => {
    setConfig((current) => {
      const next = { ...current, ...patch }
      return {
        ...next,
        activeHotspot:
          patch.mode === 'customize'
            ? null
            : patch.activeHotspot === undefined
              ? next.activeHotspot
              : patch.activeHotspot,
        mode: patch.activeHotspot ? 'information' : next.mode,
        preset: patch.preset ?? findPresetForConfig(next),
      }
    })
  }, [])

  const applyPreset = useCallback((presetId: PresetId) => {
    const preset = presets.find((item) => item.id === presetId) ?? presets[0]
    setConfig((current) => ({
      ...current,
      preset: preset.id,
      ...preset.config,
    }))
  }, [])

  const handleShare = useCallback(async () => {
    const url = getShareUrl(config)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1700)
    } catch {
      window.prompt('Share URL', url)
    }
  }, [config])

  const handleScreenshot = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `auralux-h1-${config.body}-${config.cushion}.png`
    link.click()
  }, [config.body, config.cushion])

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig)
  }, [])

  const handleHotspotSelect = useCallback((hotspot: HotspotId | null) => {
    setConfig((current) => ({
      ...current,
      mode: 'information',
      activeHotspot: hotspot,
    }))
  }, [])

  const canvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas
  }, [])

  const sceneKey = useMemo(() => `${config.body}-${config.cushion}-${config.metal}`, [
    config.body,
    config.cushion,
    config.metal,
  ])

  return (
    <main className="app-shell" data-material-key={sceneKey} data-mode={config.mode}>
      <div className="scene-layer">
        <ConfiguratorScene
          config={config}
          activeHotspot={config.activeHotspot}
          onCanvasReady={canvasReady}
        />
      </div>
      <div className="surface-grid" aria-hidden="true" />
      <ControlPanel
        config={config}
        copied={copied}
        onPreset={applyPreset}
        onChange={updateConfig}
        onShare={handleShare}
        onScreenshot={handleScreenshot}
        onReset={resetConfig}
        onHotspotSelect={handleHotspotSelect}
      />
    </main>
  )
}

export default App
