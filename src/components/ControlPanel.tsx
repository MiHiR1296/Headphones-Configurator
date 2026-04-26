import {
  Box,
  Camera,
  Check,
  CircleDot,
  Download,
  Eye,
  Headphones,
  Layers,
  Palette,
  RotateCcw,
  Share2,
  SlidersHorizontal,
} from 'lucide-react'
import {
  bodyOptions,
  cameraViews,
  cushionOptions,
  ledOptions,
  metalOptions,
  presets,
  type BodyOptionId,
  type ConfigState,
  type CushionOptionId,
  type LedOptionId,
  type MetalOptionId,
  type ModeId,
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
}: ControlPanelProps) {
  return (
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
          label="Assembled view"
          active={config.mode === 'assembled'}
          onClick={() => onChange({ mode: 'assembled' satisfies ModeId })}
        >
          <Box size={19} />
        </IconButton>
        <IconButton
          label="Exploded view"
          active={config.mode === 'exploded'}
          onClick={() => onChange({ mode: 'exploded' satisfies ModeId })}
        >
          <Layers size={19} />
        </IconButton>
        <IconButton
          label="Feature hotspots"
          active={config.hotspots}
          onClick={() => onChange({ hotspots: !config.hotspots })}
        >
          <CircleDot size={19} />
        </IconButton>
      </aside>

      <aside className="config-panel" aria-label="Product configuration">
        <section className="panel-section panel-intro">
          <div>
            <span className="section-kicker">
              <SlidersHorizontal size={14} />
              Live setup
            </span>
            <h2>{config.mode === 'exploded' ? 'Exploded material study' : 'Premium over-ear finish'}</h2>
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
            <span>Body</span>
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
            <span>Metal</span>
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
            <span>LED</span>
          </div>
          <div className="swatch-grid led-grid">
            {ledOptions.map((option) => (
              <SwatchButton<LedOptionId>
                key={option.id}
                option={option}
                active={config.led === option.id}
                onClick={(led) => onChange({ led })}
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
            onClick={() => onChange({ view: view as ViewId })}
          >
            {view === 'hero' ? <Eye size={17} /> : <Camera size={17} />}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
