import {
  Camera,
  Check,
  Download,
  Eye,
  Headphones,
  Info,
  Menu,
  Palette,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import {
  bodyOptions,
  cameraViews,
  cushionOptions,
  findHotspot,
  headbandOptions,
  hotspotDefinitions,
  metalOptions,
  portOptions,
  presets,
  type BodyOptionId,
  type ConfigState,
  type CushionOptionId,
  type HeadbandOptionId,
  type HotspotId,
  type MetalOptionId,
  type PortOptionId,
  type PresetId,
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
}

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
      title={option.label}
    >
      <span className="swatch" style={{ backgroundColor: option.hex }} />
      <span className="swatch-label">{option.label}</span>
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
}: ControlPanelProps) {
  const activeHotspot = findHotspot(config.activeHotspot)
  const isInformationMode = config.mode === 'information'

  return (
    <>
      {isInformationMode ? (
        <aside className="info-mode-toolbar" aria-label="Information controls">
          <IconButton
            label="Return to customization"
            onClick={() => onChange({ mode: 'customize', activeHotspot: null, view: 'hero' })}
          >
            <Menu size={20} />
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
              label="Information mode"
              onClick={() => onChange({ mode: 'information', activeHotspot: null })}
            >
              <Info size={19} />
            </IconButton>
          </aside>

          <aside className="config-panel" aria-label="Product configuration">
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
                <span>Shell</span>
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
                <span>Cushions</span>
              </div>
              <div className="swatch-grid">
                {cushionOptions.map((option) => (
                  <SwatchButton<CushionOptionId>
                    key={option.id}
                    option={option}
                    active={config.cushion === option.id}
                    onClick={(cushion) => onChange({ cushion })}
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
                <span>Ports</span>
              </div>
              <div className="swatch-grid">
                {portOptions.map((option) => (
                  <SwatchButton<PortOptionId>
                    key={option.id}
                    option={option}
                    active={config.ports === option.id}
                    onClick={(ports) => onChange({ ports })}
                  />
                ))}
              </div>
            </section>
          </aside>

          <nav className="view-switcher" aria-label="Camera views">
            {Object.entries(cameraViews).map(([view, item]) => (
              <button
                key={view}
                type="button"
                className={config.view === view ? 'is-active' : ''}
                onClick={() => onChange({ view: view as ViewId, activeHotspot: null })}
              >
                {view === 'hero' ? <Eye size={17} /> : <Camera size={17} />}
                <span>{item.label}</span>
              </button>
            ))}
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
