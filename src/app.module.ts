import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtGuard } from './auth/jwt.guard';
import { APP_GUARD } from '@nestjs/core';

import jwtConfig from './config/jwt';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://voloshko999_db_user:ztXYtnYM600@cluster0.lkvycwd.mongodb.net/notes-app?appName=Cluster0',
      {
        ssl: true,
        tlsAllowInvalidCertificates: false,
      },
    ),
    ConfigModule.forRoot({
      load: [jwtConfig],
      isGlobal: true,
    }),
    NotesModule,
    CategoriesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    }
  ],
})
export class AppModule {}
