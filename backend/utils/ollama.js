const isProduction = process.env.NODE_ENV === 'production';
const axios = require('axios');

// EMISSION FACTORS (kg CO₂e per unit) - Based on DEFRA and IPCC data
const EMISSION_FACTORS = {
  // Transport
  flight_short_haul: 0.12576,    // per km (under 3700 km)
  flight_long_haul: 0.185,       // per km (over 3700 km)
  car_petrol: 0.192,             // per km
  car_diesel: 0.171,             // per km
  car_ev: 0.053,                 // per km
  motorcycle: 0.103,             // per km
  bus: 0.089,                   // per km
  train: 0.041,                 // per km
  metro: 0.033,                 // per km
  
  // Energy (per kWh)
  electricity_coal: 0.82,       // kg CO₂e per kWh
  electricity_gas: 0.45,        // kg CO₂e per kWh
  electricity_renewable: 0.02,  // kg CO₂e per kWh
  natural_gas: 0.202,           // per kWh
  ac_per_hour: 0.55,            // per hour (1.5 ton AC)
  
  // Diet (per serving/kg)
  beef: 27,                     // kg CO₂e per kg
  lamb: 24,                     // kg CO₂e per kg
  pork: 7,                      // kg CO₂e per kg
  chicken: 5,                   // kg CO₂e per kg
  vegetarian_meal: 2,           // kg CO₂e per meal
  vegan_meal: 1.5,              // kg CO₂e per meal

  bicycle: 0,                   // Zero emission!
  walking: 0,                   // Zero emission!
  shipping: 0.15,               // per kg-km
};

// ========== MOCK DATA FOR PRODUCTION (NO OLLAMA NEEDED) ==========
function getMockEmissionData(description) {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('drive') || lowerDesc.includes('car') || lowerDesc.includes('suv')) {
    return {
      activity_type: 'driving',
      quantity: 40,
      unit: 'km',
      estimated_emission_kg_co2e: 7.68,
      category: 'Transport',
      details: { carType: 'petrol' }
    };
  }
  
  if (lowerDesc.includes('fly') || lowerDesc.includes('flight') || lowerDesc.includes('delhi') || lowerDesc.includes('mumbai')) {
    return {
      activity_type: 'flying',
      quantity: 1150,
      unit: 'km',
      estimated_emission_kg_co2e: 144.62,
      category: 'Transport',
      details: { class: 'economy' }
    };
  }
  
  if (lowerDesc.includes('train')) {
    return {
      activity_type: 'train',
      quantity: 100,
      unit: 'km',
      estimated_emission_kg_co2e: 4.1,
      category: 'Transport',
      details: {}
    };
  }
  
  if (lowerDesc.includes('bus')) {
    return {
      activity_type: 'bus',
      quantity: 20,
      unit: 'km',
      estimated_emission_kg_co2e: 1.78,
      category: 'Transport',
      details: {}
    };
  }
  
  if (lowerDesc.includes('steak') || lowerDesc.includes('beef')) {
    return {
      activity_type: 'diet',
      quantity: 1,
      unit: 'meal',
      estimated_emission_kg_co2e: 8.1,
      category: 'Diet',
      details: { foodType: 'beef' }
    };
  }
  
  if (lowerDesc.includes('chicken')) {
    return {
      activity_type: 'diet',
      quantity: 1,
      unit: 'meal',
      estimated_emission_kg_co2e: 1.5,
      category: 'Diet',
      details: { foodType: 'chicken' }
    };
  }
  
  if (lowerDesc.includes('ac') || lowerDesc.includes('air conditioner')) {
    return {
      activity_type: 'appliance_use',
      quantity: 6,
      unit: 'hours',
      estimated_emission_kg_co2e: 3.3,
      category: 'Energy',
      details: { appliance: 'ac' }
    };
  }
  
  if (lowerDesc.includes('walk') || lowerDesc.includes('bicycle') || lowerDesc.includes('bike')) {
    return {
      activity_type: 'other',
      quantity: 5,
      unit: 'km',
      estimated_emission_kg_co2e: 0,
      category: 'Transport',
      details: {}
    };
  }
  
  // Default fallback
  return {
    activity_type: 'other',
    quantity: 1,
    unit: 'unit',
    estimated_emission_kg_co2e: 5.0,
    category: 'Other',
    details: {}
  };
}

