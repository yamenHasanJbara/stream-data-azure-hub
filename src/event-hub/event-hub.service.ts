import { Injectable } from "@nestjs/common";
import { ContainerClient } from "@azure/storage-blob";
import { BlobCheckpointStore } from "@azure/eventhubs-checkpointstore-blob";
import {
  earliestEventPosition,
  EventHubConsumerClient,
  MessagingError,
  PartitionContext,
  ReceivedEventData,
  Subscription
} from "@azure/event-hubs";
import { CustomConfig } from "../common/custom.config";
import { CustomLogger } from "../common/custom.logger";
import { Error } from "mongoose";
import { ServiceBusService } from "../service-bus/service-bus.service";

@Injectable()
export class EventHubService {

  constructor(
    private readonly customConfig: CustomConfig,
    private readonly logging: CustomLogger,
    private readonly serviceBus: ServiceBusService
  ) {
  }

  async createConnectionToEventHub() {
    const eventHubConnectionString: string = this.customConfig.getEventHubConnectionString();
    const eventHubName: string = this.customConfig.getEventHubName();
    const consumerGroup: string = this.customConfig.getConsumerGroupName();
    const storageConnectionString: string = this.customConfig.getStorageConnectionString();
    const containerName: string = this.customConfig.getContainerName();


    const containerClient: ContainerClient = new ContainerClient(
      storageConnectionString,
      containerName
    );


    const checkPointStore: BlobCheckpointStore = new BlobCheckpointStore(
      containerClient
    );


    const consumerClient: EventHubConsumerClient = new EventHubConsumerClient(
      consumerGroup,
      eventHubConnectionString,
      eventHubName,
      checkPointStore
    );


    const subscription: Subscription = consumerClient.subscribe({
        processEvents: async (events: ReceivedEventData[], context: PartitionContext) => {
          if (events.length === 0) {
            console.log("There is no data to receive!");
            return;
          }

          for (const event of events) {
            await this.serviceBus.sendToServiceBus(event);
          }
          // Update the checkpoint.
          await context.updateCheckpoint(events[events.length - 1]);
        },
        processError: async (err: Error | MessagingError, context: PartitionContext) => {
          this.logging.error(err);
        }
      },
      {
        startPosition: earliestEventPosition
      }
    );
    return {
      "status": true,
      "message": "connection to the event hub successfully"
    };
  }

}
