import { Module } from "@nestjs/common";
import { CustomLogger } from "./custom.logger";
import { CustomConfig } from "./custom.config";


@Module({
  imports: [],
  providers: [CustomLogger, CustomConfig],
  exports: [CustomLogger, CustomConfig]
})
export class CommonModule {
}