function getMockTips() {
  return `1. 🚗 Consider carpooling or using public transport for your daily commute
2. 🥗 Try incorporating meatless meals 2-3 times per week
3. 💡 Switch to LED bulbs and turn off appliances when not in use
4. 🚲 For short distances, consider walking or cycling instead of driving`;
}

function getMockReportSummary(userEmail) {
  return `Great progress on your carbon reduction journey, ${userEmail || 'user'}! Your consistent tracking is helping you understand your environmental impact. Keep making sustainable choices like using public transport and reducing meat consumption. Every small step counts toward a greener future! 🌍`;
}

const ollamaCall = async (prompt, model = process.env.OLLAMA_MODEL) => {
  // PRODUCTION: Don't call Ollama
  if (isProduction) {
    throw new Error('Ollama is disabled in production mode');
  }
  
  try {
    const response = await axios.post(`${process.env.OLLAMA_BASE_URL}/api/generate`, {
      model,
      prompt,
      stream: false,
      temperature: 0.7,
    });
    return response.data.response;
  } catch (error) {
    console.error('Ollama API Error:', error.message);
    throw new Error('Failed to connect to Ollama. Make sure it is running on http://localhost:11434');
  }
};

// Calculate emission based on activity type and quantity
const calculateEmission = (activityType, quantity, unit, details = {}) => {
  let emission = 0;
  
  switch (activityType) {
    case 'flying':
      // Check if short or long haul
      const isLongHaul = quantity > 3700;
      emission = quantity * (isLongHaul ? EMISSION_FACTORS.flight_long_haul : EMISSION_FACTORS.flight_short_haul);
      break;
      
    case 'driving':
      const carType = details.carType || 'petrol';
      if (carType === 'petrol') emission = quantity * EMISSION_FACTORS.car_petrol;
      else if (carType === 'diesel') emission = quantity * EMISSION_FACTORS.car_diesel;
      else if (carType === 'ev') emission = quantity * EMISSION_FACTORS.car_ev;
      else emission = quantity * EMISSION_FACTORS.car_petrol;
      break;
      
    case 'train':
      emission = quantity * EMISSION_FACTORS.train;
      break;
      
    case 'bus':
      emission = quantity * EMISSION_FACTORS.bus;
      break;
      
    case 'cooking':
    case 'heating':
      emission = quantity * EMISSION_FACTORS.natural_gas;
      break;
      
    case 'appliance_use':
      if (details.appliance === 'ac') {
        emission = quantity * EMISSION_FACTORS.ac_per_hour;
      } else {
        emission = quantity * EMISSION_FACTORS.electricity_coal;
      }
      break;
      
    case 'diet':
      const foodType = details.foodType || 'vegetarian_meal';
      emission = EMISSION_FACTORS[foodType] || EMISSION_FACTORS.vegetarian_meal;
      break;
      
    default:
      emission = quantity * 0.1; // Fallback
  }
  
  return Math.round(emission * 100) / 100; // Round to 2 decimals
};

