"use strict";

DXWorkout.createWorkoutViewModel = function() {
    var id = ko.observable(),
        title,
        started = ko.observable(),
        date = ko.observable(),
        goal = ko.observable(),
        notes = ko.observable(),
        exerciseGroups = ko.observableArray();

    function clear() {
        fromJS({
            id: null,
            started: false,
            date: new Date,
            goal: "",
            notes: "",
            exerciseGroups: [{
                restInterval: 60,
                exercises: [{
                    sets: [{
                    }]
                }]
            }]
        });
    }

    function exerciseGroupViewModelFromData(data) {
        var vm = DXWorkout.createExerciseGroupViewModel(exerciseGroups);
        vm.fromJS(data);
        return vm;
    }

    function fromJS(data) {
        id(data.id);
        date(new Date(data.date));
        goal(data.goal);
        notes(data.notes);
        started(data.started);
        exerciseGroups($.map(data.exerciseGroups, exerciseGroupViewModelFromData));
    }

    function toJS() {
        return {
            id: id(),
            started: started(),
            date: date(),
            goal: goal(),
            notes: notes(),
            title: title(),
            exerciseGroups: $.map(exerciseGroups(), function(item) { return item.toJS(); })
        }
    }

    function handleDone(e) {
        save();
        DXWorkout.removeCurrentWorkout();
        DXWorkout.app.navigate("Log", { root: true });
    }
 

    function save() {
        var data = toJS();

        if (typeof (data.date) == "object") {
            data.date = data.date.toJSON();
        }
        
        if(!data.id) {
            data.id = DXWorkout.currentId;
            id(DXWorkout.currentId);
            DXWorkout.insertWorkout(data);
        } else {
            DXWorkout.updateWorkout(data.id, data);
        }
        
    }

    function handlePostpone(e) {
        started(false);
        DXWorkout.saveCurrentWorkout();
        DXWorkout.app.navigate("CreateWorkout/" + DXWorkout.currentId);
    }

    function handleStart(e) {
        started(true);
        DXWorkout.saveCurrentWorkout();
        DXWorkout.app.navigate("EditWorkout/" + DXWorkout.currentId);
    }

    function isEmpty() {
        return !id() && !started() && !goal() && !notes();
    }

    function handleCancel(e) {
        if(!isEmpty()) {
            if(!confirm("Are you sure you want to cancel this workout?"))
                return;
            if(id())
                DXWorkout.deleteWorkout(id());
        }
        DXWorkout.removeCurrentWorkout();
        DXWorkout.app.navigate("Log", { root: true });
    }
       
    title = ko.computed(function() {
        var format = "MMM d, yyyy",
            bag = [Globalize.format(date(), format)];

        if(goal())
            bag.push("-", goal());

        return bag.join(" ");
    });

    return {
        currentNavigationItemId: "currentWorkout",

        id: id,
        title: title,
        goal: goal,
        date: date,
        notes: notes,
        exerciseGroups: exerciseGroups,
        started: started,

        save: save,
        handleDone: handleDone,
        handleStart: handleStart,
        handleCancel: handleCancel,
        handlePostpone: handlePostpone,
        isEmpty: isEmpty,

        toJS: toJS,
        fromJS: fromJS,

        clear: clear
    };
};