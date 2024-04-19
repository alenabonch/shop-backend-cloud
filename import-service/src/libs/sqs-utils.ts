import { GetQueueUrlCommand, SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({region: process.env.REGION})

export const sendProductsToCatalogItemsQueue = async (products: any[]) => {
  const queueUrl = await getQueueUrlByName(process.env.CATALOG_ITEMS_QUEUE)
  for (const product of products) {
    await sendMessageToQueue(product, queueUrl);
  }
};

export const sendMessageToQueue = async (message: any, queueUrl: string) => {
  try {
    console.log('Sending message to queue', JSON.stringify(message), queueUrl)

    return sqsClient.send(
        new SendMessageCommand({
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(message),
        }),
    )
  } catch (e) {
    console.log('Error sending message to queue', e)
  }
};

export const getQueueUrlByName = async (queueName: string): Promise<string> => {
  try {
    console.log('Getting queue URL by name', queueName);

    const input = {
      QueueName: queueName,
    };
    const command = new GetQueueUrlCommand(input);
    const response = await sqsClient.send(command);

    console.log('Received queue URL', response.QueueUrl)
    return response.QueueUrl;
  } catch (e) {
    console.log('Error getting queue URL', e)
  }
};
