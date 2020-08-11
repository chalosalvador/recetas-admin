
import { db } from './index'
import { refi } from './index' 

const viewIngredients=(querySnapshot, table)=>{
    return querySnapshot.forEach((doc) => {
      
        const{name}= doc.data();
        table.push({
            key: doc.id,
            name
        });
    });     
};
const addIngredient= (ingredientData) => {
    return db.collection("ingredients").add(ingredientData);
};


const Ingredients = {
    viewIngredients,
    addIngredient
};

export default Ingredients;