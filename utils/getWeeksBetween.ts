export default (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in milliseconds
  const diffInMs = end.getTime() - start.getTime();

  // Convert milliseconds to days
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  // Calculate the number of weeks
  const numWeeks = Math.ceil(diffInDays / 7);

  return numWeeks;
};
