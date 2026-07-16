'use client';

import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Line, Sphere, Torus, Html } from "@react-three/drei";
import * as THREE from "three";

type Tab = "dna" | "solar" | "volcano" | "math" | "ielts";

/* ---------------------------- DNA MODEL ---------------------------- */

function DnaModel() {
    const teal = "#14B8A6";
    const violet = "#8B7CF6";

    const { curveA, curveB, rungs, ballsA, ballsB } = useMemo(() => {
        const pointsA: THREE.Vector3[] = [];
        const pointsB: THREE.Vector3[] = [];
        const rungList: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];
        const turns = 3;
        const steps = 60;
        const radius = 1.1;
        const height = 4.4;

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const angle = t * Math.PI * 2 * turns;
            const y = t * height - height / 2;
            const a = new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
            const b = new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius);
            pointsA.push(a);
            pointsB.push(b);
            if (i % 5 === 0) rungList.push({ a, b });
        }

        return {
            curveA: pointsA,
            curveB: pointsB,
            rungs: rungList,
            ballsA: rungList.map((r) => r.a),
            ballsB: rungList.map((r) => r.b),
        };
    }, []);

    return (
        <group>
            <Line points={curveA} color={teal} lineWidth={3} />
            <Line points={curveB} color={violet} lineWidth={3} />
            {rungs.map((r, i) => (
                <Line key={i} points={[r.a, r.b]} color="#D8D3EA" lineWidth={1.5} />
            ))}
            {ballsA.map((p, i) => (
                <Sphere key={`a-${i}`} args={[0.09, 16, 16]} position={p}>
                    <meshStandardMaterial color={teal} roughness={0.35} metalness={0.1} />
                </Sphere>
            ))}
            {ballsB.map((p, i) => (
                <Sphere key={`b-${i}`} args={[0.09, 16, 16]} position={p}>
                    <meshStandardMaterial color={violet} roughness={0.35} metalness={0.1} />
                </Sphere>
            ))}
        </group>
    );
}

/* --------------------------- SOLAR MODEL ---------------------------- */

function Planet({
    distance,
    size,
    speed,
    color,
    hasRing,
    tilt = 0,
}: {
    distance: number;
    size: number;
    speed: number;
    color: string;
    hasRing?: boolean;
    tilt?: number;
}) {
    const ref = useRef<THREE.Group>(null);
    useFrame((state) => {
        const t = state.clock.getElapsedTime() * speed;
        if (ref.current) {
            ref.current.position.x = Math.cos(t) * distance;
            ref.current.position.z = Math.sin(t) * distance * 0.55;
        }
    });
    return (
        <group ref={ref}>
            <mesh rotation={[tilt, 0, 0]}>
                <sphereGeometry args={[size, 24, 24]} />
                <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
            </mesh>
            {hasRing && (
                <Torus args={[size * 1.7, 0.04, 8, 40]} rotation={[Math.PI / 2.3, 0, 0]}>
                    <meshStandardMaterial color={color} roughness={0.5} transparent opacity={0.7} />
                </Torus>
            )}
        </group>
    );
}

function SolarModel() {
    return (
        <group rotation={[0.25, 0, 0]}>
            <mesh>
                <sphereGeometry args={[0.55, 32, 32]} />
                <meshStandardMaterial color="#FFC94A" emissive="#FF8A3D" emissiveIntensity={1.4} roughness={0.4} />
            </mesh>
            <pointLight color="#FFD98A" intensity={2.2} distance={12} decay={2} />

            <Torus args={[1.6, 0.006, 8, 64]} rotation={[Math.PI / 2, 0, 0]}>
                <meshBasicMaterial color="#E7E2F5" transparent opacity={0.5} />
            </Torus>
            <Torus args={[2.5, 0.006, 8, 64]} rotation={[Math.PI / 2, 0, 0]}>
                <meshBasicMaterial color="#E7E2F5" transparent opacity={0.4} />
            </Torus>

            <Planet distance={1.6} size={0.16} speed={0.9} color="#14B8A6" />
            <Planet distance={2.5} size={0.22} speed={0.55} color="#8B7CF6" hasRing tilt={0.3} />
        </group>
    );
}

const pseudoRandom = (seed: number) => {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
    };
};

/* -------------------------- VOLCANO MODEL --------------------------- */

