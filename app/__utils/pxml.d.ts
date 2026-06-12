/**
 * TypeScript type definitions for PXML (ProgressXML) v1.3
 * Based on the Structure Overview from the specification
 */

// ============================================
// ROOT DOCUMENT
// ============================================

/**
 * Root element of a PXML document
 * Contains document metadata and production units
 */
export interface PXMLDocument {
  /** Document information and version */
  DocInfo: DocInfo;

  /** Production orders (peut apparaître 0 à n fois) */
  Order?: Order[];

  /** Feedback blocks for production reports (peut apparaître 0 à n fois) */
  Feedback?: Feedback[];
}

// ============================================
// DOCUMENT INFO
// ============================================

/**
 * Document metadata and version information
 * Doit apparaître précisément une fois par document
 */
export interface DocInfo {
  /** Identification optionnelle du document entier, notamment pour les retours PTS */
  GlobalID?: string;

  /** Version majeure de la spécification PXML utilisée */
  MajorVersion: number;

  /** Version mineure de la spécification PXML utilisée */
  MinorVersion: number;

  /** Commentaire sur le document, optionnel mais recommandé pour les documents de rétroaction PTS */
  Comment?: string;

  /** Annotation de non-conformité PXML avec conventions de conversion */
  ConvertConventions?: string;

  /** Mode et directives de traitement du document (peut apparaître 0 à n fois) */
  Mode?: Mode[];
}

/**
 * Directive de mode pour contrôler le traitement du document
 */
export interface Mode {
  /** Identifiant du mode (ex: "ProdLayout", "EnableProduction", "EnableReinforcement") */
  ID: string;

  /** Valeur du mode (typiquement "true"/"false" ou une chaîne comme culture) */
  Val: string | boolean;
}

// ============================================
// ORDER
// ============================================

/**
 * Unité de production avec informations de commande communes
 * Peut apparaître 0 à n fois
 * Ne doit contenir que des unités de production pour une seule commande
 */
export interface Order {
  /** Identifiant de la commande */
  OrderNo?: string;

  /** Identification du groupe de bâtiments */
  Structure?: string;

  /** Bâtiment unique */
  Building?: string;

  /** Description de l'étage */
  Storey?: string;

  /** Section d'étage */
  Substorey?: string;

  /** Composant */
  Component?: string;

  /** Identifiant du dessin */
  DrawingNo?: string;

  /** Date de génération ou révision du dessin */
  DrawingDate?: string; // DateTime

  /** Numéro de révision du dessin */
  DrawingRevision?: string;

  /** Auteur du dessin */
  DrawingAuthor?: string;

  /** ID de sous-projet ERP */
  ErpProjectUnit?: string;

  /** Date de livraison prévue */
  DeliveryDate?: string; // DateTime

  /** Nom de l'application source */
  ApplicationName?: string;

  /** GUID de l'application source */
  ApplicationGUID?: string;

  /** Version de l'application source */
  ApplicationVersion?: string;

  /** Informations comptables de position (peut apparaître 0 à n fois) */
  OrderInfo?: OrderInfo[];

  /** Élément de production (peut apparaître 0 à n fois) */
  Product?: Product[];
}

/**
 * Information de position comptable ou d'ordre
 */
export interface OrderInfo {
  /** Type d'information (ex: "AccountingPosition") */
  Type: string;

  /** Identification globale optionnelle */
  GlobalID?: string;

  /** Code de la position comptable */
  Code?: string;

  /** Valeurs détaillées de l'information (peut apparaître 0 à n fois) */
  OrderInfoVal?: OrderInfoVal[];
}

/**
 * Valeur détaillée d'une information d'ordre
 */
export interface OrderInfoVal {
  /** Type de valeur (ex: "LocalizedName", "Description", "PositionInBOQ") */
  Type: string;

  /** Valeur */
  V: string;

  /** Unité optionnelle */
  U?: string;

