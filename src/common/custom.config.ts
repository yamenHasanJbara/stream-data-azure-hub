import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CustomConfig {

  constructor(private readonly configService: ConfigService) {
  }

  getEventHubConnectionString(): string {
    return this.configService.get<string>("EVENT_HUB_CONNECTION_STRING");
  }

  getStorageConnectionString(): string {
    return this.configService.get<string>("STORAGE_CONNECTION_STRING");
  }

  getEventHubName(): string {
    return this.configService.get<string>("EVENT_HUB_NAME");
  }

  getContainerName(): string {
    return this.configService.get<string>("CONTAINER_NAME");
  }

  getConsumerGroupName(): string {
    return this.configService.get<string>("CONSUMER_GROUP_NAME");
  }

  getServiceBusConnectionString(): string {
    return this.configService.get<string>("SERVICE_BUS_CONNECTION_STRING");
  }

  getFirstQueueName(): string {
    return this.configService.get<string>("FIRST_SERVICE_BUS_QUEUE_NAME");
  }

  getSecondQueueName(): string {
    return this.configService.get<string>("SECOND_SERVICE_BUS_QUEUE_NAME");
  }

  getLoggerPath(): string {
    return this.configService.get<string>("LOG_MESSAGE_FILE_PATH");
  }


  getLoggerPathError(): string {
    return this.configService.get<string>("ERROR_MESSAGE_FILE_PATH");
  }
}