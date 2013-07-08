"use strict";

DXWorkout.createExerciseViewModel = function() {
    var name = ko.observable(""),
        equipment = ko.observable(""),
        sets = ko.observableArray();

    function setViewModelFromData(data) {
        var vm = DXWorkout.createSetViewModel(sets);
        vm.fromJS(data);
        return vm;            
    }

    function fromJS(data) {
        name(data.name);
        equipment(data.equipment);
        sets($.map(data.sets, setViewModelFromData));
    }

    function toJS() {
        return {
            name: name(),
            equipment: equipment(),
            sets: $.map(sets(), function(item) { return item.toJS() })
        };
    }

    return {
        name: name,
        equipment: equipment,
        sets: sets,
        exercisesTypes: DXWorkout.settings["exercise"],
        equipmentTypes: DXWorkout.settings["equipment"],

        toJS: toJS,
        fromJS: fromJS
    };
};