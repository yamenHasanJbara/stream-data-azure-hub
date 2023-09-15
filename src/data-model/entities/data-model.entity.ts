import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type DataModelDocument = HydratedDocument<DataModel>;

@Schema({
  timestamps: true
})
export class DataModel {

  @Prop()
  queue_name: string;

  @Prop()
  data: string;
}

export const DataModelSchema = SchemaFactory.createForClass(DataModel);
