import { Injectable, LoggerService } from "@nestjs/common";
import fs from "fs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CustomLogger implements LoggerService {

  private readonly logFilePath: string;
  private readonly errorFilePath: string;
  private readonly warnFilePath: string;

  constructor(private readonly configService: ConfigService) {
    this.logFilePath = configService.get<string>("LOG_MESSAGE_FILE_PATH");
    this.errorFilePath = configService.get<string>("ERROR_MESSAGE_FILE_PATH");
    this.warnFilePath = configService.get<string>("WARN_MESSAGE_FILE_PATH");
  }

  log(message: any, ...optionalParams): any {
    const logMessage: string = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(this.logFilePath, logMessage);
  }

  error(message: any, ...optionalParams): any {
    const logMessage: string = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(this.errorFilePath, logMessage);
  }

  warn(message: any, ...optionalParams): any {
    const logMessage: string = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(this.warnFilePath, logMessage);
  }

}