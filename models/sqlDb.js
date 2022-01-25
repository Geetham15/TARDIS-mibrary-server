import { Connection, TYPES } from "tedious";

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "azureuser",
      password: "2cPTuC!kd9WmRMR",
    },
    type: "default",
  },
  server: "mibraryserver.database.windows.net",
  options: {
    database: "mibraryserver",
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
