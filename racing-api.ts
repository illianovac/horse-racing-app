// Racing API client for fetching horse racing data
// Based on The Racing API documentation

const API_BASE_URL = 'https://api.theracingapi.com/v1';
// In a production app, these would be stored in environment variables
const API_USERNAME = 'demo_username'; 
const API_PASSWORD = 'demo_password';

// Types for API responses
export interface Race {
  race_id: string;
  date: string;
  region: string;
  course_id: string;
  course: string;
  time: string;
  type: string;
  class: string;
  age_band: string;
  distance: string;
  going: string;
  runners: Runner[];
}

export interface Runner {
  horse_id: string;
  horse: string;
  jockey_id: string;
  jockey: string;
  trainer_id: string;
  trainer: string;
  age: string;
  weight: string;
  number: string;
  draw: string;
  sp: string; // Starting price
  position?: string; // Only available for results
}

export interface RaceCard {
  race_id: string;
  date: string;
  course: string;
  time: string;
  title: string;
  distance: string;
  age_band: string;
  runners_count: number;
}

// API client functions
export const racingApi = {
  // Fetch today's racecards
  async getTodaysRacecards() : Promise<RaceCard[]> {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const response = await fetch(`${API_BASE_URL}/racecards/${today}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${API_USERNAME}:${API_PASSWORD}`),
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.racecards;
    } catch (error) {
      console.error('Error fetching racecards:', error);
      // Return mock data for development
      return getMockRacecards();
    }
  },
  
  // Fetch race details by ID
  async getRaceById(raceId: string): Promise<Race> {
    try {
      const response = await fetch(`${API_BASE_URL}/race/${raceId}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${API_USERNAME}:${API_PASSWORD}`),
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.race;
    } catch (error) {
      console.error('Error fetching race details:', error);
      // Return mock data for development
      return getMockRaceDetails(raceId);
    }
  },
  
  // Fetch runner odds for a race
  async getRunnerOdds(raceId: string, horseId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/odds/${raceId}/${horseId}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${API_USERNAME}:${API_PASSWORD}`),
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.odds;
    } catch (error) {
      console.error('Error fetching runner odds:', error);
      // Return mock data for development
      return { sp: '5/1', current: '9/2' };
    }
  },
  
  // Fetch race results
  async getRaceResults(raceId: string): Promise<Race> {
    try {
      const response = await fetch(`${API_BASE_URL}/results/${raceId}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${API_USERNAME}:${API_PASSWORD}`),
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching race results:', error);
      // Return mock data for development
      return getMockRaceResults(raceId);
    }
  },
};

// Mock data for development
function getMockRacecards(): RaceCard[] {
  return [
    {
      race_id: 'race_001',
      date: new Date().toISOString().split('T')[0],
      course: 'Ascot',
      time: '14:30',
      title: 'The Queen Anne Stakes',
      distance: '1m',
      age_band: '4yo+',
      runners_count: 8
    },
    {
      race_id: 'race_002',
      date: new Date().toISOString().split('T')[0],
      course: 'Ascot',
      time: '15:05',
      title: 'The King's Stand Stakes',
      distance: '5f',
      age_band: '3yo+',
      runners_count: 12
    },
    {
      race_id: 'race_003',
      date: new Date().toISOString().split('T')[0],
      course: 'Cheltenham',
      time: '15:40',
      title: 'The Novices' Chase',
      distance: '2m 4f',
      age_band: '5yo+',
      runners_count: 6
    }
  ];
}

function getMockRaceDetails(raceId: string): Race {
  return {
    race_id: raceId,
    date: new Date().toISOString().split('T')[0],
    region: 'GB',
    course_id: 'crs_52',
    course: 'Ascot',
    time: '14:30',
    type: 'Flat',
    class: '1',
    age_band: '4yo+',
    distance: '1m',
    going: 'Good to Firm',
    runners: [
      {
        horse_id: 'hrs_001',
        horse: 'Fast Runner',
        jockey_id: 'jky_001',
        jockey: 'J. Smith',
        trainer_id: 'trn_001',
        trainer: 'T. Johnson',
        age: '4',
        weight: '9-0',
        number: '1',
        draw: '3',
        sp: '3/1'
      },
      {
        horse_id: 'hrs_002',
        horse: 'Lucky Star',
        jockey_id: 'jky_002',
        jockey: 'R. Williams',
        trainer_id: 'trn_002',
        trainer: 'S. Davis',
        age: '5',
        weight: '9-2',
        number: '2',
        draw: '5',
        sp: '5/1'
      },
      {
        horse_id: 'hrs_003',
        horse: 'Champion',
        jockey_id: 'jky_003',
        jockey: 'M. Brown',
        trainer_id: 'trn_003',
        trainer: 'P. Wilson',
        age: '4',
        weight: '9-0',
        number: '3',
        draw: '1',
        sp: '7/2'
      }
    ]
  };
}

function getMockRaceResults(raceId: string): Race {
  const race = getMockRaceDetails(raceId);
  
  // Add positions to runners
  race.runners[0].position = '1';
  race.runners[1].position = '3';
  race.runners[2].position = '2';
  
  return race;
}
