const errorDictionary: Record<string, string> = {
  "Preventing creation of hero because a security prevention rule was triggered: Name already exists":
    "That hero name is already taken.",
  "ValidationError: weight must be a number":
    "Please enter a valid number for weight.",
  "The heroId in an Invalid ObjectId": "That hero does not exist.",
};

export function getFriendlyError(message: string): string {
  return errorDictionary[message] || "Something went wrong. Please try again.";
}
