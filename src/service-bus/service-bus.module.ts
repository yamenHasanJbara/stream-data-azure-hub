import { Module } from "@nestjs/common";
import { ServiceBusService } from "./service-bus.service";
import { CommonModule } from "../common/common.module";
import { DataModelModule } from "../data-model/data-model.module";

@Module({
  imports: [
    CommonModule,
    DataModelModule
  ],
  controllers: [],
  providers: [ServiceBusService],
  exports: [ServiceBusService]
})
export class ServiceBusModule {
}