function VolcanoModel() {
    const ashPositions = useMemo(() => {
        const rand = pseudoRandom(12345);
        return Array.from({ length: 10 }).map(() => ({
            x: (rand() - 0.5) * 1.6,
            z: (rand() - 0.5) * 1.6,
            y: 1.6 + rand() * 0.8,
            s: 0.05 + rand() * 0.06,
            speed: 0.4 + rand() * 0.6,
            offset: rand() * Math.PI * 2,
        }));
    }, []);
    const ashRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        ashRef.current?.children.forEach((child, i) => {
            const p = ashPositions[i];
            child.position.y = p.y + Math.sin(t * p.speed + p.offset) * 0.15;
        });
    });

    return (
        <group>
            {/* Mountain shell — pie-slice cutaway reveals the cross-section */}
            <mesh rotation={[0, Math.PI * 0.15, 0]}>
                <coneGeometry args={[1.7, 2.2, 48, 1, false, 0, Math.PI * 1.5]} />
                <meshStandardMaterial color="#F4EBDD" roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
            {/* Magma conduit */}
            <mesh position={[0, -0.2, 0]}>
                <cylinderGeometry args={[0.16, 0.3, 1.8, 16, 1, true]} />
                <meshStandardMaterial color="#FF6B4A" emissive="#FF6B4A" emissiveIntensity={0.7} side={THREE.DoubleSide} />
            </mesh>
            {/* Magma chamber */}
            <mesh position={[0, -1.05, 0]}>
                <sphereGeometry args={[0.55, 24, 24]} />
                <meshStandardMaterial color="#E8532F" emissive="#FF8A3D" emissiveIntensity={0.9} roughness={0.5} />
            </mesh>
            {/* Crater glow */}
            <mesh position={[0, 1.05, 0]}>
                <cylinderGeometry args={[0.32, 0.4, 0.15, 24]} />
                <meshStandardMaterial color="#FFC94A" emissive="#FF8A3D" emissiveIntensity={1.1} />
            </mesh>
            {/* Ash particles */}
            <group ref={ashRef}>
                {ashPositions.map((p, i) => (
                    <mesh key={i} position={[p.x, p.y, p.z]}>
                        <sphereGeometry args={[p.s, 8, 8]} />
                        <meshStandardMaterial color="#8B7CF6" transparent opacity={0.5} />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

/* -------------------------- MATH BRIDGE MODEL --------------------------- */

function MathBridgeModel({
    step,
    coefA,
    coefC,
}: {
    step: number;
    coefA: number;
    coefC: number;
}) {
    const showGrid = step >= 2;
    const showForces = step >= 4;

    // Calculate main cables points
    const { cableFront, cableBack, hangersFront, hangersBack } = useMemo(() => {
        const frontPoints: THREE.Vector3[] = [];
        const backPoints: THREE.Vector3[] = [];
        const hFront: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
        const hBack: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
        const halfWidth = 2.5;
        const resolution = 50;

        for (let i = 0; i <= resolution; i++) {
            const x = -halfWidth + (i / resolution) * (2 * halfWidth);
            const y = coefA * (x * x) + coefC;
            frontPoints.push(new THREE.Vector3(x, y, 0.5));
            backPoints.push(new THREE.Vector3(x, y, -0.5));
        }

        // Hangers placed every 0.4 units from -2.0 to 2.0
        for (let x = -2.0; x <= 2.0; x += 0.4) {
            const rx = Math.round(x * 10) / 10;
            const yCable = coefA * (rx * rx) + coefC;
            hFront.push({
                start: new THREE.Vector3(rx, 0, 0.5),
                end: new THREE.Vector3(rx, yCable, 0.5),
            });
            hBack.push({
                start: new THREE.Vector3(rx, 0, -0.5),
                end: new THREE.Vector3(rx, yCable, -0.5),
            });
        }

        return {
            cableFront: frontPoints,
            cableBack: backPoints,
            hangersFront: hFront,
            hangersBack: hBack,
        };
    }, [coefA, coefC]);

    // Force vectors
    const forceVectors = useMemo(() => {
        const vectors: { position: THREE.Vector3; direction: THREE.Vector3; length: number }[] = [];
        if (!showForces) return vectors;

        // Symmetric points along X axis for tension
        const xPositions = [-1.8, -0.8, 0.8, 1.8];
        xPositions.forEach((x) => {
            const y = coefA * (x * x) + coefC;
            const derivative = 2 * coefA * x;

            // Tangent direction away from vertex (0,c)
            const direction = new THREE.Vector3(x > 0 ? 1 : -1, x > 0 ? derivative : -derivative, 0).normalize();

            // Tension force magnitude is higher near towers
            const magnitude = 0.35 * Math.sqrt(1 + derivative * derivative);

            vectors.push({
                position: new THREE.Vector3(x, y, 0.5),
                direction,
                length: magnitude,
            });
        });

        return vectors;
    }, [coefA, coefC, showForces]);

    return (
        <group>
            {/* Coordinate Grid */}
            {showGrid && (
                <group position={[0, 0, -0.52]}>
                    {/* Vertical grid lines */}
                    {Array.from({ length: 15 }).map((_, i) => {
                        const x = -3.5 + i * 0.5;
                        const isMain = Math.abs(x) < 0.01;
                        return (
                            <Line
                                key={`v-${x}`}
                                points={[[x, -0.5, 0], [x, 2.2, 0]]}
                                color={isMain ? "#FF6B4A" : "#8B7CF6"}
                                lineWidth={isMain ? 1.8 : 0.5}
                                transparent
                                opacity={isMain ? 0.7 : 0.15}
                            />
                        );
                    })}
                    {/* Horizontal grid lines */}
                    {Array.from({ length: 8 }).map((_, i) => {
                        const y = -0.5 + i * 0.5;
                        const isMain = Math.abs(y) < 0.01;
                        return (
                            <Line
                                key={`h-${y}`}
                                points={[[-3.5, y, 0], [3.5, y, 0]]}
                                color={isMain ? "#FF6B4A" : "#8B7CF6"}
                                lineWidth={isMain ? 1.8 : 0.5}
                                transparent
                                opacity={isMain ? 0.7 : 0.15}
                            />
                        );
                    })}
                    {/* Axes Numbers */}
                    {[-3, -2, -1, 1, 2, 3].map((x) => (
                        <Html key={`lbl-x-${x}`} position={[x, -0.22, 0]} center className="pointer-events-none select-none">
                            <span className="text-[10px] font-bold text-[var(--muted)] font-mono">{x}</span>
                        </Html>
                    ))}
                    {[0.5, 1.0, 1.5, 2.0].map((y) => (
                        <Html key={`lbl-y-${y}`} position={[-0.2, y, 0]} center className="pointer-events-none select-none">
                            <span className="text-[10px] font-bold text-[var(--muted)] font-mono">{y.toFixed(1)}</span>
                        </Html>
                    ))}
                    <Html position={[3.6, -0.1, 0]} center className="pointer-events-none select-none">
                        <span className="text-[10px] font-bold text-[var(--coral)] font-mono">X</span>
                    </Html>
                    <Html position={[-0.15, 2.3, 0]} center className="pointer-events-none select-none">
                        <span className="text-[10px] font-bold text-[var(--coral)] font-mono">Y</span>
                    </Html>
                </group>
            )}

            {/* Towers / Pillars */}
            {/* Tower A (Left) */}
            <group position={[-2.5, 0, 0]}>
                <mesh position={[0, 1.1, 0.5]}>
                    <cylinderGeometry args={[0.07, 0.07, 2.2, 16]} />
                    <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
                </mesh>
                <mesh position={[0, 1.1, -0.5]}>
                    <cylinderGeometry args={[0.07, 0.07, 2.2, 16]} />
                    <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
                </mesh>
                {/* Horizontal brace */}
                <mesh position={[0, 1.7, 0]}>
                    <boxGeometry args={[0.05, 0.08, 1.0]} />
                    <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
                </mesh>
                <mesh position={[0, 0.8, 0]}>
                    <boxGeometry args={[0.05, 0.08, 1.0]} />
                    <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
                </mesh>
            </group>

            {/* Tower B (Right) */}
            <group position={[2.5, 0, 0]}>
                <mesh position={[0, 1.1, 0.5]}>
                    <cylinderGeometry args={[0.07, 0.07, 2.2, 16]} />
                    <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
                </mesh>
                <mesh position={[0, 1.1, -0.5]}>
                    <cylinderGeometry args={[0.07, 0.07, 2.2, 16]} />
                    <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
                </mesh>
                {/* Horizontal brace */}
                <mesh position={[0, 1.7, 0]}>
                    <boxGeometry args={[0.05, 0.08, 1.0]} />
                    <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
                </mesh>
                <mesh position={[0, 0.8, 0]}>
                    <boxGeometry args={[0.05, 0.08, 1.0]} />
                    <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
                </mesh>
            </group>

            {/* Bridge Deck (Road) */}
            <mesh position={[0, -0.02, 0]}>
                <boxGeometry args={[6.2, 0.04, 1.2]} />
                <meshStandardMaterial color="#475569" roughness={0.9} />
            </mesh>
            {/* Road lines */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[6.2, 0.01]} />
                <meshBasicMaterial color="#FFD98A" />
            </mesh>
            <mesh position={[0, -0.02, 0.6]}>
                <boxGeometry args={[6.2, 0.08, 0.04]} />
                <meshStandardMaterial color="#94A3B8" roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.02, -0.6]}>
                <boxGeometry args={[6.2, 0.08, 0.04]} />
                <meshStandardMaterial color="#94A3B8" roughness={0.5} />
            </mesh>

            {/* Main Cables */}
            <Line points={cableFront} color="#14B8A6" lineWidth={4} />
            <Line points={cableBack} color="#14B8A6" lineWidth={4} />

            {/* Hangers */}
            {hangersFront.map((h, i) => (
                <Line key={`hf-${i}`} points={[h.start, h.end]} color="#94A3B8" lineWidth={1.2} />
            ))}
            {hangersBack.map((h, i) => (
                <Line key={`hb-${i}`} points={[h.start, h.end]} color="#94A3B8" lineWidth={1.2} />
            ))}

            {/* Moving Cars */}
            <MovingCar />
            <MovingCar2 />

            {/* Forces Vectors (Tension) */}
            {forceVectors.map((v, i) => (
                <group key={`vec-${i}`}>
                    <VectorArrow position={v.position} direction={v.direction} length={v.length} color="#FF6B4A" />
                    <Html position={[v.position.x, v.position.y + v.length * 0.8 + 0.1, v.position.z]} center className="pointer-events-none select-none">
                        <span className="text-[8px] bg-red-500 text-white font-bold px-1 py-0.5 rounded font-mono shadow-sm">
                            T
                        </span>
                    </Html>
                </group>
            ))}

            {/* Downward Gravity/Load vectors on Road */}
            {showForces && [-1.6, -0.8, 0, 0.8, 1.6].map((x, i) => (
                <group key={`grav-${i}`} position={[x, -0.02, 0.35]}>
                    <VectorArrow position={new THREE.Vector3(0, 0.4, 0)} direction={new THREE.Vector3(0, -1, 0)} length={0.3} color="#FFC94A" />
                    <Html position={[0, 0.5, 0]} center className="pointer-events-none select-none">
                        <span className="text-[8px] bg-amber-500 text-white font-bold px-1 py-0.5 rounded font-mono shadow-sm">
                            G
                        </span>
                    </Html>
                </group>
            ))}

            {/* Equation Label */}
            {step === 3 && (
                <Html position={[0, coefC + 0.38, 0.5]} center className="pointer-events-none select-none">
                    <div className="bg-white/95 border border-[var(--coral)] border-2 backdrop-blur text-[var(--ink)] font-bold px-3 py-2 rounded-xl shadow-lg flex flex-col items-center animate-pulse-glow">
                        <span className="text-[8px] text-[var(--muted)] font-bold uppercase tracking-wider">Kabel Tenglamasi</span>
                        <span className="font-mono text-sm text-[var(--coral-dark)]">y = {coefA.toFixed(2)}x² + {coefC.toFixed(2)}</span>
                    </div>
                </Html>
            )}

            {/* Step 5 Interactive Overlay indicator */}
            {step === 5 && (
                <Html position={[0, coefC + 0.45, 0.5]} center className="pointer-events-none select-none">
                    <div className="bg-[var(--teal)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        Laboratoriya: Parametrlarni o'zgartiring!
                    </div>
                </Html>
            )}
        </group>
    );
}

function VectorArrow({
    position,
    direction,
    length,
    color,
}: {
    position: THREE.Vector3;
    direction: THREE.Vector3;
    length: number;
    color: string;
}) {
    const rotation = useMemo(() => {
        return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    }, [direction]);

    return (
        <group position={position} quaternion={rotation}>
            {/* Shaft */}
            <mesh position={[0, length / 2, 0]}>
                <cylinderGeometry args={[0.012, 0.012, length, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
            </mesh>
            {/* Tip */}
            <mesh position={[0, length, 0]}>
                <coneGeometry args={[0.045, 0.12, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
            </mesh>
        </group>
    );
}

function MovingCar() {
    const ref = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (ref.current) {
            const t = state.clock.getElapsedTime() * 0.8;
            const x = ((t % 6.8) - 3.4);
            ref.current.position.x = x;
        }
    });
    return (
        <group ref={ref} position={[0, 0.02, 0.22]}>
            {/* Body */}
            <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[0.2, 0.06, 0.1]} />
                <meshStandardMaterial color="#FF6B4A" roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[-0.01, 0.09, 0]}>
                <boxGeometry args={[0.1, 0.04, 0.08]} />
                <meshStandardMaterial color="#241F2E" roughness={0.1} />
            </mesh>
            {/* Wheels */}
            {[-0.05, 0.05].map((wx) =>
                [-0.05, 0.05].map((wz) => (
                    <mesh key={`w-${wx}-${wz}`} position={[wx, 0.015, wz]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.022, 0.022, 0.015, 8]} />
                        <meshStandardMaterial color="#111" roughness={0.8} />
                    </mesh>
                ))
            )}
        </group>
    );
}

function MovingCar2() {
    const ref = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (ref.current) {
            const t = state.clock.getElapsedTime() * 0.6 + 3.0;
            const x = 3.4 - (t % 6.8);
            ref.current.position.x = x;
        }
    });
    return (
        <group ref={ref} position={[0, 0.02, -0.22]}>
            {/* Body */}
            <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[0.2, 0.06, 0.1]} />
                <meshStandardMaterial color="#8B7CF6" roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[0.01, 0.09, 0]}>
                <boxGeometry args={[0.1, 0.04, 0.08]} />
                <meshStandardMaterial color="#241F2E" roughness={0.1} />
            </mesh>
            {/* Wheels */}
            {[-0.05, 0.05].map((wx) =>
                [-0.05, 0.05].map((wz) => (
                    <mesh key={`w2-${wx}-${wz}`} position={[wx, 0.015, wz]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.022, 0.022, 0.015, 8]} />
                        <meshStandardMaterial color="#111" roughness={0.8} />
                    </mesh>
                ))
            )}
        </group>
    );
}

