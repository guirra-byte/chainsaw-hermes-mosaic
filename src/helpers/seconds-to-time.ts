function secondsToTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const reply = `${String(hours).padStart(2, "0")}
  :${String(minutes).padStart(2, "0")}
  :${String(remainingSeconds).padStart(2, "0")}`;

  return reply;
}

export { secondsToTime };
