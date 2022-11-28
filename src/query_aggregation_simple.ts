const { MongoClient } = require('mongodb');

async function query_aggregation() {
  const uri = "mongodb://localhost:27017/catalog";
  const client = new MongoClient(uri);

  try {
    const connection = await client.connect();

    const connect = await client.db("local");

    const test = await connect.collection("test");

    const query = getQuery(['stores'])

    const aggCursor = test.aggregate(query);
    for await (const doc of aggCursor) {
      console.log(JSON.stringify(doc, null, 2));
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }

}


export function getQuery(sources: string[]) {
  return [
    { $match: { source: { $in: sources } } },
    {
      $project: {
        field_name: 1,
        status: {
          $first: {
            $filter: { input: '$properties', as: 'property', cond: { $eq: ['$$property.k', 'status'] } },
          },
        },
        field_owner: 1,
        field_type: 1,
      },
    },
    {
      $group: {
        _id: { field_name: '$field_name', field_type: '$field_type' },
        totalCount: { $sum: 1 },
        completedCount: { $sum: { $cond: [{ $ne: ['$status.v', 'completed'] }, 1, 0] } },
      },
    },
    {
      $project: {
        completedCount: 1,
        totalCount: 1,
        _id: 0,
        attributeName: '$_id.field_name',
        attributeType: '$_id.field_type',
      },
    },
    {
      $facet: {
        status: [
          {
            $group: {
              _id: 0,
              totalCount: { $sum: 1 },
              completedCount: { $sum: 1 },
            },
          },
          { $unset: ['_id'] },
        ],
        statusPerField: [],
      },
    },
  ];
}

query_aggregation().catch(console.error);