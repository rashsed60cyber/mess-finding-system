import defaultMesses from "../data/messes";

/*
========================================
MESS NORMALIZER
========================================

Old owner listings may not contain all
new MessFinder fields.

This function gives every mess a safe,
consistent structure.
*/

export function normalizeMess(mess = {}) {
  const availableSeats =
    Number(
      mess.availableSeats ??
      mess.seats ??
      0
    );

  const totalSeats =
    Number(
      mess.totalSeats ??
      mess.seats ??
      0
    );

  const facilities = {
    wifi:
      mess.facilities?.wifi ??
      Boolean(mess.wifi),

    gas:
      mess.facilities?.gas ??
      Boolean(mess.gas),

    water:
      mess.facilities?.water ??
      true,

    electricity:
      mess.facilities?.electricity ??
      true,

    studyTable:
      mess.facilities?.studyTable ??
      false,

    balcony:
      mess.facilities?.balcony ??
      false,

    cctv:
      mess.facilities?.cctv ??
      false,

    securityGuard:
      mess.facilities?.securityGuard ??
      false,

    generator:
      mess.facilities?.generator ??
      false,

    ips:
      mess.facilities?.ips ??
      false,

    parking:
      mess.facilities?.parking ??
      false,

    kitchen:
      mess.facilities?.kitchen ??
      true,

    dining:
      mess.facilities?.dining ??
      Boolean(mess.meal),

    commonRoom:
      mess.facilities?.commonRoom ??
      false,

    laundry:
      mess.facilities?.laundry ??
      false,

    hotWater:
      mess.facilities?.hotWater ??
      false
  };

  const mealAvailable =
    mess.mealInfo?.available ??
    Boolean(mess.meal);

  return {
    ...mess,

    id:
      mess.id ??
      Date.now(),

    name:
      mess.name ||
      "Unnamed Mess",

    area:
      mess.area ||
      "Not specified",

    address:
      mess.address ||
      mess.area ||
      "Not specified",

    university:
      mess.university ||
      "Mawlana Bhashani Science and Technology University",

    description:
      mess.description ||
      "No description has been added yet.",

    distance:
      Number(mess.distance || 0),

    gender:
      mess.gender ||
      "Not specified",

    rent:
      Number(mess.rent || 0),

    seats: availableSeats,

    totalRooms:
      Number(
        mess.totalRooms ??
        mess.rooms?.length ??
        0
      ),

    totalSeats,

    availableSeats,

    wifi: facilities.wifi,
    gas: facilities.gas,

    meal: mealAvailable,

    singleRoom:
      mess.singleRoom ??
      Boolean(
        mess.rooms?.some(
          (room) =>
            room.type
              ?.toLowerCase()
              .includes("single")
        )
      ),

    rating:
      Number(mess.rating || 0),

    reviewCount:
      Number(
        mess.reviewCount ??
        mess.reviews?.length ??
        0
      ),

    verified:
      Boolean(mess.verified),

    verificationStatus:
      mess.verificationStatus ||
      "Pending Verification",

    image:
      mess.image || "",

    /*
    ========================================
    ROOMS
    ========================================
    */

    rooms:
      Array.isArray(mess.rooms)
        ? mess.rooms.map(
            (room, index) => ({
              id:
                room.id ??
                `${mess.id || "mess"}-room-${index + 1}`,

              roomNumber:
                room.roomNumber ||
                `${index + 1}`,

              type:
                room.type ||
                "Shared",

              totalSeats:
                Number(
                  room.totalSeats || 0
                ),

              availableSeats:
                Number(
                  room.availableSeats || 0
                ),

              rentPerSeat:
                Number(
                  room.rentPerSeat ||
                  mess.rent ||
                  0
                ),

              attachedWashroom:
                Boolean(
                  room.attachedWashroom
                ),

              balcony:
                Boolean(room.balcony),

              furnished:
                Boolean(room.furnished),

              availableFrom:
                room.availableFrom ||
                "Not specified",

              photos:
                Array.isArray(room.photos)
                  ? room.photos
                  : []
            })
          )
        : [],

    /*
    ========================================
    MONTHLY COSTS
    ========================================
    */

    costs: {
      electricity:
        Number(
          mess.costs?.electricity || 0
        ),

      gas:
        Number(
          mess.costs?.gas || 0
        ),

      wifi:
        Number(
          mess.costs?.wifi || 0
        ),

      water:
        Number(
          mess.costs?.water || 0
        ),

      meal:
        Number(
          mess.costs?.meal ||
          mess.mealInfo?.monthlyCost ||
          0
        ),

      serviceCharge:
        Number(
          mess.costs?.serviceCharge || 0
        ),

      securityDeposit:
        Number(
          mess.costs?.securityDeposit || 0
        ),

      other:
        Number(
          mess.costs?.other || 0
        )
    },

    /*
    ========================================
    FACILITIES
    ========================================
    */

    facilities,

    /*
    ========================================
    WASHROOM
    ========================================
    */

    washroom: {
      total:
        Number(
          mess.washroom?.total || 0
        ),

      attached:
        Number(
          mess.washroom?.attached || 0
        ),

      common:
        Number(
          mess.washroom?.common || 0
        ),

      studentsPerWashroom:
        Number(
          mess.washroom
            ?.studentsPerWashroom || 0
        ),

      shower:
        Boolean(
          mess.washroom?.shower
        ),

      hotWater:
        Boolean(
          mess.washroom?.hotWater
        ),

      cleaningFrequency:
        mess.washroom
          ?.cleaningFrequency ||
        "Not specified",

      condition:
        mess.washroom?.condition ||
        "Not specified",

      photos:
        Array.isArray(
          mess.washroom?.photos
        )
          ? mess.washroom.photos
          : []
    },

    /*
    ========================================
    MEAL & COOK / KHALA
    ========================================
    */

    mealInfo: {
      available:
        mealAvailable,

      system:
        mess.mealInfo?.system ||
        (mealAvailable
          ? "Available"
          : "Not Available"),

      mealsPerDay:
        Number(
          mess.mealInfo
            ?.mealsPerDay || 0
        ),

      monthlyCost:
        Number(
          mess.mealInfo
            ?.monthlyCost || 0
        ),

      perMealCost:
        Number(
          mess.mealInfo
            ?.perMealCost || 0
        ),

      cook: {
        name:
          mess.mealInfo
            ?.cook?.name || "",

        phone:
          mess.mealInfo
            ?.cook?.phone || "",

        experience:
          mess.mealInfo
            ?.cook?.experience ||
          "Not specified"
      },

      menu: {
        breakfast:
          mess.mealInfo
            ?.menu?.breakfast || "",

        lunch:
          mess.mealInfo
            ?.menu?.lunch || "",

        dinner:
          mess.mealInfo
            ?.menu?.dinner || ""
      },

      foodRating:
        Number(
          mess.mealInfo
            ?.foodRating || 0
        ),

      kitchenCleanliness:
        mess.mealInfo
          ?.kitchenCleanliness ||
        "Not specified"
    },

    /*
    ========================================
    RULES
    ========================================
    */

    rules: {
      gateClosingTime:
        mess.rules
          ?.gateClosingTime ||
        "Not specified",

      guestPolicy:
        mess.rules?.guestPolicy ||
        "Not specified",

      smokingAllowed:
        Boolean(
          mess.rules
            ?.smokingAllowed
        ),

      petsAllowed:
        Boolean(
          mess.rules?.petsAllowed
        ),

      cookingAllowed:
        mess.rules
          ?.cookingAllowed ??
        true,

      studentOnly:
        mess.rules?.studentOnly ??
        true,

      advanceNotice:
        mess.rules?.advanceNotice ||
        "Not specified",

      additionalRules:
        Array.isArray(
          mess.rules
            ?.additionalRules
        )
          ? mess.rules.additionalRules
          : []
    },

    /*
    ========================================
    ENVIRONMENT & SAFETY
    ========================================
    */

    environment: {
      noiseLevel:
        mess.environment
          ?.noiseLevel ||
        "Unknown",

      politicalActivity:
        mess.environment
          ?.politicalActivity ||
        "Unknown",

      raggingConcern:
        mess.environment
          ?.raggingConcern ||
        "No verified information",

      securityLevel:
        mess.environment
          ?.securityLevel ||
        "Unknown",

      studyEnvironment:
        mess.environment
          ?.studyEnvironment ||
        "Unknown",

      studentFriendly:
        mess.environment
          ?.studentFriendly ??
        true
    },

    /*
    ========================================
    KNOWN PROBLEMS
    ========================================
    */

    problems: {
      water:
        Boolean(
          mess.problems?.water
        ),

      electricity:
        Boolean(
          mess.problems
            ?.electricity
        ),

      internet:
        Boolean(
          mess.problems?.internet
        ),

      cleanliness:
        Boolean(
          mess.problems
            ?.cleanliness
        ),

      security:
        Boolean(
          mess.problems
            ?.security
        ),

      noise:
        Boolean(
          mess.problems?.noise
        ),

      overcrowding:
        Boolean(
          mess.problems
            ?.overcrowding
        ),

      description:
        mess.problems
          ?.description ||
        "No verified problem information."
    },

    /*
    ========================================
    OWNER CONTACT
    ========================================
    */

    contact: {
      ownerName:
        mess.contact?.ownerName ||
        mess.ownerName ||
        "Not specified",

      phone:
        mess.contact?.phone ||
        mess.phone ||
        "",

      whatsapp:
        mess.contact?.whatsapp ||
        "",

      alternatePhone:
        mess.contact
          ?.alternatePhone ||
        "",

      preferredContact:
        mess.contact
          ?.preferredContact ||
        "Phone"
    },

    /*
    ========================================
    PHOTOS
    ========================================
    */

    photos: {
      exterior:
        Array.isArray(
          mess.photos?.exterior
        )
          ? mess.photos.exterior
          : [],

      rooms:
        Array.isArray(
          mess.photos?.rooms
        )
          ? mess.photos.rooms
          : [],

      washroom:
        Array.isArray(
          mess.photos?.washroom
        )
          ? mess.photos.washroom
          : [],

      kitchen:
        Array.isArray(
          mess.photos?.kitchen
        )
          ? mess.photos.kitchen
          : [],

      dining:
        Array.isArray(
          mess.photos?.dining
        )
          ? mess.photos.dining
          : [],

      balcony:
        Array.isArray(
          mess.photos?.balcony
        )
          ? mess.photos.balcony
          : [],

      commonArea:
        Array.isArray(
          mess.photos?.commonArea
        )
          ? mess.photos.commonArea
          : [],

      surroundings:
        Array.isArray(
          mess.photos?.surroundings
        )
          ? mess.photos.surroundings
          : []
    },

    /*
    ========================================
    RATINGS
    ========================================
    */

    ratingBreakdown: {
      food:
        Number(
          mess.ratingBreakdown
            ?.food || 0
        ),

      cleanliness:
        Number(
          mess.ratingBreakdown
            ?.cleanliness || 0
        ),

      safety:
        Number(
          mess.ratingBreakdown
            ?.safety || 0
        ),

      internet:
        Number(
          mess.ratingBreakdown
            ?.internet || 0
        ),

      washroom:
        Number(
          mess.ratingBreakdown
            ?.washroom || 0
        ),

      ownerBehaviour:
        Number(
          mess.ratingBreakdown
            ?.ownerBehaviour || 0
        ),

      environment:
        Number(
          mess.ratingBreakdown
            ?.environment || 0
        ),

      valueForMoney:
        Number(
          mess.ratingBreakdown
            ?.valueForMoney || 0
        )
    },

    reviews:
      Array.isArray(mess.reviews)
        ? mess.reviews
        : [],

    /*
    ========================================
    STUDENT CONTRIBUTIONS
    ========================================
    */

    contributions:
      Array.isArray(
        mess.contributions
      )
        ? mess.contributions
        : [],

    /*
    ========================================
    PROCTOR / WELFARE
    ========================================
    */

    welfare: {
      openReports:
        Number(
          mess.welfare
            ?.openReports || 0
        ),

      resolvedReports:
        Number(
          mess.welfare
            ?.resolvedReports || 0
        ),

      reports:
        Array.isArray(
          mess.welfare?.reports
        )
          ? mess.welfare.reports
          : [],

      visitHistory:
        Array.isArray(
          mess.welfare
            ?.visitHistory
        )
          ? mess.welfare.visitHistory
          : []
    },

    createdBy:
      mess.createdBy ||
      "owner",

    createdAt:
      mess.createdAt ||
      new Date().toISOString(),

    updatedAt:
      mess.updatedAt ||
      new Date().toISOString()
  };
}

/*
========================================
OWNER MESSES
========================================
*/

export function getOwnerMesses() {
  try {
    const saved =
      JSON.parse(
        localStorage.getItem(
          "messFinderOwnerMesses"
        )
      ) || [];

    return saved.map(normalizeMess);
  } catch (error) {
    console.error(
      "Failed to load owner messes:",
      error
    );

    return [];
  }
}

/*
========================================
ALL MESSES
========================================
*/

export function getAllMesses() {
  const defaultData =
    defaultMesses.map(normalizeMess);

  const ownerMesses =
    getOwnerMesses();

  return [
    ...defaultData,
    ...ownerMesses
  ];
}

/*
========================================
GET SINGLE MESS
========================================
*/

export function getMessById(id) {
  const messId = Number(id);

  return (
    getAllMesses().find(
      (mess) =>
        Number(mess.id) === messId
    ) || null
  );
}

export default getAllMesses;