  /** Culture pour les textes localisés (ex: "en", "de") */
  Culture?: string;
}

// ============================================
// PRODUCT (ELEMENT)
// ============================================

/**
 * Élément préfabriqué individuel
 * Pour les double murs, le Product représente le mur complet (incluant les deux couches)
 * Peut apparaître 0 à n fois dans un Order
 */
export interface Product {
  /** Identification globale de l'élément */
  GlobalID?: string;

  /** Numéro ou nom de l'élément préfabriqué */
  ElementNo?: string;

  /** Type de produit (ex: "DW", "00", "03", "BM", "CL", etc.) */
  ProductType?: string;

  /** Épaisseur totale pour les double murs */
  TotalThickness?: number; // Double

  /** Écart de double mur */
  DoubleWallsGap?: number; // Double

  /** Nombre de pièces */
  PieceCount?: number; // Int

  /** Largeur de rotation pour les double murs */
  TurnWidth?: number; // Double

  /** Commentaire optionnel */
  Comment?: string;

  /** Position de rotation de l'élément */
  RotationPosition?: number; // Double

  /** Numéro de palette de stockage */
  StackNo?: string;

  /** ID de palette */
  StackID?: string;

  /** Séquence d'empilement */
  StackingSequence?: string;

  /** Niveau d'empilement */
  StackingLevel?: string;

  /** Position X en palette (mm) */
  StackingX?: number; // Double

  /** Position Y en palette (mm) */
  StackingY?: number; // Double

  /** Position Z en palette (mm) */
  StackingZ?: number; // Double

  /** Angle en palette */
  StackingAngle?: number; // Double

  /** Rotation Y d'empilement */
  StackingRotY?: number; // Double

  /** Rotation X d'empilement */
  StackingRotX?: number; // Double

  /** Coordonnées projet - Point 1 X (mm) */
  P1X?: number; // Double

  /** Coordonnées projet - Point 1 Y (mm) */
  P1Y?: number; // Double

  /** Coordonnées projet - Point 1 Z (mm) */
  P1Z?: number; // Double

  /** Coordonnées projet - Point 2 X (mm) */
  P2X?: number; // Double

  /** Coordonnées projet - Point 2 Y (mm) */
  P2Y?: number; // Double

  /** Coordonnées projet - Point 2 Z (mm) */
  P2Z?: number; // Double

  /** Coordonnées projet - Point 3 X (mm) */
  P3X?: number; // Double

  /** Coordonnées projet - Point 3 Y (mm) */
  P3Y?: number; // Double

  /** Coordonnées projet - Point 3 Z (mm) */
  P3Z?: number; // Double

  /** Information additionnelle liée au type de produit */
  AdditionInfo?: string;

  /** Information sur la manutention au déchargement */
  UnloadingInfo?: string;

  /** Information liée au transport ou groupement des éléments */
  TransportInfo?: string;

  /** Information d'article liée aux références du système ERP (format: position@groupe@type@désignation) */
  ItemPosition?: string;

  /** Date/heure de production prévue */
  ScheduledProdDate?: string; // DateTime

  /** Tableau des champs spécifiques à l'application au niveau du contenu */
  ContentIPTable?: ContentIPTable;

  /** Informations détaillées supplémentaires sur le produit (peut apparaître 0 à n fois) */
  ElementInfo?: ElementInfo[];

  /** Parties d'élément (peut apparaître 0 à n fois) */
  Slab?: Slab[];

  /** Acier de renforcement (peut apparaître 0 à n fois) */
  Steel?: Steel[];

  /** Contour/outline (peut apparaître 0 à n fois) */
  Outline?: Outline[];

  /** Directives d'inclusion de fichier CAD */
  Include?: string;
}

/**
 * Tableau de contenu avec champs spécifiques à l'application
 * Format: clés-valeurs où les valeurs peuvent être des chaînes ou tableaux de chaînes
 */
