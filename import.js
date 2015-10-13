import esnet from "./data/esnet.json";
import _ from "underscore";
import Nano from "nano";

const nano = Nano("http://localhost:5984");
console.log("Start");

function buildLocation(location) {
    const locationResult = {
        _id: `location-${location.id}`,
        type: "location"
    };

    locationResult.id = location.id;
    locationResult.short_name = location.short_name;
    locationResult.full_name = location.full_name;
    locationResult.latitude = location.latitude;
    locationResult.longitude = location.longitude;

    return locationResult;
}

function buildContact(contact) {
    const contactResult = {
        _id: `contact-${contact.id}`,
        type: "contact"
    };

    contactResult.contact_type = contact.contact_type;
    if (contactResult.contact_type === "Human") {
        contactResult.first_name = contact.first_name;
        contactResult.last_name = contact.last_name;
    } else {
        contactResult.name = contact.role_contact_name;
    }
    if (contact.title) {
        contactResult.title = contact.title;
    }

    if (contact.availability) {
        contactResult.availability = contact.availability;
    }

    if (contact.best_availability) {
        contactResult.best_availability = contact.best_availability;
    }

    if (contact.supervisor) {
        contactResult.supervisor = contact.supervisor;
    }

    if (contact.email_addresses.length > 0) {
        contactResult.email_addresses =
            _.map(contact.email_addresses, (emailAddress) => {
                return {
                    type: emailAddress.email_type.name,
                    email: emailAddress.email
                };
            });
    }

    if (contact.location) {
        contactResult.location = `location-${contact.location.id}`;
    }

    console.log(contactResult);
    return contactResult;
}

const esdb = nano.db.use("esdb", (err) => {
    console.log("[esdb:use", err);
});

// Extract the contacts
_.each(esnet.contacts, ({contact}) => {
    esdb.insert(buildContact(contact), err => {
        if (err) {
            console.error("[contact.insert] ", err.message);
            return;
        }
        console.log("Inserted contact: ", contact.id);
    });
});

// Extract the locations
const locations = {};

_.each(esnet.contacts, ({contact}) => {
    const location = contact.location;
    locations[location.id] = buildLocation(location);
});

_.each(locations, (location) => {
    console.log(locations);
    esdb.insert(location, err => {
        if (err) {
            console.error("[location.insert] ", err.message);
            return;
        }
        console.log("Inserted location: ", location._id);
    });
});
