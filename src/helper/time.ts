import { formatDistanceToNow, parseISO } from "date-fns";

export const getRelativeTime = (timestamp: string): string => {
  try {
    // Parse the ISO 8601 timestamp into a Date object
    const parsedDate = parseISO(timestamp);
    
    // Get the relative time
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid date";
  }
};


export const currentTime = new Date().toISOString(); // Get current time in ISO format
