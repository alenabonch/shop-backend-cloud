import { PublishCommand , SNSClient } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({region: process.env.REGION})

export const sendProductsCreatedNotification = async (productIds: string[]) => {
  const message = `Products created in DB with IDs: ${productIds.toString()}`;
  const subject = 'Products created';
  const topicArn = process.env.SNS_ARN;
  return sendNotification(message, subject, topicArn);
};

export const sendNotification = async (message: any, subject: string, topicArn: string) => {
  console.log('Sending notification', message, subject, topicArn);
  return snsClient.send(
      new PublishCommand({
        Message: JSON.stringify(message),
        Subject: subject,
        TopicArn: topicArn,
      }),
  )
};
