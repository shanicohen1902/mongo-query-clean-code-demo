

export const {MongoClient} = require('mongodb');

async function init() {
    const uri = "mongodb://localhost:27017/catalog";    
    const client = new MongoClient(uri);

    console.log("init")
    try {
        const connection = await client.connect();

        const connect = await client.db("local");

       const test =  await connect.collection("test");
       const file = {
        "field_name": "store_owner",
        "field_type": "string",
        "source": "stores",
        "owner": "shani",
        "properties": [
          {
            "k": "status",
            "v": "ready"
          },
          {
            "k": "last_update_date",
            "v": "2014-05-09"
          }
        ]
      }

       const result = await test.insertOne(file);
       console.log(result);

       const venusFlytrap = await test.findOne({ field_name: "store_owner" });
       console.log("venusFlytrap", venusFlytrap);




     
    }  catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

}

init().catch(console.error);
