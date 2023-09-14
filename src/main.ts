import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EventHubService } from "./event-hub/event-hub.service";
import { ServiceBusService } from "./service-bus/service-bus.service";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const eventHubService: EventHubService = app.get(EventHubService);
  await eventHubService.createConnectionToEventHub();
  const serviceBus:ServiceBusService = app.get(ServiceBusService);
  await serviceBus.createReceiverBusQueue();
  await app.listen(3000);
}

bootstrap();
