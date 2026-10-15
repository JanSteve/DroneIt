import { DropZone } from '../types';

export const DEFAULT_DROP_ZONES: DropZone[] = [
  {
    id: 'rooftop',
    name: 'Campus Rooftop Pad',
    description: 'High-rise rooftop helipad, clearance elevation +35m',
    deliveryType: 'touchdown',
    hoverAltitudeMeters: 35,
    coordinates: { x: 77.6245, y: 12.9352 },
  },
  {
    id: 'community',
    name: 'Society Community Center',
    description: 'Central gated residential square, ground level open plaza',
    deliveryType: 'winch_tether',
    hoverAltitudeMeters: 15,
    coordinates: { x: 77.6321, y: 12.9410 },
  },
  {
    id: 'lawn',
    name: 'Verified Open Lawn',
    description: 'Geo-fenced soft turf clearing, unobstructed sky corridor',
    deliveryType: 'winch_tether',
    hoverAltitudeMeters: 15,
    coordinates: { x: 77.6180, y: 12.9290 },
  },
  {
    id: 'tethered',
    name: 'Tethered Drop Point',
    description: 'Dedicated kerbside autonomous pickup pillar',
    deliveryType: 'winch_tether',
    hoverAltitudeMeters: 15,
    coordinates: { x: 77.6290, y: 12.9375 },
  },
];
