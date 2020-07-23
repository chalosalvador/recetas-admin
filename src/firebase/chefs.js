
import { db, time } from './index'
import { ref } from './index'
import { setState } from 'expect/build/jestMatchersObject';

const add = (chefData) => {
    return db.collection("chefs").add(chefData)
};

const view = (querySnapshot, LChefs) => {
    return querySnapshot.forEach((doc) => {

        const { name, lastname, speciality, experience, job, nationality,createAt } = doc.data();
        LChefs.push({
            key: doc.id,
            doc,
            name,
            lastname,
            speciality,
            experience,
            job,
            nationality,
            createAt
        });
    });
};

const onDelete = (id) => {
    return db.collection('chefs').doc(id).delete();
};

const onUpdate = (id, chefData) => {

    return db.collection('chefs').doc(id).set(
        chefData
    )
}


const Chefs = {
    add,
    view,
    onUpdate,
    onDelete
};

export default Chefs;
/*name: this.state.name,
        lastname: this.state.lastname,
        speciality: this.state.speciality,
        experience: this.state.experience,
        job: this.state.job,
        nationality: this.state.nationality */