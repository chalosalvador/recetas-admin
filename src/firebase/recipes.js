
import {db} from './index'
import { setState } from 'expect/build/jestMatchersObject';


const add= (recipesData) => {
    return db.collection("recipes").add(recipesData);
};

const onDelete =(id)=>{
    return db.collection('recipes').doc(id).delete();
};

const onView=(querySnapshot, listR)=>{
    return querySnapshot.forEach((doc) => {
      
        const{chef, description, servings, time, name, nutritionFacts, category, ingredients, steps }= doc.data();
        listR.push({
            key: doc.id,
            doc,
            name,
            //chef: ListChef[chef.id].name+ " "+ListChef[chef.id].lastname,
            chef,
            description, 
            category,
            servings, 
            time,
            nutritionFacts,
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
const viewChefs=(querySnapshot, LChefs)=>{
    return querySnapshot.forEach((doc) => {
      
        const{name, lastname}= doc.data();
        LChefs.push({
            key: doc.id,
            name,
            lastname
        });
    });     
};
const viewIngredients=(querySnapshot, LIngredients)=>{
    return querySnapshot.forEach((doc) => {
      
        const{name}= doc.data();
        LIngredients.push({
            key: doc.id,
            name
        });
    });     
};

const viewUnits=(querySnapshot, LUnits)=>{
    return querySnapshot.forEach((doc) => {
      
        const{name}= doc.data();
        LUnits.push({
            key: doc.id,
            name
        });
    });     
};


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