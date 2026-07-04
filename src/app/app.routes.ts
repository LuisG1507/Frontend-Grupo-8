import { Routes } from '@angular/router';
import { User } from './components/user/user';
import { MenuComponent } from './components/menu-component/menu-component';
import { ComponentList } from './components/user/component-list/component-list';
import { UserRegister } from './components/user/user-register/user-register';
import { UserUpdate } from './components/user/user-update/user-update';
import { Role } from './components/role/role';
import { RoleList } from './components/role/role-list/role-list';
import { RoleRegister } from './components/role/role-register/role-register';
import { RoleUpdate } from './components/role/role-update/role-update';
import { Background } from './components/background/background';
import { BackgroundList } from './components/background/background-list/background-list';
import { BackgroundRegister } from './components/background/background-register/background-register';
import { BackgroundUpdate } from './components/background/background-update/background-update';
import { Estate } from './components/estate/estate';
import { EstateList } from './components/estate/estate-list/estate-list';
import { EstateMap } from './components/estate/estate-map/estate-map';
import { EstateRegister } from './components/estate/estate-register/estate-register';
import { EstateUpdate } from './components/estate/estate-update/estate-update';
import { Contract } from './components/contract/contract';
import { ContractList } from './components/contract/contract-list/contract-list';
import { ContractRegister } from './components/contract/contract-register/contract-register';
import { ContractUpdate } from './components/contract/contract-update/contract-update';
import { Favorite } from './components/favorite/favorite';
import { FavoriteList } from './components/favorite/favorite-list/favorite-list';
import { FavoriteRegister } from './components/favorite/favorite-register/favorite-register';
import { FavoriteUpdate } from './components/favorite/favorite-update/favorite-update';
import { Review } from './components/review/review';
import { ReviewList } from './components/review/review-list/review-list';
import { ReviewRegister } from './components/review/review-register/review-register';
import { ReviewUpdate } from './components/review/review-update/review-update';
import { RiskReport } from './components/risk-report/risk-report';
import { RiskReportList } from './components/risk-report/risk-report-list/risk-report-list';
import { RiskReportRegister } from './components/risk-report/risk-report-register/risk-report-register';
import { RiskReportUpdate } from './components/risk-report/risk-report-update/risk-report-update';
import { Model3d } from './components/model3d/model3d';
import { Model3dList } from './components/model3d/model3d-list/model3d-list';
import { Model3dRegister } from './components/model3d/model3d-register/model3d-register';
import { Model3dUpdate } from './components/model3d/model3d-update/model3d-update';
import { Model3dView } from './components/model3d/model3d-view/model3d-view';
import { Authenticate } from './components/authenticate/authenticate';
import { seguridadGuard } from './guard/seguridad-guard';
import { Reportes } from './components/reports/reports';

export const routes: Routes = [
  {
    path: 'login',
    component: Authenticate,
  },
  {
    path: '',
    component: MenuComponent,
    canActivate: [seguridadGuard],
  },
  {
    path: 'register',
    component: UserRegister,
  },
  {
    path: 'reports',
    component: Reportes,
    canActivate: [seguridadGuard],
  },
  {
    path: 'users',
    component: User,
    canActivate: [seguridadGuard],
    canActivateChild: [seguridadGuard],
    children: [
      { path: 'list', component: ComponentList },
      { path: 'register', component: UserRegister },
      { path: 'edit/:id', component: UserUpdate },
    ],
  },
  {
    path: 'roles',
    component: Role,
    canActivate: [seguridadGuard],
    canActivateChild: [seguridadGuard],
    children: [
      { path: 'list', component: RoleList },
      { path: 'register', component: RoleRegister },
      { path: 'edit/:id', component: RoleUpdate },
    ],
  },
  {
    path: 'backgrounds',
    component: Background,
    canActivate: [seguridadGuard],
    canActivateChild: [seguridadGuard],
    children: [
      { path: 'list', component: BackgroundList },
      { path: 'register', component: BackgroundRegister },
      { path: 'edit/:id', component: BackgroundUpdate },
    ],
  },
  {
    path: 'estates',
    component: Estate,
    canActivate: [seguridadGuard],
    canActivateChild: [seguridadGuard],
    children: [
      { path: 'list', component: EstateList },
      // Vista geografica de los inmuebles registrados.
      { path: 'map', component: EstateMap },
      { path: 'register', component: EstateRegister },
      { path: 'edit/:id', component: EstateUpdate },
    ],
  },
  {
    path: 'contracts',
    component: Contract,
    canActivate: [seguridadGuard],
    canActivateChild: [seguridadGuard],
    children: [
      { path: 'list', component: ContractList },
      { path: 'register', component: ContractRegister },
      { path: 'edit/:id', component: ContractUpdate },
    ],
  },
  {
    path: 'favorites',
    component: Favorite,
    canActivate: [seguridadGuard],
    canActivateChild: [seguridadGuard],
    children: [
      { path: 'list', component: FavoriteList },
      { path: 'register', component: FavoriteRegister },
      { path: 'edit/:id', component: FavoriteUpdate },
    ],
  },
  {
    path: 'reviews',
    component: Review,
    canActivate: [seguridadGuard],
    canActivateChild: [seguridadGuard],
    children: [
      { path: 'list', component: ReviewList },
      { path: 'register', component: ReviewRegister },
      { path: 'edit/:id', component: ReviewUpdate },
    ],
  },
  {
    path: 'risk-reports',
    component: RiskReport,
    canActivate: [seguridadGuard],
    canActivateChild: [seguridadGuard],
    children: [
      { path: 'list', component: RiskReportList },
      { path: 'register', component: RiskReportRegister },
      { path: 'edit/:id', component: RiskReportUpdate },
    ],
  },
  {
    path: 'models3d',
    component: Model3d,
    canActivate: [seguridadGuard],
    canActivateChild: [seguridadGuard],
    children: [
      { path: 'list', component: Model3dList },
      // El ID permite recuperar la URL del GLB que mostrara model-viewer.
      { path: 'view/:id', component: Model3dView },
      { path: 'register', component: Model3dRegister },
      { path: 'edit/:id', component: Model3dUpdate },
    ],
  },
];
