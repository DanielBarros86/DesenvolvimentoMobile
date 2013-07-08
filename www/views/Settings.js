"use strict";

DXWorkout.Settings = function(params) {
    var viewModel = {
        lengthUnits: ["miles", "km"],
        weightUnits: ["lbs", "kg"],

        length: ko.observable(DXWorkout.settings["lengthUnit"]),
        weight: ko.observable(DXWorkout.settings["weightUnit"]),

        editGoals: function() {
            DXWorkout.app.navigate('EditList/goal');
        },

        editExercises: function() {
            DXWorkout.app.navigate('EditList/exercise');
        },

        editEquipment: function() {
            DXWorkout.app.navigate('EditList/equipment');
        }
    };

    viewModel.length.subscribe(function(value) {
        DXWorkout.saveSettings("lengthUnit", value);
    });

    viewModel.weight.subscribe(function(value) {
        DXWorkout.saveSettings("weightUnit", value);
    });

    return viewModel;
};