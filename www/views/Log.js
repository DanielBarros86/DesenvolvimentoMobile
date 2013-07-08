"use strict";

DXWorkout.Log = function (params) {

    var log = ko.computed(function() {
        var workouts = DXWorkout.workouts();
        workouts.sort(function(i, j) {
            return new Date(j.date) - new Date(i.date);
        });

        var grouped = {},
            result = [];

        $.each(workouts, function() {
            var key = Globalize.format(new Date(this.date), "MMM yyyy");
            if (!grouped[key])
                grouped[key] = [];
            grouped[key].push(this);
        });

        $.each(grouped, function(key, value) {
            result.push({ key: key, items: value });
        });

        return result;
    });

    function finishCurrentWorkout() {
        var current = DXWorkout.currentWorkout;
        if (current && !current.isEmpty())
            current.save();
    }

    function cancelBubble(e) {
        var evt = e || window.event;
        if (evt.stopPropagation)
            evt.stopPropagation();
        if (evt.cancelBubble != null)
            evt.cancelBubble = true;
    }

    return {
        log: log,

        handleItemClick: function (e) {
            finishCurrentWorkout();
            DXWorkout.app.navigate("EditWorkout/" + e.itemData.id, { root: true });
        },

        handleDeleteClick: function(e) {
            cancelBubble(e.actionValue);
            if (confirm("Do you want to delete workout?")) {
                if (DXWorkout.currentWorkout && DXWorkout.currentWorkout.id() === e.model.id)
                    DXWorkout.removeCurrentWorkout();
                DXWorkout.deleteWorkout(e.model.id);
            }
        },

        handleCopyClick: function(e) {
            cancelBubble(e.actionValue);
            finishCurrentWorkout();

            var wo = DXWorkout,
                workout = DXWorkout.createWorkoutViewModel(),
                id = (new DevExpress.data.Guid).toString();

            workout.fromJS({
                goal: e.model.goal,
                date: new Date,
                notes: "workout copied from " + Globalize.format(new Date(e.model.date), "MMM-d-yyyy HH:mm"),
                exerciseGroups: e.model.exerciseGroups
            });
            wo.currentWorkout = workout;
            wo.currentId = id;
            wo.saveCurrentWorkout();
            
            wo.app.navigate("CreateWorkout/" + id);
        }
    };
};