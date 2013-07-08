"use strict";

DXWorkout.createExerciseGroupViewModel = function(allGroups) {
    var PATTERNS = [
            { name: "Standard set", count: 1 },
            { name: "Superset / Compound set", count: 2 },
            { name: "Giant set", count: 3 }
        ],
        pattern,
        restInterval = ko.observable(60),
        exercises = ko.observableArray();

    function exerciseViewModelFromData(data) {
        var vm = DXWorkout.createExerciseViewModel();
        vm.fromJS(data);
        return vm;
    }

    function fromJS(data) {
        restInterval(data.restInterval);
        exercises($.map(data.exercises, exerciseViewModelFromData));
    }

    function toJS() {
        return {
            pattern: pattern(),
            restInterval: restInterval(),
            exercises: $.map(exercises(), function(item) { return item.toJS(); })
        };
    }

    function canDelete() {
        return allGroups().length > 1;
    };

    function handleAddExerciseGroup() {
        var context = ko.contextFor(event.target || event.srcElement);
        var index = context.$index() + 1;

        var newGroup = DXWorkout.createExerciseGroupViewModel(allGroups);
        newGroup.adding = true;
        allGroups.splice(index, 0, newGroup);
    }

    function handleDeleteExerciseGroup() {
        var context = ko.contextFor(event.target || event.srcElement);
        var index = context.$index();

        allGroups.splice(index, 1);
    }

    pattern = ko.computed({
        read: function() {
            return exercises().length;
        },

        write: function(newCount) {
            var prevCount = exercises().length,
                diff = newCount - prevCount,
                i;

            if(!diff)
                return;

            for(i = 0; i < Math.abs(diff) ; i++) {
                if(diff > 0) {
                    var exercise = DXWorkout.createExerciseViewModel();
                    exercise.fromJS({
                        sets: [{ }]
                    });
                    exercises.push(exercise);
                } else {
                    exercises.pop();
                }
            }
        }
    });

    return {
        PATTERNS: PATTERNS,

        pattern: pattern,
        restInterval: restInterval,
        exercises: exercises,            

        canDelete: canDelete,
        handleAddExerciseGroup: handleAddExerciseGroup,
        handleDeleteExerciseGroup: handleDeleteExerciseGroup,

        toJS: toJS,
        fromJS: fromJS
    };
};