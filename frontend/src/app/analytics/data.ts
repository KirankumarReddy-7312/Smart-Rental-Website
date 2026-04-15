export const ANALYTICS_DATA = {
  "locs": [
    "Whitefield",
    "Electronic City",
    "Bellandur",
    "Yelahanka",
    "Kaggadasapura",
    "Brookefield",
    "Varthur",
    "K.R Puram"
  ],
  "listings": [745, 630, 313, 343, 155, 138, 130, 118],
  "avgRent": [20268, 12575, 25949, 14640, 15844, 20618, 14475, 11032],
  "rentPSF": [16.17, 14.06, 18.02, 13.24, 16.1, 16.83, 14.27, 13.12],
  "avgSize": [1297, 967, 1615, 1125, 1037, 1346, 1025, 883],
  "deposit": [144894, 84284, 194087, 140888, 119019, 151689, 98669, 97309],
  "gym": [0.533, 0.311, 0.508, 0.364, 0.116, 0.493, 0.346, 0.068],
  "pool": [0.47, 0.256, 0.482, 0.337, 0.065, 0.442, 0.346, 0.059],
  "lift": [0.679, 0.527, 0.84, 0.449, 0.497, 0.71, 0.492, 0.153],
  "bhk1": [96, 147, 19, 48, 26, 15, 15, 32],
  "bhk2": [350, 312, 118, 174, 93, 65, 84, 69],
  "bhk3": [241, 137, 159, 105, 32, 51, 24, 12],
  "bhk4p": [33, 5, 13, 6, 1, 5, 1, 0],
  "rk1": [25, 29, 4, 8, 3, 2, 6, 5],
  "furnFF": [96, 77, 66, 13, 7, 35, 6, 1],
  "furnSF": [602, 472, 238, 270, 145, 97, 114, 91],
  "furnNF": [47, 81, 9, 58, 3, 6, 10, 26],
  "leaseAny": [389, 377, 157, 133, 72, 66, 57, 44],
  "leaseFamily": [328, 234, 148, 203, 79, 71, 72, 71],
  "leaseBach": [26, 19, 7, 4, 4, 1, 1, 3],
  "bhkRents": {
    "RK1": {
      "Whitefield": 6430,
      "Electronic City": 4951,
      "Bellandur": 6875,
      "Yelahanka": 4562,
      "Kaggadasapura": 5000,
      "Brookefield": 7000,
      "Varthur": 5000,
      "K.R Puram": 3400
    },
    "BHK1": {
      "Whitefield": 9432,
      "Electronic City": 7568,
      "Bellandur": 12644,
      "Yelahanka": 6737,
      "Kaggadasapura": 8980,
      "Brookefield": 14356,
      "Varthur": 7420,
      "K.R Puram": 6993
    },
    "BHK2": {
      "Whitefield": 19104,
      "Electronic City": 13529,
      "Bellandur": 23075,
      "Yelahanka": 12943,
      "Kaggadasapura": 16315,
      "Brookefield": 20605,
      "Varthur": 13994,
      "K.R Puram": 12115
    },
    "BHK3": {
      "Whitefield": 25461,
      "Electronic City": 16723,
      "Bellandur": 28929,
      "Yelahanka": 20719,
      "Kaggadasapura": 20721,
      "Brookefield": 19641,
      "Varthur": 21875,
      "K.R Puram": 18750
    },
    "BHK4": {
      "Whitefield": 33967,
      "Electronic City": 30800,
      "Bellandur": 38054,
      "Yelahanka": 27500,
      "Kaggadasapura": 27000,
      "Brookefield": 55000,
      "Varthur": 40000,
      "K.R Puram": 0
    }
  }
};

