import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
//import { ProductModule } from './products/products.module'; umpb ulru ygrn vkvf
import { Products } from './typeorm/products.entity';
import { Orders } from './typeorm/orders.entity';
import { ProductsModule } from './products/products.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { OrdersModule } from './orders/orders.module';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport:{
        host: process.env.SMTP_EMAIL_HOST,
        auth: {
          user: process.env.SYSTEM_EMAIL_ADDR,
          pass: process.env.SYSTEM_EMAIL_APP_PASS
        },
      },
      template: {
        dir: __dirname + '/../templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        },
      },
    })
    ,
    TypeOrmModule.forRootAsync({
      imports: [ ConfigModule ],
      useFactory: (config: ConfigService)=>({
        type: 'mysql',
        host: config.get('HOST'),
        username: config.get('DB_USERNAME'),
        password: config.get('PASSWORD'),
        port: config.get('PORT'),
        database: config.get('DB_NAME'),
        entities: [Products,Orders],
        synchronize: true
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    OrdersModule,
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
