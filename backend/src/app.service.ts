import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'APP V1 created By:\n \tCamilo Culpian. \n \tEmiliano Jara. \n \tNatasha. \n \tGaston';
  }
}