/* -------------------------- IELTS LESSON MODEL --------------------------- */
/*
   Scene concept: an open study book with an animated pen "writing" on the
   right-hand page, an exam clock ticking overhead (timing pressure is core
   to IELTS), and four glowing skill columns arranged around the book —
   Listening / Reading / Writing / Speaking — each topped with a floating
   band-score badge. All geometry is low-poly (few segments, no shadows,
   no post-processing) so it stays smooth at high frame rates.
*/

function ExamClock() {
    const minuteRef = useRef<THREE.Group>(null);
    const hourRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        // Fast sweep communicates "the clock is running" without needing real time.
        if (minuteRef.current) minuteRef.current.rotation.z -= delta * 1.1;
        if (hourRef.current) hourRef.current.rotation.z -= delta * 0.09;
    });

    const hourMarks = [0, 3, 6, 9];

    return (
        <group position={[0, 1.95, 0]}>
            <mesh>
                <torusGeometry args={[0.5, 0.035, 12, 48]} />
                <meshStandardMaterial color="#E2E8F0" roughness={0.5} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.015]}>
                <circleGeometry args={[0.46, 40]} />
                <meshStandardMaterial color="#FDFBF7" roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
            {hourMarks.map((h) => {
                const angle = (h / 12) * Math.PI * 2;
                const x = Math.sin(angle) * 0.37;
                const y = Math.cos(angle) * 0.37;
                return (
                    <Html key={h} position={[x, y, 0.05]} center className="pointer-events-none select-none">
                        <span className="text-[9px] font-bold text-[var(--ink)] font-mono">{h === 0 ? 12 : h}</span>
                    </Html>
                );
            })}
            <group ref={hourRef} position={[0, 0, 0.05]}>
                <mesh position={[0, 0.14, 0]}>
                    <boxGeometry args={[0.03, 0.28, 0.015]} />
                    <meshStandardMaterial color="#241F2E" />
                </mesh>
            </group>
            <group ref={minuteRef} position={[0, 0, 0.065]}>
                <mesh position={[0, 0.2, 0]}>
                    <boxGeometry args={[0.02, 0.4, 0.015]} />
                    <meshStandardMaterial color="#FF6B4A" emissive="#FF6B4A" emissiveIntensity={0.4} />
                </mesh>
            </group>
            <mesh position={[0, 0, 0.08]}>
                <sphereGeometry args={[0.03, 12, 12]} />
                <meshStandardMaterial color="#241F2E" />
            </mesh>
        </group>
    );
}

