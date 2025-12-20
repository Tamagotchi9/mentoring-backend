import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';

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
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