export interface ContentIPTable {
  [key: string]: string | string[];
}

// ============================================
// ELEMENT INFO
// ============================================

/**
 * Informations supplémentaires sur l'élément Product
 * Principalement utilisé pour transférer les données CAD vers ERP
 * Peut apparaître 0 à n fois
 */
export interface ElementInfo {
  /** Type d'information (ex: "AccArea", "ArchitecturalPart", "Outlet", "MountPart", "EffortArea") */
  Type: string;

  /** Indique si l'entrée est fournie pour la gestion d'inventaire */
  Inventory?: boolean;

  /** Identification globale optionnelle */
  GlobalID?: string;

  /** Code alphanumérique (code article ou "match code") */
  Code?: string;

  /** Description textuelle libre ou désignation */
  Description?: string;

  /** Identification unique de l'objet auquel l'ElementInfo est référencé */
  ObjectID?: string;

  /** Multiplicateur de quantité pour le bloc ElementInfo entier */
  PieceCount?: number; // Int

  /** Valeur de quantité ou taille 1 (la signification dépend du Type) */
  Val1?: number; // Double

  /** Valeur de quantité ou taille 2 (la signification dépend du Type) */
  Val2?: number; // Double

  /** Unité de mesure (ex: "m²", "m³", "n", "kg") */
  Unit?: string;

  /** Valeurs détaillées de l'information (peut apparaître 0 à n fois) */
  ElemInfoVal?: ElemInfoVal[];
}

/**
 * Valeur détaillée d'une information d'élément
 */
export interface ElemInfoVal {
  /** Type de valeur (ex: "Length", "Width", "Height", "Qlty", "Name") */
  Type: string;

  /** Valeur */
  V: string | number;

  /** Unité optionnelle */
  U?: string;
}

// ============================================
// SLAB (ELEMENT PART)
// ============================================

/**
 * Partie d'élément (Slab)
 * Peut apparaître 0 à n fois dans un Product
 */
export interface Slab {
  /** Type de partie (ex: "01", "02", "05" pour DW ProductType) */
  PartType?: number;

  /** Position X de placement géométrique (mm) */
  X?: number; // Double

  /** Position Y de placement géométrique (mm) */
  Y?: number; // Double

  /** Position Z de placement géométrique (mm) */
  Z?: number; // Double

  /** Rotation autour de l'axe X (DEG) */
  RotX?: number; // Double

  /** Rotation autour de l'axe Y (DEG) */
  RotY?: number; // Double

  /** Rotation autour de l'axe Z (DEG) */
  RotZ?: number; // Double

  /** Position X de directive de production (mm) */
  ProdX?: number; // Double

  /** Position Y de directive de production (mm) */
  ProdY?: number; // Double

  /** Position Z de directive de production (mm) */
  ProdZ?: number; // Double

  /** Rotation de production autour de l'axe X (DEG) */
  ProdRotX?: number; // Double

  /** Rotation de production autour de l'axe Y (DEG) */
  ProdRotY?: number; // Double

  /** Rotation de production autour de l'axe Z (DEG) */
  ProdRotZ?: number; // Double

  /** Longueur maximale (mm) - propriété redondante, déconseillée */
  MaxLength?: number; // Double

  /** Largeur maximale (mm) - propriété redondante, déconseillée */
  MaxWidth?: number; // Double

  /** Projection de renforcement à gauche (mm) */
  IronProjectionLeft?: number; // Double

  /** Projection de renforcement à droite (mm) */
  IronProjectionRight?: number; // Double

  /** Projection de renforcement au bas (mm) */
  IronProjectionBottom?: number; // Double

  /** Projection de renforcement au haut (mm) */
  IronProjectionTop?: number; // Double

  /** Contours géométriques (peut apparaître 0 à n fois) */
  Outline?: Outline[];

  /** Acier/renforcement (peut apparaître 0 à n fois) */
  Steel?: Steel[];

