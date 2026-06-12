import * as THREE from "three";
import {rapportToUnity} from "@/app/__utils/maths";
import {safeArray} from "@/app/__utils/utils";
import {Product} from "@/app/__utils/pxml";

export const getWallPosition = (file: Product) => {
  const p1 = new THREE.Vector3(
    rapportToUnity(file?.P1X),
    rapportToUnity(file?.P1Y),
    rapportToUnity(file?.P1Z),
  );

  const p2 = new THREE.Vector3(
    rapportToUnity(file?.P2X),
    rapportToUnity(file?.P2Y),
    rapportToUnity(file?.P2Z),
  );
  const p3 = new THREE.Vector3(
    rapportToUnity(file?.P3X),
    rapportToUnity(file?.P3Y),
    rapportToUnity(file?.P3Z),
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

  const longueur = rapportToUnity(Math.max(...allX) - Math.min(...allX));
  const hauteur = rapportToUnity(Math.max(...allY) - Math.min(...allY));

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
