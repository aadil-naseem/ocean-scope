export interface ObservationMarker {
  id: string;
  name: string;
  type: 'argo' | 'glider' | 'ctd' | 'mooring';
  lat: number;
  lon: number;
  position3D: [number, number, number]; // [x, y, z] in Three.js space
  depth: number;
  lastUpdated: string;
  profileDepth: string;
  battery?: string;
  cycleNumber?: number;
  status: 'active' | 'profiling' | 'surfacing';
  region: 'Arabian Sea' | 'Bay of Bengal' | 'Equatorial Indian Ocean';
  observedValues: {
    temperature: number;
    salinity: number;
    chlorophyll: number;
    currentSpeed: number;
  };
  modelValues: {
    temperature: number;
    salinity: number;
    chlorophyll: number;
    currentSpeed: number;
  };
  depthProfile: {
    depth: number;
    observedTemp: number;
    modelTemp: number;
    observedSalinity: number;
    modelSalinity: number;
    observedChlorophyll: number;
    modelChlorophyll: number;
    observedCurrent: number;
    modelCurrent: number;
  }[];
  trajectory?: [number, number, number][];
}

export interface OceanRegion {
  id: string;
  name: string;
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number };
  center: [number, number];
  description: string;
}

export const REGIONS: OceanRegion[] = [
  {
    id: "arabian-sea",
    name: "Arabian Sea & Indian EEZ",
    bounds: { minLat: 5, maxLat: 25, minLon: 60, maxLon: 80 },
    center: [15, 70],
    description: "High-salinity regime with seasonal monsoon reversal & coastal upwelling",
  },
  {
    id: "bay-of-bengal",
    name: "Bay of Bengal",
    bounds: { minLat: 5, maxLat: 22, minLon: 80, maxLon: 98 },
    center: [14, 88],
    description: "Freshwater stratified basin with intense tropical cyclone genesis",
  },
  {
    id: "equatorial-io",
    name: "Equatorial Indian Ocean",
    bounds: { minLat: -10, maxLat: 5, minLon: 60, maxLon: 95 },
    center: [0, 78],
    description: "Wyrtki Jet dynamics and Indian Ocean Dipole (IOD) coupling",
  },
];

