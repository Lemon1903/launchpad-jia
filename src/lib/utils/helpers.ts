export function getWidthPercentage(width: number, baseWidth: number) {
  return (width / baseWidth) * 100;
}

/**
 * Recursively remove empty fields up to a certain level
 * @param obj - the object or array to clean
 * @param maxLevel - maximum depth to clean (1 = top level only)
 * @param currentLevel - internal tracker, defaults to 1
 */
export function removeEmptyFields<T>(obj: T, maxLevel: number, currentLevel = 1): any {
  if (Array.isArray(obj)) {
    if (currentLevel > maxLevel) return obj; // stop cleaning deeper
    return obj
      .map((item) => removeEmptyFields(item, maxLevel, currentLevel + 1))
      .filter(
        (item) =>
          item != null &&
          (typeof item !== "object" || (Object.keys(item).length > 0 && !isAllEmptyString(item))),
      );
  }

  if (obj && typeof obj === "object") {
    if (currentLevel > maxLevel) return obj; // stop cleaning deeper
    const cleaned = Object.fromEntries(
      Object.entries(obj)
        .filter(
          ([_, v]) => v !== undefined && v !== null && !(typeof v === "string" && v.trim() === ""),
        )
        .map(([k, v]) => [k, removeEmptyFields(v, maxLevel, currentLevel + 1)]),
    );

    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }

  if (typeof obj === "string" && obj.trim() === "") return undefined;

  return obj;
}

// helper to check if an object's all values are empty strings
export function isAllEmptyString(obj: Record<string, any>) {
  return Object.values(obj).every((v) => typeof v === "string" && v.trim() === "");
}

// Recursively convert empty strings to undefined in objects and arrays
export function emptyStringsToUndefined<T>(value: T): T {
  // Handle null or undefined
  if (value == null) {
    return value;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(emptyStringsToUndefined) as T;
  }

  // Handle objects
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, emptyStringsToUndefined(val)]),
    ) as T;
  }

  // Handle primitives (including non-empty strings)
  if (typeof value === "string" && value === "") {
    return undefined as T;
  }

  return value;
}
