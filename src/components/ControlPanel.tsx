import {
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Headphones,
  Info,
  Menu,
  Palette,
  Pause,
  Play,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  bodyOptions,
  cameraViews,
  findHotspot,
  headbandOptions,
  hotspotDefinitions,
  metalOptions,
  plasticOptions,
  presets,
  stitchOptions,
  type BodyOptionId,
  type ConfigState,
  type HeadbandOptionId,
  type HotspotId,
  type MetalOptionId,
  type MobilePanelState,
  type PlasticOptionId,
  type PresetId,
  type StitchOptionId,
  type ViewId,
} from '../config/product'

type ControlPanelProps = {
  config: ConfigState
  copied: boolean
  onPreset: (preset: PresetId) => void
  onChange: (patch: Partial<ConfigState>) => void
  onShare: () => void
  onScreenshot: () => void
  onReset: () => void
  onHotspotSelect: (hotspot: HotspotId | null) => void
  mobilePanelState: MobilePanelState
  onMobilePanelStateChange: (state: MobilePanelState) => void
}

type PanelDragStart = {
  x: number
  y: number
  canSnapDown: boolean
} | null

function IconButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className={`icon-button ${active ? 'is-active' : ''}`}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function SwatchButton<T extends string>({
  option,
  active,
  onClick,
}: {
  option: { id: T; label: string; hex: string }
  active: boolean
  onClick: (id: T) => void
}) {
  return (
    <button
      type="button"
      className={`swatch-button ${active ? 'is-active' : ''}`}
      onClick={() => onClick(option.id)}
      aria-label={option.label}
      title={option.label}
    >
      <span className="swatch" style={{ backgroundColor: option.hex }} />
      {active ? <Check size={15} strokeWidth={2.4} /> : null}
    </button>
  )
}

