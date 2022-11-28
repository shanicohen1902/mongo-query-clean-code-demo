export class GroupAggregationBuilder {

    constructor(id:any){
        this['_id'] = id
    }

    addField(field:string, accumulator:any){
        this['totalCount'] = accumulator
        return this
    }

}


export function groupByKey(id: any) {
    return {
        $group: {
            _id: id,
            totalCount: { $sum: 1 },
            completedCount: { $sum: { $cond: [{ $ne: ['$status.v', 'completed'] }, 1, 0] } },
        }
    }
}

function main(){
    const builder = new GroupAggregationBuilder({ field_name: '$field_name', field_type: '$field_type' })
    .addField("totalCount", { $sum: 1 })
    console.log(JSON.stringify(builder, null, 2))
}

main()