function OpenBook() {
    const penRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (penRef.current) {
            penRef.current.position.x = 0.4 + Math.sin(t * 2.2) * 0.16;
            penRef.current.position.z = 0.1 + Math.cos(t * 1.6) * 0.14;
            penRef.current.rotation.z = -0.6 + Math.sin(t * 2.2) * 0.12;
        }
    });

    const textLines = useMemo(() => Array.from({ length: 5 }).map((_, i) => -0.5 + i * 0.2), []);

    return (
        <group position={[0, -0.35, 0]}>
            {/* Spine */}
            <mesh position={[0, -0.015, 0]}>
                <boxGeometry args={[0.08, 0.05, 1.55]} />
                <meshStandardMaterial color="#241F2E" roughness={0.6} />
            </mesh>
            {/* Left page */}
            <mesh rotation={[-Math.PI / 2.05, 0, -0.32]} position={[-0.56, 0, 0]}>
                <planeGeometry args={[1.05, 1.5]} />
                <meshStandardMaterial color="#FDFBF7" side={THREE.DoubleSide} roughness={0.95} />
            </mesh>
            {/* Right page */}
            <mesh rotation={[-Math.PI / 2.05, 0, 0.32]} position={[0.56, 0, 0]}>
                <planeGeometry args={[1.05, 1.5]} />
                <meshStandardMaterial color="#FDFBF7" side={THREE.DoubleSide} roughness={0.95} />
            </mesh>
            {/* Faint printed lines, left page */}
            {textLines.map((z, i) => (
                <mesh key={`l-${i}`} rotation={[-Math.PI / 2.05, 0, -0.32]} position={[-0.56, 0.002, z]}>
                    <planeGeometry args={[0.78, 0.02]} />
                    <meshBasicMaterial color="#D8D3EA" transparent opacity={0.55} />
                </mesh>
            ))}
            {/* Handwritten-style shorter lines, right page (being filled in) */}
            {textLines.map((z, i) => (
                <mesh key={`r-${i}`} rotation={[-Math.PI / 2.05, 0, 0.32]} position={[0.56, 0.002, z]}>
                    <planeGeometry args={[0.55 - i * 0.05, 0.018]} />
                    <meshBasicMaterial color="#8B7CF6" transparent opacity={0.5} />
                </mesh>
            ))}
            {/* Pen, animated as if writing */}
            <group ref={penRef} position={[0.4, 0.05, 0.1]} rotation={[0, 0, -0.6]}>
                <mesh>
                    <cylinderGeometry args={[0.014, 0.014, 0.42, 10]} />
                    <meshStandardMaterial color="#14B8A6" roughness={0.3} metalness={0.3} />
                </mesh>
                <mesh position={[0, 0.23, 0]}>
                    <coneGeometry args={[0.014, 0.05, 10]} />
                    <meshStandardMaterial color="#241F2E" />
                </mesh>
            </group>
        </group>
    );
}

