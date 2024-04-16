import { PublishCommand , SNSClient } from "@aws-sdk/client-sns";
import { ProductWithStock } from '../models/product';

const snsClient = new SNSClient({region: process.env.REGION})

export const sendProductsCreatedNotification = async (products: ProductWithStock[]) => {
  const message = `Products created in DB: ${JSON.stringify(products)}`;
  const subject = 'Products created';
  const topicArn = process.env.SNS_ARN;
  return sendNotification(message, subject, topicArn);
};

export const sendNotification = async (message: string, subject: string, topicArn: string) => {
  console.log('Sending notification', message, subject, topicArn);
  return snsClient.send(
      new PublishCommand({
        Message: message,
        Subject: subject,
        TopicArn: topicArn,
      }),
  )
};
