export interface SustainabilityTip {
  id: string;
  category: 'transportation' | 'energy' | 'food' | 'waste' | 'daily';
  title: string;
  impactKgMonth: number;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  studentInsight: string;
  description: string;
  tags: string[];
}

export const SUSTAINABILITY_TIPS: SustainabilityTip[] = [
  // TRANSPORTATION
  {
    id: 'tip_trans_1',
    category: 'transportation',
    title: 'Swap 3 Car Commutes for Campus Transit or Metro',
    impactKgMonth: 38.5,
    difficulty: 'Easy',
    studentInsight: 'Most universities offer discounted student semester transit passes.',
    description:
      'Replacing solitary petrol car travel with shared electric rail or municipal bus drastically slashes per-passenger emissions by up to 75%.',
    tags: ['Transit', 'Commuting', 'High Impact'],
  },
  {
    id: 'tip_trans_2',
    category: 'transportation',
    title: 'Cycle or Walk for Trips Under 3 Kilometers',
    impactKgMonth: 22.0,
    difficulty: 'Easy',
    studentInsight: 'Saves fuel money and counts towards daily cardio between lecture halls.',
    description:
      'Combustion engines emit the highest rate of pollutants during the initial 5 minutes when cold. Walking or cycling short errands eliminates these spike emissions entirely.',
    tags: ['Active Travel', 'Health', 'Zero Emissions'],
  },
  {
    id: 'tip_trans_3',
    category: 'transportation',
    title: 'Peer Carpooling with Course Mates',
    impactKgMonth: 31.0,
    difficulty: 'Moderate',
    studentInsight: 'Coordinate with roommates or classmates who share 9 AM timetable slots.',
    description:
      'Doubling vehicle occupancy immediately cuts your individual travel carbon burden in half while splitting parking and fuel costs.',
    tags: ['Carpool', 'Budget Friendly'],
  },
  {
    id: 'tip_trans_4',
    category: 'transportation',
    title: 'Maintain Proper Tire Pressure & Eco-Driving',
    impactKgMonth: 12.0,
    difficulty: 'Easy',
    studentInsight: 'Under-inflated tires increase rolling resistance and burn ~4% more fuel.',
    description:
      'Checking tire psi once a month and avoiding aggressive sudden acceleration saves significant petrol and prolongs tire life.',
    tags: ['Maintenance', 'Efficiency'],
  },

  // ENERGY
  {
    id: 'tip_energy_1',
    category: 'energy',
    title: 'Set AC Thermostat to 24°C (75°F)',
    impactKgMonth: 32.0,
    difficulty: 'Easy',
    studentInsight: 'Use a desk fan for targeted air circulation instead of freezing the whole dorm room.',
    description:
      'Every degree increase on your air conditioning thermostat reduces electricity load by roughly 6-8%, preventing dozens of kilograms of coal/gas power generation emissions.',
    tags: ['Cooling', 'Dorm Friendly', 'High Impact'],
  },
  {
    id: 'tip_energy_2',
    category: 'energy',
    title: 'Eliminate Phantom Loads with Smart Power Strips',
    impactKgMonth: 9.5,
    difficulty: 'Easy',
    studentInsight: 'Plug desktop monitors, gaming consoles, and phone docks into a switched strip.',
    description:
      'Standby electricity (vampire power) accounts for up to 10% of residential energy draw. Turning off switches at the wall when leaving for campus saves continuous wasted kWh.',
    tags: ['Gadgets', 'Low Effort'],
  },
  {
    id: 'tip_energy_3',
    category: 'energy',
    title: 'Embrace Natural Daylight in Study Areas',
    impactKgMonth: 6.0,
    difficulty: 'Easy',
    studentInsight: 'Study near library windows during daylight hours instead of turning on ceiling tubes.',
    description:
      'Natural light improves circadian rhythm and concentration while keeping artificial lumen demand to a minimum.',
    tags: ['Wellbeing', 'Lighting'],
  },
  {
    id: 'tip_energy_4',
    category: 'energy',
    title: 'Activate Laptop Eco-Mode & Manage Charge Cycles',
    impactKgMonth: 4.5,
    difficulty: 'Easy',
    studentInsight: 'Avoid leaving laptops plugged in at 100% all night long in hostel rooms.',
    description:
      'Tuning display sleep timers to 5 minutes and enabling OS battery saver extends device lifespan and cuts parasitic grid draw.',
    tags: ['Technology', 'Habits'],
  },

  // FOOD
  {
    id: 'tip_food_1',
    category: 'food',
    title: 'Adopt "Meatless Mondays" & Plant-Forward Dinners',
    impactKgMonth: 45.0,
    difficulty: 'Moderate',
    studentInsight: 'Campus cafeterias often offer delicious lentil, chickpea, paneer, and tofu bowls.',
    description:
      'Livestock agriculture generates massive quantities of methane and requires vast land clearing. Replacing red meat with plant proteins just 2 days a week cuts food emissions by ~30%.',
    tags: ['Diet', 'High Impact', 'Health'],
  },
  {
    id: 'tip_food_2',
    category: 'food',
    title: 'Zero Food Waste via Weekly Meal Planning',
    impactKgMonth: 18.0,
    difficulty: 'Moderate',
    studentInsight: 'Keep a mini-fridge inventory before buying fresh produce to avoid rotting greens.',
    description:
      'Uneaten food that decomposes anaerobically in landfills produces potent methane gas. Planning portions and freezing leftovers has immediate environmental benefit.',
    tags: ['Zero Waste', 'Kitchen'],
  },
  {
    id: 'tip_food_3',
    category: 'food',
    title: 'Select Seasonal & Regional Produce',
    impactKgMonth: 11.5,
    difficulty: 'Easy',
    studentInsight: 'Visit weekend local farmer stalls or university co-ops for seasonal fruit.',
    description:
      'Out-of-season produce often relies on heated greenhouses or air-freight transport with heavy carbon footprints compared to native seasonal crops.',
    tags: ['Local', 'Fresh'],
  },

  // WASTE
  {
    id: 'tip_waste_1',
    category: 'waste',
    title: 'Carry a Reusable Stainless Bottle & Travel Mug',
    impactKgMonth: 7.2,
    difficulty: 'Easy',
    studentInsight: 'Campuses have free purified water refill stations; many coffee kiosks offer a discount.',
    description:
      'A single reusable bottle prevents 150+ single-use plastic PET bottles per year and saves petrochemical manufacturing emissions.',
    tags: ['Plastic Free', 'Daily Carry'],
  },
  {
    id: 'tip_waste_2',
    category: 'waste',
    title: 'Digital-First Note Taking & Cloud Assignments',
    impactKgMonth: 8.0,
    difficulty: 'Easy',
    studentInsight: 'Use tablets, markdown editors, or PDF annotation instead of printing reams of slides.',
    description:
      'Paper manufacturing consumes significant water and energy. Keeping lecture notes digital eliminates wood pulp demand and post-semester trash.',
    tags: ['Academics', 'Digital'],
  },
  {
    id: 'tip_waste_3',
    category: 'waste',
    title: 'Segregate Organic Scraps from Recyclables',
    impactKgMonth: 14.0,
    difficulty: 'Moderate',
    studentInsight: 'Check if your college environmental club runs a campus composting heap.',
    description:
      'Contaminating paper or cardboard with wet food waste ruins recyclable batches. Proper sorting ensures clean recycling streams reach processors.',
    tags: ['Recycling', 'Dorm Rules'],
  },

  // DAILY HABITS
  {
    id: 'tip_daily_1',
    category: 'daily',
    title: 'Take the Stairs for Trips Under 4 Floors',
    impactKgMonth: 5.5,
    difficulty: 'Easy',
    studentInsight: 'Elevators wait times during campus rush hour are often slower than taking stairs!',
    description:
      'Commercial building elevators consume significant peak surge electricity. Walking stairs saves building power and keeps you energized.',
    tags: ['Fitness', 'Campus Life'],
  },
  {
    id: 'tip_daily_2',
    category: 'daily',
    title: 'Cold Water Laundry Wash & Air Drying',
    impactKgMonth: 16.0,
    difficulty: 'Easy',
    studentInsight: 'Hang clothes on a foldable drying rack near a breeze instead of hot tumble dryers.',
    description:
      'About 75% of the energy consumed by washing machines goes into heating water. Cold water cycles clean modern fabrics just as effectively.',
    tags: ['Laundry', 'Home'],
  },
  {
    id: 'tip_daily_3',
    category: 'daily',
    title: 'Second-Hand Textbooks & Student Gear Swaps',
    impactKgMonth: 24.0,
    difficulty: 'Easy',
    studentInsight: 'Check campus senior-to-junior resale groups before purchasing brand new editions.',
    description:
      'Circular reuse prevents embodied carbon emissions from manufacturing, binding, and international shipping of new goods.',
    tags: ['Circular Economy', 'Save Money'],
  },
];