function SkillPillar({
    angle,
    color,
    height,
    label,
    score,
}: {
    angle: number;
    color: string;
    height: number;
    label: string;
    score: string;
}) {
    const radius = 2.15;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const bobRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (bobRef.current) {
            bobRef.current.position.y = -0.4 + Math.sin(t * 1.4 + angle) * 0.04;
        }
    });

    return (
        <group position={[x, 0, z]}>
            <group ref={bobRef}>
                <mesh position={[0, height / 2, 0]}>
                    <cylinderGeometry args={[0.14, 0.17, height, 20]} />
                    <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} emissive={color} emissiveIntensity={0.25} />
                </mesh>
                <mesh position={[0, height + 0.06, 0]}>
                    <sphereGeometry args={[0.11, 16, 16]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} />
                </mesh>
                <Html position={[0, height + 0.32, 0]} center className="pointer-events-none select-none">
                    <div className="flex flex-col items-center gap-0.5">
                        <span
                            className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full shadow-sm"
                            style={{ background: color }}
                        >
                            {score}
                        </span>
                        <span className="text-[8px] font-semibold text-[var(--ink)] bg-white/85 px-1 rounded">
                            {label}
                        </span>
                    </div>
                </Html>
            </group>
        </group>
    );
}

function IeltsModel({ lang = "en" }: { lang?: "en" | "uz" | "ru" }) {
    const teal = "#14B8A6";
    const violet = "#8B7CF6";
    const coral = "#FF6B4A";
    const amber = "#FFC94A";

    const skills = useMemo(() => {
        if (lang === "uz") {
            return [
                { angle: -Math.PI * 0.72, color: teal, height: 1.15, label: "Audio sahnalar", score: "Eshitish" },
                { angle: -Math.PI * 0.22, color: violet, height: 1.5, label: "3D Kontekst", score: "Kezish" },
                { angle: Math.PI * 0.22, color: coral, height: 1.75, label: "Vizual Insholar", score: "Yozish" },
                { angle: Math.PI * 0.72, color: amber, height: 1.3, label: "AI Imtihonchi", score: "Gapirish" },
            ];
        } else if (lang === "ru") {
            return [
                { angle: -Math.PI * 0.72, color: teal, height: 1.15, label: "Аудио сцены", score: "Слушать" },
                { angle: -Math.PI * 0.22, color: violet, height: 1.5, label: "3D Контекст", score: "Изучать" },
                { angle: Math.PI * 0.22, color: coral, height: 1.75, label: "Визуальные эссе", score: "Писать" },
                { angle: Math.PI * 0.72, color: amber, height: 1.3, label: "ИИ Экзаменатор", score: "Говорить" },
            ];
        } else {
            return [
                { angle: -Math.PI * 0.72, color: teal, height: 1.15, label: "Audio Scenes", score: "Listen" },
                { angle: -Math.PI * 0.22, color: violet, height: 1.5, label: "3D Context", score: "Explore" },
                { angle: Math.PI * 0.22, color: coral, height: 1.75, label: "Visual Essays", score: "Build" },
                { angle: Math.PI * 0.72, color: amber, height: 1.3, label: "AI Examiner", score: "Practice" },
            ];
        }
    }, [lang, teal, violet, coral, amber]);

    const titleText = lang === "uz" ? "IELTS Darsi" : lang === "ru" ? "Урок IELTS" : "IELTS Lesson";
    const subText = lang === "uz" ? "Faol O'rganish" : lang === "ru" ? "Активное обучение" : "Active Prep";

    return (
        <group>
            <OpenBook />
            <ExamClock />
            {skills.map((s, i) => (
                <SkillPillar key={i} {...s} />
            ))}
            <Html position={[0, 1.15, 0]} center className="pointer-events-none select-none">
                <div className="bg-white/95 border-2 border-[var(--coral)] backdrop-blur text-[var(--ink)] font-bold px-3 py-1.5 rounded-xl shadow-lg flex flex-col items-center whitespace-nowrap">
                    <span className="text-[8px] text-[var(--muted)] font-bold uppercase tracking-wider">{titleText}</span>
                    <span className="font-mono text-xs text-[var(--coral-dark)]">{subText}</span>
                </div>
            </Html>
        </group>
    );
}

