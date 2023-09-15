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

  /**
   * Init a persistent connection to the event hub, and send the data for service bus queue.
   */
  async createConnectionToEventHub(): Promise<void> {
    const eventHubConnectionString: string = this.customConfig.getEventHubConnectionString();
    const eventHubName: string = this.customConfig.getEventHubName();
    const consumerGroup: string = this.customConfig.getConsumerGroupName();
    const storageConnectionString: string = this.customConfig.getStorageConnectionString();
    const containerName: string = this.customConfig.getContainerName();

    // Create a blob container client and a blob checkpoint store using the client.
    const containerClient: ContainerClient = new ContainerClient(
      storageConnectionString,
      containerName
    );

    const checkPointStore: BlobCheckpointStore = new BlobCheckpointStore(
      containerClient
    );
    // Create a consumer client for the event hub by specifying the checkpoint store.
    const consumerClient: EventHubConsumerClient = new EventHubConsumerClient(
      consumerGroup,
      eventHubConnectionString,
      eventHubName,
      checkPointStore,
    );

    // Subscribe to the events, and specify handlers for processing the events and errors.
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
  }

}
