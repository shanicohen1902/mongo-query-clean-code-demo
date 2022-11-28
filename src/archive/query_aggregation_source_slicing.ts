

// select field_name
// from test
// group by field name, field_type 
// where count = completed_count
// and source in []

  const preparePhase = {
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
  }
  const groupByField = {
    $group: {
      _id: { field_name: '$field_name', field_type: '$field_type' },
      totalCount: { $sum: 1 },
      completedCount: { $sum: { $cond: [{ $ne: ['$status.v', 'completed'] }, 1, 0] } },
    },
  }
  const transformFields = {
    $project: {
      completedCount: 1,
      totalCount: 1,
      _id: 0,
      attributeName: '$_id.field_name',
      attributeType: '$_id.field_type',
    }
  }

  const splitResult = {
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
  }
  
export function groupBySource(sources: string[]) {
  const filterBySource = { $match: { source: { $in: sources } } }

  return [
    filterBySource,
    preparePhase,
    groupByField,
    transformFields,
    splitResult,
  ];
}

