import { Module } from "@nestjs/common";
import { DataModelService } from "./data-model.service";
import { DataModelController } from "./data-model.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { DataModel, DataModelSchema } from "./entities/data-model.entity";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DataModel.name, schema: DataModelSchema }
    ]),
    CommonModule
  ],
  controllers: [DataModelController],
  providers: [DataModelService],
  exports: [DataModelService]
})
export class DataModelModule {
}
