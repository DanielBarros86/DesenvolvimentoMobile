"use strict";

DXWorkout.WeightGraphs = function(params) {
    var weightChartOptions,
        weightParamsFilled,
        exerciseTypes = ko.observableArray([]),
        equipmentTypes = ko.observableArray([]),
        tabOptions,
        selectedTab = ko.observable(1),
        selectedExerciseType = ko.observable(""),
        selectedEquipmentType = ko.observable(""),

        isWeightDataLoaded = ko.observable(false);

    weightChartOptions = {
        commonSeriesSettings: {
            argumentField: 'date'
        },
        series: [
            { valueField: 'weight', name: 'Weight' },
        ],
        argumentAxis: {
            grid: {
                visible: true
            },
            tickInterval: 'day',
            label: {
                format: 'monthAndDay'
            }
        },
        valueAxis: {
            min: 0
        },
        tooltip: {
            enabled: true
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center'
        },
        dataSource: ko.observableArray([])
    };

    function setTypes(workouts) {
        var exercisesArray = [],
            equipmentArray = [];
        $.each(workouts, function() {
            $.each(this.exerciseGroups, function() {
                $.each(this.exercises, function() {
                    var name = this.name,
                        equipment = this.equipment;
                    if (name && $.inArray(name, exercisesArray) < 0)
                        exercisesArray.push(name);
                    if (equipment && $.inArray(equipment, equipmentArray) < 0)
                        equipmentArray.push(equipment);
                });
            });
        });
        exerciseTypes(exercisesArray);
        equipmentTypes(equipmentArray);
    }

    function weightDataLoaded(workouts) {
        var weightGraphObj = { },
            weightGraphInfo = [ ];

        $.each(workouts, function (_, workout) {
            return $.each(workout.exerciseGroups, function(_, exerciseGroup) {
                return $.each(exerciseGroup.exercises, function (_, exercise) {
                    if (exercise.name == selectedExerciseType() && exercise.equipment == selectedEquipmentType()) {
                        var maxWeight = -1;
                        $.each(exercise.sets, function () {
                            if (this.weight > maxWeight)
                                maxWeight = this.weight;
                        });
                        if (maxWeight > 0) {
                            var date = new Date(workout.date);
                            var key = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                            if (weightGraphObj[key] > maxWeight)
                                return;

                            weightGraphObj[key] = maxWeight;
                        }
                    }
                });
            });
        });

        weightGraphInfo = $.map(weightGraphObj, function(value, key) {
            return {
                date: new Date(key),
                weight: value
            }
        });

        if (weightGraphInfo.length)
                weightChartOptions.dataSource(weightGraphInfo);
            else
                weightChartOptions.dataSource([]);
        isWeightDataLoaded(true);
    }

    weightParamsFilled = ko.computed(function() {
        return selectedExerciseType() && selectedEquipmentType();
    });

    weightParamsFilled.subscribe(function(need) {
        if (need)
            weightDataLoaded(DXWorkout.workouts());
    });

    tabOptions = {
        items: [
            { text: "Goal" },
            { text: "Weight" }
        ],
        itemClickAction: function(value) {
            if (value.itemData.text === "Goal")
                DXWorkout.app.navigate("GoalGraphs", { root: "true" });
        },
        selectedIndex: selectedTab
    };

    return {
        weightChartOptions: weightChartOptions,

        exerciseTypes: exerciseTypes,
        equipmentTypes: equipmentTypes,
        selectedExerciseType: selectedExerciseType,
        selectedEquipmentType: selectedEquipmentType,
        
        weightParamsFilled: weightParamsFilled,
        isWeightDataLoaded: isWeightDataLoaded,

        tabOptions: tabOptions,

        viewShowing: function() {
            isWeightDataLoaded(false);
            selectedTab(1);
        },

        viewShown: function() {
            var workouts = DXWorkout.workouts();
            setTypes(workouts);
            if (weightParamsFilled()) {
                weightDataLoaded(workouts);
            }
        },

        weightChartHasData: function() {
            return weightChartOptions.dataSource().length;
        }
    };
};