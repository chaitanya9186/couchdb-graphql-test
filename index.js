import DataLoader from "dataloader";
import Nano from "nano"; // CouchDB

const couch = Nano("http://localhost:5984");
const esdb = couch.use("esdb");

const batchGetContacts = (keys =>
    new Promise((resolve, reject) => {
        console.log("REQ:", keys);
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

function createLoaders() {
    return {
        contacts: new DataLoader(ids => batchGetContacts(ids)),
        locations: new DataLoader(ids => batchGetLocations(ids)),
    };
}

const loaders = createLoaders();

const promise1 = loaders.contacts.load("contact-981");
const promise2 = loaders.contacts.load("contact-978");
const promise3 = loaders.contacts.load("contact-981");

Promise.all([promise1, promise2, promise3]).then(([contact1, contact2, contact3]) => {
    console.log("ALL RESOLVED");
    console.log(`* ${contact1.first_name} ${contact1.last_name}`);
    console.log(`* ${contact2.first_name} ${contact2.last_name}`);
    console.log(`* ${contact3.first_name} ${contact3.last_name}`);
});
