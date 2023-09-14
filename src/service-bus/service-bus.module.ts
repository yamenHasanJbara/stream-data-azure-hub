import { Module } from "@nestjs/common";
import { ServiceBusService } from "./service-bus.service";
import { ServiceBusController } from "./service-bus.controller";
import { CommonModule } from "../common/common.module";
import { DataModelModule } from "../data-model/data-model.module";

@Module({
  imports: [
    CommonModule,
    DataModelModule
  ],
  controllers: [ServiceBusController],
  providers: [ServiceBusService],
  exports: [ServiceBusService]
})
export class ServiceBusModule {
}
