import { SimulationNodeDatum } from 'd3';

export interface D3Node extends SimulationNodeDatum {
  id: string;
  relations: Set<string>;
  constants: Set<string>;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

export class GramoFONode implements D3Node {
  public readonly relations = new Set<string>();
  public readonly constants = new Set<string>();

  public constructor(public readonly id: string, initialRelations?: string[], initialConstants?: string[], public x?: number, public y?: number) {
    initialRelations?.forEach((relation) => this.relations.add(relation));
    initialConstants?.forEach((constant) => this.constants.add(constant));
  }
}
