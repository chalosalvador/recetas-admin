
import {db} from './index'
import { setState } from 'expect/build/jestMatchersObject';

const add= (recipesData) => {
    return db.collection("recipes").add(recipesData);
};

const onDelete =(id)=>{
    return db.collection('recipes').doc(id).delete();
};

const onView=(querySnapshot, boards)=>{
    return querySnapshot.forEach((doc) => {
      
        const{chef,description, servings, time,name, calories, category, protein, fat,ingredients,steps }= doc.data();
        boards.push({
            key: doc.id,
            doc,
            name,
            chef,
            description, 
            category,
            servings, 
            time,
            calories,
            protein,
            fat,
            ingredients,
            steps
        });
    }); 
}
const onUpdate = (id, recipesData) => {

    return db.collection('recipes').doc(id).set(
        recipesData
    )
}
const viewChefs=(querySnapshot, boards)=>{
    return querySnapshot.forEach((doc) => {
      
        const{name, lastname}= doc.data();
        boards.push({
            key: doc.id,
            name,
            lastname
        });
    });     
};
const viewIngredients=(querySnapshot, boards)=>{
    return querySnapshot.forEach((doc) => {
      
        const{name}= doc.data();
        boards.push({
            key: doc.id,
            name
        });
    });     
};

const viewUnits=(querySnapshot, boards)=>{
    return querySnapshot.forEach((doc) => {
      
        const{name}= doc.data();
        boards.push({
            key: doc.id,
            name
        });
    });     
};


const chefName=()=>{
    
}
const Recipes = {
    add,
    onDelete,
    onUpdate,
    viewChefs,
    viewIngredients,
    viewUnits,
    onView
    
};

export default Recipes;