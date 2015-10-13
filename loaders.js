import DataLoader from "dataloader";
import Nano from "nano";

const couch = Nano("http://localhost:5984");
const esdb = couch.use("esdb");

const batchGetContacts = (keys =>
    new Promise((resolve, reject) => {
        esdb.view("esdb", "contacts", { keys: keys }, (err, docs) => {
            if (err) {
                return reject(err);
            }
            resolve(docs.rows.map(row => {
                const contact = row.value;
                return row.error ? new Error(row.error) : contact;
            }));
        });
    }
));

const batchGetLocations = (keys =>
    new Promise((resolve, reject) => {
        esdb.view("esdb", "locations", { keys: keys }, (err, docs) => {
            if (err) {
                return reject(err);
            }
            resolve(docs.rows.map(row => {
                const location = row.value;
                return row.error ? new Error(row.error) : location;
            }));
        });
    }
));

export default {
    contacts: new DataLoader(ids => batchGetContacts(ids)),
    locations: new DataLoader(ids => batchGetLocations(ids)),
};