export const MOCK_OBSERVATIONS: ObservationMarker[] = [
  {
    id: "argo-2901234",
    name: "Argo Float 2901234",
    type: "argo",
    lat: 14.2,
    lon: 72.1,
    position3D: [-0.6, 0.2, 0.4],
    depth: 100,
    lastUpdated: "12 Aug 2026, 06:00 UTC",
    profileDepth: "0 – 2000 m",
    battery: "94%",
    cycleNumber: 142,
    status: "active",
    region: "Arabian Sea",
    observedValues: {
      temperature: 25.4,
      salinity: 35.1,
      chlorophyll: 0.85,
      currentSpeed: 0.42,
    },
    modelValues: {
      temperature: 25.8,
      salinity: 35.3,
      chlorophyll: 0.78,
      currentSpeed: 0.45,
    },
    depthProfile: [
      { depth: 0, observedTemp: 29.2, modelTemp: 29.5, observedSalinity: 34.8, modelSalinity: 34.9, observedChlorophyll: 2.1, modelChlorophyll: 1.9, observedCurrent: 0.65, modelCurrent: 0.68 },
      { depth: 50, observedTemp: 28.6, modelTemp: 28.9, observedSalinity: 35.0, modelSalinity: 35.1, observedChlorophyll: 1.8, modelChlorophyll: 1.7, observedCurrent: 0.58, modelCurrent: 0.60 },
      { depth: 100, observedTemp: 25.4, modelTemp: 25.8, observedSalinity: 35.1, modelSalinity: 35.3, observedChlorophyll: 0.85, modelChlorophyll: 0.78, observedCurrent: 0.42, modelCurrent: 0.45 },
      { depth: 200, observedTemp: 19.8, modelTemp: 20.2, observedSalinity: 35.4, modelSalinity: 35.5, observedChlorophyll: 0.35, modelChlorophyll: 0.32, observedCurrent: 0.28, modelCurrent: 0.30 },
      { depth: 400, observedTemp: 14.2, modelTemp: 14.5, observedSalinity: 35.2, modelSalinity: 35.3, observedChlorophyll: 0.12, modelChlorophyll: 0.10, observedCurrent: 0.18, modelCurrent: 0.20 },
      { depth: 600, observedTemp: 10.8, modelTemp: 11.0, observedSalinity: 35.0, modelSalinity: 35.0, observedChlorophyll: 0.05, modelChlorophyll: 0.05, observedCurrent: 0.12, modelCurrent: 0.14 },
      { depth: 800, observedTemp: 8.5, modelTemp: 8.6, observedSalinity: 34.9, modelSalinity: 34.9, observedChlorophyll: 0.02, modelChlorophyll: 0.02, observedCurrent: 0.08, modelCurrent: 0.09 },
      { depth: 1000, observedTemp: 6.9, modelTemp: 7.0, observedSalinity: 34.8, modelSalinity: 34.8, observedChlorophyll: 0.01, modelChlorophyll: 0.01, observedCurrent: 0.05, modelCurrent: 0.06 },
    ],
  },
  {
    id: "argo-2901889",
    name: "Argo Float 2901889",
    type: "argo",
    lat: 11.5,
    lon: 70.8,
    position3D: [-1.2, 0.2, 1.3],
    depth: 250,
    lastUpdated: "14 Aug 2026, 18:00 UTC",
    profileDepth: "0 – 2000 m",
    battery: "88%",
    cycleNumber: 89,
    status: "profiling",
    region: "Arabian Sea",
    observedValues: {
      temperature: 17.6,
      salinity: 35.4,
      chlorophyll: 0.41,
      currentSpeed: 0.38,
    },
    modelValues: {
      temperature: 18.1,
      salinity: 35.5,
      chlorophyll: 0.39,
      currentSpeed: 0.35,
    },
    depthProfile: [
      { depth: 0, observedTemp: 29.8, modelTemp: 30.0, observedSalinity: 35.2, modelSalinity: 35.3, observedChlorophyll: 2.3, modelChlorophyll: 2.1, observedCurrent: 0.72, modelCurrent: 0.70 },
      { depth: 100, observedTemp: 26.1, modelTemp: 26.5, observedSalinity: 35.3, modelSalinity: 35.4, observedChlorophyll: 1.1, modelChlorophyll: 1.0, observedCurrent: 0.50, modelCurrent: 0.48 },
      { depth: 250, observedTemp: 17.6, modelTemp: 18.1, observedSalinity: 35.4, modelSalinity: 35.5, observedChlorophyll: 0.41, modelChlorophyll: 0.39, observedCurrent: 0.38, modelCurrent: 0.35 },
      { depth: 500, observedTemp: 12.1, modelTemp: 12.3, observedSalinity: 35.1, modelSalinity: 35.2, observedChlorophyll: 0.08, modelChlorophyll: 0.09, observedCurrent: 0.15, modelCurrent: 0.16 },
      { depth: 1000, observedTemp: 7.2, modelTemp: 7.1, observedSalinity: 34.8, modelSalinity: 34.8, observedChlorophyll: 0.01, modelChlorophyll: 0.01, observedCurrent: 0.06, modelCurrent: 0.05 },
    ],
  },
  {
    id: "argo-2902341",
    name: "Argo Float 2902341",
    type: "argo",
    lat: 17.8,
    lon: 68.5,
    position3D: [-2.1, 0.2, -0.9],
    depth: 50,
    lastUpdated: "15 Aug 2026, 09:30 UTC",
    profileDepth: "0 – 2000 m",
    battery: "91%",
    cycleNumber: 64,
    status: "active",
    region: "Arabian Sea",
    observedValues: {
      temperature: 28.1,
      salinity: 36.2,
      chlorophyll: 1.12,
      currentSpeed: 0.58,
    },
    modelValues: {
      temperature: 27.9,
      salinity: 36.0,
      chlorophyll: 1.05,
      currentSpeed: 0.54,
    },
    depthProfile: [
      { depth: 0, observedTemp: 29.9, modelTemp: 29.8, observedSalinity: 36.3, modelSalinity: 36.2, observedChlorophyll: 1.8, modelChlorophyll: 1.7, observedCurrent: 0.62, modelCurrent: 0.59 },
      { depth: 50, observedTemp: 28.1, modelTemp: 27.9, observedSalinity: 36.2, modelSalinity: 36.0, observedChlorophyll: 1.12, modelChlorophyll: 1.05, observedCurrent: 0.58, modelCurrent: 0.54 },
      { depth: 150, observedTemp: 22.4, modelTemp: 22.8, observedSalinity: 35.9, modelSalinity: 35.8, observedChlorophyll: 0.45, modelChlorophyll: 0.40, observedCurrent: 0.35, modelCurrent: 0.36 },
      { depth: 500, observedTemp: 12.8, modelTemp: 13.0, observedSalinity: 35.2, modelSalinity: 35.3, observedChlorophyll: 0.06, modelChlorophyll: 0.07, observedCurrent: 0.14, modelCurrent: 0.15 },
      { depth: 1000, observedTemp: 7.0, modelTemp: 6.9, observedSalinity: 34.8, modelSalinity: 34.9, observedChlorophyll: 0.01, modelChlorophyll: 0.01, observedCurrent: 0.05, modelCurrent: 0.06 },
    ],
  },
  {
    id: "glider-incois-04",
    name: "Glider INCOIS-G4 (Varuna)",
    type: "glider",
    lat: 15.6,
    lon: 73.4,
    position3D: [0.3, 0.2, 0.1],
    depth: 85,
    lastUpdated: "15 Aug 2026, 11:45 UTC",
    profileDepth: "0 – 500 m",
    battery: "76%",
    cycleNumber: 312,
    status: "active",
    region: "Arabian Sea",
    observedValues: {
      temperature: 26.8,
      salinity: 34.9,
      chlorophyll: 1.45,
      currentSpeed: 0.31,
    },
    modelValues: {
      temperature: 26.5,
      salinity: 35.0,
      chlorophyll: 1.38,
      currentSpeed: 0.33,
    },
    depthProfile: [
      { depth: 0, observedTemp: 29.5, modelTemp: 29.4, observedSalinity: 34.6, modelSalinity: 34.7, observedChlorophyll: 2.4, modelChlorophyll: 2.2, observedCurrent: 0.45, modelCurrent: 0.46 },
      { depth: 50, observedTemp: 28.2, modelTemp: 28.0, observedSalinity: 34.8, modelSalinity: 34.9, observedChlorophyll: 1.9, modelChlorophyll: 1.8, observedCurrent: 0.38, modelCurrent: 0.40 },
      { depth: 85, observedTemp: 26.8, modelTemp: 26.5, observedSalinity: 34.9, modelSalinity: 35.0, observedChlorophyll: 1.45, modelChlorophyll: 1.38, observedCurrent: 0.31, modelCurrent: 0.33 },
      { depth: 200, observedTemp: 20.1, modelTemp: 20.4, observedSalinity: 35.2, modelSalinity: 35.3, observedChlorophyll: 0.32, modelChlorophyll: 0.30, observedCurrent: 0.22, modelCurrent: 0.24 },
      { depth: 500, observedTemp: 11.9, modelTemp: 12.1, observedSalinity: 35.1, modelSalinity: 35.1, observedChlorophyll: 0.05, modelChlorophyll: 0.05, observedCurrent: 0.10, modelCurrent: 0.11 },
    ],
    trajectory: [
      [-0.2, 0.2, 0.8],
      [0.0, 0.2, 0.5],
      [0.3, 0.2, 0.1],
      [0.6, 0.2, -0.3],
    ],
  },
  {
    id: "glider-incois-09",
    name: "Glider INCOIS-G9 (Sagarika)",
    type: "glider",
    lat: 13.1,
    lon: 71.5,
    position3D: [-0.9, 0.2, 0.9],
    depth: 120,
    lastUpdated: "15 Aug 2026, 10:15 UTC",
    profileDepth: "0 – 1000 m",
    battery: "82%",
    cycleNumber: 218,
    status: "active",
    region: "Arabian Sea",
    observedValues: {
      temperature: 24.1,
      salinity: 35.2,
      chlorophyll: 0.62,
      currentSpeed: 0.49,
    },
    modelValues: {
      temperature: 24.5,
      salinity: 35.3,
      chlorophyll: 0.58,
      currentSpeed: 0.51,
    },
    depthProfile: [
      { depth: 0, observedTemp: 29.1, modelTemp: 29.2, observedSalinity: 35.0, modelSalinity: 35.1, observedChlorophyll: 1.5, modelChlorophyll: 1.4, observedCurrent: 0.58, modelCurrent: 0.60 },
      { depth: 120, observedTemp: 24.1, modelTemp: 24.5, observedSalinity: 35.2, modelSalinity: 35.3, observedChlorophyll: 0.62, modelChlorophyll: 0.58, observedCurrent: 0.49, modelCurrent: 0.51 },
      { depth: 300, observedTemp: 16.2, modelTemp: 16.5, observedSalinity: 35.3, modelSalinity: 35.4, observedChlorophyll: 0.21, modelChlorophyll: 0.19, observedCurrent: 0.30, modelCurrent: 0.32 },
      { depth: 600, observedTemp: 10.5, modelTemp: 10.7, observedSalinity: 35.0, modelSalinity: 35.0, observedChlorophyll: 0.04, modelChlorophyll: 0.04, observedCurrent: 0.14, modelCurrent: 0.15 },
      { depth: 1000, observedTemp: 6.8, modelTemp: 6.9, observedSalinity: 34.8, modelSalinity: 34.8, observedChlorophyll: 0.01, modelChlorophyll: 0.01, observedCurrent: 0.06, modelCurrent: 0.06 },
    ],
    trajectory: [
      [-1.3, 0.2, 1.5],
      [-1.1, 0.2, 1.2],
      [-0.9, 0.2, 0.9],
      [-0.7, 0.2, 0.6],
    ],
  },
];

