// Types for tipster predictions
export interface Prediction {
  id: string;
  tipster: {
    id: string;
    name: string;
    accuracy: number; // Percentage of correct predictions
  };
  race_id: string;
  horse_id: string;
  horse_name: string;
  prediction_type: 'win' | 'place' | 'each-way';
  confidence: number; // 1-5 scale
  reasoning: string;
  odds_at_time: string;
  timestamp: string;
}

// Mock tipster data
const MOCK_TIPSTERS = [
  {
    id: 'tipster_001',
    name: 'John Expert',
    accuracy: 42.5,
    bio: 'Professional tipster with 15 years of experience in UK and Ireland racing.',
    specialties: ['Flat racing', 'Sprints']
  },
  {
    id: 'tipster_002',
    name: 'Sarah Picks',
    accuracy: 38.7,
    bio: 'Former jockey turned tipster. Specializes in jump racing and staying races.',
    specialties: ['Jump racing', 'Staying races']
  },
  {
    id: 'tipster_003',
    name: 'Racing Guru',
    accuracy: 35.2,
    bio: 'Statistical analyst using data-driven approach to horse racing predictions.',
    specialties: ['Data analysis', 'Value betting']
  }
];

// Tipster service for predictions
export const tipsterService = {
  // Get all tipsters
  async getTipsters() {
    // In a real app, this would fetch from an API or database
    return MOCK_TIPSTERS;
  },
  
  // Get tipster by ID
  async getTipsterById(tipsterId: string) {
    // In a real app, this would fetch from an API or database
    return MOCK_TIPSTERS.find(t => t.id === tipsterId) || null;
  },
  
  // Get predictions for a race
  async getPredictionsForRace(raceId: string): Promise<Prediction[]> {
    // In a real app, this would fetch from an API or database
    // For now, generate some mock predictions
    return this.generateMockPredictions(raceId);
  },
  
  // Get predictions by a specific tipster
  async getPredictionsByTipster(tipsterId: string): Promise<Prediction[]> {
    // In a real app, this would fetch from an API or database
    // For now, generate some mock predictions
    return this.generateMockPredictions(null, tipsterId);
  },
  
  // Submit a new prediction (for tipsters only)
  async submitPrediction(prediction: Omit<Prediction, 'id' | 'timestamp'>): Promise<Prediction> {
    // In a real app, this would send to an API or database
    // For now, just return a mock response
    const newPrediction: Prediction = {
      ...prediction,
      id: `pred_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    
    return newPrediction;
  },
  
  // Helper to generate mock predictions
  generateMockPredictions(raceId: string | null = null, tipsterId: string | null = null): Prediction[] {
    const mockHorses = [
      { id: 'hrs_001', name: 'Fast Runner' },
      { id: 'hrs_002', name: 'Lucky Star' },
      { id: 'hrs_003', name: 'Champion' },
      { id: 'hrs_004', name: 'Dark Horse' },
      { id: 'hrs_005', name: 'Speedy Gonzales' }
    ];
    
    const mockRaces = [
      'race_001',
      'race_002',
      'race_003'
    ];
    
    const predictions: Prediction[] = [];
    
    // Filter tipsters if tipsterId is provided
    const tipsters = tipsterId 
      ? MOCK_TIPSTERS.filter(t => t.id === tipsterId)
      : MOCK_TIPSTERS;
    
    // Filter races if raceId is provided
    const races = raceId
      ? [raceId]
      : mockRaces;
    
    // Generate 1-2 predictions per tipster per race
    tipsters.forEach(tipster => {
      races.forEach(race => {
        // Randomly select 1-2 horses for predictions
        const numPredictions = Math.floor(Math.random() * 2) + 1;
        const selectedHorses = [...mockHorses]
          .sort(() => 0.5 - Math.random())
          .slice(0, numPredictions);
        
        selectedHorses.forEach(horse => {
          const predictionTypes: ('win' | 'place' | 'each-way')[] = ['win', 'place', 'each-way'];
          const randomType = predictionTypes[Math.floor(Math.random() * predictionTypes.length)];
          
          const confidence = Math.floor(Math.random() * 5) + 1;
          
          const odds = [
            '2/1', '3/1', '4/1', '5/1', '6/1', '7/1', '8/1', '10/1', '12/1', '14/1', '16/1', '20/1'
          ];
          const randomOdds = odds[Math.floor(Math.random() * odds.length)];
          
          const reasonings = [
            'Strong form on this going.',
            'Distance suits perfectly.',
            'Jockey in great form recently.',
            'Trainer has excellent record at this course.',
            'Recent improvement suggests more to come.',
            'Well handicapped on best form.',
            'Conditions ideal for this horse today.'
          ];
          const randomReasoning = reasonings[Math.floor(Math.random() * reasonings.length)];
          
          predictions.push({
            id: `pred_${tipster.id}_${race}_${horse.id}`,
            tipster: {
              id: tipster.id,
              name: tipster.name,
              accuracy: tipster.accuracy
            },
            race_id: race,
            horse_id: horse.id,
            horse_name: horse.name,
            prediction_type: randomType,
            confidence,
            reasoning: randomReasoning,
            odds_at_time: randomOdds,
            timestamp: new Date().toISOString()
          });
        });
      });
    });
    
    return predictions;
  }
};
