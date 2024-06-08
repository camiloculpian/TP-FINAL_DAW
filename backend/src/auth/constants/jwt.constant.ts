import { ConfigModule } from "@nestjs/config";

ConfigModule.forRoot({
    envFilePath: 'src/config/jwtConstants.env',
  });
  
export const jwtConstants= {
    // secret:'sdfkñlujhsa87654iklhgfas974yt5qaitgaso8i745yalihjgbfsol9i8475yaiugblei444875qe,.m,'
    secret: process.env.SECRET
}