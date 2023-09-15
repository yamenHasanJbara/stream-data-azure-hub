import { Module } from "@nestjs/common";
import { EventHubService } from "./event-hub.service";
import { CommonModule } from "../common/common.module";
import { ServiceBusModule } from "../service-bus/service-bus.module";

@Module({
  imports: [
    CommonModule,
    ServiceBusModule
  ],
  providers: [EventHubService]
})
export class EventHubModule {
}
