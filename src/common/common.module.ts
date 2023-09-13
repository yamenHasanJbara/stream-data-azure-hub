import { Module } from "@nestjs/common";
import { CustomLogger } from "./custom.logger";
import { ConfigService } from "@nestjs/config";


@Module({
  imports: [],
  providers: [CustomLogger]
})
export class CommonModule {
}