  /** Pièces montées (peut apparaître 0 à n fois) */
  MountPart?: MountPart[];

  /** Blocs d'allocation (peut apparaître 0 à n fois) */
  Alloc?: Alloc[];
}

// ============================================
// OUTLINE
// ============================================

/**
 * Contour géométrique général d'un élément ou d'une partie
 * Le Type attribute détermine le type d'élément enfermé:
 * - "lot": Contour de couche de béton avec contours, découpes et données de béton
 * - "mountpart": Pièces de montage
 * Peut apparaître 0 à n fois
 */
export interface Outline {
  /** Type de contour ("lot" | "mountpart") */
  Type: "lot" | "mountpart";

  /** Identification globale optionnelle */
  GlobalID?: string;

  /** Position X de placement géométrique du contour (mm) */
  X?: number; // Double

  /** Position Y de placement géométrique du contour (mm) */
  Y?: number; // Double

  /** Position Z de placement géométrique du contour (mm) */
  Z?: number; // Double

  /** Rotation autour de l'axe X (DEG) */
  RotX?: number; // Double

  /** Rotation autour de l'axe Y (DEG) */
  RotY?: number; // Double

  /** Rotation autour de l'axe Z (DEG) */
  RotZ?: number; // Double

  /** Hauteur/épaisseur de la couche de béton ou profondeur de la pièce montée (mm) */
  Height?: number; // Double

  /** Identifiant ou désignation de l'élément */
  Name?: string;

  /** Informations génériques librement utilisables */
  GenericInfo01?: string;

  /** Informations génériques librement utilisables */
  GenericInfo02?: string;

  /** Instructions de montage (uniquement pour mountpart)
   * 0 = en cours d'installation
   * 1 = dessiné seulement
   * 2 = monté seulement
   * 3 = ni dessiné ni monté
   * 4 = installé dans le renforcement
   * 5 = automatiquement installé
   */
  MountingInstruction?: number; // Int

  /** Type de pièce montée (uniquement pour mountpart) */
  MountPartType?: string;

  /** Article/code de la pièce montée (uniquement pour mountpart) */
  MountPartArticle?: string;

  /** Projection d'armature en mm (uniquement pour mountpart) */
  MountPartIronProjection?: number; // Double

  /** Direction de projection ou orientation de la pièce montée en degrés (uniquement pour mountpart) */
  MountPartDirection?: number; // Double

  /** Longueur de la pièce montée en mm (uniquement pour mountpart) */
  MountPartLength?: number; // Double

  /** Largeur de la pièce montée en mm (uniquement pour mountpart) */
  MountPartWidth?: number; // Double

  /** Mode de bétonnage (uniquement pour lot) */
  ConcretingMode?: string;

  /** Qualité/grade du béton (uniquement pour lot), ex: "B25" */
  ConcreteQuality?: string;

  /** Masse volumétrique du béton en kg/dm³ */
  UnitWeight?: number; // Double

  /** Volume cible de béton en m³ */
  Volume?: number; // Double

  /** Désignation de la couche à laquelle appartient l'élément (ex: "L01", "L02") */
  Layer?: string;

  /** Identification unique de l'objet par le système CAD
   * Peut avoir une structure multi-niveaux en utilisant des points pour séparer les identifiants partiels
   */
  ObjectID?: string;

  /** Tableau des champs spécifiques à l'application au niveau du contenu */
  ContentIPTable?: ContentIPTable;

  /** Formes/polygones (peut apparaître 0 à n fois) */
  Shape?: Shape;
}

/**
 * Forme/polygone composé de points formant un contour
 * Décrit soit un contour, soit une découpe selon la propriété Cutout
 */
export interface Shape {
  /** Identification globale optionnelle de la forme */
  GlobalID?: string;

  /** Si vrai, cette Shape décrit une découpe (trou dans la forme environnante) */
  Cutout?: boolean; // Bool

