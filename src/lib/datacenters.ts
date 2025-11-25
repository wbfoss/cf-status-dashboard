// Cloudflare data center coordinates by airport code
// This maps the 3-letter codes to [longitude, latitude]
export const datacenterCoordinates: Record<string, [number, number]> = {
  // North America - United States
  ABQ: [-106.6504, 35.0402],   // Albuquerque
  ANC: [-149.9961, 61.1743],   // Anchorage
  ATL: [-84.4281, 33.6367],    // Atlanta
  AUS: [-97.6699, 30.1945],    // Austin
  BNA: [-86.6782, 36.1263],    // Nashville
  BOS: [-71.0096, 42.3656],    // Boston
  BGR: [-68.8281, 44.8074],    // Bangor
  BUF: [-78.7322, 42.9405],    // Buffalo
  CLE: [-81.8498, 41.4117],    // Cleveland
  CLT: [-80.9431, 35.2140],    // Charlotte
  CMH: [-82.8919, 39.9981],    // Columbus
  DEN: [-104.6737, 39.8561],   // Denver
  DFW: [-97.0381, 32.8998],    // Dallas
  DTW: [-83.3534, 42.2124],    // Detroit
  EWR: [-74.1687, 40.6895],    // Newark
  FSD: [-96.7419, 43.5820],    // Sioux Falls
  HNL: [-157.9224, 21.3245],   // Honolulu
  IAD: [-77.4558, 38.9531],    // Washington DC (Dulles)
  IAH: [-95.3414, 29.9844],    // Houston
  IND: [-86.2944, 39.7173],    // Indianapolis
  JAX: [-81.6879, 30.4941],    // Jacksonville
  LAS: [-115.1523, 36.0840],   // Las Vegas
  LAX: [-118.4085, 33.9416],   // Los Angeles
  MCI: [-94.7139, 39.2976],    // Kansas City
  MEM: [-89.9767, 35.0424],    // Memphis
  MFE: [-98.2386, 26.1758],    // McAllen
  MIA: [-80.2906, 25.7959],    // Miami
  MSP: [-93.2218, 44.8820],    // Minneapolis
  OKC: [-97.6007, 35.3931],    // Oklahoma City
  OMA: [-95.8941, 41.3032],    // Omaha
  ORD: [-87.9048, 41.9742],    // Chicago
  ORF: [-76.2012, 36.8946],    // Norfolk
  PDX: [-122.5975, 45.5898],   // Portland
  PHL: [-75.2411, 39.8729],    // Philadelphia
  PHX: [-112.0118, 33.4373],   // Phoenix
  PIT: [-80.2329, 40.4915],    // Pittsburgh
  RDU: [-78.7870, 35.8776],    // Durham/Raleigh
  RIC: [-77.3197, 37.5052],    // Richmond
  SAN: [-117.1896, 32.7336],   // San Diego
  SAT: [-98.4698, 29.5312],    // San Antonio
  SEA: [-122.3088, 47.4502],   // Seattle
  SFO: [-122.3789, 37.6213],   // San Francisco
  SJC: [-121.9290, 37.3626],   // San Jose
  SLC: [-111.9791, 40.7884],   // Salt Lake City
  SMF: [-121.5908, 38.6954],   // Sacramento
  STL: [-90.3700, 38.7487],    // St. Louis
  TLH: [-84.3503, 30.3965],    // Tallahassee
  TPA: [-82.5332, 27.9755],    // Tampa

  // North America - Canada
  YHZ: [-63.5085, 44.8808],    // Halifax
  YOW: [-75.6692, 45.3225],    // Ottawa
  YUL: [-73.7408, 45.4706],    // Montreal
  YVR: [-123.1815, 49.1947],   // Vancouver
  YWG: [-97.2399, 49.9100],    // Winnipeg
  YXE: [-106.6997, 52.1707],   // Saskatoon
  YYC: [-114.0203, 51.1215],   // Calgary
  YYZ: [-79.6306, 43.6777],    // Toronto

  // North America - Mexico
  GDL: [-103.3111, 20.5218],   // Guadalajara
  MEX: [-99.0721, 19.4361],    // Mexico City
  QRO: [-100.1853, 20.6173],   // Queretaro

  // Central America & Caribbean
  BGI: [-59.4925, 13.0746],    // Bridgetown, Barbados
  GND: [-61.7863, 12.0042],    // St. George's, Grenada
  GUA: [-90.5275, 14.5833],    // Guatemala City
  KIN: [-76.7875, 17.9357],    // Kingston, Jamaica
  POS: [-61.3372, 10.5953],    // Port of Spain, Trinidad
  PTY: [-79.3835, 9.0714],     // Panama City
  SAP: [-87.9236, 15.4526],    // San Pedro Sula, Honduras
  SDQ: [-69.6688, 18.4296],    // Santo Domingo
  SJO: [-84.2097, 9.9939],     // San José, Costa Rica
  SJU: [-66.0018, 18.4394],    // San Juan, Puerto Rico
  STI: [-70.6049, 19.4061],    // Santiago de los Caballeros, DR
  TGU: [-87.2172, 14.0608],    // Tegucigalpa, Honduras

  // South America
  ARI: [-70.3387, -18.3487],   // Arica, Chile
  ARU: [-50.4319, -21.2096],   // Aracatuba, Brazil
  ASU: [-57.5200, -25.2400],   // Asunción, Paraguay
  BAQ: [-74.7813, 10.8896],    // Barranquilla, Colombia
  BEL: [-48.4783, -1.3792],    // Belém, Brazil
  BNU: [-49.0661, -26.9194],   // Blumenau, Brazil
  BOG: [-74.1469, 4.7016],     // Bogotá, Colombia
  BSB: [-47.9292, -15.8711],   // Brasilia, Brazil
  CAW: [-41.3017, -21.6983],   // Campos dos Goytacazes, Brazil
  CCP: [-73.0631, -36.7725],   // Concepción, Chile
  CFC: [-50.9397, -26.7756],   // Caçador, Brazil
  CGB: [-56.1167, -15.6528],   // Cuiaba, Brazil
  CLO: [-76.3816, 3.5432],     // Cali, Colombia
  CNF: [-43.9711, -19.6244],   // Belo Horizonte, Brazil
  COR: [-64.2080, -31.3100],   // Córdoba, Argentina
  CWB: [-49.1725, -25.5285],   // Curitiba, Brazil
  EZE: [-58.5358, -34.8222],   // Buenos Aires, Argentina
  FLN: [-48.5472, -27.6706],   // Florianopolis, Brazil
  FOR: [-38.5326, -3.7763],    // Fortaleza, Brazil
  GEO: [-58.2270, 6.4989],     // Georgetown, Guyana
  GIG: [-43.2506, -22.8099],   // Rio de Janeiro, Brazil
  GRU: [-46.4730, -23.4356],   // São Paulo, Brazil
  GYE: [-79.8836, -2.1574],    // Guayaquil, Ecuador
  GYN: [-49.2269, -16.6317],   // Goiania, Brazil
  JDO: [-39.2701, -7.2189],    // Juazeiro do Norte, Brazil
  JOI: [-48.7975, -26.2244],   // Joinville, Brazil
  LIM: [-77.1143, -12.0219],   // Lima, Peru
  LPB: [-68.1925, -16.5094],   // La Paz, Bolivia
  MAO: [-60.0261, -3.0386],    // Manaus, Brazil
  MDE: [-75.4280, 6.1644],     // Medellín, Colombia
  NQN: [-68.1558, -38.9489],   // Neuquen, Argentina
  NVT: [-48.6514, -26.8794],   // Navegantes/Timbo, Brazil
  PBM: [-55.1908, 5.4522],     // Paramaribo, Suriname
  PMW: [-48.3569, -10.2417],   // Palmas, Brazil
  POA: [-51.1753, -29.9944],   // Porto Alegre, Brazil
  QWJ: [-47.3333, -22.7392],   // Americana, Brazil
  RAO: [-47.7761, -21.1364],   // Ribeirao Preto, Brazil
  REC: [-34.9236, -8.1264],    // Recife, Brazil
  SCL: [-70.7858, -33.3930],   // Santiago, Chile
  SJK: [-45.8614, -23.2286],   // São José dos Campos, Brazil
  SJP: [-49.4064, -20.8167],   // São José do Rio Preto, Brazil
  SOD: [-47.4900, -23.4786],   // Sorocaba, Brazil
  SSA: [-38.3319, -12.9086],   // Salvador, Brazil
  UDI: [-48.2256, -18.8828],   // Uberlandia, Brazil
  UIO: [-78.3575, -0.1292],    // Quito, Ecuador
  VCP: [-47.1342, -23.0075],   // Campinas, Brazil
  VIX: [-40.2864, -20.2581],   // Vitoria, Brazil
  XAP: [-52.6564, -27.1342],   // Chapeco, Brazil

  // Europe - Western
  AMS: [4.7683, 52.3105],      // Amsterdam
  BCN: [2.0785, 41.2971],      // Barcelona
  BOD: [-0.7156, 44.8283],     // Bordeaux, France
  BRU: [4.4844, 50.9010],      // Brussels
  CDG: [2.5479, 49.0097],      // Paris
  DUB: [-6.2499, 53.4264],     // Dublin
  DUS: [6.7668, 51.2895],      // Dusseldorf
  EDI: [-3.3725, 55.9508],     // Edinburgh
  FRA: [8.5706, 50.0379],      // Frankfurt
  GVA: [6.1092, 46.2370],      // Geneva
  HAM: [9.9917, 53.6304],      // Hamburg
  LHR: [-0.4543, 51.4700],     // London
  LIS: [-9.1354, 38.7756],     // Lisbon
  LUX: [6.2044, 49.6233],      // Luxembourg
  LYS: [5.0883, 45.7256],      // Lyon, France
  MAD: [-3.5673, 40.4936],     // Madrid
  MAN: [-2.2750, 53.3537],     // Manchester
  MRS: [5.2142, 43.4393],      // Marseille
  MUC: [11.7861, 48.3537],     // Munich
  MXP: [8.7127, 45.6306],      // Milan
  PMO: [13.0914, 38.1800],     // Palermo, Italy
  STR: [9.2220, 48.6899],      // Stuttgart, Germany
  ZRH: [8.5617, 47.4582],      // Zurich

  // Europe - Northern
  ARN: [17.9237, 59.6519],     // Stockholm
  CPH: [12.6561, 55.6180],     // Copenhagen
  GOT: [12.2858, 57.6628],     // Gothenburg
  HEL: [24.9633, 60.3172],     // Helsinki
  KEF: [-22.6056, 63.9850],    // Reykjavik
  OSL: [11.0841, 60.1976],     // Oslo
  RIX: [23.9711, 56.9236],     // Riga
  TLL: [24.8328, 59.4133],     // Tallinn
  VNO: [25.2858, 54.6341],     // Vilnius

  // Europe - Central & Eastern
  BEG: [20.3091, 44.8184],     // Belgrade
  BTS: [17.2127, 48.1699],     // Bratislava
  BUD: [19.2556, 47.4298],     // Budapest
  KBP: [30.8947, 50.3450],     // Kyiv
  KIV: [28.9304, 46.9277],     // Chișinău, Moldova
  MSQ: [27.5615, 53.8825],     // Minsk, Belarus
  OTP: [26.0850, 44.5711],     // Bucharest
  PRG: [14.2632, 50.1008],     // Prague
  SKP: [21.6214, 41.9617],     // Skopje, North Macedonia
  SOF: [23.4114, 42.6967],     // Sofia
  TIA: [19.7206, 41.4147],     // Tirana, Albania
  TXL: [13.2877, 52.5597],     // Berlin
  VIE: [16.5697, 48.1103],     // Vienna
  WAW: [20.9679, 52.1672],     // Warsaw
  ZAG: [16.0688, 45.7429],     // Zagreb

  // Europe - Southern
  ATH: [23.9445, 37.9364],     // Athens
  FCO: [12.2389, 41.8003],     // Rome
  SKG: [22.9709, 40.5197],     // Thessaloniki, Greece

  // Russia & Central Asia
  AKX: [57.2067, 50.2458],     // Aktobe, Kazakhstan
  ALA: [77.0122, 43.3521],     // Almaty, Kazakhstan
  DME: [37.9063, 55.4088],     // Moscow
  EVN: [44.3959, 40.1473],     // Yerevan, Armenia
  FRU: [74.4776, 43.0553],     // Bishkek, Kyrgyzstan
  GYD: [50.0467, 40.4675],     // Baku, Azerbaijan
  KJA: [92.4933, 56.1729],     // Krasnoyarsk, Russia
  LED: [30.2625, 59.8003],     // Saint Petersburg
  LLK: [48.6897, 38.4286],     // Astara, Azerbaijan
  NQZ: [71.4670, 51.0222],     // Astana, Kazakhstan
  TBS: [44.9549, 41.6691],     // Tbilisi, Georgia
  ULN: [106.7667, 47.8433],    // Ulaanbaatar, Mongolia

  // Middle East
  ADB: [27.1567, 38.2924],     // Izmir, Turkey
  AMM: [35.9932, 31.7226],     // Amman
  BAH: [50.6336, 26.2708],     // Bahrain
  BEY: [35.4936, 33.8209],     // Beirut, Lebanon
  BGW: [44.2346, 33.2625],     // Baghdad, Iraq
  BSR: [47.7830, 30.5491],     // Basra, Iraq
  DMM: [49.7979, 26.4712],     // Dammam, Saudi Arabia
  DOH: [51.5651, 25.2731],     // Doha
  DXB: [55.3644, 25.2532],     // Dubai
  EBL: [43.9630, 36.2376],     // Erbil, Iraq
  HFA: [35.0429, 32.8094],     // Haifa, Israel
  IST: [28.8141, 41.2753],     // Istanbul
  ISU: [45.3167, 35.5617],     // Sulaymaniyah, Iraq
  JED: [39.1728, 21.6796],     // Jeddah, Saudi Arabia
  KWI: [47.9689, 29.2266],     // Kuwait
  LCA: [33.6249, 34.8756],     // Nicosia, Cyprus
  MCT: [58.2841, 23.5933],     // Muscat
  NJF: [44.0035, 31.9897],     // Najaf, Iraq
  RUH: [46.6989, 24.9576],     // Riyadh
  TLV: [34.8854, 32.0055],     // Tel Aviv
  XNH: [46.0900, 31.0833],     // Nasiriyah, Iraq
  ZDM: [35.2151, 31.9038],     // Ramallah

  // Africa - North
  AAE: [7.8092, 36.8222],      // Annaba, Algeria
  ALG: [3.2158, 36.6910],      // Algiers
  CAI: [31.4056, 30.1219],     // Cairo
  CMN: [-7.5898, 33.3675],     // Casablanca
  CZL: [6.6200, 36.2761],      // Constantine, Algeria
  ORN: [-0.6214, 35.6239],     // Oran, Algeria
  TUN: [10.2271, 36.8510],     // Tunis

  // Africa - West
  ABJ: [-3.9264, 5.2561],      // Abidjan, Ivory Coast
  ACC: [-0.1667, 5.6052],      // Accra, Ghana
  ASK: [-5.3496, 6.9033],      // Yamoussoukro, Ivory Coast
  DKR: [-17.4902, 14.7397],    // Dakar, Senegal
  LOS: [3.3212, 6.5774],       // Lagos, Nigeria
  OUA: [-1.5124, 12.3532],     // Ouagadougou, Burkina Faso

  // Africa - East
  ADD: [38.7993, 8.9778],      // Addis Ababa, Ethiopia
  DAR: [39.2026, -6.8781],     // Dar es Salaam, Tanzania
  EBB: [32.4436, 0.0424],      // Kampala, Uganda
  JIB: [43.1594, 11.5472],     // Djibouti
  KGL: [-30.1392, -1.9686],    // Kigali, Rwanda
  MBA: [39.5942, -4.0348],     // Mombasa, Kenya
  NBO: [36.9278, -1.3192],     // Nairobi, Kenya

  // Africa - Central
  FIH: [15.4446, -4.3858],     // Kinshasa, DR Congo
  LAD: [13.2312, -8.8583],     // Luanda, Angola

  // Africa - Southern
  CPT: [18.6017, -33.9715],    // Cape Town
  DUR: [31.1197, -29.6144],    // Durban, South Africa
  GBE: [25.9181, -24.5553],    // Gaborone, Botswana
  HRE: [31.0928, -17.9318],    // Harare, Zimbabwe
  JNB: [28.2460, -26.1367],    // Johannesburg
  LLW: [33.7806, -13.7833],    // Lilongwe, Malawi
  LUN: [28.4526, -15.3308],    // Lusaka, Zambia
  MPM: [32.5726, -25.9208],    // Maputo, Mozambique
  WDH: [17.4709, -22.4800],    // Windhoek, Namibia

  // Africa - Islands
  MRU: [57.6836, -20.4302],    // Port Louis, Mauritius
  RUN: [55.5100, -20.8907],    // Saint-Denis, Réunion
  TNR: [47.4788, -18.7969],    // Antananarivo, Madagascar

  // South Asia
  AMD: [72.6347, 23.0772],     // Ahmedabad, India
  BLR: [77.7063, 12.9499],     // Bangalore, India
  BOM: [72.8679, 19.0896],     // Mumbai, India
  CCU: [88.4467, 22.6520],     // Kolkata, India
  CMB: [79.8864, 7.1756],      // Colombo, Sri Lanka
  CNN: [75.5472, 11.9139],     // Kannur, India
  COK: [76.4019, 10.1520],     // Kochi, India
  DAC: [90.3978, 23.8433],     // Dhaka, Bangladesh
  CGP: [91.8133, 22.2496],     // Chittagong, Bangladesh
  DEL: [77.1025, 28.5562],     // New Delhi, India
  HYD: [78.4296, 17.2403],     // Hyderabad, India
  ISB: [73.0992, 33.6167],     // Islamabad, Pakistan
  IXC: [76.7884, 30.6735],     // Chandigarh, India
  KHI: [67.1608, 24.9065],     // Karachi, Pakistan
  KNU: [80.3464, 26.4409],     // Kanpur, India
  KTM: [85.3590, 27.6966],     // Kathmandu, Nepal
  MAA: [80.1693, 12.9941],     // Chennai, India
  MLE: [73.5287, 4.1918],      // Male, Maldives
  NAG: [79.0472, 21.0922],     // Nagpur, India
  PAT: [85.0878, 25.5912],     // Patna, India
  PBH: [89.6419, 27.4833],     // Thimphu, Bhutan

  // Southeast Asia
  BKK: [100.7501, 13.6900],    // Bangkok, Thailand
  BWN: [114.9282, 4.9442],     // Bandar Seri Begawan, Brunei
  CEB: [123.9794, 10.3075],    // Cebu, Philippines
  CGK: [106.6558, -6.1256],    // Jakarta, Indonesia
  CGY: [124.6119, 8.4156],     // Cagayan de Oro, Philippines
  CNX: [98.9628, 18.7669],     // Chiang Mai, Thailand
  CRK: [120.5600, 15.1860],    // Clark/Tarlac, Philippines
  DAD: [108.1994, 16.0439],    // Da Nang, Vietnam
  DPS: [115.1672, -8.7482],    // Denpasar, Bali, Indonesia
  HAN: [105.8067, 21.2212],    // Hanoi, Vietnam
  JHB: [103.6672, 1.6411],     // Johor Bahru, Malaysia
  JOG: [110.4317, -7.7883],    // Yogyakarta, Indonesia
  KCH: [110.3472, 1.4847],     // Kuching, Malaysia
  KUL: [101.7098, 2.7456],     // Kuala Lumpur, Malaysia
  MLG: [112.7144, -7.9269],    // Malang, Indonesia
  MNL: [121.0198, 14.5086],    // Manila, Philippines
  PNH: [104.8439, 11.5469],    // Phnom Penh, Cambodia
  SGN: [106.6522, 10.8185],    // Ho Chi Minh City, Vietnam
  SIN: [103.9915, 1.3644],     // Singapore
  URT: [99.1356, 9.1325],      // Surat Thani, Thailand
  VTE: [102.5636, 17.9881],    // Vientiane, Laos

  // East Asia - China
  BHY: [109.1200, 21.4817],    // Beihai
  CAN: [113.2989, 23.3924],    // Guangzhou
  CGD: [111.6400, 29.0319],    // Changde
  CGO: [113.8408, 34.5197],    // Zhengzhou
  CKG: [106.6417, 29.7192],    // Chongqing
  CSX: [113.2192, 28.1892],    // Changsha
  CZX: [119.7763, 31.9197],    // Changzhou
  DLC: [121.5393, 38.9653],    // Dalian
  FOC: [119.6628, 25.9350],    // Fuzhou
  FUO: [113.0708, 23.0833],    // Foshan
  HAK: [110.4589, 19.9344],    // Haikou/Chengmai
  HGH: [120.4344, 30.2294],    // Hangzhou/Shaoxing
  HYN: [121.4286, 28.6561],    // Taizhou, Zhejiang
  JXG: [120.7550, 30.7464],    // Jiaxing
  KHN: [115.9000, 28.8647],    // Nanchang
  KMG: [102.9294, 24.9925],    // Kunming
  KWE: [106.8006, 26.5381],    // Guiyang
  NNG: [108.1722, 22.6083],    // Nanning
  PEK: [116.5975, 40.0799],    // Beijing
  PKX: [116.4108, 39.5094],    // Beijing Daxing/Langfang
  PVG: [121.8083, 31.1443],    // Shanghai Pudong
  SHA: [121.3360, 31.1979],    // Shanghai Hongqiao
  SJW: [114.6969, 38.2806],    // Shijiazhuang
  SZX: [113.8106, 22.6394],    // Shenzhen
  TAO: [120.3747, 36.2661],    // Qingdao
  TEN: [109.1897, 27.8833],    // Tongren
  TNA: [117.2158, 36.8572],    // Jinan/Zibo
  TYN: [112.6286, 37.7467],    // Taiyuan/Yangquan
  XFN: [112.2911, 32.1519],    // Xiangyang
  XIY: [107.1550, 34.3667],    // Xi'an/Baoji
  XNN: [101.7303, 36.5286],    // Xining

  // East Asia - Japan & Korea
  FUK: [130.4511, 33.5858],    // Fukuoka, Japan
  ICN: [126.4512, 37.4602],    // Seoul, Korea
  KIX: [135.2441, 34.4347],    // Osaka, Japan
  NRT: [140.3929, 35.7720],    // Tokyo Narita, Japan
  OKA: [127.6461, 26.1958],    // Naha, Okinawa, Japan

  // East Asia - Taiwan, Hong Kong, Macau
  HKG: [113.9185, 22.3080],    // Hong Kong
  KHH: [120.3500, 22.5769],    // Kaohsiung, Taiwan
  MFM: [113.5917, 22.1494],    // Macau
  TPE: [121.2332, 25.0797],    // Taipei, Taiwan

  // Oceania - Australia
  ADL: [138.5306, -34.9450],   // Adelaide
  BNE: [153.1175, -27.3842],   // Brisbane
  CBR: [149.1903, -35.3069],   // Canberra
  HBA: [147.5097, -42.8361],   // Hobart
  MEL: [144.8410, -37.6690],   // Melbourne
  PER: [115.9672, -31.9385],   // Perth
  SYD: [151.1772, -33.9399],   // Sydney

  // Oceania - New Zealand & Pacific
  AKL: [174.7850, -37.0082],   // Auckland
  CHC: [172.5344, -43.4894],   // Christchurch
  GUM: [144.7937, 13.4834],    // Guam
  NOU: [166.2128, -22.0146],   // Noumea, New Caledonia
  PPT: [-149.6068, -17.5567],  // Papeete, Tahiti
  SUV: [178.5592, -18.0431],   // Suva, Fiji
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
