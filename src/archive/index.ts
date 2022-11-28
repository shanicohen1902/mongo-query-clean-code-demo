import { Builder, FacetBuilder, GroupBuilder, MatchBuilder, ProjectBuilder } from 'mongo-simple-aggregation-builder'

const matchStage = new MatchBuilder().match('field_name', 'value');
const projectStage = new ProjectBuilder().includeField('field_name').addField('calculated_field', '$another_field');
const groupStage = new GroupBuilder('id').count('total').sum('aggregated_field', 'aggregated_val');
const facetStage = new FacetBuilder().addFacet(
  'summary',
  new Builder()
      .group(new GroupBuilder(0).count('totalCount').sum('completedCount', 'value'))
      .unset(['_id'])
      .build(),
);

const pipeline = new Builder()
    .match(matchStage)
    .project(projectStage)
    .group(groupStage)
    .facet(facetStage)
    .build();
    
//console.log(JSON.stringify(pipeline, null, 4));


async function main() {


    console.log("main")
    
}

//main().catch(console.error);

//export * from './query_aggregation_helper'
//export * from './query_aggregation_simple'
//export * from './query_aggregation_simple_slicing'
//export * from './query_aggregation_source_slicing'
//export * from './query_aggregation_helper';
