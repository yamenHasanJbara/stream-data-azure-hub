import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonModule } from './common/common.module';

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
    CommonModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}
