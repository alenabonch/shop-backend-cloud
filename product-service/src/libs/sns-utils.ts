import { PublishCommand , SNSClient } from "@aws-sdk/client-sns";
import { ProductWithStock } from '../models/product';

const snsClient = new SNSClient({region: process.env.REGION})

export const sendProductsCreatedNotification = async (products: ProductWithStock[]) => {
  for (const product of products) {
    const message = `New product is created in the DB: ${JSON.stringify(product)}`;
    const subject = 'New product is created';
    const topicArn = process.env.SNS_ARN;

    await snsClient.send(
        new PublishCommand({
          Message: message,
          Subject: subject,
          TopicArn: topicArn,
          MessageAttributes: {
            count: {
              DataType: 'Number',
              StringValue: product.count.toString()
            }
          }
        }),
    )
  }
};
