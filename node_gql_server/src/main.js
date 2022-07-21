var express = require('express');
var {graphqlHTTP} = require('express-graphql');
var {buildSchema} = require('graphql');

var schema = buildSchema(`
    type SteerPoint {
        lat: Float!
        long: Float!
        height(reference: heightReferenceType!, unit: heightUnitType!): Float
    }

    type Query{
        getHeight(reference: heightReferenceType!, unit: heightUnitType!): Float
        getSteerPoint: SteerPoint
    }

    enum heightReferenceType{
        MSL,
        ELLIPSOID,
        GEOID,
        GROUND
    }
    enum heightUnitType{
        FEET,
        METER
    }
`);

class SteerPoint{
    constructor(){
        this.lat = 32.0;
        this.long = 34.0;
    }
    height({reference, unit}){
        return unit_converter(50, unit);
    }
}

var unit_converter = (value, to_unit) => {
    console.log(to_unit);
    if (to_unit == "FEET"){
        value *= 3.28084;
    }
    return value;
}

var root = {
    getHeight: (obj, args, context, info) => {
        return unit_converter(100, obj.unit);
    },
    getSteerPoint: (obj, args, context, info) => {
        return new SteerPoint;
    }
}

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000);
console.log('running')