"use strict";

DXWorkout.EditWorkout = function(params) {
    var format = "MMM d, yyyy";

    var wo = DXWorkout,
        id = params.id,
        workout = wo.setCurrentWorkoutById(id);
    
    function fixScrollView() {
        $(".dx-viewport .wo-scroll-view").data("dxScrollView").update(true);
    }

    function fadeIn(element, _, data) {
        if (!data.adding)
            return;

        var el = $(element);
        if(!el.hasClass("exercise-group-item") || el.parents("#__hidden-bag").length)
            return;

        el.addClass("fade-in-result");

        delete data.adding;

        var scrollerEl = $(".dx-viewport .wo-scroll-view"),
            scrollerObj = scrollerEl.data("dxScrollView");

        var headerHeight = DevExpress.position(scrollerEl.get(0)).top;
        var margin = 5;
        var relativeOffset = DevExpress.position(element).top;
        var delta = headerHeight + margin - relativeOffset;

        scrollerObj.update(true).done(function() {
            scrollerObj.scrollBy(-delta, true);
        });
    }
     
    var formattedDate = ko.computed(function() {
        return Globalize.format(workout.date(), format);
    });

    var backButtonTitle = ko.computed(function() {
        if (workout.id())
            return "Back";
        return "Postpone";
    });

    var saveButtonTitle = ko.computed(function() {
        if (workout.id())
            return "Resume";
        return "Done";
    });

    return {
        currentNavigationItemId: "currentWorkout",

        workout: workout,
        title: formattedDate,
        goal: workout.goal,

        fixScrollView: fixScrollView,
        fadeIn: fadeIn,
        backButtonTitle: backButtonTitle,
        saveButtonTitle: saveButtonTitle,

        viewShowing: function() {
            DXWorkout.currentWorkout = workout;
            
            $.each(workout.exerciseGroups(), function() {
                $.each(this.exercises(), function() {
                    $.each(this.sets(), function() {
                        this.weightUnit(DXWorkout.settings["weightUnit"]);
                    });
                });
            });
        },

        viewShown: function () {
            $(".dx-viewport .dx-lookup.wo-exercise").each(function () {
                $(this).data("dxLookup").option("dataSource", DXWorkout.settings["exercise"]);
            });

            $(".dx-viewport .dx-lookup.wo-equipment").each(function () {
                $(this).data("dxLookup").option("dataSource", DXWorkout.settings["equipment"]);
            });
        }
    };
};