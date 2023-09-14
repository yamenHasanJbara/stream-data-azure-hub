import { Controller, Get } from "@nestjs/common";
import { ServiceBusService } from "./service-bus.service";

@Controller("service-bus")
export class ServiceBusController {
  constructor(
    private readonly serviceBusService: ServiceBusService
  ) {
  }

  @Get('receive-messages')
  async receiveFromServiceBus() {
    return this.serviceBusService.createReceiverBusQueue();
  }

}