function CameraController({
    activeTab,
    mathStep,
    controlsRef,
}: {
    activeTab: Tab;
    mathStep: number;
    controlsRef: React.RefObject<any>;
}) {
    const { camera } = useThree();
    const lastStepRef = useRef(mathStep);
    const lastTabRef = useRef(activeTab);
    const animProgress = useRef(1); // 1 = done
    const [startPos] = useState(() => new THREE.Vector3());
    const [startLook] = useState(() => new THREE.Vector3());

    useEffect(() => {
        if (mathStep !== lastStepRef.current || activeTab !== lastTabRef.current) {
            lastStepRef.current = mathStep;
            lastTabRef.current = activeTab;
            animProgress.current = 0;
            startPos.copy(camera.position);
            if (controlsRef.current) {
                startLook.copy(controlsRef.current.target);
            } else {
                startLook.set(0, 0.4, 0);
            }
        }
    }, [mathStep, activeTab, camera.position, controlsRef, startLook, startPos]);

    useFrame((_, delta) => {
        if (activeTab !== "math") return;
        if (animProgress.current >= 1) return;

        const targetPos = new THREE.Vector3();
        const targetLook = new THREE.Vector3();

        switch (mathStep) {
            case 1:
                targetPos.set(2.4, 1.6, 4.4);
                targetLook.set(0, 0.4, 0);
                break;
            case 2:
                // Grid alignment - side-view
                targetPos.set(0, 0.8, 5.0);
                targetLook.set(0, 0.8, 0);
                break;
            case 3:
                // Equation view - zoomed side-view
                targetPos.set(0, 0.8, 3.8);
                targetLook.set(0, 0.8, 0);
                break;
            case 4:
                // Force analysis view - diagonal perspective
                targetPos.set(-2.0, 1.4, 3.8);
                targetLook.set(0, 0.4, 0);
                break;
            case 5:
                // Interactive lab view
                targetPos.set(2.2, 1.4, 4.0);
                targetLook.set(0, 0.4, 0);
                break;
            default:
                targetPos.set(0, 1.2, 5.4);
                targetLook.set(0, 0, 0);
        }

        animProgress.current = Math.min(1, animProgress.current + delta * 1.6);
        const t = animProgress.current;
        const ease = t * t * (3 - 2 * t); // smoothstep

        camera.position.lerpVectors(startPos, targetPos, ease);
        if (controlsRef.current) {
            controlsRef.current.target.lerpVectors(startLook, targetLook, ease);
            controlsRef.current.update();
        }
    });

    return null;
}

