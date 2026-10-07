const messes = [
  {
    id: 1,
    name: "Green Valley Student Mess",
    area: "Santosh",
    address: "Santosh, Tangail",
    university: "Mawlana Bhashani Science and Technology University",
    distance: 300,
    gender: "Male",

    rent: 4500,
    seats: 3,
    totalRooms: 3,
    totalSeats: 6,
    availableSeats: 3,

    wifi: true,
    meal: true,
    gas: true,
    singleRoom: true,

    rating: 4.8,
    reviewCount: 28,

    verified: true,
    verificationStatus: "Verified",

    image: "",

    description:
      "A comfortable and student-friendly mess located near MBSTU campus with essential facilities.",

    // =========================
    // ROOM INFORMATION
    // =========================

    rooms: [
      {
        id: 101,
        roomNumber: "101",
        type: "3 Seater",
        totalSeats: 3,
        availableSeats: 1,
        rentPerSeat: 3500,
        attachedWashroom: true,
        balcony: true,
        furnished: true,
        availableFrom: "Available Now",
        photos: []
      },

      {
        id: 102,
        roomNumber: "102",
        type: "2 Seater",
        totalSeats: 2,
        availableSeats: 1,
        rentPerSeat: 4500,
        attachedWashroom: false,
        balcony: true,
        furnished: true,
        availableFrom: "Available Now",
        photos: []
      },

      {
        id: 201,
        roomNumber: "201",
        type: "Single",
        totalSeats: 1,
        availableSeats: 1,
        rentPerSeat: 5500,
        attachedWashroom: true,
        balcony: false,
        furnished: true,
        availableFrom: "Available Now",
        photos: []
      }
    ],

    // =========================
    // MONTHLY COST
    // =========================

    costs: {
      electricity: 400,
      gas: 0,
      wifi: 200,
      water: 0,
      meal: 3000,
      serviceCharge: 0,
      securityDeposit: 4500,
      other: 0
    },

    // =========================
    // FACILITIES
    // =========================

    facilities: {
      wifi: true,
      gas: true,
      water: true,
      electricity: true,
      studyTable: true,
      balcony: true,
      cctv: true,
      securityGuard: false,
      generator: false,
      ips: true,
      parking: true,
      kitchen: true,
      dining: true,
      commonRoom: false,
      laundry: false,
      hotWater: false
    },

    // =========================
    // WASHROOM
    // =========================

    washroom: {
      total: 3,
      attached: 2,
      common: 1,
      studentsPerWashroom: 3,
      shower: true,
      hotWater: false,
      cleaningFrequency: "Daily",
      condition: "Good",
      photos: []
    },

    // =========================
    // MEAL / COOK INFORMATION
    // =========================

    mealInfo: {
      available: true,
      system: "Monthly",
      mealsPerDay: 3,
      monthlyCost: 3000,
      perMealCost: 0,

      cook: {
        name: "Mess Khala",
        phone: "",
        experience: "Not specified"
      },

      menu: {
        breakfast: "Varies daily",
        lunch: "Rice, Dal, Vegetable, Fish/Chicken",
        dinner: "Rice, Dal, Vegetable, Fish/Chicken"
      },

      foodRating: 4.5,
      kitchenCleanliness: "Good"
    },

    // =========================
    // RULES & POLICIES
    // =========================

    rules: {
      gateClosingTime: "11:00 PM",
      guestPolicy: "Guests allowed with permission",
      smokingAllowed: false,
      petsAllowed: false,
      cookingAllowed: true,
      studentOnly: true,
      advanceNotice: "1 month",
      additionalRules: []
    },

    // =========================
    // ENVIRONMENT & SAFETY
    // =========================

    environment: {
      noiseLevel: "Low",
      politicalActivity: "None reported",
      raggingConcern: "None reported",
      securityLevel: "Good",
      studyEnvironment: "Good",
      studentFriendly: true
    },

    // =========================
    // KNOWN PROBLEMS
    // =========================

    problems: {
      water: false,
      electricity: false,
      internet: false,
      cleanliness: false,
      security: false,
      noise: false,
      overcrowding: false,
      description: "No major problems currently reported."
    },

    // =========================
    // CONTACT
    // =========================

    contact: {
      ownerName: "Mess Owner",
      phone: "",
      whatsapp: "",
      alternatePhone: "",
      preferredContact: "Phone"
    },

    // =========================
    // PHOTO GALLERY
    // =========================

    photos: {
      exterior: [],
      rooms: [],
      washroom: [],
      kitchen: [],
      dining: [],
      balcony: [],
      commonArea: [],
      surroundings: []
    },

    // =========================
    // REVIEWS
    // =========================

    ratingBreakdown: {
      food: 4.5,
      cleanliness: 4.6,
      safety: 4.8,
      internet: 4.3,
      washroom: 4.4,
      ownerBehaviour: 4.7,
      environment: 4.8,
      valueForMoney: 4.6
    },

    reviews: [
      {
        id: 1,
        studentName: "Anonymous Student",
        verifiedResident: true,
        rating: 5,
        comment:
          "Good environment and suitable for university students.",
        date: "2026-10-01",
        helpful: 4
      }
    ],

    // =========================
    // STUDENT CONTRIBUTIONS
    // =========================

    contributions: [],

    // =========================
    // WELFARE / PROCTOR
    // =========================

    welfare: {
      openReports: 0,
      resolvedReports: 0,
      reports: [],
      visitHistory: []
    },

    createdBy: "system",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01"
  },

  // =====================================================
  // MESS 2
  // =====================================================

  {
    id: 2,
    name: "Campus View Mess",
    area: "Santosh",
    address: "Santosh, Tangail",
    university: "Mawlana Bhashani Science and Technology University",

    rent: 3500,
    distance: 550,
    gender: "Male",
    seats: 2,

    totalRooms: 4,
    totalSeats: 8,
    availableSeats: 2,

    wifi: true,
    meal: false,
    gas: true,
    singleRoom: false,

    rating: 4.4,
    reviewCount: 18,

    verified: false,
    verificationStatus: "Pending Verification",

    image: "",

    description:
      "Affordable accommodation suitable for MBSTU students.",

    rooms: [
      {
        id: 201,
        roomNumber: "201",
        type: "2 Seater",
        totalSeats: 2,
        availableSeats: 1,
        rentPerSeat: 3500,
        attachedWashroom: false,
        balcony: true,
        furnished: false,
        availableFrom: "Available Now",
        photos: []
      },

      {
        id: 202,
        roomNumber: "202",
        type: "3 Seater",
        totalSeats: 3,
        availableSeats: 1,
        rentPerSeat: 3200,
        attachedWashroom: false,
        balcony: false,
        furnished: false,
        availableFrom: "Available Now",
        photos: []
      }
    ],

    costs: {
      electricity: 350,
      gas: 0,
      wifi: 200,
      water: 0,
      meal: 0,
      serviceCharge: 0,
      securityDeposit: 3500,
      other: 0
    },

    facilities: {
      wifi: true,
      gas: true,
      water: true,
      electricity: true,
      studyTable: false,
      balcony: true,
      cctv: false,
      securityGuard: false,
      generator: false,
      ips: false,
      parking: true,
      kitchen: true,
      dining: false,
      commonRoom: false,
      laundry: false,
      hotWater: false
    },

    washroom: {
      total: 2,
      attached: 0,
      common: 2,
      studentsPerWashroom: 4,
      shower: true,
      hotWater: false,
      cleaningFrequency: "Regular",
      condition: "Average",
      photos: []
    },

    mealInfo: {
      available: false,
      system: "Not Available",
      mealsPerDay: 0,
      monthlyCost: 0,
      perMealCost: 0,

      cook: {
        name: "",
        phone: "",
        experience: ""
      },

      menu: {
        breakfast: "",
        lunch: "",
        dinner: ""
      },

      foodRating: 0,
      kitchenCleanliness: "Average"
    },

    rules: {
      gateClosingTime: "11:30 PM",
      guestPolicy: "Permission required",
      smokingAllowed: false,
      petsAllowed: false,
      cookingAllowed: true,
      studentOnly: true,
      advanceNotice: "1 month",
      additionalRules: []
    },

    environment: {
      noiseLevel: "Moderate",
      politicalActivity: "Unknown",
      raggingConcern: "None reported",
      securityLevel: "Good",
      studyEnvironment: "Good",
      studentFriendly: true
    },

    problems: {
      water: false,
      electricity: false,
      internet: false,
      cleanliness: false,
      security: false,
      noise: false,
      overcrowding: false,
      description: "No verified major problems."
    },

    contact: {
      ownerName: "Mess Owner",
      phone: "",
      whatsapp: "",
      alternatePhone: "",
      preferredContact: "Phone"
    },

    photos: {
      exterior: [],
      rooms: [],
      washroom: [],
      kitchen: [],
      dining: [],
      balcony: [],
      commonArea: [],
      surroundings: []
    },

    ratingBreakdown: {
      food: 0,
      cleanliness: 4.2,
      safety: 4.4,
      internet: 4.3,
      washroom: 4.0,
      ownerBehaviour: 4.5,
      environment: 4.3,
      valueForMoney: 4.7
    },

    reviews: [],

    contributions: [],

    welfare: {
      openReports: 0,
      resolvedReports: 0,
      reports: [],
      visitHistory: []
    },

    createdBy: "system",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01"
  },

  // =====================================================
  // MESS 3
  // =====================================================

  {
    id: 3,
    name: "Dream House Female Mess",
    area: "Santosh",
    address: "Santosh, Tangail",
    university: "Mawlana Bhashani Science and Technology University",

    rent: 5000,
    distance: 400,
    gender: "Female",
    seats: 4,

    totalRooms: 5,
    totalSeats: 10,
    availableSeats: 4,

    wifi: true,
    meal: true,
    gas: true,
    singleRoom: true,

    rating: 4.7,
    reviewCount: 32,

    verified: true,
    verificationStatus: "Verified",

    image: "",

    description:
      "Secure student accommodation with essential facilities for female MBSTU students.",

    rooms: [
      {
        id: 301,
        roomNumber: "301",
        type: "2 Seater",
        totalSeats: 2,
        availableSeats: 1,
        rentPerSeat: 5000,
        attachedWashroom: true,
        balcony: true,
        furnished: true,
        availableFrom: "Available Now",
        photos: []
      },

      {
        id: 302,
        roomNumber: "302",
        type: "Single",
        totalSeats: 1,
        availableSeats: 1,
        rentPerSeat: 6500,
        attachedWashroom: true,
        balcony: true,
        furnished: true,
        availableFrom: "Available Now",
        photos: []
      }
    ],

    costs: {
      electricity: 400,
      gas: 0,
      wifi: 200,
      water: 0,
      meal: 3200,
      serviceCharge: 0,
      securityDeposit: 5000,
      other: 0
    },

    facilities: {
      wifi: true,
      gas: true,
      water: true,
      electricity: true,
      studyTable: true,
      balcony: true,
      cctv: true,
      securityGuard: true,
      generator: false,
      ips: true,
      parking: false,
      kitchen: true,
      dining: true,
      commonRoom: true,
      laundry: false,
      hotWater: false
    },

    washroom: {
      total: 4,
      attached: 2,
      common: 2,
      studentsPerWashroom: 3,
      shower: true,
      hotWater: false,
      cleaningFrequency: "Daily",
      condition: "Very Good",
      photos: []
    },

    mealInfo: {
      available: true,
      system: "Monthly",
      mealsPerDay: 3,
      monthlyCost: 3200,
      perMealCost: 0,

      cook: {
        name: "Mess Khala",
        phone: "",
        experience: "Experienced"
      },

      menu: {
        breakfast: "Daily rotating menu",
        lunch: "Rice, Dal, Vegetable, Fish/Chicken",
        dinner: "Rice, Dal, Vegetable, Fish/Chicken"
      },

      foodRating: 4.6,
      kitchenCleanliness: "Very Good"
    },

    rules: {
      gateClosingTime: "10:00 PM",
      guestPolicy: "Visitors allowed with permission",
      smokingAllowed: false,
      petsAllowed: false,
      cookingAllowed: true,
      studentOnly: true,
      advanceNotice: "1 month",
      additionalRules: []
    },

    environment: {
      noiseLevel: "Low",
      politicalActivity: "None reported",
      raggingConcern: "None reported",
      securityLevel: "Very Good",
      studyEnvironment: "Very Good",
      studentFriendly: true
    },

    problems: {
      water: false,
      electricity: false,
      internet: false,
      cleanliness: false,
      security: false,
      noise: false,
      overcrowding: false,
      description: "No major verified problems."
    },

    contact: {
      ownerName: "Mess Owner",
      phone: "",
      whatsapp: "",
      alternatePhone: "",
      preferredContact: "Phone"
    },

    photos: {
      exterior: [],
      rooms: [],
      washroom: [],
      kitchen: [],
      dining: [],
      balcony: [],
      commonArea: [],
      surroundings: []
    },

    ratingBreakdown: {
      food: 4.6,
      cleanliness: 4.8,
      safety: 4.9,
      internet: 4.4,
      washroom: 4.7,
      ownerBehaviour: 4.6,
      environment: 4.8,
      valueForMoney: 4.5
    },

    reviews: [],

    contributions: [],

    welfare: {
      openReports: 0,
      resolvedReports: 0,
      reports: [],
      visitHistory: []
    },

    createdBy: "system",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01"
  },

  // =====================================================
  // MESS 4
  // =====================================================

  {
    id: 4,
    name: "Student Corner",
    area: "Kagmarai",
    address: "Kagmarai, Tangail",
    university: "Mawlana Bhashani Science and Technology University",

    rent: 3000,
    distance: 900,
    gender: "Male",
    seats: 5,

    totalRooms: 6,
    totalSeats: 15,
    availableSeats: 5,

    wifi: false,
    meal: true,
    gas: true,
    singleRoom: false,

    rating: 4.1,
    reviewCount: 14,

    verified: false,
    verificationStatus: "Community Listed",

    image: "",

    description:
      "Budget-friendly student accommodation with available seats.",

    rooms: [],

    costs: {
      electricity: 350,
      gas: 0,
      wifi: 0,
      water: 0,
      meal: 2800,
      serviceCharge: 0,
      securityDeposit: 3000,
      other: 0
    },

    facilities: {
      wifi: false,
      gas: true,
      water: true,
      electricity: true,
      studyTable: false,
      balcony: false,
      cctv: false,
      securityGuard: false,
      generator: false,
      ips: false,
      parking: true,
      kitchen: true,
      dining: true,
      commonRoom: false,
      laundry: false,
      hotWater: false
    },

    washroom: {
      total: 3,
      attached: 0,
      common: 3,
      studentsPerWashroom: 5,
      shower: true,
      hotWater: false,
      cleaningFrequency: "Regular",
      condition: "Average",
      photos: []
    },

    mealInfo: {
      available: true,
      system: "Monthly",
      mealsPerDay: 3,
      monthlyCost: 2800,
      perMealCost: 0,

      cook: {
        name: "Mess Khala",
        phone: "",
        experience: "Not specified"
      },

      menu: {
        breakfast: "Varies",
        lunch: "Regular student meal",
        dinner: "Regular student meal"
      },

      foodRating: 4.0,
      kitchenCleanliness: "Average"
    },

    rules: {
      gateClosingTime: "11:30 PM",
      guestPolicy: "Permission required",
      smokingAllowed: false,
      petsAllowed: false,
      cookingAllowed: true,
      studentOnly: true,
      advanceNotice: "1 month",
      additionalRules: []
    },

    environment: {
      noiseLevel: "Moderate",
      politicalActivity: "Unknown",
      raggingConcern: "None reported",
      securityLevel: "Average",
      studyEnvironment: "Average",
      studentFriendly: true
    },

    problems: {
      water: false,
      electricity: false,
      internet: true,
      cleanliness: false,
      security: false,
      noise: false,
      overcrowding: false,
      description:
        "WiFi is currently not provided by the mess."
    },

    contact: {
      ownerName: "Mess Owner",
      phone: "",
      whatsapp: "",
      alternatePhone: "",
      preferredContact: "Phone"
    },

    photos: {
      exterior: [],
      rooms: [],
      washroom: [],
      kitchen: [],
      dining: [],
      balcony: [],
      commonArea: [],
      surroundings: []
    },

    ratingBreakdown: {
      food: 4.0,
      cleanliness: 3.9,
      safety: 4.1,
      internet: 0,
      washroom: 3.8,
      ownerBehaviour: 4.2,
      environment: 4.0,
      valueForMoney: 4.6
    },

    reviews: [],

    contributions: [],

    welfare: {
      openReports: 0,
      resolvedReports: 0,
      reports: [],
      visitHistory: []
    },

    createdBy: "system",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01"
  },

  // =====================================================
  // MESS 5
  // =====================================================

  {
    id: 5,
    name: "University Garden Mess",
    area: "Santosh",
    address: "Santosh, Tangail",
    university: "Mawlana Bhashani Science and Technology University",

    rent: 5500,
    distance: 200,
    gender: "Female",
    seats: 2,

    totalRooms: 4,
    totalSeats: 6,
    availableSeats: 2,

    wifi: true,
    meal: true,
    gas: true,
    singleRoom: true,

    rating: 4.9,
    reviewCount: 41,

    verified: true,
    verificationStatus: "Verified",

    image: "",

    description:
      "Premium student accommodation located very close to MBSTU campus.",

    rooms: [],

    costs: {
      electricity: 450,
      gas: 0,
      wifi: 250,
      water: 0,
      meal: 3500,
      serviceCharge: 0,
      securityDeposit: 5500,
      other: 0
    },

    facilities: {
      wifi: true,
      gas: true,
      water: true,
      electricity: true,
      studyTable: true,
      balcony: true,
      cctv: true,
      securityGuard: true,
      generator: true,
      ips: true,
      parking: true,
      kitchen: true,
      dining: true,
      commonRoom: true,
      laundry: false,
      hotWater: true
    },

    washroom: {
      total: 4,
      attached: 3,
      common: 1,
      studentsPerWashroom: 2,
      shower: true,
      hotWater: true,
      cleaningFrequency: "Daily",
      condition: "Excellent",
      photos: []
    },

    mealInfo: {
      available: true,
      system: "Monthly",
      mealsPerDay: 3,
      monthlyCost: 3500,
      perMealCost: 0,

      cook: {
        name: "Mess Khala",
        phone: "",
        experience: "Experienced"
      },

      menu: {
        breakfast: "Daily rotating menu",
        lunch: "Rice, Dal, Vegetable, Fish/Chicken",
        dinner: "Rice, Dal, Vegetable, Fish/Chicken"
      },

      foodRating: 4.8,
      kitchenCleanliness: "Excellent"
    },

    rules: {
      gateClosingTime: "10:00 PM",
      guestPolicy: "Visitors allowed with permission",
      smokingAllowed: false,
      petsAllowed: false,
      cookingAllowed: true,
      studentOnly: true,
      advanceNotice: "1 month",
      additionalRules: []
    },

    environment: {
      noiseLevel: "Low",
      politicalActivity: "None reported",
      raggingConcern: "None reported",
      securityLevel: "Excellent",
      studyEnvironment: "Excellent",
      studentFriendly: true
    },

    problems: {
      water: false,
      electricity: false,
      internet: false,
      cleanliness: false,
      security: false,
      noise: false,
      overcrowding: false,
      description: "No major verified problems."
    },

    contact: {
      ownerName: "Mess Owner",
      phone: "",
      whatsapp: "",
      alternatePhone: "",
      preferredContact: "Phone"
    },

    photos: {
      exterior: [],
      rooms: [],
      washroom: [],
      kitchen: [],
      dining: [],
      balcony: [],
      commonArea: [],
      surroundings: []
    },

    ratingBreakdown: {
      food: 4.8,
      cleanliness: 4.9,
      safety: 4.9,
      internet: 4.8,
      washroom: 4.9,
      ownerBehaviour: 4.8,
      environment: 4.9,
      valueForMoney: 4.6
    },

    reviews: [],

    contributions: [],

    welfare: {
      openReports: 0,
      resolvedReports: 0,
      reports: [],
      visitHistory: []
    },

    createdBy: "system",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01"
  },

  // =====================================================
  // MESS 6
  // =====================================================

  {
    id: 6,
    name: "Scholars Home",
    area: "Kagmarai",
    address: "Kagmarai, Tangail",
    university: "Mawlana Bhashani Science and Technology University",

    rent: 4000,
    distance: 700,
    gender: "Male",
    seats: 3,

    totalRooms: 4,
    totalSeats: 8,
    availableSeats: 3,

    wifi: true,
    meal: true,
    gas: false,
    singleRoom: true,

    rating: 4.5,
    reviewCount: 22,

    verified: false,
    verificationStatus: "Pending Verification",

    image: "",

    description:
      "A peaceful accommodation option designed for university students.",

    rooms: [],

    costs: {
      electricity: 400,
      gas: 0,
      wifi: 200,
      water: 0,
      meal: 3000,
      serviceCharge: 0,
      securityDeposit: 4000,
      other: 0
    },

    facilities: {
      wifi: true,
      gas: false,
      water: true,
      electricity: true,
      studyTable: true,
      balcony: true,
      cctv: false,
      securityGuard: false,
      generator: false,
      ips: true,
      parking: true,
      kitchen: true,
      dining: true,
      commonRoom: false,
      laundry: false,
      hotWater: false
    },

    washroom: {
      total: 3,
      attached: 1,
      common: 2,
      studentsPerWashroom: 3,
      shower: true,
      hotWater: false,
      cleaningFrequency: "Regular",
      condition: "Good",
      photos: []
    },

    mealInfo: {
      available: true,
      system: "Monthly",
      mealsPerDay: 3,
      monthlyCost: 3000,
      perMealCost: 0,

      cook: {
        name: "Mess Khala",
        phone: "",
        experience: "Not specified"
      },

      menu: {
        breakfast: "Varies",
        lunch: "Regular student meal",
        dinner: "Regular student meal"
      },

      foodRating: 4.4,
      kitchenCleanliness: "Good"
    },

    rules: {
      gateClosingTime: "11:00 PM",
      guestPolicy: "Permission required",
      smokingAllowed: false,
      petsAllowed: false,
      cookingAllowed: true,
      studentOnly: true,
      advanceNotice: "1 month",
      additionalRules: []
    },

    environment: {
      noiseLevel: "Low",
      politicalActivity: "Unknown",
      raggingConcern: "None reported",
      securityLevel: "Good",
      studyEnvironment: "Very Good",
      studentFriendly: true
    },

    problems: {
      water: false,
      electricity: false,
      internet: false,
      cleanliness: false,
      security: false,
      noise: false,
      overcrowding: false,
      description: "No major verified problems."
    },

    contact: {
      ownerName: "Mess Owner",
      phone: "",
      whatsapp: "",
      alternatePhone: "",
      preferredContact: "Phone"
    },

    photos: {
      exterior: [],
      rooms: [],
      washroom: [],
      kitchen: [],
      dining: [],
      balcony: [],
      commonArea: [],
      surroundings: []
    },

    ratingBreakdown: {
      food: 4.4,
      cleanliness: 4.5,
      safety: 4.5,
      internet: 4.4,
      washroom: 4.3,
      ownerBehaviour: 4.6,
      environment: 4.7,
      valueForMoney: 4.5
    },

    reviews: [],

    contributions: [],

    welfare: {
      openReports: 0,
      resolvedReports: 0,
      reports: [],
      visitHistory: []
    },

    createdBy: "system",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01"
  }
];

export default messes;
