
import { Builder, FacetBuilder, GroupBuilder, MatchBuilder, ProjectBuilder, Filter, Comparison, Operator } from 'mongo-simple-aggregation-builder'


// select field_name
// from test
// group by field name, field_type 
// where count = completed_count
// and source in []

import { GroupAggregationBuilder } from "./query_aggregation_helper"

const preparePhase = new ProjectBuilder().includeField("field_name").addField("status", {
  $first: {
    $filter: new Filter('$properties', 'property', new Comparison(Operator.EQ, '$$property.k', 'status'))
  },
})

const groupByField = new GroupAggregationBuilder({ field_name: '$field_name', field_type: '$field_type' })
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

  const query = new Builder()
    .match(filterBySource)
    .project(preparePhase)
    .group(groupByField)
    .project(transformFields)
    .facet(splitResult)

  return query;
}

