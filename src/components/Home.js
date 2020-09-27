import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Button, Icon, Carousel, Typography, List, Avatar, Progress, Card, Row, Col, Space} from 'antd';
import '../styles/home.css'
import { refRecipes, createAt } from '../firebase/index';
import Recipes from '../firebase/recipes';
import welcome from '../imgs/admin.jpg';
import fat from  '../imgs/grasas.png';
import carbs from '../imgs/carbs.png';
import protein from '../imgs/proteina.jpg';

const DescriptionRecipe = ({ name, description }) => (
  <div className="site-description-item-profile-wrapper">
  <Card  type="inner" bordered={true}>
  
  <p>{"Receta: "+name}</p>
  <p>{"Descripcion: "+description}</p>
  </Card>
  </div>
);

const { Title } = Typography;
const { Meta } = Card;

class Home extends Component {

  initialState = {

    chef: '',
    recipes: {},

  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.listR = null;
  }
  /*
  onCollection=(querySnapshot)=>{
    
    refRecipes.onSnapshot((querySnapshot)=>{
      const recipes= [];
      querySnapshot.forEach((doc) => {
        const {chef, description, servings, time, name, nutritionFacts, category } = doc.data();
        recipes.push({
          key: doc.id,
          doc,
          chef, 
          description, 
          servings, 
          time, 
          name, 
          nutritionFacts, 
          category
        });
      });
      this.setState({
        recipes
      });
    });
  }*/

  searchRecipes = (querySnapshot) => {
    const recipes = [];
    Recipes.onView(querySnapshot, recipes)
    this.setState({
      recipes
    });

  }
  componentDidMount() {
    this.listR = refRecipes.where("description", "==", "Postre").onSnapshot(this.searchRecipes)
  }



  render() {
    const { titleHome } = this.props;

    const data = [
      {
        title: this.state.recipes.name,

      },
    ];
    return (

      <React.Fragment>

        <Title level={2}>{titleHome}</Title>
        {console.log("Receta consultadas", this.state.recipes)}

        <Row gutter={{ xs: 16, sm: 24, md: 32, lg: 32 }}>
          <Col className="gutter-row" span={13}>
            <div >
              <Card
                //style={{ width: 425 }}
                title="Sabias Que?"
                type="inner"
              >
                <Meta
                  description="Seguna la OMS(Organizacion Mundial de La Salud) ha determinado que la proporción de Carbohidratos, Proteínas y rasas para un estado de salud óptimo es de 55%, 15%, 30% respectivamente "
                />
                <br />
                <Progress type="circle" percent={55} />
                <Progress type="circle" percent={15} />
                <Progress type="circle" percent={30} />
              </Card>
            </div>
          </Col>
          <Col className="gutter-row" span={11}>
            <div >
              <Carousel autoplay >
                <div>
                <img src={carbs} alt="carbs" />
                </div>
                <div>
                <img src={fat} alt="fat" />
                </div>
                <div>
                <img src={protein} alt="protein" />
                </div>
              </Carousel>
            </div>
          </Col>

        </Row>       

      </React.Fragment>
    );
  }
}

export default compose(withRouter)(Home);