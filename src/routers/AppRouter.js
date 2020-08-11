import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFoundPage from '../containers/NotFoundPage';

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import Loadable from 'react-loadable';
import Loading from '../components/Loading';
import { ABOUT, HOME, LOGIN, ADDCHEFS,  CHEFSLIST, ADDRECIPIES, RECIPESLIST, USERSLIST} from '../constants/routes';

const AsyncLogin = Loadable( {
  loader: () => import( '../containers/LoginPage' ),
  loading: Loading
} );


const AsyncHome = Loadable( {
  loader: () => import( '../containers/HomePage' ),
  loading: Loading
} );

const AsyncAbout = Loadable( {
  loader: () => import( '../containers/AboutPage' ),
  loading: Loading
} );

const AsyncAddChefs = Loadable( {
  loader: () => import( '../containers/NewChefs' ),
  loading: Loading
} );

const AsyncChefsList = Loadable( {
  loader: () => import( '../containers/ChefsList' ),
  loading: Loading
} );

const AsyncAddRecipes = Loadable( {
  loader: () => import( '../containers/NewRecipes' ),
  loading: Loading
} );
const AsyncRecipesList = Loadable( {
  loader: () => import( '../containers/RecipesList' ),
  loading: Loading
} );
const AsyncUserList = Loadable( {
  loader: () => import( '../containers/UserList' ),
  loading: Loading
} );


const AppRouter = () => {

  return (
    <Switch>
      <PrivateRoute exact={ true } path={ HOME } component={ AsyncHome } />

      <PrivateRoute exact={ true } path={ ADDCHEFS } component={ AsyncAddChefs } />
      <PrivateRoute exact={ true } path={ CHEFSLIST } component={ AsyncChefsList } />

      <PrivateRoute exact={ true } path={ ADDRECIPIES } component={ AsyncAddRecipes} />
      <PrivateRoute exact={ true } path={ RECIPESLIST } component={ AsyncRecipesList} />   
      
      <PrivateRoute exact={ true } path={ USERSLIST } component={ AsyncUserList} /> 
      

      <PublicRoute path={ LOGIN } component={ AsyncLogin } />
      <PublicRoute path={ ABOUT } component={ AsyncAbout } />


      <Route component={ NotFoundPage } />
    </Switch>
  );
};

export default AppRouter;