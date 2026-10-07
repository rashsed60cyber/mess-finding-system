export function calculateMatch(mess, preferences) {
  let score = 0;
  let total = 0;
  const reasons = [];

  // Maximum Rent
  if (preferences.maxRent) {
    total += 30;

    if (Number(mess.rent) <= Number(preferences.maxRent)) {
      score += 30;
      reasons.push("Within your budget");
    }
  }

  // Maximum Distance
  if (preferences.maxDistance) {
    total += 25;

    if (
      Number(mess.distance) <=
      Number(preferences.maxDistance)
    ) {
      score += 25;
      reasons.push("Within preferred distance");
    }
  }

  // Mess Type / Gender
  if (preferences.gender) {
    total += 15;

    if (mess.gender === preferences.gender) {
      score += 15;
      reasons.push("Matches your mess type");
    }
  }

  // WiFi
  if (preferences.wifi) {
    total += 10;

    if (mess.wifi) {
      score += 10;
      reasons.push("WiFi available");
    }
  }

  // Meal System
  if (preferences.meal) {
    total += 10;

    if (mess.meal) {
      score += 10;
      reasons.push("Meal system available");
    }
  }

  // Gas
  if (preferences.gas) {
    total += 10;

    if (mess.gas) {
      score += 10;
      reasons.push("Gas available");
    }
  }

  // Single Room
  if (preferences.singleRoom) {
    total += 10;

    if (mess.singleRoom) {
      score += 10;
      reasons.push("Single room available");
    }
  }

  const percentage =
    total === 0
      ? 0
      : Math.round((score / total) * 100);

  return {
    score: percentage,
    reasons
  };
}

export function getRecommendations(
  messes,
  preferences
) {
  return messes
    .map((mess) => {
      const result =
        calculateMatch(mess, preferences);

      return {
        ...mess,
        matchScore: result.score,
        matchReasons: result.reasons
      };
    })
    .sort((a, b) => {
      // First priority: highest match score
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }

      // Second priority: lower rent
      if (Number(a.rent) !== Number(b.rent)) {
        return Number(a.rent) - Number(b.rent);
      }

      // Third priority: shorter distance
      return Number(a.distance) - Number(b.distance);
    });
}
