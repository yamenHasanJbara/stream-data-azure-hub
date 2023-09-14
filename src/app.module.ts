import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonModule } from "./common/common.module";
import { EventHubModule } from './event-hub/event-hub.module';
import { ServiceBusModule } from './service-bus/service-bus.module';
import { DataModelModule } from './data-model/data-model.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>("DATABASE_CONNECTION"),
          autoCreate: true
        };
      },
      inject: [ConfigService]
    }),

    CommonModule,
    EventHubModule,
    ServiceBusModule,
    DataModelModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}
