function secondsToTime(time: string) {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  return timeRegex.test(time);
}

export { secondsToTime };
