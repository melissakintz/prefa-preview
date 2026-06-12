"use client";

import * as THREE from "three";

export const WallFace = ({
  a,
  b,
  c,
  d,
}: {
  a: THREE.Vector3;
  b: THREE.Vector3;
  c: THREE.Vector3;
  d: THREE.Vector3;
}) => {
  /**
   *   D ——— C
   *   |   / |
   *   |  /  |
   *   | /   |
   *   A ——— B
   */
  // prettier-ignore
  const positions = new Float32Array([
    a.x, a.y, a.z,
    b.x, b.y, b.z,
    c.x, c.y, c.z,
    a.x, a.y, a.z,
    c.x, c.y, c.z,
    d.x, d.y, d.z,
  ]);

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <meshBasicMaterial
        color="#a0c4ff"
        side={THREE.DoubleSide}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};
