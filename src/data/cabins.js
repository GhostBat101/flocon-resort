/**
 * cabins: Cabin data repository and spline coordinate positions for Flocon Resort.
 * Communicates with: BookingController.jsx, DesktopShowcase.jsx, and MobileUtility.jsx.
 */

export const CABINS = [
  {
    id: 'chalet-chamonix',
    name: 'Chalet Chamonix',
    tag: 'Signature Panoramic',
    altitude: '2,400m',
    splinePosition: 0.25,
    basePrice: 850,
    capacity: 'Up to 6 Guests',
    coordinates: [12, 40, -10],
    description: 'Private south-facing sun deck, stone hearth fireplace, and cedar hot tub overlooking Mont Blanc.',
    amenities: ['Private Cedar Hot Tub', 'Direct Ski-In Slope Access', 'Stone Hearth Fireplace', 'Panoramic Glacial Vistas', 'Chalet Host Service'],
  },
  {
    id: 'chalet-valais',
    name: 'Chalet Valais',
    tag: 'Glacier Retreat',
    altitude: '2,150m',
    splinePosition: 0.55,
    basePrice: 620,
    capacity: 'Up to 4 Guests',
    coordinates: [-14, 30, 8],
    description: 'Timber-framed master suite with direct ski-in slope access, spruce sauna, and panoramic alpine views.',
    amenities: ['Spruce Timber Sauna', 'Ski Equipment Boot Warmers', 'Private Balcony', 'Fireside Dining Nook', 'Wine Cellar Selection'],
  },
  {
    id: 'chalet-zermatt',
    name: 'Chalet Zermatt',
    tag: 'Couples Sanctuary',
    altitude: '1,950m',
    splinePosition: 0.78,
    basePrice: 490,
    capacity: 'Up to 2 Guests',
    coordinates: [16, 20, -12],
    description: 'Intimate two-story refuge featuring rough-hewn pine interiors, heated stone floors, and private ski locker room.',
    amenities: ['Rough-Hewn Pine Interior', 'Heated Stone Floors', 'Espresso Bar', 'Private Ski Locker', 'Morning Pastry Delivery'],
  },
];

export const RESORT_FACTS = {
  name: 'Flocon Resort',
  region: 'French Alps',
  peakElevation: '2,800m',
  valleyElevation: '1,200m',
  dummyPhone: '+883510000000000',
  dummyPhoneDisplay: '+883 5100 0000 0000',
  dummyEmail: 'booking@flocon.example.com',
};
