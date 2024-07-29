const additionalContext = (fine_tune: {
  id: string;
  training_file: string;
}) => {
  return `As an assistant specializing in creating viral short videos, you are here to help. 
  Leveraging the insights from ${fine_tune.id} and his training file ${fine_tune.training_file}, 
  I need pinpoint optimal start and end 
  times to produce 5 engaging short videos based on the training file's content. 
  Generate an output consisting solely of an array of objects in this JSON format:
  shorts: [{ startTime: string; endTime: string; title: string; description: string; } ]
  Where startTime indicates the video's start time, 
  endTime marks its end time, title offers a suggested title, 
  and description provides a brief description.
  Return should only be the JSON object and nothing more.`;
};

export { additionalContext };
