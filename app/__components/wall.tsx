"use client";

import * as THREE from "three";
import { useMemo } from "react";

// Ancien composant — rectangle depuis 4 coins fixes (comparatif)
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
        opacity={0.3}
      />
    </mesh>
  );
};

export const WallFaceFromVertices = ({
  corners,
}: {
  corners: THREE.Vector3[];
}) => {
  if (corners.length < 3) return null;

  const triangles: number[] = [];
  for (let i = 1; i < corners.length - 1; i++) {
    const a = corners[0];
    const b = corners[i];
    const c = corners[i + 1];
    triangles.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  }

  const positions = new Float32Array(triangles);
  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <meshBasicMaterial
        color="#ffb347"
        side={THREE.DoubleSide}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

export const WallExtruded = ({
  localVertices,
  matrix,
  thickness,
}: {
  localVertices: { x: number; y: number }[];
  matrix: THREE.Matrix4;
  thickness: number;
}) => {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(localVertices[0].x, localVertices[0].y);
    localVertices.slice(1).forEach((v) => shape.lineTo(v.x, v.y));
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: false,
    });
    geo.applyMatrix4(matrix);
    return geo;
  }, [localVertices, matrix, thickness]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#a0c4ff"
        side={THREE.DoubleSide}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

export const WallSolid = ({
  front,
  back,
}: {
  front: THREE.Vector3[];
  back: THREE.Vector3[];
}) => {
  if (front.length < 3 || back.length < 3) return null;
  const n = front.length;

  const triangles: number[] = [];

  const push = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => {
    triangles.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  };

  // Face avant (fan)
  for (let i = 1; i < n - 1; i++) push(front[0], front[i], front[i + 1]);

  // Face arrière (fan, sens inversé pour la normale)
  for (let i = 1; i < n - 1; i++) push(back[0], back[i + 1], back[i]);

  // Côtés : pour chaque arête du contour, un rectangle = 2 triangles
  for (let i = 0; i < n; i++) {
    const a = front[i];
    const b = front[(i + 1) % n];
    const a2 = back[i];
    const b2 = back[(i + 1) % n];
    push(a, b, b2);
    push(a, b2, a2);
  }

  const positions = new Float32Array(triangles);
  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <meshBasicMaterial
        color="#a0c4ff"
        side={THREE.DoubleSide}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};
