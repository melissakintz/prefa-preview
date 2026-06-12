"use client";
import { Canvas, useThree } from "@react-three/fiber";
import { Line, OrbitControls, Text } from "@react-three/drei";
import { Product } from "@/app/__utils/pxml";
import * as THREE from "three";
import { useEffect } from "react";
import { WallFace } from "@/app/__components/wall";
import { getWallPosition } from "@/app/__utils/get-wall-position";

export default function Scene({ files }: { files: Product[] }) {
  const first = files[0];
  const { PA, PB, PC, PD } = getWallPosition(first);

  return (
    <Canvas className={"size-full"}>
      <WallFace a={PA} b={PB} c={PC} d={PD} />
      <MeshPoint position={PA} color={"red"} />
      <MeshPoint position={PB} color={"green"} />
      <MeshPoint position={PC} color={"blue"} />
      <MeshPoint position={PD} color={"yellow"} />

      <Helpers target={PA} />
    </Canvas>
  );
}

const MeshPoint = ({
  position,
  color,
}: {
  position: THREE.Vector3;
  color: string;
}) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

const CameraSetup = ({ target }: { target: THREE.Vector3 }) => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(target.x + 10, target.y + 10, target.z + 10);
    camera.lookAt(target);
  }, [camera, target]);
  return null;
};

const GridLabels = ({
  target,
  size = 10,
  divisions = 10,
}: {
  target: THREE.Vector3;
  size?: number;
  divisions?: number;
}) => {
  const step = size / divisions;
  const labels = [];
  for (let i = -size / 2; i <= size / 2; i += step) {
    // graduations X (sur la grille horizontale)
    labels.push(
      <Text
        key={`x${i}`}
        position={[target.x + i, target.y, target.z + size / 2 + 0.3]}
        fontSize={0.2}
        color="red"
        anchorX="center"
      >
        {parseFloat((target.x + i).toFixed(2))}
      </Text>,
    );
    // graduations Z (sur la grille horizontale)
    labels.push(
      <Text
        key={`z${i}`}
        position={[target.x - size / 2 - 0.3, target.y, target.z + i]}
        fontSize={0.2}
        color="blue"
        anchorX="center"
        rotation={[0, Math.PI / 2, 0]}
      >
        {parseFloat((target.z + i).toFixed(2))}
      </Text>,
    );
    // graduations Y (sur la grille verticale)
    labels.push(
      <Text
        key={`y${i}`}
        position={[target.x - size / 2 - 0.3, target.y + i, target.z]}
        fontSize={0.2}
        color="green"
        anchorX="center"
      >
        {parseFloat((target.y + i).toFixed(2))}
      </Text>,
    );
  }
  return <>{labels}</>;
};

const Helpers = ({ target }: { target: THREE.Vector3 }) => (
  <>
    <CameraSetup target={target} />
    <gridHelper args={[10, 10]} position={target}>
      <lineBasicMaterial transparent opacity={0.3} color="#888888" />
    </gridHelper>
    <GridLabels target={target} />
    {/* grille verticale plan XY */}
    <gridHelper
      args={[10, 10]}
      position={target}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <lineBasicMaterial transparent opacity={0.2} color="#888888" />
    </gridHelper>
    {/* Axes dans les deux sens */}
    <Line
      points={[
        [target.x - 10, target.y, target.z],
        [target.x + 10, target.y, target.z],
      ]}
      color="red"
      lineWidth={1}
    />
    <Line
      points={[
        [target.x, target.y - 10, target.z],
        [target.x, target.y + 10, target.z],
      ]}
      color="green"
      lineWidth={1}
    />
    <Line
      points={[
        [target.x, target.y, target.z - 10],
        [target.x, target.y, target.z + 10],
      ]}
      color="blue"
      lineWidth={1}
    />
    {/* Noms des axes */}
    <Text
      position={[target.x + 11, target.y, target.z]}
      fontSize={0.4}
      color="red"
      anchorX="center"
    >
      X
    </Text>
    <Text
      position={[target.x, target.y + 11, target.z]}
      fontSize={0.4}
      color="green"
      anchorX="center"
    >
      Y
    </Text>
    <Text
      position={[target.x, target.y, target.z + 11]}
      fontSize={0.4}
      color="blue"
      anchorX="center"
    >
      Z
    </Text>
    <OrbitControls target={target} />
  </>
);
