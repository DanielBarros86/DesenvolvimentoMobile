"use strict";

DXWorkout.GoalGraphs = function(params) {
    var monthAgo,       
        goalsChartOptions,
        tabOptions,
        selectedTab = ko.observable(0),

        isGoalsDataLoaded = ko.observable(false);

    monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    goalsChartOptions = {
        series: {
            argumentField: 'goal',
            valueField: 'count',
        },
        tooltip: {
            enabled: true,
            percentPrecision: 1,
            customizeText: function(value) {
                return value.percentText;
            }
        },
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom'
        },
        dataSource: ko.observableArray([])
    };

    function goalDataLoaded(queryResult) {
        var goalsNumberLimit = 5,
            goalsCounts = [],
            i;

        queryResult.sort(function(i, j) {
            return j.items.length - i.items.length;
        });

        for(i = 0; i < queryResult.length; i++) {
            var el = queryResult[i];
            if(i < goalsNumberLimit) {
                goalsCounts.push({
                    goal: el.key || "(unspecified)",
                    count: el.items.length
                });
            } else {
                goalsCounts[goalsNumberLimit - 1].count += el.items.length;
            }
        }

        if(queryResult.length > goalsNumberLimit)
            goalsCounts[goalsNumberLimit - 1].goal = "other";

        goalsChartOptions.dataSource(goalsCounts);
        isGoalsDataLoaded(true);
    }

    tabOptions = {
        items: [
            { text: "Goal" },
            { text: "Weight" }
        ],
        itemClickAction: function(value) {
            if (value.itemData.text === "Weight")
                DXWorkout.app.navigate("WeightGraphs", { root: "true" }); 
        },
        selectedIndex: selectedTab
    };

    return {
        goalsChartOptions: goalsChartOptions,

        isGoalsDataLoaded: isGoalsDataLoaded,

        tabOptions: tabOptions,

        viewShowing: function() {
            isGoalsDataLoaded(false);
            selectedTab(0);
        },

        viewShown: function() {
            var workouts = DXWorkout.workouts(),
                grouped = { },
                result = [ ];

            $.each(workouts, function() {
                if (monthAgo.getTime() > new Date(this.date).getTime())
                    return;

                if (!grouped[this.goal])
                    grouped[this.goal] = [];
                grouped[this.goal].push(this);
            });

            $.each(grouped, function(key, value) {
                result.push({ key: key, items: value });
            });

            goalDataLoaded(result);
        },

        goalsChartHasData: function() {
            return goalsChartOptions.dataSource().length;
        }
    };
};