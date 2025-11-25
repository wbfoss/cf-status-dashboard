// Cloudflare data center coordinates by airport code
// This maps the 3-letter codes to [longitude, latitude]
export const datacenterCoordinates: Record<string, [number, number]> = {
  // North America
  ATL: [-84.4281, 33.6367],    // Atlanta
  BOS: [-71.0096, 42.3656],    // Boston
  BUF: [-78.7322, 42.9405],    // Buffalo
  CLT: [-80.9431, 35.2140],    // Charlotte
  ORD: [-87.9048, 41.9742],    // Chicago
  CMH: [-82.8919, 39.9981],    // Columbus
  DFW: [-97.0381, 32.8998],    // Dallas
  DEN: [-104.6737, 39.8561],   // Denver
  DTW: [-83.3534, 42.2124],    // Detroit
  HNL: [-157.9224, 21.3245],   // Honolulu
  IAH: [-95.3414, 29.9844],    // Houston
  JAX: [-81.6879, 30.4941],    // Jacksonville
  MCI: [-94.7139, 39.2976],    // Kansas City
  LAS: [-115.1523, 36.0840],   // Las Vegas
  LAX: [-118.4085, 33.9416],   // Los Angeles
  MFE: [-98.2386, 26.1758],    // McAllen
  MEM: [-89.9767, 35.0424],    // Memphis
  MIA: [-80.2906, 25.7959],    // Miami
  MSP: [-93.2218, 44.8820],    // Minneapolis
  BNA: [-86.6782, 36.1263],    // Nashville
  EWR: [-74.1687, 40.6895],    // Newark
  ORF: [-76.2012, 36.8946],    // Norfolk
  OMA: [-95.8941, 41.3032],    // Omaha
  PHL: [-75.2411, 39.8729],    // Philadelphia
  PHX: [-112.0118, 33.4373],   // Phoenix
  PIT: [-80.2329, 40.4915],    // Pittsburgh
  PDX: [-122.5975, 45.5898],   // Portland
  RIC: [-77.3197, 37.5052],    // Richmond
  SMF: [-121.5908, 38.6954],   // Sacramento
  SLC: [-111.9791, 40.7884],   // Salt Lake City
  SAN: [-117.1896, 32.7336],   // San Diego
  SFO: [-122.3789, 37.6213],   // San Francisco
  SJC: [-121.9290, 37.3626],   // San Jose
  SEA: [-122.3088, 47.4502],   // Seattle
  STL: [-90.3700, 38.7487],    // St. Louis
  TPA: [-82.5332, 27.9755],    // Tampa
  YYZ: [-79.6306, 43.6777],    // Toronto
  YVR: [-123.1815, 49.1947],   // Vancouver
  YUL: [-73.7408, 45.4706],    // Montreal
  YYC: [-114.0203, 51.1215],   // Calgary
  IAD: [-77.4558, 38.9531],    // Washington DC (Dulles)

  // Europe
  AMS: [4.7683, 52.3105],      // Amsterdam
  ATH: [23.9445, 37.9364],     // Athens
  BCN: [2.0785, 41.2971],      // Barcelona
  BEG: [20.3091, 44.8184],     // Belgrade
  TXL: [13.2877, 52.5597],     // Berlin
  BRU: [4.4844, 50.9010],      // Brussels
  OTP: [26.0850, 44.5711],     // Bucharest
  BUD: [19.2556, 47.4298],     // Budapest
  CPH: [12.6561, 55.6180],     // Copenhagen
  DUB: [-6.2499, 53.4264],     // Dublin
  DUS: [6.7668, 51.2895],      // Dusseldorf
  EDI: [-3.3725, 55.9508],     // Edinburgh
  FRA: [8.5706, 50.0379],      // Frankfurt
  GVA: [6.1092, 46.2370],      // Geneva
  GOT: [12.2858, 57.6628],     // Gothenburg
  HAM: [9.9917, 53.6304],      // Hamburg
  HEL: [24.9633, 60.3172],     // Helsinki
  KBP: [30.8947, 50.3450],     // Kyiv
  LIS: [-9.1354, 38.7756],     // Lisbon
  LHR: [-0.4543, 51.4700],     // London
  MAD: [-3.5673, 40.4936],     // Madrid
  MAN: [-2.2750, 53.3537],     // Manchester
  MRS: [5.2142, 43.4393],      // Marseille
  MXP: [8.7127, 45.6306],      // Milan
  MUC: [11.7861, 48.3537],     // Munich
  OSL: [11.0841, 60.1976],     // Oslo
  CDG: [2.5479, 49.0097],      // Paris
  PRG: [14.2632, 50.1008],     // Prague
  KEF: [-22.6056, 63.9850],    // Reykjavik
  RIX: [23.9711, 56.9236],     // Riga
  FCO: [12.2389, 41.8003],     // Rome
  SOF: [23.4114, 42.6967],     // Sofia
  ARN: [17.9237, 59.6519],     // Stockholm
  TLL: [24.8328, 59.4133],     // Tallinn
  VIE: [16.5697, 48.1103],     // Vienna
  VNO: [25.2858, 54.6341],     // Vilnius
  WAW: [20.9679, 52.1672],     // Warsaw
  ZAG: [16.0688, 45.7429],     // Zagreb
  ZRH: [8.5617, 47.4582],      // Zurich

  // Asia Pacific
  BLR: [77.7063, 12.9499],     // Bangalore
  BKK: [100.7501, 13.6900],    // Bangkok
  PEK: [116.5975, 40.0799],    // Beijing
  CEB: [123.9794, 10.3075],    // Cebu
  MAA: [80.1693, 12.9941],     // Chennai
  CGK: [106.6558, -6.1256],    // Jakarta
  HKG: [113.9185, 22.3080],    // Hong Kong
  HYD: [78.4296, 17.2403],     // Hyderabad
  KUL: [101.7098, 2.7456],     // Kuala Lumpur
  CCU: [88.4467, 22.6520],     // Kolkata
  MNL: [121.0198, 14.5086],    // Manila
  BOM: [72.8679, 19.0896],     // Mumbai
  DEL: [77.1025, 28.5562],     // New Delhi
  KIX: [135.2441, 34.4347],    // Osaka
  ICN: [126.4512, 37.4602],    // Seoul
  PVG: [121.8083, 31.1443],    // Shanghai
  SIN: [103.9915, 1.3644],     // Singapore
  TPE: [121.2332, 25.0797],    // Taipei
  NRT: [140.3929, 35.7720],    // Tokyo
  SGN: [106.6522, 10.8185],    // Ho Chi Minh City

  // Oceania
  AKL: [174.7850, -37.0082],   // Auckland
  BNE: [-153.1175, -27.3842],  // Brisbane
  MEL: [144.8410, -37.6690],   // Melbourne
  PER: [115.9672, -31.9385],   // Perth
  SYD: [151.1772, -33.9399],   // Sydney

  // Middle East & Africa
  AMM: [35.9932, 31.7226],     // Amman
  BAH: [50.6336, 26.2708],     // Bahrain
  CAI: [31.4056, 30.1219],     // Cairo
  CPT: [18.6017, -33.9715],    // Cape Town
  CMN: [-7.5898, 33.3675],     // Casablanca
  DOH: [51.5651, 25.2731],     // Doha
  DXB: [55.3644, 25.2532],     // Dubai
  JNB: [28.2460, -26.1367],    // Johannesburg
  KWI: [47.9689, 29.2266],     // Kuwait
  LOS: [3.3212, 6.5774],       // Lagos
  MBA: [39.5942, -4.0348],     // Mombasa
  MCT: [58.2841, 23.5933],     // Muscat
  RUH: [46.6989, 24.9576],     // Riyadh
  TLV: [34.8854, 32.0055],     // Tel Aviv

  // South America
  EZE: [-58.5358, -34.8222],   // Buenos Aires
  CWB: [-49.1725, -25.5285],   // Curitiba
  FOR: [-38.5326, -3.7763],    // Fortaleza
  GRU: [-46.4730, -23.4356],   // São Paulo
  GIG: [-43.2506, -22.8099],   // Rio de Janeiro
  LIM: [-77.1143, -12.0219],   // Lima
  MDE: [-75.4280, 6.1644],     // Medellín
  BOG: [-74.1469, 4.7016],     // Bogotá
  SCL: [-70.7858, -33.3930],   // Santiago
  POA: [-51.1753, -29.9944],   // Porto Alegre

  // Central America & Caribbean
  SJO: [-84.2097, 9.9939],     // San José (Costa Rica)
  PTY: [-79.3835, 9.0714],     // Panama City
  SDQ: [-69.6688, 18.4296],    // Santo Domingo
};

// Extract airport code from component name like "Amsterdam, Netherlands - (AMS)"
export function extractAirportCode(name: string): string | null {
  const match = name.match(/\(([A-Z]{3})\)$/);
  return match ? match[1] : null;
}

// Get coordinates for a component
export function getComponentCoordinates(name: string): [number, number] | null {
  const code = extractAirportCode(name);
  if (code && datacenterCoordinates[code]) {
    return datacenterCoordinates[code];
  }
  return null;
}