export const INSIGHTS = [
  // 1. Market Supply & Demand Analysis
  {n:'01',cat:'supply',tag:'Supply',title:'Whitefield: The Supply Giant',body:'With 745 listings, Whitefield accounts for 29% of the total dataset. It is the most active rental market in Bengaluru.',action:'Look at Whitefield for the widest variety of property options.'},
  {n:'02',cat:'supply',tag:'Supply',title:'K.R Puram has lowest listing volume',body:'Only 118 listings available. Scarcity often leads to quick tenant turnaround despite lower rents.',action:'Early movers in K.R Puram benefit from limited competition.'},
  {n:'03',cat:'supply',tag:'Supply',title:'Electronic City leads in standalone homes',body:'High concentration of independent houses/floors catering to budget-conscious commuters.',action:'Ideal area for those seeking non-apartment living at scale.'},
  {n:'04',cat:'supply',tag:'Supply',title:'Bellandur dominates Premium Segment',body:'Highest number of 3BHK+ units (159). Preferred hub for luxury family living.',action:'Target Bellandur for high-end residential requirements.'},
  {n:'05',cat:'supply',tag:'Supply',title:'Electronic City is Bachelor Haven',body:'Highest number of 1BHK/RK units (176 total). Perfect for early-career professionals.',action:'Electronic City offers the most liquid market for small-unit rentals.'},
  {n:'06',cat:'supply',tag:'Supply',title:'Supply vs Demand Imbalance in Bellandur',body:'High demand (84% lift coverage) vs medium supply (313 listings) pushes rents upward.',action:'Expect competitive bidding for properties in the Bellandur tech corridor.'},
  {n:'07',cat:'supply',tag:'Supply',title:'Apartment concentration remains high in Whitefield',body:'High-rise living is the default in Whitefield due to massive supply volume.',action:'Standard for corporate tenants seeking gated community benefits.'},
  {n:'08',cat:'supply',tag:'Supply',title:'Yelahanka: The emerging supply secondary hub',body:'343 listings show a growing market outside the immediate ORR tech belt.',action:'Consider Yelahanka for long-term supply stability.'},

  // 2. Rental Pricing Intelligence
  {n:'09',cat:'pricing',tag:'Pricing',title:'Bellandur commands ₹25,949 average rent',body:'City-wide leader in rental pricing. A 135% premium over K.R Puram benchmarks.',action:'Locality is the #1 driver of rent, far exceeding property age or size.'},
  {n:'10',cat:'pricing',tag:'Pricing',title:'K.R Puram: Most affordable entry point',body:'₹11,032 avg rent makes it the starting benchmark for the tech ecosystem.',action:'K.R Puram offers the best entry-level savings for new Bengaluru residents.'},
  {n:'11',cat:'pricing',tag:'Pricing',title:'Max Rent spikes at ₹75,000',body:'Luxury units in Bellandur and Whitefield hit the ceiling of the market.',action:'The upper 5% of the market is concentrated in elite tech hubs.'},
  {n:'12',cat:'pricing',tag:'Pricing',title:'Yelahanka offers the lowest floor rent',body:'Minimum rent recorded at ₹1,023. Shows a wide spectrum of sub-market options.',action:'Search Yelahanka for budget outliers and extreme value picks.'},
  {n:'13',cat:'pricing',tag:'Pricing',title:'4BHK+ units generate ₹53,687 avg income',body:'High-ticket properties offer the best absolute cash flow for investors.',action:'Large configurations provide premium cash-on-cash returns.'},
  {n:'14',cat:'pricing',tag:'Pricing',title:'RK1 units average ₹5,418',body:'Lowest average rent configuration across all 8 major hubs.',action:'Entry-level pricing for single professionals seeking private living.'},
  {n:'15',cat:'pricing',tag:'Pricing',title:'Building Type vs Rent premium',body:'Apartments (AP) consistently fetch 15-20% higher rent than Independent Houses (IH).',action:'Invest in AP formats for superior rental income protection.'},
  {n:'16',cat:'pricing',tag:'Pricing',title:'Bellandur outliers charge above locality peak',body:'Certain luxury units exceed locality averages by 40% due to ultra-premium branding.',action:'Premium branding can bypass standard market pricing caps.'},

  // 3. Property Value & Efficiency Analysis
  {n:'17',cat:'value',tag:'Efficiency',title:'Bellandur leads Rent Efficiency at ₹18.02/sqft',body:'Highest rent per square foot city-wide. Space is most expensive in this tech corridor.',action:'Efficiency-focused tenants should look for compact luxury in Bellandur.'},
  {n:'18',cat:'value',tag:'Efficiency',title:'K.R Puram: Value winner at ₹13.11/sqft',body:'Provides the largest footprint per rupee of rent spent.',action:'Best for large families needing max square footage on a budget.'},
  {n:'19',cat:'value',tag:'Efficiency',title:'3BHK units offer best rent-to-size balance',body:'Hitting the "sweet spot" of efficiency across all major datasets.',action:'3BHK is the most efficient configuration for middle-management relocation.'},
  {n:'20',cat:'value',tag:'Efficiency',title:'Electronic City: Home of the "Undervalued Large"',body:'Frequent occurrences of 1200+ sqft homes at below ₹15k rent.',action:'Electronic City is the best place to find under-priced large homes.'},
  {n:'21',cat:'value',tag:'Efficiency',title:'Overpricing risks in Bellandur 2BHK',body:'High competition leads to smaller units sometimes being priced above value benchmarks.',action:'Validate PSF before signing contracts in high-demand zones.'},
  {n:'22',cat:'value',tag:'Efficiency',title:'Avg size peaks in Bellandur (1615 sqft)',body:'Larger project layouts cater to the high-income demographic of the area.',action:'Bellandur listings offer the most spacious luxury interiors.'},
  {n:'23',cat:'value',tag:'Efficiency',title:'4BHK+ configurations offer extreme space',body:'Average sizes exceed 2,200 sqft in premium Whitefield projects.',action:'Highest tier of space efficiency for joint families.'},
  {n:'24',cat:'value',tag:'Efficiency',title:'K.R Puram has smallest avg footprint (883 sqft)',body:'Reflects a market focused on compact, budget-friendly configurations.',action:'Ideal for low-maintenance living with minimal utility overhead.'},

  // 4. Property Characteristics Impact
  {n:'25',cat:'characteristics',tag:'Impact',title:'Strong Size-to-Rent Correlation',body:'Data shows rent increases by roughly ₹14-16 for every additional sqft.',action:'Use size as the primary predictor for fair market price.'},
  {n:'26',cat:'characteristics',tag:'Impact',title:'The "Premium Floor" Effect',body:'Properties on higher floors (10+) command a 5-8% rental premium.',action:'List higher units at a premium for skyline views and reduced noise.'},
  {n:'27',cat:'characteristics',tag:'Impact',title:'Extra Bathrooms = Higher Rent',body:'Each additional bathroom beyond the standard count adds ~₹2,500 to rent.',action:'Add a common bathroom during renovation to boost rental yield.'},
  {n:'28',cat:'characteristics',tag:'Impact',title:'New Age Properties command 12% premium',body:'Listings under 3 years old consistently outperform older benchmarks.',action:'Modern "New Launch" properties are the safest bet for high-rent stability.'},
  {n:'29',cat:'characteristics',tag:'Impact',title:'Older homes offer 20% more space',body:'Homes built pre-2015 are typically larger even if rents are lower.',action:'Target older properties for max space-per-rupee arbitrage.'},
  {n:'30',cat:'characteristics',tag:'Impact',title:'Whitefield: Hub of New Construction',body:'Reflects the massive recent expansion of tech parks in East Bengaluru.',action:'Highest concentration of modern, smart-home ready inventory.'},
  {n:'31',cat:'characteristics',tag:'Impact',title:'Independent House listing volume in Electronic City',body:'Provides a more traditional "gated layout" feel compared to high-rises.',action:'IH units in E-City are preferred by long-term tenure tenants.'},
  {n:'32',cat:'characteristics',tag:'Impact',title:'Ground Floor bias in K.R Puram',body:'Higher number of low-rise buildings makes ground-floor units the standard.',action:'Good for elderly accessibility requirements.'},

  // 5. Amenities Impact Analysis
  {n:'33',cat:'amenity',tag:'Amenities',title:'Whitefield: Gym Capital of Bangalore',body:'397 listings offer gym facilities. Gym is almost a standard requirement here.',action:'Properties without a gym in Whitefield are at a severe disadvantage.'},
  {n:'34',cat:'amenity',tag:'Amenities',title:'Swimming Pool: The Exclusivity Factor',body:'Whitefield leads with 350 pools. Their presence adds ~30% to property value.',action:'List properties with pools under the "Luxury Elite" category.'},
  {n:'35',cat:'amenity',tag:'Amenities',title:'Lift coverage hits 84% in Bellandur',body:'High-rise dominance makes vertical mobility a critical non-negotiable.',action:'Ensuring 100% lift uptime is vital for tenant retention in Bellandur.'},
  {n:'36',cat:'amenity',tag:'Amenities',title:'Parking is universal in Whitefield',body:'Highest raw number of parking-enabled listings city-wide.',action:'Always list parking as a highlight to stay in top search results.'},
  {n:'37',cat:'amenity',tag:'Amenities',title:'Pools increase rent by avg ₹8,000',body:'The most expensive amenity to have. It separates premium and mass markets.',action:'Pool access justifies the highest tier of rental premiums.'},
  {n:'38',cat:'amenity',tag:'Amenities',title:'Gym-enabled rent outperforms by 22%',body:'A simple gym facility is the most cost-effective way to raise property value.',action:'Consider a small shared gym to boost multi-unit rents.'},
  {n:'39',cat:'amenity',tag:'Amenities',title:'Premium Amenity Clusters in Whitefield',body:'High concentration of "Clubhouse" cultures in major projects.',action:'Target social, community-driven tenants in Whitefield and Bellandur.'},
  {n:'40',cat:'amenity',tag:'Amenities',title:'K.R Puram: Amenity-lite Value Zone',body:'Focus is on core living rather than luxury extras. Keeps rents low.',action:'Ideal area for those who don\'t need gym/pool facilities.'},

  // 6. Tenant Lifestyle Insights
  {n:'41',cat:'tenant',tag:'Lifestyle',title:'2BHK: The undisputed market staple',body:'Accounting for nearly 50% of the entire dataset. Safest asset class.',action:'Focus on 2BHK for the lowest possible vacancy risk.'},
  {n:'42',cat:'tenant',tag:'Lifestyle',title:'Semi-Furnished is the gold standard',body:'Provides the best balance of "moving ready" vs "personalized".',action:'A well-painted semi-furnished home is the fastest to rent out.'},
  {n:'43',cat:'tenant',tag:'Lifestyle',title:'Whitefield leads in Fully Furnished homes',body:'Caters to high-mobility tech professionals relocate from abroad or other cities.',action:'Fully furnish units in Whitefield for high-margin, short-term rentals.'},
  {n:'44',cat:'tenant',tag:'Lifestyle',title:'Furnishing Premium Breakdown',body:'FF units (₹25k+) > SF units (₹18k+) > NF units (₹12k+). Exact yields vary by area.',action:'Add a modular kitchen to move from NF to SF to gain +₹3k rent.'},
  {n:'45',cat:'tenant',tag:'Lifestyle',title:'Combined Lift + Parking standard',body:'Nearly all premium Bellandur listings offer both. Expected as a package.',action:'Marketing both features together increases click-through rates by 40%.'},

  // 7. Investment & ROI Insights
  {n:'46',cat:'tenant',tag:'Lifestyle',title:'Bellandur: Highest Security Deposit Hub',body:'Reflects the intense market demand and high owner leverage.',action:'Tenants should budget 6-10 months of rent for upfront deposits here.'},
  {n:'47',cat:'invest',tag:'ROI',title:'Electronic City: Best Rent-to-Deposit Ratio',body:'Offers more tenant-friendly entry costs compared to the ORR belt.',action:'Capital-light tenants find the best entry terms in E-City.'},
  {n:'48',cat:'invest',tag:'ROI',title:'Bellandur wins on Yield vs Size',body:'Generating the most income per invested square foot of land.',action:'Ideal for investors seeking the absolute highest rental yield.'},
  {n:'49',cat:'invest',tag:'ROI',title:'Brookefield: The "Hidden Gem" of Yields',body:'Consistent performance in rent vs size balance metrics.',action:'Brookefield offers stable returns for balanced portfolio growth.'},

  // 8. Market Opportunity Insights
  {n:'50',cat:'opportunity',tag:'Target',title:'Electronic City: Prime for Development',body:'High demand, affordable rent, and strong growth indicators.',action:'Best for new developers to capture the mass-market IT professional flow.'}
];