  /** Position Z de référence pour les arêtes penchées */
  RefHeight?: number; // Double

  /** Sommets du polygone formant la forme (peut apparaître >= 1 fois) */
  SVertex?: SVertex[];
}

/**
 * Sommet d'un polygone formant une forme/contour
 * Décrit un coin du polygone (un point dans le plan)
 */
export interface SVertex {
  /** Identification globale optionnelle du sommet */
  GlobalID?: string;

  /** Coordinate X du sommet (mm)
   * Décrit les coordonnées à la position Z donnée par Shape.RefHeight
   * Pour les arêtes penchées, les coordonnées à d'autres niveaux Z sont données par:
   * X + DX * (Z - RefHeight) et Y + DY * (Z - RefHeight)
   */
  X?: number[]; // Double

  /** Coordinate Y du sommet (mm) */
  Y?: number[]; // Double

  /** Bulge - hauteur de l'arc entre ce sommet et le suivant (mm)
   * Si non nul, la connexion à son successeur est un arc de cette hauteur
   * Positif = arc courbe vers l'extérieur, négatif = arc courbe vers l'intérieur
   * Cas spécial: si Shape a seulement 1 SVertex, il est interprété comme cercle,
   * le sommet spécifie le centre et |Bulge| = diamètre du cercle
   */
  Bulge?: number; // Double

  /** Attribut de ligne - information spécifique à l'application pouvant être assignée à chaque SVertex
   * Typiquement un nombre hexadécimal 4 chiffres interprété comme champ de bits:
   * Bit 00 [0001]: Pas de chanfrein au bas
   * Bit 01 [0002]: Coffrage spécial
   * Bit 02 [0004]: Joint de coulage
   * Bit 03 [0008]: Pas de chanfrein au haut
   * Bit 04 [0010]: Courbure au bas
   * Bit 05 [0020]: Ressort (coffrage avec gorge)
   * Bit 06 [0040]: Gorge (coffrage avec ressort)
   * Bit 07 [0080]: Courbure au haut
   * Bit 08 [0100]: Arête nette
   * Bit 11 [0800]: Coffrage de support
   * Bit 12 [1000]: Coffrage de fenêtre
   * Bit 13 [2000]: Coffrage de contour
   * Bit 14 [4000]: Ne pas fixer le coffrage en place
   */
  LineAttribute?: string;

  /** Profil de l'arête géométrique - description précise du profil du béton
   * Format: "z0|p0 z1|p1 z2|p2 ... zn|pn" (paires de nombres séparées par des espaces)
   * zi = valeurs Z verticales (hauteurs absolues)
   * pi = valeurs horizontales (positives = saillantes, négatives = rentrantes)
   * Les Z initiaux/finaux sont optionnels (valeurs par défaut: 0 et épaisseur)
   */
  Profile?: string;

  /** Pente de l'arête en direction X
   * Pour une arête non parallèle à l'axe Z: X + DX * (Z - RefHeight)
   * Avec DX=1 et DY=0, l'arête a une inclinaison de 45 degrés à l'axe Z
   */
  DX?: number; // Double

  /** Pente de l'arête en direction Y
   * Pour une arête non parallèle à l'axe Z: Y + DY * (Z - RefHeight)
   */
  DY?: number; // Double
}

// ============================================
// STEEL (REINFORCEMENT)
// ============================================

/**
 * Informations sur l'acier/renforcement
 * Peut apparaître 0 à n fois
 */
export interface Steel {
  /** Identification de l'acier */
  SteelID?: string;

  /** Nom de l'armature */
  Name?: string;

  /** Barres de renforcement individuelles (peut apparaître 0 à n fois) */
  Bar?: Bar[];

  /** Treillis de renforcement (peut apparaître 0 à n fois) */
  Mesh?: Mesh[];

  /** Girouettes en treillis (peut apparaître 0 à n fois) */
  LatticeGirder?: LatticeGirder[];

