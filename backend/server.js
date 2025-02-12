const dotenv = require('dotenv');
const app = require("./app");

const { default: mongoose } = require('mongoose');
const dbConfig = require("./config/dbConfig");
const DataSetModel = require("./db/models/dataSet");

dotenv.config();

const PORT = process.env.PORT || 5555;

try {
    app.listen(PORT, async () => {
        console.log("Connection to DB...");
        await mongoose.connect(dbConfig.url, dbConfig.options);
        console.log("Connected to DB!")
    
        let dataSets = await DataSetModel.find();
        if(!dataSets || dataSets?.length < 1) {
            console.log("Creating default DataSets...");
            dataSets = [{
                name: "DataSet_0",
                description: "This is the default data set."
            }];
            dataSets.forEach(async (dataSet) => {
                const newDataSet = new DataSetModel(dataSet)
                await newDataSet.save();
            });
        }
    
        console.log(`Server is running on port ${PORT}...`);
    });
} catch (error) {
    console.log(error);
}