import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<h3>APP V1 - DAW</h3> <p>Created By:</p><p>&emsp;Camilo Culpian.<br>&emsp;Emiliano Jara.<br>&emsp;Natasha Szmagalski Koroll.<br>&emsp;Gaston</p>';
  }
}
