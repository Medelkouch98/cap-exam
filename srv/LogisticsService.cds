using { exam.logistics as my } from '../db/schema.cds';

@path : '/logistics'
service LogisticsService
{
    @cds.redirection.target
    @odata.draft.enabled
    entity Shipments as
        projection on my.Shipments;

    @cds.redirection.target
    @readonly
    entity Packages as
        projection on my.Packages;
}

annotate LogisticsService with @requires :
[
    'authenticated-user'
];