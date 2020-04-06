import { Icon, Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogoutButton from './LogoutButton';
import '../styles/navigation.css';
import {ABOUT, ADDCHEFS, EDITCHEFS, CHEFSLIST } from '../constants/routes';

const SubMenu = Menu.SubMenu;

class Navigation extends React.Component {
  rootSubmenuKeys = [ 'sub1', 'sub2' ];

  state = {
    current: 'home',
    collapsed: false,
    openKeys: []
  };

  onOpenChange = ( openKeys ) => {
    const latestOpenKey = openKeys.find( key => this.state.openKeys.indexOf( key ) === -1 );
    if( this.rootSubmenuKeys.indexOf( latestOpenKey ) === -1 ) {
      this.setState( { openKeys } );
    } else {
      this.setState( {
        openKeys: latestOpenKey
          ? [ latestOpenKey ]
          : []
      } );
    }
  };

  handleClick = ( e ) => {
    console.log( 'click ', e );
    this.setState( {
      current: e.key
    } );
  };

  render() {
    return (
      this.props.isAuthenticated
        ?
        <Menu
          onClick={ this.handleClick }
          openKeys={ this.state.openKeys }
          mode='inline'
          theme='light'
          inlineCollapsed={ this.state.collapsed }
          onOpenChange={ this.onOpenChange }
          className='menu'
        >
          <Menu.Item key='home'>
            <Link to='/'><Icon type='home' /> <span>Home</span></Link>
          </Menu.Item>

          <SubMenu key='sub1' title={ <span><Icon type='mail' /><span>Gestion Usuarios</span></span> }>
            <Menu.Item key='2'>
              <Link to={ ADDCHEFS }>Registrar Chefs</Link></Menu.Item>
            <Menu.Item key='3'>
              <Link to={ EDITCHEFS }>Editar Chefs</Link></Menu.Item>
            <Menu.Item key='4'>
            <Link to={ CHEFSLIST }>Ver lista de Chefs</Link></Menu.Item>
          </SubMenu>

          <SubMenu key='sub2' title={ <span><Icon type='appstore' /><span>Administracion de Recetas</span></span> }>
            <Menu.Item key='5'>Crear nuevas Recetas</Menu.Item>
            <Menu.Item key='6'>Lista de Recetas</Menu.Item>
            <SubMenu key='sub3' title='Submenu'>
              <Menu.Item key='7'>Option 7</Menu.Item>
              <Menu.Item key='8'>Option 8</Menu.Item>
            </SubMenu>
          </SubMenu>

          <Menu.Item key='about'>
            <span><Icon type='question-circle' /><span><Link to={ ABOUT }>Acerca de...</Link></span></span>
          </Menu.Item>

          <Menu.Item key='logout'>
            <LogoutButton />
          </Menu.Item>
        </Menu>
        : null
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: !!state.auth.uid
});

export default connect( mapStateToProps )( Navigation );