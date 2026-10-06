
export function calculateMatch(mess, preferences) {
  let score = 0;
  let total = 0;
  const reasons = [];

  if (preferences.maxRent) {
    total += 30;

    if (mess.rent <= Number(preferences.maxRent)) {
      score += 30;
      reasons.push("Within your budget");
    }
  }

  if (preferences.maxDistance) {
    total += 25;

    if (
      mess.distance <=
      Number(preferences.maxDistance)
    ) {
      score += 25;
      reasons.push("Within preferred distance");
    }
  }

  if (preferences.gender) {
    total += 15;

    if (mess.gender === preferences.gender) {
      score += 15;
      reasons.push("Matches your mess type");
    }
  }

  if (preferences.wifi) {
    total += 10;

    if (mess.wifi) {
      score += 10;
      reasons.push("WiFi available");
    }
  }

  if (preferences.meal) {
    total += 10;

    if (mess.meal) {
      score += 10;
      reasons.push("Meal system available");
    }
  }

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
    .sort(
      (a, b) =>
        b.matchScore - a.matchScore
    );
}
