import { CloudWatchLogsClient, PutLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
const logsClient = new CloudWatchLogsClient({});

export const logCloudWatch = (message: string) => {
  console.log(message);

  const input = {
    logGroupName: process.env.CLOUDWATCH_LOG_GROUP,
    logStreamName: process.env.CLOUDWATCH_LOG_STREAM,
    logEvents: [
      {
        message,
        timestamp: Date.now(),
      },
    ],
  };

  try {
    return logsClient.send(new PutLogEventsCommand(input));
  } catch (err) {
    console.error(err);
  }
};
