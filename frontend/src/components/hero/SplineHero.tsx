import type { Application } from '@splinetool/runtime'
import { forwardRef, lazy, memo, Suspense, useCallback, useImperativeHandle, useRef, useState } from 'react'
import type { ReactNode } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

const sceneUrl =
  "https://prod.spline.design/gLke6ns11zkDbyzB/scene.splinecode"

export interface SplineHeroHandle {
  readonly application: Application | null
}

function LoadingPlaceholder(): ReactNode {
  return (
    <div
      aria-live="polite"
      className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)]"
    >
      <span className="text-[var(--font-size-small)] text-[var(--color-text-muted)]">
        Loading scene…
      </span>
    </div>
  )
}

const SplineHero = memo(forwardRef<SplineHeroHandle>(function SplineHero(_, ref): ReactNode {
  const [isLoaded, setIsLoaded] = useState(false)
  const applicationRef = useRef<Application | null>(null)

  useImperativeHandle(
    ref,
    () => ({
      get application(): Application | null {
        return applicationRef.current
      },
    }),
    [],
  )

  const handleLoad = useCallback((application: Application): void => {
    applicationRef.current = application;

    // Temporary debugging
    (window as any).app = application;

    console.log("Spline Application:", application);
    console.log("Keys:", Object.keys(application));

    setIsLoaded(true);
  }, [])

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
      <Suspense fallback={<LoadingPlaceholder />}>
        {!isLoaded && <LoadingPlaceholder />}

        <div className="h-full w-full scale-120 transform">
          <Spline
            aria-label="Interactive Formula One car model"
            className="h-full w-full"
            scene={sceneUrl}
            renderOnDemand
            onLoad={handleLoad}
          />
        </div>
      </Suspense>
    </div>
  )
}))

export default SplineHero
