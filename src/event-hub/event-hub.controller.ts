import { Controller, Get } from "@nestjs/common";
import { EventHubService } from "./event-hub.service";

@Controller("event-hub")
export class EventHubController {
  constructor(
    private readonly eventHubService: EventHubService
  ) {
  }

  @Get("connect")
  async connectToEventHub() {
    return this.eventHubService.createConnectionToEventHub();
  }
}
