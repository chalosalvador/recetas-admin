import React, { Component } from 'react';
import '../styles/home.css'
import {Carousel}  from 'antd';

const HomePage = props => (


    <Carousel autoplay>
        <div>
            <img src="../imgs/logo.png" alt="imagen1"/>
        </div>
        <div>
            <h3>2</h3>
        </div>
        <div>
            <h3>3</h3>
        </div>
        <div>
            <h3>4</h3>
        </div>
    </Carousel>
);









export default HomePage;