const extractEmissionData = async (activityDescription) => {
  // PRODUCTION: Use mock data (no Ollama call)
  if (isProduction) {
    console.log('Production mode: Using mock emission data for:', activityDescription);
    return getMockEmissionData(activityDescription);
  }
  
  // DEVELOPMENT: Use real Ollama AI
  const classificationPrompt = `You are an expert in carbon emissions. Classify the following activity and return ONLY a valid JSON object (no markdown, no extra text) with these exact fields:
- activity_type: (string - one of: "driving", "flying", "train", "bus", "cooking", "heating", "appliance_use", "diet", "other")
- quantity: (number - the numerical amount)
- unit: (string - e.g., "km", "hours", "kg", "meals")
- category: (string - one of: "Transport", "Energy", "Diet", "Other")
- details: (object - with additional info like carType: "petrol/diesel/ev", appliance: "ac/heater", foodType: "beef/chicken/vegetarian_meal")

Activity: "${activityDescription}"

Return ONLY the JSON object, nothing else.`;

  try {
    // Step 1: Get classification from AI
    const classificationResponse = await ollamaCall(classificationPrompt);
    const jsonMatch = classificationResponse.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Ollama');
    }
    
    const extracted = JSON.parse(jsonMatch[0]);
    
    // Step 2: Calculate emission using formula (NOT AI guess)
    const estimatedEmission = calculateEmission(
      extracted.activity_type,
      extracted.quantity,
      extracted.unit,
      extracted.details || {}
    );
    
    // Step 3: Return structured data with calculated emission
    return {
      activity_type: extracted.activity_type,
      quantity: extracted.quantity,
      unit: extracted.unit,
      estimated_emission_kg_co2e: estimatedEmission,
      category: extracted.category,
      details: extracted.details
    };
    
  } catch (error) {
    console.error('Emission extraction error:', error.message);
    
    // Fallback: Try to extract basic info from description
    return {
      activity_type: "other",
      quantity: 1,
      unit: "unit",
      estimated_emission_kg_co2e: 1.0,
      category: "Other",
      details: {}
    };
  }
};

const generateEmissionTips = async (userActivities) => {
  // PRODUCTION: Return mock tips
  if (isProduction) {
    return getMockTips();
  }
  
  // DEVELOPMENT: Use real Ollama
  if (!userActivities || userActivities.length === 0) {
    return "1. Start tracking your daily activities to understand your carbon footprint\n2. Try using public transport once a week\n3. Switch to energy-efficient appliances";
  }

  const categoryBreakdown = {};
  userActivities.forEach((activity) => {
    categoryBreakdown[activity.category] = (categoryBreakdown[activity.category] || 0) + (activity.emission || 0);
  });

  const topCategory = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0];

  const prompt = `You are a carbon reduction expert. Based on the user's activity data, provide 2-3 specific, actionable tips to reduce carbon emissions.

User's top emission category: ${topCategory ? topCategory[0] : 'Mixed'}
Total emissions in this category: ${topCategory ? topCategory[1].toFixed(2) : '0'} kg CO2e

Generate ONLY practical, specific recommendations (no markdown, just plain text). Format as a numbered list.`;

  try {
    const response = await ollamaCall(prompt);
    return response.trim();
  } catch (error) {
    console.error('Tip generation error:', error.message);
    return `1. Reduce ${topCategory ? topCategory[0].toLowerCase() : 'your highest'} emissions by being more mindful\n2. Consider alternative transportation methods\n3. Track your progress weekly to stay motivated`;
  }
};

const generateReportSummary = async (weeklyData, monthlyData, userEmail) => {
  // PRODUCTION: Return mock summary
  if (isProduction) {
    return getMockReportSummary(userEmail);
  }
  
  // DEVELOPMENT: Use real Ollama
  const prompt = `Generate a brief, encouraging carbon footprint report summary for a user (${userEmail}).

Weekly emissions: ${weeklyData?.total || 0} kg CO2e (${weeklyData?.trend > 0 ? 'increased' : 'decreased'} ${Math.abs(weeklyData?.trend || 0).toFixed(1)}%)
Monthly emissions: ${monthlyData?.total || 0} kg CO2e
Top category: ${monthlyData?.topCategory || 'Transport'}

Provide 2-3 sentences of personalized insight and encouragement.`;

  try {
    const response = await ollamaCall(prompt);
    return response.trim();
  } catch (error) {
    console.error('Report summary error:', error.message);
    return `Keep tracking your carbon footprint to make a positive environmental impact. Your efforts contribute to a sustainable future!`;
  }
};

module.exports = {
  ollamaCall,
  extractEmissionData,
  generateEmissionTips,
  generateReportSummary,
  EMISSION_FACTORS,
};