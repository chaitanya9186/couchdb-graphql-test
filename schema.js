import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString
} from "graphql";

const locationType = new GraphQLObjectType({
    name: "Location",
    description: "A Location",
    fields: () => ({
        id: {
            type: GraphQLString,
            resolve: it => it._id
        },

        full_name: {
            type: GraphQLString,
            description: "The full name of the location"
        },

        short_name: {
            type: GraphQLString,
            description: "The short name of the location"
        },
    })
});

const contactType = new GraphQLObjectType({
    name: "Contact",
    description: "A Contact",
    fields: () => ({
        id: {
            type: GraphQLString,
            resolve: it => it._id
        },

        first_name: {
            type: GraphQLString,
            description: "The first name of the contact"
        },

        last_name: {
            type: GraphQLString,
            description: "The last name of the contact"
        },

        location: {
            type: locationType,
            description: "The main location of the contact",
            resolve: ({location}, _, {rootValue: loaders}) => (
                loaders.locations.load(location)
            )
        },
    })
});

export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "ESDB",
        description: "The root query object",
        fields: () => ({
            contact: {
                type: contactType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (_, {id}, {rootValue: loaders}) => (
                    loaders.contacts.load(id)
                )
            }
        })
    })
});
