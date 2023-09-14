import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DataModel, DataModelDocument } from "./entities/data-model.entity";
import { Model } from "mongoose";
import { CustomLogger } from "../common/custom.logger";


@Injectable()
export class DataModelService {


  constructor(
    @InjectModel(DataModel.name)
    private readonly dataModel: Model<DataModelDocument>,
    private readonly logging: CustomLogger
  ) {
  }

  async storeInDb(messageReceived, queueName: string) {
    try {
      return this.dataModel.create({
        queue_name: queueName,
        data: JSON.stringify(messageReceived)
      });
    } catch (e) {
      this.logging.error(e.message);
    }
  }
}