  /** Blocs d'allocation (peut apparaître 0 à n fois) */
  Alloc?: Alloc[];
}

/**
 * Barre de renforcement individuelle
 */
export interface Bar {
  /** Identification globale de la barre */
  GlobalID?: string;

  /** Numéro ou nom de la barre */
  BarNo?: string;

  /** Nombre de barres identiques */
  PieceCount?: number; // Int

  /** Diamètre de la barre (mm) */
  Diameter?: number; // Double

  /** Type de matériau de la barre */
  MaterialType?: string;

  /** Longueur totale de la barre (mm) */
  TotalLength?: number; // Double

  /** Segments de la barre (peut apparaître 0 à n fois) */
  Segment?: BarSegment[];
}

/**
 * Segment d'une barre de renforcement
 */
export interface BarSegment {
  /** Identification du segment */
  SegmentID?: string;

  /** Type de segment */
  SegmentType?: string;

  /** Longueur du segment (mm) */
  Length?: number; // Double
}

/**
 * Treillis de renforcement
 */
export interface Mesh {
  /** Identification du treillis */
  MeshID?: string;

  /** Numéro ou nom du treillis */
  MeshNo?: string;

  /** Type de treillis */
  MeshType?: string;

  /** Nombre de treillis identiques */
  PieceCount?: number; // Int
}

/**
 * Girouette en treillis
 */
export interface LatticeGirder {
  /** Identification de la girouette */
  LatticeGirderID?: string;

  /** Numéro ou nom de la girouette */
  GirderNo?: string;

  /** Nombre de girouettes identiques */
  PieceCount?: number; // Int

  /** Type de girouette */
  GirderType?: string;
}

// ============================================
// MOUNT PART
// ============================================

/**
 * Pièce de montage, accessoire
 * Peut apparaître 0 à n fois
 */
export interface MountPart {
  /** Identification de la pièce de montage */
  MountPartID?: string;

  /** Code de la pièce de montage */
  Code?: string;

  /** Description de la pièce de montage */
  Description?: string;

  /** Type de pièce */
  MountType?: string;

  /** Nombre de pièces */
  PieceCount?: number; // Int
}

// ============================================
// ALLOC (ALLOCATION/STAGGERING)
// ============================================

/**
 * Bloc d'allocation décrivant un motif d'escalonnement pour les barres ou girouettes
 * Utilisé pour décrire les cages
 * Peut apparaître 0 à n fois
 */
export interface Alloc {
  /** Type d'allocation (ex: "Bar", "Girder") */
  Type: string;

  /** Identification de l'allocation */
  AllocID?: string;

  /** Index de la barre de guidage si applicable */
  GuidingBar?: number; // Int

  /** Région de l'allocation (peut apparaître 0 à n fois) */
  Region?: AllocRegion[];
}

/**
 * Région d'une allocation
 */
export interface AllocRegion {
  /** Identification de la région */
  RegionID?: string;

  /** Position de début dans la région */
  StartPosition?: number; // Double

  /** Position de fin dans la région */
  EndPosition?: number; // Double

  /** Espacement des éléments */
  Spacing?: number; // Double
}

// ============================================
// FEEDBACK
// ============================================

/**
 * Bloc de retour d'information pour les rapports de production
 * Peut apparaître 0 à n fois dans le document racine
 */
export interface Feedback {
  /** Type d'élément auquel se rapporte le retour d'information (ex: "Bar", "Slab") */
  ItemType: string;

  /** Identification globale de l'élément produit */
  GlobalID?: string;

  /** Nombre de pièces produites */
  PieceCount?: number; // Int

  /** Type de matériau utilisé */
  MaterialType?: string;

  /** Lot de matériau */
  MaterialBatch?: string;

  /** Poids du matériau utilisé (kg) */
  MaterialWeight?: number; // Double

  /** Date/heure de production */
  ProdDate?: string; // DateTime
}
