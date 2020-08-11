import { Icon, Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogoutButton from './LogoutButton';
import '../styles/navigation.css';
import {ABOUT, ADDCHEFS, CHEFSLIST, ADDRECIPIES, RECIPESLIST, USERSLIST } from '../constants/routes';

import {HomeOutlined, SolutionOutlined, SnippetsOutlined} from '@ant-design/icons';

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
            <Link to='/'><HomeOutlined /> <span>Home</span></Link>
          </Menu.Item>

          <SubMenu key='sub1' title={ <span><SolutionOutlined /><span>Gestion Usuarios</span></span> }>
            <Menu.Item key='2'><Link to={ ADDCHEFS }>Registrar Chefs</Link></Menu.Item>
            <Menu.Item key='3'> <Link to={ CHEFSLIST }>Lista de Chefs</Link></Menu.Item>
            <Menu.Item key='4'><Link to={ USERSLIST }>Usuarios App</Link></Menu.Item>
            </SubMenu>

          <SubMenu key='sub2' title={ <span><SnippetsOutlined /><span>Gestion Recetas</span></span> }>
            <Menu.Item key='6'><Link to={ ADDRECIPIES }>Registrar Recetas</Link></Menu.Item>
            <Menu.Item key='7'><Link to={ RECIPESLIST }>Lista de Recetas</Link></Menu.Item>
            
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