
import defaultMesses from "../data/messes";

export function getOwnerMesses() {
  try {
    return (
      JSON.parse(
        localStorage.getItem("messFinderOwnerMesses")
      ) || []
    );
  } catch {
    return [];
  }
}

export function getAllMesses() {
  const ownerMesses = getOwnerMesses();

  return [
    ...defaultMesses,
    ...ownerMesses
  ];
}

export default getAllMesses;
