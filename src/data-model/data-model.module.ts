import { Module } from "@nestjs/common";
import { DataModelService } from "./data-model.service";
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
  providers: [DataModelService],
  exports: [DataModelService]
})
export class DataModelModule {
}
