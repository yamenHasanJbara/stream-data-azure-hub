import { Injectable } from "@nestjs/common";
import { CustomConfig } from "../common/custom.config";
import { CustomLogger } from "../common/custom.logger";
import { ReceivedEventData } from "@azure/event-hubs";
import {
  ServiceBusClient,
  ServiceBusMessageBatch,
  ServiceBusReceivedMessage,
  ServiceBusReceiver,
  ServiceBusSender
} from "@azure/service-bus";
import { DataModelService } from "../data-model/data-model.service";
import { queuesName } from "../common/queues";

@Injectable()
export class ServiceBusService {
  constructor(
    private readonly customConfig: CustomConfig,
    private readonly logging: CustomLogger,
    private readonly dataModelService: DataModelService
  ) {
  }

  async sendToServiceBus(message: ReceivedEventData): Promise<void> {

    try {
      const connectionString: string = this.customConfig.getServiceBusConnectionString();
      //let queue: string;
      const queue: string = this.getQueue(message.body);
      // create a Service Bus client using the connection string to the Service Bus namespace
      const serviceBusClient: ServiceBusClient = new ServiceBusClient(connectionString);
      // createSender() can also be used to create a sender for a topic.
      const serviceBusSender: ServiceBusSender = serviceBusClient.createSender(queue);

      // here is the process for sending data through a batch
      let batch: ServiceBusMessageBatch = await serviceBusSender.createMessageBatch();
      // send data through the batch
      await serviceBusSender.sendMessages(batch);

    } catch (e) {
      this.logging.error(e);
    }

  }

  async createReceiverBusQueue() {
    // connection string to your Service Bus namespace
    const connectionString: string = this.customConfig.getServiceBusConnectionString();

    // create a Service Bus client using the connection string to the Service Bus namespace
    const sbClient: ServiceBusClient = new ServiceBusClient(connectionString);

    for (const queue of queuesName) {
      // createReceiver() can also be used to create a receiver for a subscription.
      const receiver: ServiceBusReceiver = sbClient.createReceiver(queue);

      const receiverHandleForDeadMessage: ServiceBusReceiver = sbClient.createReceiver(queue, { subQueueType: "deadLetter" });

      //check if there is any deal letter messages in the queue
      const deadMessages: ServiceBusReceivedMessage[] = await receiverHandleForDeadMessage.receiveMessages(100);
      if (deadMessages.length > 0) {
        await this.fixAndResendMessage(deadMessages, queue, sbClient, receiverHandleForDeadMessage);
      }

      // function to handle messages
      const myMessageHandler = async (messageReceived: any) => {
        await this.dataModelService.storeInDb(messageReceived.body, queue);
      };

      // function to handle any errors
      const myErrorHandler = async (error: any) => {
        this.logging.error(error);
      };

      // subscribe and specify the message and error handlers
      receiver.subscribe({
        processMessage: myMessageHandler,
        processError: myErrorHandler
      });

    }
  }

  private getQueue(body: any): string {
    if (body.test) {
      return this.customConfig.getFirstQueueName();
    } else {
      return this.customConfig.getSecondQueueName();
    }
  }

  /**
   *
   * @param deadMessages
   * @param queueName
   * @param sbClient
   * @param receiverHandleForDeadMessage
   * @private
   * this function is used for resend dead messages to the queue to reprocessing it again.
   */
  private async fixAndResendMessage(deadMessages: ServiceBusReceivedMessage[], queueName: string, sbClient: ServiceBusClient, receiverHandleForDeadMessage: ServiceBusReceiver) {
    const sender: ServiceBusSender = sbClient.createSender(queueName);
    for (const message of deadMessages) {
      const repairedMessage = { ...message };
      await sender.sendMessages(repairedMessage);
      await receiverHandleForDeadMessage.completeMessage(message);
    }
    await sender.close();
  }
}
