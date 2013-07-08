"use strict";

window.DXWorkout = {};

!function () {
    var wo = window.DXWorkout,
        app,
        device = DevExpress.devices.current(),
        APP_SETTINGS = {
            namespace: wo,
            defaultLayout: "navbar",
            navigation: [
                {
                    "id": "currentWorkout",
                    "action": function () {
                        var current = wo.currentWorkout,
                            id = wo.currentId;
                        wo.app.navigate(current && current.started()
                            ? "EditWorkout/" + id
                            : "CreateWorkout/" + id,
                            { root: true });
                    },
                    "title": "Workout",
                    "icon": "runner"
                },
                {
                    "id": "Logs",
                    "title": "Logs",
                    "action": "#Log",
                    "icon": "event"
                },
                {
                    "id": "Graphs",
                    "title": "Graphs",
                    "action": "#GoalGraphs",
                    "icon": "chart"
                },
                {
                    "id": "Settings",
                    "title": "Settings",
                    "action": "#Settings",
                    "icon": "card"
                }
            ]
        };

    $.extend(wo, {
        defaultSettings: {
            goal: ["Abs", "Arms", "Back", "Chest", "Legs", "Shoulders"],
            exercise: ["Back extension", "Bench press", "Bent-over row", "Biceps curl", "Calf raise", "Chest fly", "Chin-up", "Close-grip bench press", "Crunch",
                "Deadlift", "Dip", "Front raise", "Good-morning", "Handstand push-up", "Hyperextension", "Lateral raise", "Leg curl", "Leg extension", "Leg press",
                "Leg raise", "Lunge", "Machine fly", "Military press", "Pulldown", "Pullup", "Push-up", "Pushdown", "Rear delt raise", "Rowing at cable machine",
                "Seated row", "Shoulder press", "Shoulder shrug", "Sit-up", "Squat", "Supine row", "Triceps extension", "Upright row"],
            equipment: ["Back fly station", "Back row station", "Barbell", "Chin-up bar", "Decline bench", "Dip bar", "Dumbbells", "Ez-curl-bar", "Flat bench",
                "Incline bench", "Kettlebells", "Leg curl bench", "Leg extension bench", "Power rack station", "Preacher curl station", "Pulldown station"],
            lengthUnit: "miles",
            weightUnit: "lbs"
        },
        initStates: {
            NORMAL: "normal",
            EMPTY: "emptyLog"
        },
        isWinPhone: device.platform === "win8" && device.phone,

        currentWorkout: null,
        currentId: null
    });

    $(function () {
        app = wo.app = new DevExpress.framework.html.HtmlApplication(APP_SETTINGS);
        app.router.register(":view/:id", { view: "Log", id: undefined });
        wo.initUserData().done(function (state) {
            var startView;
            switch (state) {
                case wo.initStates.NORMAL:
                    startView = "Log";
                    break;
                case wo.initStates.EMPTY:
                    startView = "CreateWorkout/" + wo.currentId;
                    break;
            }

            wo.app.navigate(startView);

            setTimeout(function () {
                document.addEventListener("deviceready", function () {
                    if(wo.isWinPhone) {
                        document.addEventListener("backbutton", function() {
                            if(wo.app.canBack()) {
                                wo.app.back();
                            }
                            else {
                                throw new Error("exit");
                            }
                        }, false);
                    }
                    navigator.splashscreen.hide();
                }, false);
            }, 1000);
        });
    });

}();