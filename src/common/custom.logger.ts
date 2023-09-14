import { Injectable, LoggerService } from "@nestjs/common";
import * as fs from "fs";
import { CustomConfig } from "./custom.config";

@Injectable()
export class CustomLogger implements LoggerService {

  private readonly logFilePath: string;
  private readonly errorFilePath: string;

  constructor(private readonly customConfig: CustomConfig) {
    this.logFilePath = customConfig.getLoggerPath();
    this.errorFilePath = customConfig.getLoggerPathError();
  }

  log(message: any, ...optionalParams): any {
    const logMessage: string = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(this.logFilePath, logMessage);
  }

  error(message: any, ...optionalParams): any {
    const logMessage: string = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(this.logFilePath, logMessage);
  }

  warn(message: any, ...optionalParams): any {
    const logMessage: string = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(this.logFilePath, logMessage);
  }

}