export function ControlPanel({
  config,
  copied,
  onPreset,
  onChange,
  onShare,
  onScreenshot,
  onReset,
  onHotspotSelect,
  mobilePanelState,
  onMobilePanelStateChange,
}: ControlPanelProps) {
  const activeHotspot = findHotspot(config.activeHotspot)
  const isInformationMode = config.mode === 'information'
  const [panelOpen, setPanelOpen] = useState(true)
  const [isMobileLayout, setIsMobileLayout] = useState(false)
  const panelRef = useRef<HTMLElement | null>(null)
  const dragStartRef = useRef<PanelDragStart>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 980px)')
    const syncLayout = () => setIsMobileLayout(mediaQuery.matches)

    syncLayout()
    mediaQuery.addEventListener('change', syncLayout)

    return () => mediaQuery.removeEventListener('change', syncLayout)
  }, [])

  const toggleMobilePanel = useCallback(() => {
    onMobilePanelStateChange(mobilePanelState === 'expanded' ? 'compact' : 'expanded')
  }, [mobilePanelState, onMobilePanelStateChange])

  const togglePanel = useCallback(() => {
    if (isMobileLayout) {
      toggleMobilePanel()
      return
    }

    setPanelOpen((current) => !current)
  }, [isMobileLayout, toggleMobilePanel])

  const handlePanelPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!isMobileLayout || event.button !== 0) return

      const panel = panelRef.current
      if (!panel) return

      const rect = panel.getBoundingClientRect()
      dragStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        canSnapDown: panel.scrollTop <= 4 || event.clientY - rect.top < 84,
      }
    },
    [isMobileLayout],
  )

  const handlePanelPointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const start = dragStartRef.current
      dragStartRef.current = null
      if (!start) return

      const deltaX = event.clientX - start.x
      const deltaY = event.clientY - start.y
      const isVerticalSwipe = Math.abs(deltaY) > 48 && Math.abs(deltaY) > Math.abs(deltaX) * 1.15

      if (!isVerticalSwipe) return

      if (deltaY < 0) {
        onMobilePanelStateChange('expanded')
        return
      }

      if (start.canSnapDown) onMobilePanelStateChange('compact')
    },
    [onMobilePanelStateChange],
  )

  const handlePanelPointerCancel = useCallback(() => {
    dragStartRef.current = null
  }, [])

  const panelVisible = isMobileLayout || panelOpen
  const panelToggleLabel = isMobileLayout
    ? mobilePanelState === 'expanded'
      ? 'Collapse customization panel'
      : 'Expand customization panel'
    : panelOpen
      ? 'Hide customization panel'
      : 'Show customization panel'

  return (
    <>
      {isInformationMode ? (
        <aside className="mode-rail" aria-label="Information controls">
          <IconButton
            label="Return to customization"
            onClick={() => {
              setPanelOpen(true)
              onChange({ mode: 'customize', activeHotspot: null, view: 'hero' })
            }}
          >
            <X size={19} />
          </IconButton>
        </aside>
      ) : (
        <>
          <header className="app-header">
            <div className="brand-lockup">
              <span className="brand-mark">
                <Headphones size={20} />
              </span>
              <div>
                <p>Headphones Configurator</p>
                <h1>Auralux H1</h1>
              </div>
            </div>

            <div className="header-actions">
              <IconButton label="Reset view and materials" onClick={onReset}>
                <RotateCcw size={19} />
              </IconButton>
              <IconButton label="Capture product image" onClick={onScreenshot}>
                <Download size={19} />
              </IconButton>
              <IconButton label={copied ? 'Copied share link' : 'Copy share link'} onClick={onShare}>
                <Share2 size={19} />
              </IconButton>
            </div>
          </header>

          <aside className="mode-rail" aria-label="Scene modes">
            <IconButton
              label={panelToggleLabel}
              active={isMobileLayout ? mobilePanelState === 'expanded' : panelOpen}
              onClick={togglePanel}
            >
              {isMobileLayout ? (
                mobilePanelState === 'expanded' ? (
                  <ChevronDown size={19} />
                ) : (
                  <ChevronUp size={19} />
                )
              ) : panelOpen ? (
                <X size={19} />
              ) : (
                <Menu size={19} />
              )}
            </IconButton>
            <IconButton
              label="Information mode"
              onClick={() => onChange({ mode: 'information', activeHotspot: null })}
            >
              <Info size={19} />
            </IconButton>
          </aside>

          {panelVisible ? (
            <aside
              ref={panelRef}
              className="config-panel"
              aria-label="Product configuration"
              data-mobile-state={mobilePanelState}
              onPointerDown={handlePanelPointerDown}
              onPointerUp={handlePanelPointerUp}
              onPointerCancel={handlePanelPointerCancel}
            >
              <button
                type="button"
                className="panel-grip-button"
                aria-label={panelToggleLabel}
                title={panelToggleLabel}
                onClick={toggleMobilePanel}
              >
                {mobilePanelState === 'expanded' ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
              <section className="panel-section panel-intro">
                <div>
                  <span className="section-kicker">
                    <SlidersHorizontal size={14} />
                    Live setup
                  </span>
                  <h2>Premium over-ear finish</h2>
                </div>
                <p>{copied ? 'Share link copied.' : 'Configure finishes and inspect the product state.'}</p>
              </section>

              <section className="panel-section">
                <div className="section-heading">
                  <span>
                    <Palette size={15} />
                    Presets
                  </span>
                </div>
                <div className="preset-grid">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className={`preset-button ${config.preset === preset.id ? 'is-active' : ''}`}
                      onClick={() => onPreset(preset.id)}
                    >
                      <span>{preset.label}</span>
                      <small>{preset.description}</small>
                    </button>
                  ))}
                </div>
              </section>

              <section className="panel-section control-stack">
                <div className="section-heading">
                  <span>Earcups</span>
                </div>
                <div className="swatch-grid">
                  {bodyOptions.map((option) => (
                    <SwatchButton<BodyOptionId>
                      key={option.id}
                      option={option}
                      active={config.body === option.id}
                      onClick={(body) => onChange({ body })}
                    />
                  ))}
                </div>
              </section>

              <section className="panel-section control-stack">
                <div className="section-heading">
                  <span>Headband</span>
                </div>
                <div className="swatch-grid">
                  {headbandOptions.map((option) => (
                    <SwatchButton<HeadbandOptionId>
                      key={option.id}
                      option={option}
                      active={config.headband === option.id}
                      onClick={(headband) => onChange({ headband })}
                    />
                  ))}
                </div>
              </section>

              <section className="panel-section control-stack">
                <div className="section-heading">
                  <span>Brushed metal</span>
                </div>
                <div className="swatch-grid">
                  {metalOptions.map((option) => (
                    <SwatchButton<MetalOptionId>
                      key={option.id}
                      option={option}
                      active={config.metal === option.id}
                      onClick={(metal) => onChange({ metal })}
                    />
                  ))}
                </div>
              </section>

              <section className="panel-section control-stack">
                <div className="section-heading">
                  <span>Plastic</span>
                </div>
                <div className="swatch-grid">
                  {plasticOptions.map((option) => (
                    <SwatchButton<PlasticOptionId>
                      key={option.id}
                      option={option}
                      active={config.plastic === option.id}
                      onClick={(plastic) => onChange({ plastic })}
                    />
                  ))}
                </div>
              </section>

              <section className="panel-section control-stack">
                <div className="section-heading">
                  <span>Stitches</span>
                </div>
                <div className="swatch-grid is-compact">
                  {stitchOptions.map((option) => (
                    <SwatchButton<StitchOptionId>
                      key={option.id}
                      option={option}
                      active={config.stitches === option.id}
                      onClick={(stitches) => onChange({ stitches })}
                    />
                  ))}
                </div>
              </section>
            </aside>
          ) : null}

          <nav className="view-switcher" aria-label="Camera views">
            <button
              type="button"
              className={config.view === 'hero' ? 'is-active' : ''}
              onClick={() => onChange({ view: 'hero' as ViewId, activeHotspot: null })}
            >
              <Eye size={17} />
              <span>{cameraViews.hero.label}</span>
            </button>
            <button
              type="button"
              className={config.rotationPaused ? 'is-active' : ''}
              onClick={() => onChange({ rotationPaused: !config.rotationPaused })}
            >
              {config.rotationPaused ? <Play size={17} /> : <Pause size={17} />}
              <span>{config.rotationPaused ? 'Resume' : 'Pause'}</span>
            </button>
            <button
              type="button"
              className={config.view === 'detail' ? 'is-active' : ''}
              onClick={() => onChange({ view: 'detail' as ViewId, activeHotspot: null })}
            >
              <Camera size={17} />
              <span>{cameraViews.detail.label}</span>
            </button>
          </nav>
        </>
      )}

      {isInformationMode && !activeHotspot ? (
        <div className="info-callout-layer" aria-label="Product information points">
          {hotspotDefinitions.map((hotspot) => (
            <button
              key={hotspot.id}
              type="button"
              className="info-callout"
              style={
                {
                  '--x': `${hotspot.screen.desktop[0]}%`,
                  '--y': `${hotspot.screen.desktop[1]}%`,
                  '--mx': `${hotspot.screen.mobile[0]}%`,
                  '--my': `${hotspot.screen.mobile[1]}%`,
                } as React.CSSProperties
              }
              onClick={() => onHotspotSelect(hotspot.id)}
            >
              <span />
              {hotspot.label}
            </button>
          ))}
        </div>
      ) : null}

      {isInformationMode && activeHotspot ? (
        <section className="info-detail-card" aria-label={activeHotspot.title}>
          <div className="hotspot-card-heading">
            <span>{activeHotspot.label}</span>
            <button
              type="button"
              className="mini-icon-button"
              aria-label="Back to information overview"
              title="Back to information overview"
              onClick={() => onHotspotSelect(null)}
            >
              <X size={18} />
            </button>
          </div>
          <h3>{activeHotspot.title}</h3>
          <p>{activeHotspot.description}</p>
          <button type="button" className="full-view-button" onClick={() => onHotspotSelect(null)}>
            Back to overview
          </button>
        </section>
      ) : null}
    </>
  )
}