export interface ModelLayerConfig {
  variable: 'temperature' | 'salinity' | 'currents' | 'chlorophyll';
  depth: number; // 0 to 1000
  timeStep: number; // 0 to 10
  opacity: number;
  verticalExaggeration: number;
  colormap: 'thermal' | 'turbo' | 'viridis' | 'deep';
  showCurrentVectors: boolean;
  vectorDensity: number;
  showOceanModel: boolean;
  showObservations: boolean;
  filterArgo: boolean;
  filterGliders: boolean;
  filterCTD: boolean;
  filterMoorings: boolean;
  selectedRegionId: string;
}

export const VARIABLE_META = {
  temperature: {
    label: "Sea Temperature",
    shortLabel: "Temp",
    unit: "°C",
    min: 5,
    max: 32,
    legendGradient: "from-blue-600 via-cyan-400 via-yellow-400 to-red-500",
    description: "INCOIS ROMS High-Resolution Hydrodynamic Model",
  },
  salinity: {
    label: "Practical Salinity",
    shortLabel: "Salinity",
    unit: "PSU",
    min: 33,
    max: 37,
    legendGradient: "from-indigo-900 via-purple-600 via-pink-500 to-amber-300",
    description: "Surface & Subsurface Halocline Concentration",
  },
  currents: {
    label: "Current Velocity (U/V)",
    shortLabel: "Currents",
    unit: "m/s",
    min: 0,
    max: 1.2,
    legendGradient: "from-emerald-950 via-teal-500 via-cyan-300 to-white",
    description: "Eulerian Ocean Circulation & Surface Drift Vectors",
  },
  chlorophyll: {
    label: "Chlorophyll-a",
    shortLabel: "Chlorophyll",
    unit: "mg/m³",
    min: 0,
    max: 3.0,
    legendGradient: "from-blue-950 via-teal-700 via-emerald-400 to-lime-300",
    description: "Biogeochemical Satellite & Model Synthesis (PFZ Advisory)",
  },
};
