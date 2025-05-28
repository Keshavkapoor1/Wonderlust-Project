const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
main().then((res)=>{
    console.log("working")
})
.catch((err)=>{
    console.log(err);
});


const inidb=async()=>{
    console.log(initdata.data); // Check for missing fields
    try {
        await listing.deleteMany({});
       initdata.data= initdata.data.map((obj)=>({
          ...obj,owner:'6831b85770046ae0cf764399'
        }));
        await listing.insertMany(initdata.data);
        console.log("Data successfully inserted!");
      } catch (err) {
        console.log("Error inserting data:", err);
      }
    }



    main().then(() => {
        inidb();
      });

