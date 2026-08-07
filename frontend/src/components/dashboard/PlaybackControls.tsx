import type { ReactNode } from 'react'

const PLAYBACK_SPEEDS = [0.5, 1, 2, 4] as const

type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number]

interface PlaybackControlsProps {
  isPlaying: boolean
  playbackSpeed: PlaybackSpeed
  currentIndex: number
  sampleCount: number
  onPlayPause: () => void
  onStepBack: () => void
  onStepForward: () => void
  onRestart: () => void
  onPlaybackSpeedChange: (speed: PlaybackSpeed) => void
}

function ControlButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode
  disabled?: boolean
  onClick: () => void
}): ReactNode {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="border border-[var(--color-border)] px-[var(--space-sm)] py-1 [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-purple)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--color-border)] disabled:hover:text-[var(--color-text-secondary)]"
    >
      {children}
    </button>
  )
}

export default function PlaybackControls({
  isPlaying,
  playbackSpeed,
  currentIndex,
  sampleCount,
  onPlayPause,
  onStepBack,
  onStepForward,
  onRestart,
  onPlaybackSpeedChange,
}: PlaybackControlsProps): ReactNode {
  const isAtStart = currentIndex === 0
  const isAtEnd = sampleCount === 0 || currentIndex >= sampleCount - 1
  const hasSamples = sampleCount > 0

  return (
    <div className="mt-[var(--space-md)] flex flex-wrap items-center justify-between gap-[var(--space-sm)] border-t border-[var(--color-border)] pt-[var(--space-md)]">
      <div className="flex flex-wrap gap-1" aria-label="Telemetry playback controls">
        <ControlButton disabled={!hasSamples || isAtStart} onClick={onRestart}>
          Restart
        </ControlButton>
        <ControlButton disabled={!hasSamples || isAtStart} onClick={onStepBack}>
          Step Back
        </ControlButton>
        <ControlButton disabled={!hasSamples || (!isPlaying && isAtEnd)} onClick={onPlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </ControlButton>
        <ControlButton disabled={!hasSamples || isAtEnd} onClick={onStepForward}>
          Step Forward
        </ControlButton>
      </div>
      <label className="flex items-center gap-[var(--space-sm)] [font-family:var(--font-family-mono)] text-[var(--font-size-caption)] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
        <span>Rate</span>
        <select
          value={playbackSpeed}
          onChange={(event) => onPlaybackSpeedChange(Number(event.currentTarget.value) as PlaybackSpeed)}
          className="border border-[var(--color-border)] bg-[var(--color-background)] px-[var(--space-sm)] py-1 text-[var(--color-text-primary)] outline-none transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-border-hover)] focus-visible:border-[var(--color-primary-purple)]"
          aria-label="Playback speed"
        >
          {PLAYBACK_SPEEDS.map((speed) => (
            <option key={speed} value={speed}>
              {speed}×
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
