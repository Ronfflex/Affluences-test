import * as express from 'express';
import { ExpressController, RoomController } from './controllers';

const app = express();
const port = 3000;

const controllers: ExpressController[] = [
    new RoomController()
  ];
  for (let controller of controllers) {
    const router = controller.buildRoutes();
    app.use(controller.path, router);
  }

app.listen(port, () => {
    console.log('App listening on port 3000!');
    }
);