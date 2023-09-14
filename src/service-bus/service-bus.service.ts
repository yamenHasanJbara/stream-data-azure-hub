import { Injectable } from "@nestjs/common";
import { CustomConfig } from "../common/custom.config";
import { CustomLogger } from "../common/custom.logger";
import { ReceivedEventData } from "@azure/event-hubs";
import { ServiceBusClient, ServiceBusMessageBatch, ServiceBusReceiver, ServiceBusSender } from "@azure/service-bus";
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

  async sendToServiceBus(message: ReceivedEventData) {

    try {
      const connectionString: string = this.customConfig.getServiceBusConnectionString();
      let queue: string;
      if (message.body.test) {
        // Strategy design patter
        queue = this.customConfig.getFirstQueueName();
      } else {
        queue = this.customConfig.getSecondQueueName();
      }

      const serviceBusClient: ServiceBusClient = new ServiceBusClient(connectionString);
      const serviceBusSender: ServiceBusSender = serviceBusClient.createSender(queue);

      let batch: ServiceBusMessageBatch = await serviceBusSender.createMessageBatch();
      if (!batch.tryAddMessage(message)) {
        await serviceBusSender.sendMessages(batch);
        batch = await serviceBusSender.createMessageBatch(message.body);
      }
      await serviceBusSender.sendMessages(batch);
      await serviceBusSender.close();
      await serviceBusClient.close();

    } catch (e) {
      this.logging.error(e);
    }

  }

  async createReceiverBusQueue() {
    // connection string to your Service Bus namespace
    const connectionString: string = this.customConfig.getServiceBusConnectionString();

    // create a Service Bus client using the connection string to the Service Bus namespace
    const sbClient: ServiceBusClient = new ServiceBusClient(connectionString);

    let queues: string[] = queuesName;
    for (const queue of queues) {
      // createReceiver() can also be used to create a receiver for a subscription.
      const receiver: ServiceBusReceiver = sbClient.createReceiver(queue);

      // function to handle messages
      const myMessageHandler = async (messageReceived) => {
        await this.dataModelService.storeInDb(messageReceived.body, queue);
      };

      // function to handle any errors
      const myErrorHandler = async (error) => {
        this.logging.log(error);
      };

      // subscribe and specify the message and error handlers
      receiver.subscribe({
        processMessage: myMessageHandler,
        processError: myErrorHandler
      });

    }
  }

}
