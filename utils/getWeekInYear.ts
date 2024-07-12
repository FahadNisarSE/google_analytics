export default (year: number): number => {
  const januaryFirst = new Date(year, 0, 1);
  const decemberThirtyFirst = new Date(year, 11, 31);

  const firstDayOfYear = januaryFirst.getDay(); // Day of the week (0-6) for January 1st
  const lastDayOfYear = decemberThirtyFirst.getDay(); // Day of the week (0-6) for December 31st

  // Calculate the number of full weeks between January 1st and December 31st
  const daysInYear =
    (decemberThirtyFirst.getTime() - januaryFirst.getTime()) /
    (1000 * 60 * 60 * 24);
  const fullWeeks = Math.floor(daysInYear / 7);

  // Adjust for partial weeks at the beginning and end of the year
  let extraWeekAtStart = firstDayOfYear === 0 ? 1 : 0; // If Jan 1st is Sunday, add 1 extra week
  let extraWeekAtEnd = lastDayOfYear === 6 ? 1 : 0; // If Dec 31st is Saturday, add 1 extra week

  return fullWeeks + extraWeekAtStart + extraWeekAtEnd;
};
