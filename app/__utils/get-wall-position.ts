import * as THREE from "three";
import { Vector3 } from "three";
import { rapportToUnit } from "@/app/__utils/maths";
import { safeArray } from "@/app/__utils/utils";
import { Product } from "@/app/__utils/pxml";

/**
 *
 * - Ancienne (getWallPosition) : utilise min/max des X et Y locaux → coinA = P1 exactement
 *   - Nouvelle (getWallPositionFromVertices) : applique v.X ?? 0 et v.Y ?? 0 pour chaque vertex, mais si le premier SVertex a X=0, Y=-2660, alors le premier coin n'est pas P1 — il est décalé de -2660 dans
 *   la direction Y
 * @param file
 */
export const getWallPosition = (file: Product) => {
  const p1 = new THREE.Vector3(
    rapportToUnit(file?.P1X),
    rapportToUnit(file?.P1Y),
    rapportToUnit(file?.P1Z),
  );

  const p2 = new THREE.Vector3(
    rapportToUnit(file?.P2X),
    rapportToUnit(file?.P2Y),
    rapportToUnit(file?.P2Z),
  );
  const p3 = new THREE.Vector3(
    rapportToUnit(file?.P3X),
    rapportToUnit(file?.P3Y),
    rapportToUnit(file?.P3Z),
  );

  /**
   *   En architecture/BIM (comme ton fichier PXML), Z = hauteur (verticale).
   *   En Three.js, Y = hauteur par défaut.
   *   Mais ici on parle juste des axes locaux du mur selon la spec PXML — X c'est la longueur, Y c'est la hauteur, Z c'est l'épaisseur. C'est la convention choisie par la spec, pas une vérité universelle.
   *   Quand tu appliqueras la transformation pour afficher le mur dans Three.js, il faudra peut-être remapper les axes. Mais pour l'instant reste avec la convention de la spec pour ne pas te perdre.
   */
  // clone important, avoid modifyn directly p3
  const vP1P3 = p3.clone().sub(p1);
  const vP1P2 = p2.clone().sub(p1);

  const X = vP1P3.clone().normalize();

  // cross == produit vectoriel
  const Z = vP1P3.clone().cross(vP1P2).normalize();
  const Y = Z.clone().cross(vP1P3).normalize();

  // X, Y, Z vont orienter le mur — contour principal du premier slab
  const mainShape = safeArray(file?.Slab?.[0]?.Outline)?.find(
    (o) => o?.Type === "lot",
  )?.Shape;

  const vertices = safeArray(mainShape?.SVertex);

  const allX = vertices.flatMap((v) => v?.X ?? 0);
  const allY = vertices.flatMap((v) => v?.Y ?? 0);

  const longueur = rapportToUnit(Math.max(...allX) - Math.min(...allX));
  const hauteur = rapportToUnit(Math.max(...allY) - Math.min(...allY));

  //   P1                          (bas-gauche)
  const PA = p1.clone();
  //  P1 + longueur * X(bas - droite);
  const PB = p1.clone().addScaledVector(X, longueur);
  //  P1 + longueur * X + hauteur * Y   (haut-droite)
  const PC = p1
    .clone()
    .addScaledVector(X, longueur)
    .addScaledVector(Y, hauteur);
  //  P1 + hauteur * Y            (haut-gauche)
  const PD = p1.clone().addScaledVector(Y, hauteur);

  return { PA, PB, PC, PD };
};

// Retourne les coins réels en transformant chaque SVertex local via P1, X, Y
export const getWallCorners = (file: Product) => {
  const p1 = new THREE.Vector3(
    rapportToUnit(file?.P1X),
    rapportToUnit(file?.P1Y),
    rapportToUnit(file?.P1Z),
  );
  const p2 = new THREE.Vector3(
    rapportToUnit(file?.P2X),
    rapportToUnit(file?.P2Y),
    rapportToUnit(file?.P2Z),
  );
  const p3 = new THREE.Vector3(
    rapportToUnit(file?.P3X),
    rapportToUnit(file?.P3Y),
    rapportToUnit(file?.P3Z),
  );

  const vP1P3 = p3.clone().sub(p1);
  const vP1P2 = p2.clone().sub(p1);

  const X = vP1P3.clone().normalize();
  const Z = vP1P3.clone().cross(vP1P2).normalize();
  const Y = Z.clone().cross(vP1P3).normalize();

  // Matrice qui transforme les coords locales → coords monde
  //   makeBasis(X, Y, Z) dit : "quand je dessine vers la droite (axe local X), ça correspond à la direction X dans le monde réel. Quand je dessine vers le haut (axe local Y), ça correspond à Y, etc."
  /*
 *   Concrètement la matrice stocke ça sous forme de tableau 4x4 :

  | X.x  Y.x  Z.x  P1.x |   ← colonne X du mur, colonne Y, colonne Z, position
  | X.y  Y.y  Z.y  P1.y |
  | X.z  Y.z  Z.z  P1.z |
  | 0    0    0    1    | --> w qui permet la translation du plan, sans p1 ne peut pas bouger, la matrice ne pourra que tourner autour de p1
  Chaque colonne répond à une question :
  - col 1 : "si j'avance de 1 dans X local, je vais où dans le monde ?"
  - col 2 : "si j'avance de 1 dans Y local, je vais où ?"
  - col 3 : "si j'avance de 1 dans Z local (épaisseur), je vais où ?"
  - col 4 : "où est l'origine du mur ?" → P1

  Quand tu fais geo.applyMatrix4(matrix), chaque point (x, y, z) local devient x*col1 + y*col2 + z*col3 + col4 dans le monde.
  */
  const matrix = new THREE.Matrix4().makeBasis(X, Y, Z).setPosition(p1); // et tout ça part de p1

  const mainOutline = safeArray(file?.Slab?.[0]?.Outline)?.find(
    (o) => o?.Type === "lot",
  );
  const firstShape = safeArray(mainOutline?.Shape)?.[0];
  const vertices = safeArray(firstShape?.SVertex);

  // Coordonnées locales (en mètres) pour ExtrudeGeometry : Locales en 2D -> X Y
  const localVertices = vertices.map((v) => ({
    x: rapportToUnit(Number(v?.X)),
    y: rapportToUnit(Number(v?.Y)),
  }));

  // Coordonnées monde (pour l'ancienne méthode triangles)
  const corners = vertices.map((v) =>
    p1
      .clone()
      .addScaledVector(X, rapportToUnit(Number(v?.X)))
      .addScaledVector(Y, rapportToUnit(Number(v?.Y))),
  );

  return { corners, localVertices, matrix, p1, Z };
};

/**
 * Copy 4 vertices et les décaler dans Z (épaisseur)
 *
 *   Face avant        Face arrière
 *   D ——— C    →    D' ——— C'
 *   |     |         |      |
 *   A ——— B    →    A' ——— B'
 *
 *   -> 4 faces au total
 *   Avant  : A, B, C, D
 *   Arrière: A', B', C', D'
 *   Gauche : A, D, D', A'
 *   Droite : B, C, C', B'
 *   Bas    : A, B, B', A'
 *   Haut   : D, C, C', D'
 *
 *   Chaque face = 2 triangles
 *
 *
 */
export const extrudeWall = (
  corners: Vector3[],
  Z: Vector3,
  thickness: number,
) => {
  return corners.map((c) => c.clone().addScaledVector(Z, thickness));
};
