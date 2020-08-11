
import { db, time } from './index'
import { refUser } from './index'
import { setState } from 'expect/build/jestMatchersObject';



const onView = (querySnapshot, ListU) => {
    return querySnapshot.forEach((doc) => {
        //console.log("QUERY USER",doc.data());
        const { name, lastname, nickname, weight, gender, dateBirth, healthInfo, height, dailyActivities } = doc.data();
        ListU.push({
            key: doc.id,
            doc,
            name,
            lastname,
            nickname,
            dateBirth,
            height,
            weight,
            gender,
            healthInfo,
            dailyActivities
        });
    });
};
const viewSubCollection=(querySnapshot, listSubColl,id)=>{
    return db.collection('users').doc(id).collection('plan').get().then(querySnapshot=>{
        querySnapshot.forEach((doc)=>{
            const { endTime, startTime, title, date, allday}= doc.data();
            listSubColl.push({
                key: doc.id,
                date
            });
        });
    });
};



const onDelete = (id) => {
    return db.collection('users').doc(id).delete();
};


const Users = {
    onView,
    viewSubCollection
};

export default Users;