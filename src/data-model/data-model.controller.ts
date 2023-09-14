import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DataModelService } from './data-model.service';


@Controller('data-model')
export class DataModelController {
  constructor(private readonly dataModelService: DataModelService) {}

}