/* ----------------------------- ROOT SCENE ---------------------------- */

function SpinningRig({
    rotation,
    isPlaying,
    children,
}: {
    rotation: number;
    isPlaying: boolean;
    children: React.ReactNode;
}) {
    const ref = useRef<THREE.Group>(null);
    useFrame((_, delta) => {
        if (ref.current && isPlaying) {
            ref.current.rotation.y += delta * 0.6;
        }
    });
    // When not auto-playing, follow the slider value exactly.
    const manualY = THREE.MathUtils.degToRad(rotation);
    return (
        <group ref={ref} rotation={isPlaying ? undefined : [0, manualY, 0]}>
            {children}
        </group>
    );
}

export default function Lesson3D({
    activeTab,
    rotation,
    isPlaying,
    mathStep = 1,
    mathCoefA = 0.15,
    mathCoefC = 0.5,
    lang = "en",
}: {
    activeTab: Tab;
    rotation: number;
    isPlaying: boolean;
    mathStep?: number;
    mathCoefA?: number;
    mathCoefC?: number;
    lang?: "en" | "uz" | "ru";
}) {
    const controlsRef = useRef<any>(null);

    // Fix HMR: force Canvas remount with a fresh WebGL context after hot reload
    const [mountKey, setMountKey] = useState(0);
    useEffect(() => {
        // Increment key on mount to force fresh Canvas after HMR
        setMountKey((k) => k + 1);
        // Dispatch resize so r3f recalculates canvas dimensions
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Canvas
            key={mountKey}
            camera={{ position: [0, 1.2, 5.4], fov: 42 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
            onCreated={({ gl, size }) => {
                gl.setSize(size.width, size.height);
                gl.setClearColor(0x000000, 0);
            }}
        >
            <ambientLight intensity={0.55} />
            <directionalLight position={[3, 4, 3]} intensity={0.9} />
            <directionalLight position={[-3, -2, -3]} intensity={0.25} />

            <CameraController activeTab={activeTab} mathStep={mathStep} controlsRef={controlsRef} />

            <SpinningRig rotation={rotation} isPlaying={isPlaying && activeTab !== "math"}>
                {activeTab === "dna" && <DnaModel />}
                {activeTab === "solar" && <SolarModel />}
                {activeTab === "volcano" && <VolcanoModel />}
                {activeTab === "ielts" && <IeltsModel lang={lang} />}
            </SpinningRig>

            {activeTab === "math" && (
                <MathBridgeModel step={mathStep} coefA={mathCoefA} coefC={mathCoefC} />
            )}

            <OrbitControls
                ref={controlsRef}
                enablePan={false}
                enableZoom={true}
                minDistance={3.2}
                maxDistance={8}
                autoRotate={false}
            />
        </Canvas>
    );
}