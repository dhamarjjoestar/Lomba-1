import { useMemo, useState } from "react";
import { RotateCcw, Box, Info } from "lucide-react";

type Candidate3DPreviewProps = {
  substitution?: number;
  particleSize?: number;
  waterBinderRatio?: number;
  targetClass?: string;
  blockLength?: number;
  blockWidth?: number;
  blockThickness?: number;
};

type MaterialType = "residue" | "cement" | "sand" | "binder";

type Particle = {
  id: number;
  material: MaterialType;
  x: number;
  y: number;
  size: number;
  depth: number;
};

export default function Candidate3DPreview({
  substitution = 10,
  particleSize = 75,
  waterBinderRatio = 0.45,
  targetClass = "B",
  blockLength = 200,
  blockWidth = 100,
  blockThickness = 60,
}: Candidate3DPreviewProps) {
  const [rotation, setRotation] = useState({
    x: 14,
    y: -24,
  });

  const [zoom, setZoom] = useState(1);
  const [crossSection, setCrossSection] = useState(true);

  /*
   * Lightweight visual particle field.
   *
   * Important:
   * This is a UI representation of the candidate composition.
   * It is NOT an experimentally validated microstructure model.
   */
  const particles = useMemo<Particle[]>(() => {
    const totalParticles = 72;

    const residueWeight = Math.max(1, substitution);
    const cementWeight = Math.max(
      1,
      100 - substitution - 40,
    );

    const sandWeight = 40;
    const binderWeight = Math.max(
      5,
      waterBinderRatio * 40,
    );

    const totalWeight =
      residueWeight +
      cementWeight +
      sandWeight +
      binderWeight;

    const materialWeights: Array<
      [MaterialType, number]
    > = [
      ["residue", residueWeight],
      ["cement", cementWeight],
      ["sand", sandWeight],
      ["binder", binderWeight],
    ];

    let seed = 912731;

    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    const sizeMap: Record<MaterialType, number> = {
      residue: 7,
      cement: 5.5,
      sand: 8.5,
      binder: 4.5,
    };

    const next: Particle[] = [];

    let id = 0;

    for (const [material, weight] of materialWeights) {
      const count = Math.max(
        2,
        Math.round(
          (weight / totalWeight) * totalParticles,
        ),
      );

      for (let i = 0; i < count; i += 1) {
        next.push({
          id: id++,
          material,
          x: 7 + random() * 86,
          y: 8 + random() * 84,
          size:
            sizeMap[material] +
            random() * 2,
          depth: -30 + random() * 60,
        });
      }
    }

    return next;
  }, [substitution, waterBinderRatio]);

  const zoomIn = () => {
    setZoom((current) =>
      Math.min(
        1.4,
        Number((current + 0.08).toFixed(2)),
      ),
    );
  };

  const zoomOut = () => {
    setZoom((current) =>
      Math.max(
        0.78,
        Number((current - 0.08).toFixed(2)),
      ),
    );
  };

  const resetView = () => {
    setRotation({
      x: 14,
      y: -24,
    });

    setZoom(1);
    setCrossSection(true);
  };

  return (
    <section className="candidate-preview">
      <div className="candidate-preview-head">
        <div>
          <span className="eyebrow eyebrow-gold">
            CANDIDATE VISUALIZATION
          </span>

          <h3>
            Paving Block · {substitution}% Residue
          </h3>

          <p>
            Live visual representation of the
            current candidate formulation.
          </p>
        </div>

        <div className="candidate-preview-badge">
          <Box size={14} />
          LIVE PREVIEW
        </div>
      </div>

      <div className="candidate-preview-stage">
        <div className="candidate-preview-grid" />

        <div
          className="candidate-preview-canvas"
          onWheel={(event) => {
            event.preventDefault();

            if (event.deltaY < 0) {
              zoomIn();
            } else {
              zoomOut();
            }
          }}
          onMouseMove={(event) => {
            if (event.buttons !== 1) {
              return;
            }

            const rect =
              event.currentTarget.getBoundingClientRect();

            const normalizedX =
              (event.clientY - rect.top) /
                rect.height -
              0.5;

            const normalizedY =
              (event.clientX - rect.left) /
                rect.width -
              0.5;

            setRotation({
              x: 14 - normalizedX * 24,
              y: -24 + normalizedY * 32,
            });
          }}
        >
          <div className="candidate-ground" />
          <div className="candidate-shadow" />

          <div className="candidate-block-anchor">
            <div
              className="candidate-block-wrap"
              style={{
                transform: `
                  rotateX(${rotation.x}deg)
                  rotateY(${rotation.y}deg)
                  scale(${zoom})
                `,
              }}
            >
              <div
                className={`candidate-block-3d ${
                  crossSection
                    ? "is-cross-section"
                    : ""
                }`}
              >
                <div className="candidate-face candidate-back" />
                <div className="candidate-face candidate-left" />
                <div className="candidate-face candidate-bottom" />
                <div className="candidate-face candidate-top" />
                <div className="candidate-face candidate-right" />

                <div className="candidate-particles">
                  {particles.map((particle) => (
                    <span
                      key={particle.id}
                      className={`candidate-particle material-${particle.material}`}
                      style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        transform: `
                          translateZ(${particle.depth}px)
                        `,
                      }}
                    />
                  ))}
                </div>

                <div className="candidate-face candidate-front" />
              </div>
            </div>
          </div>

          <div className="candidate-axis-label">
            <span>MODEL SPACE</span>

            <strong>
              {blockLength} × {blockWidth} ×{" "}
              {blockThickness} mm
            </strong>
          </div>
        </div>

        <div className="candidate-preview-controls">
          <button
            type="button"
            className="candidate-control-button"
            onClick={resetView}
          >
            <RotateCcw size={13} />
            Reset
          </button>

          <button
            type="button"
            className={
              crossSection
                ? "candidate-control-button is-active"
                : "candidate-control-button"
            }
            onClick={() =>
              setCrossSection(
                (current) => !current,
              )
            }
          >
            Cross-section
          </button>

          <div className="candidate-zoom">
            <button
              type="button"
              onClick={zoomOut}
              aria-label="Zoom out"
            >
              −
            </button>

            <span>
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={zoomIn}
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="candidate-preview-meta">
        <div>
          <span>RESIDUE</span>
          <strong>
            {substitution}%
          </strong>
        </div>

        <div>
          <span>PARTICLE</span>
          <strong>
            {particleSize} μm
          </strong>
        </div>

        <div>
          <span>W/B</span>
          <strong>
            {waterBinderRatio.toFixed(2)}
          </strong>
        </div>

        <div>
          <span>TARGET</span>
          <strong>
            CLASS {targetClass}
          </strong>
        </div>
      </div>

      <div className="candidate-preview-note">
        <Info size={13} />

        <span>
          This visualization represents the
          current formulation candidate for
          interpretation. It is not an experimental
          microstructure prediction; mechanical
          performance must be verified through
          laboratory testing.
        </span>
      </div>
    </section>
  );
}
