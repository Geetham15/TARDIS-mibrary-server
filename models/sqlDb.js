import { Connection, TYPES } from "tedious";

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "azureuser", // update me
      password: "2cPTuC!kd9WmRMR", // update me
    },
    type: "default",
  },
  server: "mibraryserver.database.windows.net", // update me
  options: {
    database: "mibraryserver", //update me
    encrypt: true,
    rowCollectionOnRequestCompletion: true,
  },
};

const connection = new Connection(config);
connection.on("connect", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("connected to SQL database");
  }
});
connection.connect();
export default connection;
