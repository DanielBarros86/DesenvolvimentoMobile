"use strict";

DXWorkout.CreateWorkout = function(params) {
    var wo = DXWorkout,
        id = params.id,
        workout = wo.setCurrentWorkoutById(id);

    return {
        currentNavigationItemId: "currentWorkout",
        workout: workout,

        viewShowing: function() {
            DXWorkout.currentWorkout = workout;

            if (workout.isEmpty()) {
                workout.date(new Date);
            }
        },

        viewShown: function() {
           $(".dx-viewport .dx-lookup").data("dxLookup").option("dataSource", wo.settings["goal"]);
        }       
    };
};