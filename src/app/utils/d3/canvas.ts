import * as d3 from 'd3';

import { Zoom } from 'src/app/utils/d3/zoom';
import { terminate } from 'src/app/utils/events';

export type GraphHost = d3.Selection<HTMLDivElement, undefined, null, undefined>;

export type Canvas = d3.Selection<SVGGElement, undefined, null, undefined>;

export function createCanvas(
  host: GraphHost,
  zoom: Zoom,
  onPointerMoved: (event: PointerEvent) => void,
  onPointerUp: (event: PointerEvent) => void,
  onDoubleClick: (event: PointerEvent) => void
): Canvas {
  return host
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .on('pointermove', (event: PointerEvent) => onPointerMoved(event))
    .on('pointerup', (event: PointerEvent) => onPointerUp(event))
    .on('contextmenu', (event: MouseEvent) => terminate(event))
    .on('dblclick', (event: PointerEvent) => onDoubleClick(event))
    .call(zoom)
    .on('dblclick.zoom', null)
    .append('g');
}
