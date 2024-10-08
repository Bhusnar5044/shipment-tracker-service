import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import ShipmentRoute from '@routes/shipment.route';
import validateEnv from '@utils/validateEnv';
import CustomerRoute from './routes/customer.route';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new CustomerRoute(), new AuthRoute(), new ShipmentRoute()]);

app.listen();
