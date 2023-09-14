import { Module } from "@nestjs/common";
import { EventHubService } from "./event-hub.service";
import { EventHubController } from "./event-hub.controller";
import { CommonModule } from "../common/common.module";
import { ServiceBusModule } from "../service-bus/service-bus.module";

@Module({
  imports: [
    CommonModule,
    ServiceBusModule
  ],
  controllers: [EventHubController],
  providers: [EventHubService]
})
export class EventHubModule {
}
