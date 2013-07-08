"use strict";

DXWorkout.createSetViewModel = function(allSets) {
    var weight = ko.observable(),
        reps = ko.observable();

    function fromJS(obj) {
        weight(obj.weight);
        reps(obj.reps);
    }

    function toJS() {
        return {
            weight: weight(),
            reps: reps()
        };
    }

    function getLastSet() {
        var unwrappedSets = allSets();
        return unwrappedSets[unwrappedSets.length - 1];
    }

    function canCopy() {
        return this === getLastSet();
    }        

    function handleCopy() {
        var clonedSet = DXWorkout.createSetViewModel(allSets),
            clonedData = $.extend({ }, getLastSet().toJS());

        clonedSet.fromJS(clonedData);
        allSets.push(clonedSet);
    }

    function canDelete() {
        return allSets().length > 1;
    }

    function handleDelete() {
        var context = ko.contextFor(event.target || event.srcElement);
        var index = context.$index();


        if(allSets().length <= 1)
            throw Error("number of sets must be greater than zero");

        allSets.splice(index, 1);
    }        


    return {
        weight: weight,
        reps: reps,
        weightUnit: ko.observable(DXWorkout.settings["weightUnit"]),

        handleDelete: handleDelete,
        handleCopy: handleCopy,
        canDelete: canDelete,
        canCopy: canCopy,

        toJS: toJS,
        fromJS: fromJS
    }
};